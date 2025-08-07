import * as functions from 'firebase-functions';
import * as sgMail from '@sendgrid/mail';

// Initialize SendGrid
const SENDGRID_API_KEY = functions.config().sendgrid?.api_key || process.env.SENDGRID_API_KEY;
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

interface EmailOptions {
  to: string | string[];
  subject: string;
  templateId?: string;
  dynamicData?: Record<string, any>;
  html?: string;
  text?: string;
  from?: string;
}

/**
 * Send email using SendGrid
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    if (!SENDGRID_API_KEY) {
      console.warn('SendGrid API key not configured, skipping email send');
      return;
    }

    const from = options.from || functions.config().email?.from || 'notifications@pacificmma.com';

    // Build email message
    const msg: any = {
      to: options.to,
      from: {
        email: from,
        name: 'Pacific MMA',
      },
      subject: options.subject,
    };

    // Use template or direct HTML/text
    if (options.templateId) {
      msg.templateId = getTemplateId(options.templateId);
      msg.dynamicTemplateData = options.dynamicData;
    } else {
      if (options.html) msg.html = options.html;
      if (options.text) msg.text = options.text;
    }

    // Send email
    await sgMail.send(msg);
    console.log(`Email sent successfully to ${options.to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

/**
 * Get SendGrid template ID based on template name
 */
function getTemplateId(templateName: string): string {
  const templates: Record<string, string> = {
    // User notification templates
    notify_confirmation: 'd-1234567890abcdef', // Replace with actual template ID
    tour_available: 'd-2345678901abcdef',
    
    // Admin notification templates
    admin_notification: 'd-3456789012abcdef',
    weekly_report: 'd-4567890123abcdef',
    
    // Add more templates as needed
  };

  return templates[templateName] || templateName;
}

/**
 * Build HTML email template (fallback when SendGrid templates not available)
 */
export function buildEmailHtml(templateName: string, data: Record<string, any>): string {
  switch (templateName) {
    case 'notify_confirmation':
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1a1a1a; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 12px 24px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Pacific MMA</h1>
            </div>
            <div class="content">
              <h2>Hi ${data.name},</h2>
              <p>Thank you for your interest in our <strong>${data.destinationCountry}</strong> martial arts camp!</p>
              <p>We've added you to our notification list. As soon as this tour becomes available, you'll be the first to know.</p>
              <p><strong>Tour Details:</strong><br>${data.destinationTitle}</p>
              <p>In the meantime, feel free to explore our other available camps or contact us if you have any questions.</p>
              <p style="text-align: center; margin-top: 30px;">
                <a href="https://pacificmma.com/book" class="button">View Other Camps</a>
              </p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Pacific MMA. All rights reserved.</p>
              <p>1265A Fairview Avenue, Redwood City, CA 94061</p>
            </div>
          </div>
        </body>
        </html>
      `;

    case 'tour_available':
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1a1a1a; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .highlight { background-color: #fef3c7; padding: 15px; border-left: 4px solid #dc2626; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 12px 24px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Pacific MMA</h1>
            </div>
            <div class="content">
              <h2>Great News, ${data.name}!</h2>
              <div class="highlight">
                <h3>🎉 The ${data.destinationCountry} Camp is Now Available!</h3>
              </div>
              <p>The martial arts camp you've been waiting for is now open for booking!</p>
              <p><strong>Tour Details:</strong><br>${data.destinationTitle}</p>
              <p><strong>Price:</strong> Starting from $${data.price}</p>
              <p><strong>Duration:</strong> ${data.nights}</p>
              <p>Spots are limited and fill up quickly. Don't miss your chance to train at world-class facilities!</p>
              <p style="text-align: center; margin-top: 30px;">
                <a href="https://pacificmma.com/destination/${data.slug}" class="button">Book Now</a>
              </p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Pacific MMA. All rights reserved.</p>
              <p>To unsubscribe from these notifications, click <a href="#">here</a></p>
            </div>
          </div>
        </body>
        </html>
      `;

    default:
      return `
        <html>
        <body>
          <h2>Pacific MMA Notification</h2>
          <p>${JSON.stringify(data, null, 2)}</p>
        </body>
        </html>
      `;
  }
}

/**
 * Send batch emails
 */
export async function sendBatchEmails(
  recipients: string[], 
  subject: string, 
  templateId: string, 
  dynamicData: Record<string, any>
): Promise<void> {
  // SendGrid supports up to 1000 recipients per request
  const batchSize = 1000;
  
  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    
    await sendEmail({
      to: batch,
      subject,
      templateId,
      dynamicData,
    });
    
    // Add delay between batches to avoid rate limiting
    if (i + batchSize < recipients.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}