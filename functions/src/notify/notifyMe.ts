import * as functions from 'firebase-functions';
import { db, COLLECTIONS, timestamp } from '../config/firebase';
import { sendEmail } from '../utils/email';
import { validateNotifyRequest } from '../utils/validation';

interface NotifyMeRequest {
  name: string;
  email: string;
  phone: string;
  destinationCountry: string;
  destinationTitle: string;
}

/**
 * Cloud Function to handle notify me requests
 * When users want to be notified about tour availability
 */
export const notifyMe = functions.https.onCall(async (data: NotifyMeRequest, context) => {
  try {
    // Validate input
    const validation = validateNotifyRequest(data);
    if (!validation.valid) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        validation.error || 'Invalid input data'
      );
    }

    const { name, email, phone, destinationCountry, destinationTitle } = data;

    // Check if user already has a notification request for this destination
    const existingRequest = await db
      .collection(COLLECTIONS.NOTIFY_REQUESTS)
      .where('email', '==', email)
      .where('destinationCountry', '==', destinationCountry)
      .where('notified', '==', false)
      .limit(1)
      .get();

    if (!existingRequest.empty) {
      return {
        success: true,
        message: 'You are already on the notification list for this destination',
        alreadyExists: true,
      };
    }

    // Save to Firestore
    const notifyRequest = {
      name,
      email,
      phone,
      destinationCountry,
      destinationTitle,
      notified: false,
      createdAt: timestamp(),
      updatedAt: timestamp(),
      source: 'web',
      userId: context.auth?.uid || null,
    };

    const docRef = await db.collection(COLLECTIONS.NOTIFY_REQUESTS).add(notifyRequest);

    // Send confirmation email to user
    await sendEmail({
      to: email,
      subject: `Pacific MMA - Notification Confirmed for ${destinationCountry}`,
      templateId: 'notify_confirmation',
      dynamicData: {
        name,
        destinationCountry,
        destinationTitle,
      },
    });

    // Send notification to admin
    await sendEmail({
      to: functions.config().email?.admin || 'admin@pacificmma.com',
      subject: 'New Tour Notification Request',
      templateId: 'admin_notification',
      dynamicData: {
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        destinationCountry,
        destinationTitle,
        requestId: docRef.id,
        timestamp: new Date().toISOString(),
      },
    });

    // Log the email activity
    await db.collection(COLLECTIONS.EMAIL_LOGS).add({
      type: 'notify_request',
      recipient: email,
      destinationCountry,
      status: 'sent',
      createdAt: timestamp(),
    });

    return {
      success: true,
      message: 'Notification request received successfully',
      requestId: docRef.id,
    };
  } catch (error) {
    console.error('Error in notifyMe function:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError(
      'internal',
      'Failed to process notification request'
    );
  }
});