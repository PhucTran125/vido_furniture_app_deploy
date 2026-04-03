import { supabase } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/supabase/server';
import type { BlogPost, BlogStatus } from '@/lib/types';
import { VALID_STATUS_TRANSITIONS } from '@/lib/types';

// Database blog type (matches Supabase schema)
interface DbBlogPost {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  content: Record<string, unknown>;
  cover_image: string | null;
  author: string;
  status: string;
  is_featured: boolean;
  featured_order: number | null;
  publish_date: string | null;
  created_at: string;
  updated_at: string;
}

// Columns needed for list views (excludes heavy `content` JSONB)
const LIST_COLUMNS = 'id, slug, title, short_description, cover_image, author, status, is_featured, featured_order, publish_date, created_at, updated_at' as const;

// Generate URL-friendly slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Convert DB row to app-level BlogPost
// Handles both full rows (with content) and list rows (without content)
function dbBlogToPost(dbBlog: Partial<DbBlogPost> & Pick<DbBlogPost, 'id' | 'slug' | 'title' | 'author' | 'status' | 'is_featured' | 'created_at' | 'updated_at'>): BlogPost {
  return {
    id: dbBlog.id,
    slug: dbBlog.slug,
    title: dbBlog.title,
    shortDescription: dbBlog.short_description || undefined,
    content: dbBlog.content || {},
    coverImage: dbBlog.cover_image || undefined,
    author: dbBlog.author,
    status: dbBlog.status as BlogStatus,
    isFeatured: dbBlog.is_featured,
    featuredOrder: dbBlog.featured_order || undefined,
    publishDate: dbBlog.publish_date || undefined,
    createdAt: dbBlog.created_at,
    updatedAt: dbBlog.updated_at,
  };
}

// =============================================
// Public queries (use anon client)
// =============================================

/**
 * Get published blogs with pagination
 * Uses a single query with count + excludes heavy content column
 */
export async function getPublishedBlogs(
  page: number = 1,
  pageSize: number = 6
): Promise<{ blogs: BlogPost[]; total: number }> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await supabase
    .from('blogs')
    .select(LIST_COLUMNS, { count: 'exact' })
    .eq('status', 'published')
    .order('publish_date', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching blogs:', error);
    throw new Error(`Failed to fetch blogs: ${error.message}`);
  }

  return {
    blogs: (data || []).map(dbBlogToPost),
    total: count || 0,
  };
}

/**
 * Get a single published blog by slug
 */
export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    console.error('Error fetching blog by slug:', error);
    throw new Error(`Failed to fetch blog: ${error.message}`);
  }

  return data ? dbBlogToPost(data) : null;
}

/**
 * Get featured blogs for homepage
 */
export async function getFeaturedBlogs(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blogs')
    .select(LIST_COLUMNS)
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('featured_order', { ascending: true });

  if (error) {
    console.error('Error fetching featured blogs:', error);
    throw new Error(`Failed to fetch featured blogs: ${error.message}`);
  }

  return (data || []).map(dbBlogToPost);
}

// =============================================
// Admin queries (use service role client)
// =============================================

/**
 * Get all blogs (admin — all statuses)
 */
export async function getAllBlogs(): Promise<BlogPost[]> {
  const { data, error } = await supabaseAdmin
    .from('blogs')
    .select(LIST_COLUMNS)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all blogs:', error);
    throw new Error(`Failed to fetch blogs: ${error.message}`);
  }

  return (data || []).map(dbBlogToPost);
}

/**
 * Get a single blog by ID (admin)
 */
export async function getBlogById(id: string): Promise<BlogPost | null> {
  const { data, error } = await supabaseAdmin
    .from('blogs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Error fetching blog by ID:', error);
    throw new Error(`Failed to fetch blog: ${error.message}`);
  }

  return data ? dbBlogToPost(data) : null;
}

/**
 * Create a new blog post (admin)
 */
