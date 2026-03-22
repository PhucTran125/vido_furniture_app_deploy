import { NextResponse } from 'next/server';
import { getBlogById, updateBlog, deleteBlog } from '@/lib/db/blogs';
import { revalidatePath } from 'next/cache';
import { requireAdminAuth } from '@/lib/auth/session';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminAuth();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    const blog = await getBlogById(id);

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch blog';
    console.error('Error fetching blog:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminAuth();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    const data = await request.json();

    if (data.title !== undefined && (typeof data.title !== 'string' || data.title.trim().length === 0)) {
      return NextResponse.json({ error: 'Title cannot be empty' }, { status: 400 });
    }
    if (data.content !== undefined && typeof data.content !== 'object') {
      return NextResponse.json({ error: 'Content must be valid JSON' }, { status: 400 });
    }

    const blog = await updateBlog(id, {
      title: data.title?.trim(),
      shortDescription: data.shortDescription,
      content: data.content,
      coverImage: data.coverImage,
      publishDate: data.publishDate,
    });

    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath(`/blog/${blog.slug}`);

    return NextResponse.json(blog);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update blog';
    console.error('Error updating blog:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminAuth();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    await deleteBlog(id);

    revalidatePath('/');
    revalidatePath('/blog');

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete blog';
    console.error('Error deleting blog:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
