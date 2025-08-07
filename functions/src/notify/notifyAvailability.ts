import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { db, COLLECTIONS, timestamp } from '../config/firebase';
import { validateDestinationUpdate } from '../utils/validation';

interface DestinationUpdate {
  destinationId: string;
  available: boolean;
  price?: number;
  startDate?: string;
  endDate?: string;
  spots?: number;
}

/**
 * Cloud Function to update destination availability
 * This triggers the notification process for waiting users
 */
export const notifyAvailability = functions.https.onCall(async (data: DestinationUpdate, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  // Check admin privileges (implement custom claims in Firebase Auth)
  const userRecord = await admin.auth().getUser(context.auth.uid);
  if (!userRecord.customClaims?.admin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can update destination availability'
    );
  }

  // Validate input
  const validation = validateDestinationUpdate(data);
  if (!validation.valid) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      validation.error || 'Invalid input data'
    );
  }

  try {
    const { destinationId, available, price, startDate, endDate, spots } = data;

    // Get destination
    const destRef = db.collection(COLLECTIONS.DESTINATIONS).doc(destinationId);
    const destDoc = await destRef.get();

    if (!destDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'Destination not found'
      );
    }

    const updateData: any = {
      available,
      updatedAt: timestamp(),
      updatedBy: context.auth.uid,
    };

    // Add optional fields if provided
    if (price !== undefined) updateData.price = price;
    if (startDate) updateData.startDate = startDate;
    if (endDate) updateData.endDate = endDate;
    if (spots !== undefined) updateData.availableSpots = spots;

    // If making available, reset notification sent flag
    if (available) {
      updateData.notificationSent = false;
    }

    // Update destination
    await destRef.update(updateData);

    // Get notification request count for this destination
    const notifyCount = await db
      .collection(COLLECTIONS.NOTIFY_REQUESTS)
      .where('destinationCountry', '==', destDoc.data()!.country)
      .where('notified', '==', false)
      .count()
      .get();

    // Log the activity
    await db.collection('activity_logs').add({
      type: 'destination_availability_update',
      destinationId,
      destinationCountry: destDoc.data()!.country,
      available,
      pendingNotifications: notifyCount.data().count,
      performedBy: context.auth.uid,
      createdAt: timestamp(),
    });

    return {
      success: true,
      message: `Destination ${available ? 'enabled' : 'disabled'} successfully`,
      destinationId,
      pendingNotifications: notifyCount.data().count,
      details: {
        country: destDoc.data()!.country,
        available,
        price,
        startDate,
        endDate,
        spots,
      },
    };
  } catch (error) {
    console.error('Error updating destination availability:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError(
      'internal',
      'Failed to update destination availability'
    );
  }
});

/**
 * HTTP endpoint to get notification statistics
 */
export const getNotificationStats = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  // Check admin privileges
  const userRecord = await admin.auth().getUser(context.auth.uid);
  if (!userRecord.customClaims?.admin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can view notification statistics'
    );
  }

  try {
    // Get all destinations with their notification counts
    const destinationsSnapshot = await db.collection(COLLECTIONS.DESTINATIONS).get();
    const stats: any[] = [];

    for (const doc of destinationsSnapshot.docs) {
      const destination = doc.data();
      
      // Get pending notification count
      const pendingCount = await db
        .collection(COLLECTIONS.NOTIFY_REQUESTS)
        .where('destinationCountry', '==', destination.country)
        .where('notified', '==', false)
        .count()
        .get();

      // Get notified count
      const notifiedCount = await db
        .collection(COLLECTIONS.NOTIFY_REQUESTS)
        .where('destinationCountry', '==', destination.country)
        .where('notified', '==', true)
        .count()
        .get();

      stats.push({
        destinationId: doc.id,
        country: destination.country,
        title: destination.title,
        available: destination.available || false,
        pendingNotifications: pendingCount.data().count,
        sentNotifications: notifiedCount.data().count,
        totalRequests: pendingCount.data().count + notifiedCount.data().count,
        lastNotificationSent: destination.notificationSentAt || null,
      });
    }

    // Sort by total requests
    stats.sort((a, b) => b.totalRequests - a.totalRequests);

    // Get overall statistics
    const totalPending = stats.reduce((sum, s) => sum + s.pendingNotifications, 0);
    const totalSent = stats.reduce((sum, s) => sum + s.sentNotifications, 0);

    return {
      success: true,
      summary: {
        totalDestinations: stats.length,
        totalPendingNotifications: totalPending,
        totalSentNotifications: totalSent,
        totalRequests: totalPending + totalSent,
      },
      destinations: stats,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error getting notification statistics:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to get notification statistics'
    );
  }
});