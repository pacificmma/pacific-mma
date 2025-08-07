import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();

// Import functions
import { notifyMe } from './notify/notifyMe';
import { notifyAvailability } from './notify/notifyAvailability';
import { checkAndNotifyUsers } from './notify/scheduledNotifications';
import { contactUs, getContactMessages } from './contact/contactUs';

// HTTP Callable Functions
exports.notifyMe = notifyMe;
exports.notifyAvailability = notifyAvailability;
exports.contactUs = contactUs;
exports.getContactMessages = getContactMessages;

// Scheduled Functions
exports.scheduledNotificationCheck = checkAndNotifyUsers;

// Health Check
exports.healthCheck = functions.https.onRequest((req: any, res: any) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'pacific-mma-functions'
  });
});