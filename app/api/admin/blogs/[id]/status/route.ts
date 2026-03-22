import { NextResponse } from 'next/server';
import { updateBlogStatus } from '@/lib/db/blogs';
import { revalidatePath } from 'next/cache';
import { requireAdminAuth } from '@/lib/auth/session';
import type { BlogStatus } from '@/lib/types';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminAuth();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    const { status } = await request.json() as { status: BlogStatus };

    if (!['draft', 'published', 'archived'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be: draft, published, or archived' },
        { status: 400 }
      );
    }

    const blog = await updateBlogStatus(id, status);

    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath(`/blog/${blog.slug}`);

    return NextResponse.json(blog);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update blog status';
    console.error('Error updating blog status:', error);

    // Return 400 for invalid transitions, 500 for other errors
    const statusCode = message.includes('Invalid status transition') ? 400 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
