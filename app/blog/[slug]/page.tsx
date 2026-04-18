import { getBlogBySlug } from '@/lib/db/blogs';
import { notFound } from 'next/navigation';
import { BlogDetail } from '@/components/BlogDetail';
import type { Metadata, ResolvingMetadata } from 'next';
import { getLocalizedString } from '@/lib/types';

export const revalidate = 3600; // Revalidate every hour

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: 'Post Not Found | VIDO Furniture',
    };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const imageUrl = blog.coverImage || '/og-image.jpg';
  const title = getLocalizedString(blog.title, 'en');
  const description = getLocalizedString(blog.shortDescription, 'en');

  return {
    title: `${title} | VIDO Blog`,
    description: description || `Read ${title} by ${blog.author}`,
    openGraph: {
      title,
      description: description || `Read ${title} by ${blog.author}`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://vido-furniture.com'}/blog/${blog.slug}`,
      siteName: 'VIDO Furniture',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
        ...previousImages,
      ],
      type: 'article',
      publishedTime: blog.publishDate || blog.createdAt,
      authors: [blog.author],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description || `Read ${title} by ${blog.author}`,
      images: [imageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return <BlogDetail blog={blog} />;
}
