import { NextResponse } from 'next/server';
import { getAllBlogs, createBlog } from '@/lib/db/blogs';
import { revalidatePath } from 'next/cache';
import { requireAdminAuth } from '@/lib/auth/session';

export async function GET() {
  try {
    const auth = await requireAdminAuth();
    if (auth instanceof NextResponse) return auth;

    const blogs = await getAllBlogs();
    return NextResponse.json(blogs);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch blogs';
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAdminAuth();
    if (auth instanceof NextResponse) return auth;

    const data = await request.json();

    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    if (!data.content || typeof data.content !== 'object') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const blog = await createBlog({
      title: data.title.trim(),
      shortDescription: data.shortDescription,
      content: data.content,
      coverImage: data.coverImage,
      status: data.status,
      publishDate: data.publishDate,
      isFeatured: data.isFeatured,
      featuredOrder: data.featuredOrder,
    });

    revalidatePath('/');
    revalidatePath('/blog');

    return NextResponse.json(blog);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create blog';
    console.error('Error creating blog:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
