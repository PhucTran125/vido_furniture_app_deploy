import { NextResponse } from 'next/server';
import { verifyCurrentPassword, updateAdminPassword } from '@/lib/db/admin-accounts';
import { requireAdminAuth } from '@/lib/auth/session';

// POST /api/admin/auth/change-password — update password (uses session for adminId)
export async function POST(request: Request) {
  try {
    const auth = await requireAdminAuth();
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
    }

    // Verify current password using session's admin ID
    const isValid = await verifyCurrentPassword(auth.id, currentPassword);
    if (!isValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
    }

    // Update password
    await updateAdminPassword(auth.id, newPassword);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
