import { NextRequest, NextResponse } from 'next/server';
import { sendCustomerConfirmation, sendCompanyNotification } from '@/lib/email';
import { isValidEmail, isValidPhone, sanitizeString } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, message } = body;

    // Validate required fields
    const errors: Record<string, string> = {};
    if (!firstName?.trim()) errors.firstName = 'First name is required';
    if (!lastName?.trim()) errors.lastName = 'Last name is required';
    if (!email?.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(email.trim())) {
      errors.email = 'Please enter a valid email address';
    }
    if (!phone?.trim()) {
      errors.phone = 'Phone is required';
    } else if (!isValidPhone(phone.trim())) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const data = {
      firstName: sanitizeString(firstName, 100),
      lastName: sanitizeString(lastName, 100),
      email: sanitizeString(email, 254),
      phone: sanitizeString(phone, 20),
      message: sanitizeString(message || '', 2000),
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
