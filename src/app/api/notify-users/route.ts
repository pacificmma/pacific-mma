import { NextRequest, NextResponse } from 'next/server';
import { notifyService } from '@/services/notifyService';
import { auth } from '@/utils/fireBaseAuthProvider';
import { z } from 'zod';

const notifyUsersSchema = z.object({
  destinationCountry: z.string(),
  destinationTitle: z.string(),
  adminToken: z.string(),
});

async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const decodedToken = await auth.currentUser?.getIdTokenResult();
    return decodedToken?.claims?.role === 'admin';
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const isAdmin = await verifyAdminToken(token);
    
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { destinationCountry, destinationTitle } = notifyUsersSchema.parse(body);
    
    const requests = await notifyService.getNotifyRequestsByDestination(destinationCountry);
    
    if (requests.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No users to notify',
        notifiedCount: 0,
      });
    }
    
    const emailPromises = requests.map(async (request) => {
      const email = notifyService.generateAvailabilityEmail({
        name: request.name,
        email: request.email,
        destinationCountry,
        destinationTitle,
      });
      
      try {
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            personalizations: [{
              to: [{ email: email.to }],
            }],
            from: { email: email.from, name: 'Pacific MMA' },
            subject: email.subject,
            content: [
              { type: 'text/plain', value: email.text },
              { type: 'text/html', value: email.html },
            ],
          }),
        });
        
        return response.ok;
      } catch (error) {
        console.error(`Failed to send email to ${request.email}:`, error);
        return false;
      }
    });
    
    const results = await Promise.allSettled(emailPromises);
    const successCount = results.filter(r => r.status === 'fulfilled' && r.value).length;
    
    const requestIds = requests.map(r => r.id!).filter(Boolean);
    await notifyService.markAsNotified(requestIds);
    
    return NextResponse.json({
      success: true,
      message: `Notifications sent successfully`,
      notifiedCount: successCount,
      totalRequests: requests.length,
    });
  } catch (error) {
    console.error('Notify users error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid data provided',
          details: error.issues,
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to notify users',
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}