import * as functions from 'firebase-functions';
import { db, COLLECTIONS, timestamp } from '../config/firebase';
import { sendEmail } from '../utils/email';

interface ContactUsRequest {
  name: string;
  email: string;
  message: string;
  topic: string; // 'Camps', 'Academy', 'Fightwear'
}

/**
 * Cloud Function to handle contact us form submissions
 * Routes to different email addresses based on topic
 */
export const contactUs = functions.https.onCall(async (data: ContactUsRequest, context) => {
  try {
    // Basic validation
    if (!data.name || !data.email || !data.message || !data.topic) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'All fields are required'
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Invalid email address'
      );
    }

    // Validate topic
    const validTopics = ['Camps', 'Academy', 'Fightwear'];
    if (!validTopics.includes(data.topic)) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Invalid topic selected'
      );
    }

    const { name, email, message, topic } = data;

    // Save to Firestore
    const contactRequest = {
      name,
      email,
      message,
      topic,
      status: 'new',
      createdAt: timestamp(),
      updatedAt: timestamp(),
      userId: context.auth?.uid || null,
      ipAddress: context.rawRequest.ip || 'unknown',
    };

    const docRef = await db.collection('contact_messages').add(contactRequest);

    // Determine recipient email based on topic
    const recipientEmails = {
      'Camps': functions.config().email?.camps || 'camps@pacificmma.com',
      'Academy': functions.config().email?.academy || 'academy@pacificmma.com', 
      'Fightwear': functions.config().email?.fightwear || 'shop@pacificmma.com',
    };

    const recipientEmail = recipientEmails[topic as keyof typeof recipientEmails];

    // Send email to appropriate department
    await sendEmail({
      to: recipientEmail,
      subject: `Contact Form: ${topic} - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1a1a1a; color: white; padding: 20px; text-align: center;">
            <h1>Pacific MMA - Contact Form</h1>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <h2>New ${topic} Inquiry</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; font-weight: bold; background-color: #f0f0f0;">Name:</td>
                <td style="padding: 10px;">${name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; font-weight: bold; background-color: #f0f0f0;">Email:</td>
                <td style="padding: 10px;"><a href="mailto:${email}">${email}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; font-weight: bold; background-color: #f0f0f0;">Topic:</td>
                <td style="padding: 10px;">${topic}</td>
              </tr>
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; font-weight: bold; background-color: #f0f0f0;">Submitted:</td>
                <td style="padding: 10px;">${new Date().toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; background-color: #f0f0f0; vertical-align: top;">Message:</td>
                <td style="padding: 10px; white-space: pre-wrap;">${message}</td>
              </tr>
            </table>
            <div style="margin-top: 20px; padding: 15px; background-color: #dc2626; color: white; border-radius: 5px;">
              <strong>Action Required:</strong> Please respond to this inquiry within 24 hours.
            </div>
          </div>
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <p>&copy; 2024 Pacific MMA. All rights reserved.</p>
            <p>Contact ID: ${docRef.id}</p>
          </div>
        </div>
      `,
    });

    // Send confirmation email to user
    await sendEmail({
      to: email,
      subject: 'Pacific MMA - We received your message',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1a1a1a; color: white; padding: 20px; text-align: center;">
            <h1>Pacific MMA</h1>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <h2>Thank you for contacting us, ${name}!</h2>
            <p>We've received your message about <strong>${topic}</strong> and our team will get back to you within 24 hours.</p>
            
            <div style="background-color: #fef3c7; padding: 15px; border-left: 4px solid #dc2626; margin: 20px 0;">
              <h3>Your Message:</h3>
              <p style="white-space: pre-wrap; margin: 0;">${message}</p>
            </div>
            
            <p>If you have any urgent questions, feel free to call us at (555) 555-5555.</p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://pacificmma.com" style="display: inline-block; padding: 12px 24px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 4px;">
                Visit Our Website
              </a>
            </div>
          </div>
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <p>&copy; 2024 Pacific MMA. All rights reserved.</p>
            <p>1265A Fairview Avenue, Redwood City, CA 94061</p>
          </div>
        </div>
      `,
    });

    // Log the activity
    await db.collection(COLLECTIONS.EMAIL_LOGS).add({
      type: 'contact_form',
      recipient: recipientEmail,
      sender: email,
      topic,
      status: 'sent',
      createdAt: timestamp(),
    });

    return {
      success: true,
      message: 'Your message has been sent successfully',
      contactId: docRef.id,
    };
  } catch (error) {
    console.error('Error in contactUs function:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError(
      'internal',
      'Failed to process contact form submission'
    );
  }
});

/**
 * Get contact messages for admin (with pagination)
 */
export const getContactMessages = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  // Check admin privileges (you should implement custom claims)
  try {
    const admin = require('firebase-admin');
    const userRecord = await admin.auth().getUser(context.auth.uid);
    if (!userRecord.customClaims?.admin) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Only admins can view contact messages'
      );
    }

    const { limit = 50, offset = 0, topic, status } = data;

    let query = db.collection('contact_messages')
      .orderBy('createdAt', 'desc');

    // Apply filters
    if (topic) {
      query = query.where('topic', '==', topic);
    }
    
    if (status) {
      query = query.where('status', '==', status);
    }

    // Apply pagination
    query = query.limit(limit).offset(offset);

    const snapshot = await query.get();
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Get total count for pagination
    let countQuery: any = db.collection('contact_messages');
    if (topic) countQuery = countQuery.where('topic', '==', topic);
    if (status) countQuery = countQuery.where('status', '==', status);
    
    const countSnapshot = await countQuery.count().get();
    const total = countSnapshot.data().count;

    return {
      success: true,
      messages,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    };
  } catch (error) {
    console.error('Error getting contact messages:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to get contact messages'
    );
  }
});