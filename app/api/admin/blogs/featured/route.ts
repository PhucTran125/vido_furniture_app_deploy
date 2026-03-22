import { NextResponse } from 'next/server';
import { getFeaturedBlogs, setFeaturedBlogs } from '@/lib/db/blogs';
import { revalidatePath } from 'next/cache';
import { requireAdminAuth } from '@/lib/auth/session';

export async function GET() {
  try {
    const auth = await requireAdminAuth();
    if (auth instanceof NextResponse) return auth;

    const featured = await getFeaturedBlogs();
    return NextResponse.json(featured);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch featured blogs';
    console.error('Error fetching featured blogs:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const auth = await requireAdminAuth();
    if (auth instanceof NextResponse) return auth;

    const { blogIds } = await request.json() as { blogIds: string[] };

    if (!Array.isArray(blogIds) || blogIds.length < 3 || blogIds.length > 5) {
      return NextResponse.json(
        { error: 'Must select between 3 and 5 featured blogs' },
        { status: 400 }
      );
    }

    await setFeaturedBlogs(blogIds);

    revalidatePath('/');

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to set featured blogs';
    console.error('Error setting featured blogs:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
