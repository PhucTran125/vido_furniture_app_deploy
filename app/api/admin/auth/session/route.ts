import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/session';

// GET /api/admin/auth/session — check if admin is authenticated
export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, admin: session });
}
