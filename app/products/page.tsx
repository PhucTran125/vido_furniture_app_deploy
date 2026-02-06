import { ProductGrid } from '@/components/ProductGrid';
import type { Metadata } from 'next';
import { getProducts } from '@/lib/db/products';

// Enable ISR: Revalidate every hour
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Products | VIDO Furniture',
  description: 'Browse our complete catalog of high-quality furniture for export.',
};

export default async function ProductsPage() {
  const products = await getProducts();

  return <ProductGrid products={products} />;
}