export async function createBlog(data: {
  title: string;
  shortDescription?: string;
  content: Record<string, unknown>;
  coverImage?: string;
  status?: BlogStatus;
  publishDate?: string;
}): Promise<BlogPost> {
  const slug = generateSlug(data.title);

  // Check for slug uniqueness
  const { data: existing } = await supabaseAdmin
    .from('blogs')
    .select('slug')
    .eq('slug', slug)
    .single();

  const finalSlug = existing
    ? `${slug}-${Date.now()}`
    : slug;

  const dbData = {
    slug: finalSlug,
    title: data.title,
    short_description: data.shortDescription || null,
    content: data.content,
    cover_image: data.coverImage || null,
    author: "VIDO Furniture's CEO",
    status: data.status || 'draft',
    publish_date: data.publishDate || (data.status === 'published' ? new Date().toISOString() : null),
  };

  const { data: created, error } = await supabaseAdmin
    .from('blogs')
    .insert(dbData)
    .select()
    .single();

  if (error) {
    console.error('Error creating blog:', error);
    throw new Error(`Failed to create blog: ${error.message}`);
  }

  return dbBlogToPost(created);
}

/**
 * Update an existing blog post (admin)
 */
export async function updateBlog(
  id: string,
  data: {
    title?: string;
    shortDescription?: string;
    content?: Record<string, unknown>;
    coverImage?: string;
    publishDate?: string;
  }
): Promise<BlogPost> {
  const dbUpdates: Record<string, unknown> = {};

  if (data.title !== undefined) {
    dbUpdates.title = data.title;
    // Preserve existing slug to avoid breaking public URLs
  }
  if (data.shortDescription !== undefined) dbUpdates.short_description = data.shortDescription;
  if (data.content !== undefined) dbUpdates.content = data.content;
  if (data.coverImage !== undefined) dbUpdates.cover_image = data.coverImage;
  if (data.publishDate !== undefined) dbUpdates.publish_date = data.publishDate;

  const { data: updated, error } = await supabaseAdmin
    .from('blogs')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating blog:', error);
    throw new Error(`Failed to update blog: ${error.message}`);
  }

  return dbBlogToPost(updated);
}

/**
 * Update blog status with transition validation (admin)
 */
export async function updateBlogStatus(
  id: string,
  newStatus: BlogStatus
): Promise<BlogPost> {
  // Get current blog to validate transition
  const current = await getBlogById(id);
  if (!current) {
    throw new Error('Blog not found');
  }

  const allowedTransitions = VALID_STATUS_TRANSITIONS[current.status];
  if (!allowedTransitions.includes(newStatus)) {
    throw new Error(
      `Invalid status transition: ${current.status} → ${newStatus}. ` +
      `Allowed: ${allowedTransitions.join(', ') || 'none'}`
    );
  }

  const dbUpdates: Record<string, unknown> = { status: newStatus };

  // Auto-set publish_date when publishing for the first time
  if (newStatus === 'published' && !current.publishDate) {
    dbUpdates.publish_date = new Date().toISOString();
  }

  const { data: updated, error } = await supabaseAdmin
    .from('blogs')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating blog status:', error);
    throw new Error(`Failed to update blog status: ${error.message}`);
  }

  return dbBlogToPost(updated);
}

/**
 * Delete a blog post (admin)
 */
export async function deleteBlog(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('blogs')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting blog:', error);
    throw new Error(`Failed to delete blog: ${error.message}`);
  }
}

/**
 * Set featured blogs (admin)
 * Accepts an array of blog IDs in display order (3–5 items)
 */
export async function setFeaturedBlogs(blogIds: string[]): Promise<void> {
  if (blogIds.length < 3 || blogIds.length > 5) {
    throw new Error('Must select between 3 and 5 featured blogs');
  }

  // Clear all existing featured flags
  const { error: clearError } = await supabaseAdmin
    .from('blogs')
    .update({ is_featured: false, featured_order: null })
    .eq('is_featured', true);

  if (clearError) {
    console.error('Error clearing featured blogs:', clearError);
    throw new Error(`Failed to clear featured blogs: ${clearError.message}`);
  }

  // Set new featured blogs with order
  for (let i = 0; i < blogIds.length; i++) {
    const { error } = await supabaseAdmin
      .from('blogs')
      .update({ is_featured: true, featured_order: i + 1 })
      .eq('id', blogIds[i]);

    if (error) {
      console.error(`Error setting featured blog ${blogIds[i]}:`, error);
      throw new Error(`Failed to set featured blog: ${error.message}`);
    }
  }
}
