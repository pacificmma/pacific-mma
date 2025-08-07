import { 
  collection, 
  doc, 
  setDoc, 
  query, 
  where, 
  getDocs, 
  deleteDoc,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/utils/fireBaseAuthProvider';

export interface NotifyRequest {
  id?: string;
  name: string;
  email: string;
  phone: string;
  destinationCountry: string;
  destinationTitle: string;
  createdAt?: Timestamp;
  notified?: boolean;
}

export interface EmailNotification {
  to: string;
  from: string;
  subject: string;
  html: string;
  text: string;
}

class NotifyService {
  private readonly collectionName = 'notify_requests';

  async createNotifyRequest(data: Omit<NotifyRequest, 'id' | 'createdAt' | 'notified'>): Promise<string> {
    try {
      const docRef = doc(collection(db, this.collectionName));
      const notifyData: NotifyRequest = {
        ...data,
        createdAt: serverTimestamp() as Timestamp,
        notified: false,
      };
      
      await setDoc(docRef, notifyData);
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating notify request:', error);
      throw new Error('Failed to create notification request');
    }
  }

  async getNotifyRequestsByDestination(destinationCountry: string): Promise<NotifyRequest[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('destinationCountry', '==', destinationCountry),
        where('notified', '==', false)
      );
      
      const querySnapshot = await getDocs(q);
      const requests: NotifyRequest[] = [];
      
      querySnapshot.forEach((doc) => {
        requests.push({
          id: doc.id,
          ...doc.data(),
        } as NotifyRequest);
      });
      
      return requests;
    } catch (error) {
      console.error('Error fetching notify requests:', error);
      throw new Error('Failed to fetch notification requests');
    }
  }

  async markAsNotified(requestIds: string[]): Promise<void> {
    try {
      const promises = requestIds.map(async (id) => {
        const docRef = doc(db, this.collectionName, id);
        await deleteDoc(docRef);
      });
      
      await Promise.all(promises);
    } catch (error) {
      console.error('Error marking requests as notified:', error);
      throw new Error('Failed to update notification status');
    }
  }

  generateConfirmationEmail(data: {
    name: string;
    email: string;
    destinationCountry: string;
  }): EmailNotification {
    return {
      to: data.email,
      from: 'noreply@pacificmma.com',
      subject: `Pacific MMA - Notification Request Received for ${data.destinationCountry}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Hello ${data.name},</h2>
          <p style="color: #666; line-height: 1.6;">
            Thank you for your interest in our ${data.destinationCountry} MMA training tour!
          </p>
          <p style="color: #666; line-height: 1.6;">
            We've received your notification request. As soon as this tour becomes available for booking, 
            we'll send you an email with all the details and early-bird pricing options.
          </p>
          <p style="color: #666; line-height: 1.6;">
            In the meantime, feel free to explore our other available training destinations on our website.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 14px;">
            Best regards,<br>
            Pacific MMA Team
          </p>
        </div>
      `,
      text: `
        Hello ${data.name},
        
        Thank you for your interest in our ${data.destinationCountry} MMA training tour!
        
        We've received your notification request. As soon as this tour becomes available for booking, 
        we'll send you an email with all the details and early-bird pricing options.
        
        In the meantime, feel free to explore our other available training destinations on our website.
        
        Best regards,
        Pacific MMA Team
      `,
    };
  }

  generateAvailabilityEmail(data: {
    name: string;
    email: string;
    destinationCountry: string;
    destinationTitle: string;
  }): EmailNotification {
    return {
      to: data.email,
      from: 'noreply@pacificmma.com',
      subject: `🎉 ${data.destinationCountry} Tour Now Available - Pacific MMA`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Great News, ${data.name}!</h2>
          <p style="color: #666; line-height: 1.6; font-size: 16px;">
            The <strong>${data.destinationCountry}</strong> MMA training tour you were interested in is now available for booking!
          </p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #333; margin: 0 0 10px 0;">
              <strong>Tour Details:</strong>
            </p>
            <p style="color: #666; margin: 5px 0;">
              ${data.destinationTitle}
            </p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://pacificmma.com/destination/${data.destinationCountry.toLowerCase()}" 
               style="display: inline-block; background: #ff9800; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 25px; font-weight: bold;">
              Book Your Spot Now
            </a>
          </div>
          <p style="color: #666; line-height: 1.6;">
            Spaces are limited and fill up quickly. Don't miss this opportunity to train with the best!
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 14px;">
            Best regards,<br>
            Pacific MMA Team
          </p>
        </div>
      `,
      text: `
        Great News, ${data.name}!
        
        The ${data.destinationCountry} MMA training tour you were interested in is now available for booking!
        
        Tour Details:
        ${data.destinationTitle}
        
        Book your spot now at: https://pacificmma.com/destination/${data.destinationCountry.toLowerCase()}
        
        Spaces are limited and fill up quickly. Don't miss this opportunity to train with the best!
        
        Best regards,
        Pacific MMA Team
      `,
    };
  }
}

export const notifyService = new NotifyService();