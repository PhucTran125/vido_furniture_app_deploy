import { notFound } from 'next/navigation';
import { ProductDetail } from '@/components/ProductDetail';
import { getProductBySlug, getAllProductSlugs } from '@/lib/db/products';
import type { Metadata } from 'next';

// Enable ISR: Revalidate every hour
export const revalidate = 3600;

// Generate static paths for all products from database
export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

// Generate SEO metadata for each product
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | VIDO Furniture',
    };
  }

  const description = product.description?.en.join(' ') ||
    `${product.name.en} - Item No: ${product.itemNo}. High-quality ${product.category.toLowerCase()} from VIDO Furniture.`;

  return {
    title: `${product.name.en} | VIDO Furniture`,
    description,
    keywords: `${product.name.en}, ${product.itemNo}, ${product.category}, furniture, VIDO`,
    openGraph: {
      title: product.name.en,
      description: product.description?.en[0] || description,
      images: product.image ? [`/${product.image}`] : [],
      type: 'website',
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
