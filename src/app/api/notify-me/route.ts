import { NextRequest, NextResponse } from 'next/server';
import { notifyService } from '@/services/notifyService';
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

const notifyRequestSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  destinationCountry: z.string().min(1).max(100),
  destinationTitle: z.string().min(1).max(500),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validatedData = notifyRequestSchema.parse(body);
    
    const sanitizedData = {
      name: DOMPurify.sanitize(validatedData.name),
      email: DOMPurify.sanitize(validatedData.email),
      phone: DOMPurify.sanitize(validatedData.phone),
      destinationCountry: DOMPurify.sanitize(validatedData.destinationCountry),
      destinationTitle: DOMPurify.sanitize(validatedData.destinationTitle),
    };
    
    const requestId = await notifyService.createNotifyRequest(sanitizedData);
    
    const confirmationEmail = notifyService.generateConfirmationEmail({
      name: sanitizedData.name,
      email: sanitizedData.email,
      destinationCountry: sanitizedData.destinationCountry,
    });
    
    try {
      const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: confirmationEmail.to }],
          }],
          from: { email: 'koray@yourdomain.com', name: 'Pacific MMA' }, // Kendi doğrulanmış email'inizi kullanın
          subject: confirmationEmail.subject,
          content: [
            { type: 'text/plain', value: confirmationEmail.text },
            { type: 'text/html', value: confirmationEmail.html },
          ],
        }),
      });

      if (!emailResponse.ok) {
        console.error('Email sending failed but request saved');
      }
    } catch (emailError) {
      console.error('Email service error:', emailError);
    }
    
    return NextResponse.json({
      success: true,
      requestId,
      message: 'Notification request received successfully',
    });
  } catch (error) {
    console.error('Notify request error:', error);
    
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
        error: 'Failed to process notification request',
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
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}