import { notFound } from 'next/navigation';
import { ProductDetail } from '@/components/ProductDetail';
import { Contact } from '@/components/Contact';
import { JsonLd } from '@/components/seo/JsonLd';
import { getProductBySlug, getAllProductSlugs } from '@/lib/db/products';
import { getMainImageUrl } from '@/lib/types';
import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://vidofurniture.com';

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
    alternates: {
      canonical: `/products/${slug}/`,
    },
    openGraph: {
      title: product.name.en,
      description: product.description?.en[0] || description,
      images: [getMainImageUrl(product)],
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

  const productUrl = `${SITE_URL}/products/${slug}/`;
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name.en,
    sku: product.itemNo,
    category: product.category,
    description: product.description?.en?.join(' ') || undefined,
    image: product.images.map((img) => img.url),
    brand: { '@type': 'Brand', name: 'VIDO Furniture' },
    manufacturer: {
      '@type': 'Organization',
      name: 'VIDO Furniture',
      url: SITE_URL,
    },
    url: productUrl,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${SITE_URL}/products/` },
      { '@type': 'ListItem', position: 3, name: product.name.en, item: productUrl },
    ],
  };

  return (
    <>
      <JsonLd data={[productSchema, breadcrumbSchema]} />
      <ProductDetail product={product} />
      <Contact />
    </>
  );
}
