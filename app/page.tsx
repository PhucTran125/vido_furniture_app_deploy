import { Hero } from '@/components/Hero';
import { Highlights } from '@/components/Highlights';
import { FeaturedCollection } from '@/components/FeaturedCollection';
import { Achievements } from '@/components/Achievements';
import { FeaturedBlogs } from '@/components/FeaturedBlogs';
import { Contact } from '@/components/Contact';
import { getProducts } from '@/lib/db/products';
import { getFeaturedBlogs } from '@/lib/db/blogs';

// Enable ISR: Revalidate every 30 minutes for homepage
export const revalidate = 1800;

export default async function HomePage() {
  const [products, featuredBlogs] = await Promise.all([
    getProducts().catch((err) => { console.error('Failed to fetch products:', err); return []; }),
    getFeaturedBlogs().catch((err) => { console.error('Failed to fetch featured blogs:', err); return []; }),
  ]);

  return (
    <>
      {/* Hero + Highlights fill exactly one viewport (minus header) */}
      <div className="flex flex-col h-[calc(100vh-5rem)]">
        <Hero />
        <Highlights />
      </div>
      <FeaturedCollection products={products} />
      <Achievements />
      <FeaturedBlogs blogs={featuredBlogs} />
      <Contact />
    </>
  );
}
