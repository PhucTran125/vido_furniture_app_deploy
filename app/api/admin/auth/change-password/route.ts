import { NextResponse } from 'next/server';
import { verifyCurrentPassword, updateAdminPassword } from '@/lib/db/admin-accounts';

// POST /api/admin/auth/change-password — update password
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { adminId, currentPassword, newPassword } = body;

    if (!adminId || !currentPassword || !newPassword) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
    }

    // Verify current password
    const isValid = await verifyCurrentPassword(adminId, currentPassword);
    if (!isValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
    }

    // Update password
    await updateAdminPassword(adminId, newPassword);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
