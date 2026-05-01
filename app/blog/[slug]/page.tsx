import { getBlogBySlug, getPublishedBlogs } from '@/lib/db/blogs';
import { notFound } from 'next/navigation';
import { BlogDetail } from '@/components/BlogDetail';
import { JsonLd } from '@/components/seo/JsonLd';
import { renderBlogContent } from '@/lib/blog-html';
import type { Metadata, ResolvingMetadata } from 'next';
import { getLocalizedString } from '@/lib/types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://vidofurniture.com';

export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  try {
    const { blogs } = await getPublishedBlogs(1, 1000);
    return blogs.map((blog) => ({ slug: blog.slug }));
  } catch (error) {
    console.error('Error generating static blog params:', error);
    return [];
  }
}

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
    alternates: {
      canonical: `/blog/${slug}/`,
    },
    openGraph: {
      title,
      description: description || `Read ${title} by ${blog.author}`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://vidofurniture.com'}/blog/${blog.slug}/`,
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

  const title = getLocalizedString(blog.title, 'en');
  const description = getLocalizedString(blog.shortDescription, 'en');
  const articleUrl = `${SITE_URL}/blog/${slug}/`;
  const imageUrl = blog.coverImage || `${SITE_URL}/og-image.jpg`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description || undefined,
    image: [imageUrl],
    datePublished: blog.publishDate || blog.createdAt,
    dateModified: blog.updatedAt,
    author: { '@type': 'Person', name: blog.author },
    publisher: {
      '@type': 'Organization',
      name: 'VIDO Furniture',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog/` },
      { '@type': 'ListItem', position: 3, name: title, item: articleUrl },
    ],
  };

  const { en: htmlContentEn, vi: htmlContentVi } = renderBlogContent(blog.content);

  return (
    <>
      <JsonLd data={[articleSchema, breadcrumbSchema]} />
      <BlogDetail blog={blog} htmlContentEn={htmlContentEn} htmlContentVi={htmlContentVi} />
    </>
  );
}
