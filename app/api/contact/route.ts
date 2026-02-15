import { NextRequest, NextResponse } from 'next/server';
import { sendCustomerConfirmation, sendCompanyNotification } from '@/lib/email';

// GET /api/contact — diagnostic endpoint to test email config
export async function GET() {
  const envCheck = {
    GMAIL_SENDER_EMAIL: !!process.env.GMAIL_SENDER_EMAIL,
    GMAIL_CLIENT_ID: !!process.env.GMAIL_CLIENT_ID,
    GMAIL_CLIENT_SECRET: !!process.env.GMAIL_CLIENT_SECRET,
    GMAIL_REFRESH_TOKEN: !!process.env.GMAIL_REFRESH_TOKEN,
    NODE_ENV: process.env.NODE_ENV,
  };

  return NextResponse.json({ envCheck });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, message } = body;

    // Validate required fields
    const errors: Record<string, string> = {};
    if (!firstName?.trim()) errors.firstName = 'First name is required';
    if (!lastName?.trim()) errors.lastName = 'Last name is required';
    if (!email?.trim()) errors.email = 'Email is required';
    if (!phone?.trim()) errors.phone = 'Phone is required';

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const data = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      message: message?.trim() || '',
    };

    // Send emails and log any failures
    const results = await Promise.allSettled([
      sendCustomerConfirmation(data),
      sendCompanyNotification(data),
    ]);

    const failures = results.filter((r) => r.status === 'rejected');
    if (failures.length > 0) {
      failures.forEach((f) => {
        if (f.status === 'rejected') console.error('Email send failed:', f.reason);
      });
      return NextResponse.json(
        { success: false, error: 'Failed to send email. Please try again or contact us directly.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process inquiry' },
      { status: 500 }
    );
  }
}
