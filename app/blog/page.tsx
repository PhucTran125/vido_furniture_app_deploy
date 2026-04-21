import { Blog } from '@/components/Blog';
import { getPublishedBlogs } from '@/lib/db/blogs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | News & Insights | VIDO Furniture',
  description: 'Latest news and updates from VIDO Furniture - furniture manufacturing insights, industry trends, and company announcements.',
  alternates: {
    canonical: '/blog',
  },
};

export const revalidate = 3600; // Revalidate every hour

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const pageStr = typeof params.page === 'string' ? params.page : '1';
  const page = parseInt(pageStr, 10) > 0 ? parseInt(pageStr, 10) : 1;
  const limit = 9; // 9 posts per page (3x3 grid)

  const { blogs, total } = await getPublishedBlogs(page, limit);
  const totalPages = Math.ceil(total / limit);

  return <Blog blogs={blogs} currentPage={page} totalPages={totalPages} />;
}
