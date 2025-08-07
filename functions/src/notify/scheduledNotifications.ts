import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { db, COLLECTIONS, timestamp } from '../config/firebase';
import { sendBatchEmails } from '../utils/email';

/**
 * Scheduled function to check for available destinations
 * and notify users who requested notifications
 * Runs every day at 9 AM PST
 */
export const checkAndNotifyUsers = functions.pubsub
  .schedule('0 9 * * *') // Every day at 9 AM
  .timeZone('America/Los_Angeles')
  .onRun(async (context) => {
    console.log('Starting scheduled notification check');

    try {
      // Get all available destinations
      const destinationsSnapshot = await db
        .collection(COLLECTIONS.DESTINATIONS)
        .where('available', '==', true)
        .where('notificationSent', '==', false) // Only newly available
        .get();

      if (destinationsSnapshot.empty) {
        console.log('No newly available destinations to notify about');
        return null;
      }

      // Process each available destination
      for (const destDoc of destinationsSnapshot.docs) {
        const destination = destDoc.data();

        console.log(`Processing notifications for destination: ${destination.country}`);

        // Get all pending notification requests for this destination
        const notifyRequestsSnapshot = await db
          .collection(COLLECTIONS.NOTIFY_REQUESTS)
          .where('destinationCountry', '==', destination.country)
          .where('notified', '==', false)
          .get();

        if (notifyRequestsSnapshot.empty) {
          console.log(`No pending notifications for ${destination.country}`);
          continue;
        }

        // Prepare email recipients and data
        const recipients: string[] = [];
        const requestIds: string[] = [];

        notifyRequestsSnapshot.forEach(doc => {
          const request = doc.data();
          recipients.push(request.email);
          requestIds.push(doc.id);
        });

        console.log(`Sending notifications to ${recipients.length} users for ${destination.country}`);

        // Send batch emails
        await sendBatchEmails(
          recipients,
          `🎉 ${destination.country} Camp is Now Available!`,
          'tour_available',
          {
            destinationCountry: destination.country,
            destinationTitle: destination.title,
            price: destination.price || 'TBD',
            nights: destination.nights,
            slug: destination.country.toLowerCase().replace(/\s+/g, '-'),
          }
        );

        // Update notification requests as notified
        const batch = db.batch();
        
        requestIds.forEach(id => {
          const ref = db.collection(COLLECTIONS.NOTIFY_REQUESTS).doc(id);
          batch.update(ref, {
            notified: true,
            notifiedAt: timestamp(),
            updatedAt: timestamp(),
          });
        });

        // Mark destination as notification sent
        batch.update(destDoc.ref, {
          notificationSent: true,
          notificationSentAt: timestamp(),
          notificationCount: recipients.length,
        });

        await batch.commit();

        // Log the notification activity
        await db.collection(COLLECTIONS.EMAIL_LOGS).add({
          type: 'batch_notification',
          destinationCountry: destination.country,
          recipientCount: recipients.length,
          status: 'sent',
          createdAt: timestamp(),
        });

        console.log(`Successfully notified ${recipients.length} users about ${destination.country}`);
      }

      return null;
    } catch (error) {
      console.error('Error in scheduled notification check:', error);
      throw error;
    }
  });

/**
 * Function to manually trigger notifications for a specific destination
 * Can be called by admin to send notifications immediately
 */
export const manualNotifyUsers = functions.https.onCall(async (data, context) => {
  // Check if user is admin
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  // Additional admin check (you should implement custom claims)
  const userRecord = await admin.auth().getUser(context.auth.uid);
  if (!userRecord.customClaims?.admin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'User must be an admin'
    );
  }

  const { destinationId } = data;

  if (!destinationId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Destination ID is required'
    );
  }

  try {
    // Get destination details
    const destDoc = await db.collection(COLLECTIONS.DESTINATIONS).doc(destinationId).get();
    
    if (!destDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'Destination not found'
      );
    }

    const destination = destDoc.data()!;

    // Get pending notification requests
    const notifyRequestsSnapshot = await db
      .collection(COLLECTIONS.NOTIFY_REQUESTS)
      .where('destinationCountry', '==', destination.country)
      .where('notified', '==', false)
      .get();

    if (notifyRequestsSnapshot.empty) {
      return {
        success: true,
        message: 'No pending notifications for this destination',
        notificationCount: 0,
      };
    }

    // Process notifications (similar to scheduled function)
    const recipients: string[] = [];
    const requestIds: string[] = [];

    notifyRequestsSnapshot.forEach(doc => {
      const request = doc.data();
      recipients.push(request.email);
      requestIds.push(doc.id);
    });

    // Send emails
    await sendBatchEmails(
      recipients,
      `🎉 ${destination.country} Camp is Now Available!`,
      'tour_available',
      {
        destinationCountry: destination.country,
        destinationTitle: destination.title,
        price: destination.price || 'TBD',
        nights: destination.nights,
        slug: destination.country.toLowerCase().replace(/\s+/g, '-'),
      }
    );

    // Update records
    const batch = db.batch();
    
    requestIds.forEach(id => {
      const ref = db.collection(COLLECTIONS.NOTIFY_REQUESTS).doc(id);
      batch.update(ref, {
        notified: true,
        notifiedAt: timestamp(),
        updatedAt: timestamp(),
        manualNotification: true,
        notifiedBy: context.auth!.uid,
      });
    });

    batch.update(destDoc.ref, {
      notificationSent: true,
      notificationSentAt: timestamp(),
      notificationCount: recipients.length,
      manualNotification: true,
      notifiedBy: context.auth!.uid,
    });

    await batch.commit();

    return {
      success: true,
      message: `Successfully notified ${recipients.length} users`,
      notificationCount: recipients.length,
      recipients,
    };
  } catch (error) {
    console.error('Error in manual notification:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to send notifications'
    );
  }
});