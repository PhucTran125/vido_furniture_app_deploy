import { PRODUCTS } from '@/lib/constants';
import type { Product } from '@/lib/types';

// Helper to generate URL-friendly slug from product (name + item number)
export function generateSlug(product: Product): string {
  const nameSlug = product.name.en
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const itemSlug = product.itemNo.toLowerCase();

  return `${nameSlug}-${itemSlug}`;
}

// Get product by slug
export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find(p => generateSlug(p) === slug);
}

// Get all product slugs (for static generation)
export function getAllProductSlugs(): string[] {
  return PRODUCTS.map(generateSlug);
}
