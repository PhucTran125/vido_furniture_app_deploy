import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const COOKIE_NAME = 'admin_session';
const MAX_AGE = 86400; // 24 hours

interface AdminSession {
  id: number;
  username: string;
}

/**
 * Set admin session as HttpOnly secure cookie
 */
export async function setAdminSession(res: NextResponse, admin: AdminSession): Promise<NextResponse> {
  const value = Buffer.from(JSON.stringify(admin)).toString('base64');
  res.cookies.set(COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  });
  return res;
}

/**
 * Get admin session from HttpOnly cookie (for use in API routes)
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie?.value) return null;

  try {
    const decoded = Buffer.from(cookie.value, 'base64').toString('utf-8');
    const session = JSON.parse(decoded) as AdminSession;
    if (!session.id || !session.username) return null;
    return session;
  } catch {
    return null;
  }
}

/**
 * Require admin authentication — returns 401 response if not authenticated
 */
export async function requireAdminAuth(): Promise<AdminSession | NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return session;
}

/**
 * Create a response that clears the admin session cookie
 */
export function clearAdminSession(res: NextResponse): NextResponse {
  res.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}
