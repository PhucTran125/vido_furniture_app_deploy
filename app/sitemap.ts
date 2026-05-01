import { MetadataRoute } from 'next';
import { getAllProductSlugsWithMeta } from '@/lib/db/products';
import { getPublishedBlogs } from '@/lib/db/blogs';

const BASE_URL = 'https://vidofurniture.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/about/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/products/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/highlights/export-quality/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/highlights/customer-service/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/highlights/factory/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Dynamic product pages
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const items = await getAllProductSlugsWithMeta();
    productPages = items.map(({ slug, updatedAt }) => ({
      url: `${BASE_URL}/products/${slug}/`,
      lastModified: updatedAt ? new Date(updatedAt) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error generating product sitemap entries:', error);
  }

  // Dynamic blog pages
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const { blogs } = await getPublishedBlogs(1, 1000);
    blogPages = blogs.map((blog) => ({
      url: `${BASE_URL}/blog/${blog.slug}/`,
      lastModified: blog.updatedAt ? new Date(blog.updatedAt) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error generating blog sitemap entries:', error);
  }

  return [...staticPages, ...productPages, ...blogPages];
}
