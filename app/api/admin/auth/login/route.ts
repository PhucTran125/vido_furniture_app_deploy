import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/db/admin-accounts';

// POST /api/admin/auth/login — verify credentials
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const admin = await verifyAdmin(username, password);

    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({ success: true, admin: { id: admin.id, username: admin.username } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
