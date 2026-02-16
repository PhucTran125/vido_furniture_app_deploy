import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/db/admin-accounts';
import { setAdminSession } from '@/lib/auth/session';

// POST /api/admin/auth/login — verify credentials and set secure session cookie
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

    const res = NextResponse.json({ success: true, admin: { id: admin.id, username: admin.username } });
    await setAdminSession(res, { id: admin.id, username: admin.username });
    return res;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
