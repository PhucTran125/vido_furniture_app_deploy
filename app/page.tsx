import { Hero } from '@/components/Hero';
import { Highlights } from '@/components/Highlights';
import { FeaturedCollection } from '@/components/FeaturedCollection';
import { ProductGrid } from '@/components/ProductGrid';
import { Contact } from '@/components/Contact';
import { getProducts } from '@/lib/db/products';

// Enable ISR: Revalidate every 30 minutes for homepage
export const revalidate = 1800;

export default async function HomePage() {
  const products = await getProducts();

  return (
    <>
      <Hero />
      <Highlights />
      <FeaturedCollection products={products} />
      <ProductGrid products={products} />
      <Contact />
    </>
  );
}
