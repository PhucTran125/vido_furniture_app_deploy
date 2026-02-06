import { Blog } from '@/components/Blog';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | VIDO Furniture',
  description: 'Latest news and updates from VIDO Furniture - furniture manufacturing insights, industry trends, and company announcements.',
};

export default function BlogPage() {
  return <Blog />;
}
