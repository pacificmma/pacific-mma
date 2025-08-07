import * as admin from 'firebase-admin';

// Firestore collections
export const COLLECTIONS = {
  NOTIFY_REQUESTS: 'notify_requests',
  DESTINATIONS: 'destinations',
  USERS: 'users',
  EMAIL_LOGS: 'email_logs',
} as const;

// Get Firestore instance
export const db = admin.firestore();

// Get Auth instance
export const auth = admin.auth();

// Get Storage instance
export const storage = admin.storage();

// Timestamp helper
export const timestamp = admin.firestore.FieldValue.serverTimestamp;