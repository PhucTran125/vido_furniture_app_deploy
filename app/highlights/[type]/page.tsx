import { notFound } from 'next/navigation';
import { HighlightDetail } from '@/components/HighlightDetail';
import type { Metadata } from 'next';
import type { PageType } from '@/lib/types';

const HIGHLIGHT_TYPES = ['export-quality', 'customer-service', 'factory'] as const;

type HighlightType = typeof HIGHLIGHT_TYPES[number];

const METADATA_CONFIG: Record<HighlightType, { title: string; description: string }> = {
  'export-quality': {
    title: 'Export Quality Standards',
    description: 'Learn about VIDO Furniture\'s commitment to international quality standards, rigorous testing, and export excellence.',
  },
  'customer-service': {
    title: 'Customer Service Process',
    description: 'Our comprehensive 7-step procurement process ensures smooth communication and timely delivery for B2B clients worldwide.',
  },
  'factory': {
    title: 'Manufacturing Excellence & Capability',
    description: 'Explore VIDO Furniture\'s state-of-the-art manufacturing facility, quality control processes, and commitment to sustainability.',
  },
};

// Generate static paths for all highlight types
export async function generateStaticParams() {
  return HIGHLIGHT_TYPES.map(type => ({ type }));
}

// Generate SEO metadata for each highlight page
export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type } = await params;
  const config = METADATA_CONFIG[type as HighlightType];

  if (!config) {
    return {
      title: 'Not Found | VIDO Furniture',
    };
  }

  return {
    title: `${config.title} | VIDO Furniture`,
    description: config.description,
  };
}

export default async function HighlightPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const isValidType = HIGHLIGHT_TYPES.includes(type as HighlightType);

  if (!isValidType) {
    notFound();
  }

  return <HighlightDetail type={type as PageType} />;
}
