export interface LocalizedContent {
  en: string;
  vi: string;
}

export interface ProductImage {
  url: string;
  alt?: LocalizedContent;
  isMain: boolean;
  displayOrder: number;
}

export interface ProductPrices {
  fobFuzhou?: number;
  mailOrder?: number;
  ukFrUs?: number;
}

export interface Product {
  id: string;
  itemNo: string;
  category: string;
  categoryId?: number;

  // Localized content
  name: LocalizedContent;
  description?: { en: string[]; vi: string[] };
  material?: { en: string[]; vi: string[] };
  packagingType?: LocalizedContent;
  remark?: LocalizedContent;

  // Images
  images: ProductImage[];

  // Dimensions
  dimensions?: { en: string[]; vi: string[] };
  packingSize?: string;

  // Pricing
  prices?: ProductPrices;

  // Logistics
  moq?: number;
  innerPack?: string;
  containerCapacity?: number;
  cartonCBM?: number;

  // Set components (for furniture sets)
  setComponents?: any;

  // Metadata
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Helper functions
export function getMainImage(product: Product): ProductImage | undefined {
  return product.images.find(img => img.isMain) || product.images[0];
}

export function getGalleryImages(product: Product): ProductImage[] {
  return [...product.images].sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getMainImageUrl(product: Product): string {
  return getMainImage(product)?.url || '';
}

export interface NavItem {
  label: string;
  href: string;
}

export interface CompanyInfo {
  name: string;
  address: string;
  hotline: string;
  taxCode: string;
  email?: string;
}

export type PageType = 'home' | 'about' | 'blog' | 'export-quality' | 'customer-service' | 'factory';