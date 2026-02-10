import { supabase } from '@/lib/supabase/client';
import { supabaseAdmin } from '../supabase/server';
import type { Product, LocalizedContent, ProductImage, ProductPrices } from '@/lib/types';
// test change commit's author
// Helper to generate unique slug from name and item number
function generateSlugFromName(name: string, itemNo: string): string {
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const itemSlug = itemNo.toLowerCase();

  return `${nameSlug}-${itemSlug}`;
}

// Database product type (matches new Supabase JSONB schema)
interface DbProduct {
  id: string;
  item_no: string;
  category: string;
  name: LocalizedContent;
  images: ProductImage[];
  dimensions?: { en: string[]; vi: string[] };
  packing_size?: string;
  material?: { en: string[]; vi: string[] };
  packaging_type?: LocalizedContent;
  prices?: ProductPrices;
  moq?: number;
  inner_pack?: string;
  container_capacity?: number;
  carton_cbm?: number;
  remark?: LocalizedContent;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Helper to safely parse JSONB fields that might come as strings
function parseJsonField<T>(value: T | string | undefined | null): T | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return undefined;
    }
  }
  return value as T;
}

// Convert database product to application Product type
function dbProductToProduct(dbProduct: DbProduct): Product {
  return {
    id: dbProduct.id,
    itemNo: dbProduct.item_no,
    category: dbProduct.category,
    name: dbProduct.name,
    images: dbProduct.images || [],
    dimensions: parseJsonField<{ en: string[]; vi: string[] }>(dbProduct.dimensions),
    packingSize: dbProduct.packing_size,
    material: parseJsonField<{ en: string[]; vi: string[] }>(dbProduct.material),
    packagingType: dbProduct.packaging_type,
    prices: dbProduct.prices,
    moq: dbProduct.moq,
    innerPack: dbProduct.inner_pack,
    containerCapacity: dbProduct.container_capacity,
    cartonCBM: dbProduct.carton_cbm,
    remark: dbProduct.remark,
    isActive: dbProduct.is_active,
    createdAt: dbProduct.created_at,
    updatedAt: dbProduct.updated_at,
  };
}

// Convert application Product to database format
function productToDbProduct(product: Partial<Product> & { itemNo: string; name: LocalizedContent; category: string }) {
  return {
    item_no: product.itemNo,
    category: product.category,
    name: product.name,
    images: product.images || [],
    dimensions: product.dimensions || null,
    packing_size: product.packingSize || null,
    material: product.material || null,
    packaging_type: product.packagingType || null,
    prices: product.prices || null,
    moq: product.moq || null,
    inner_pack: product.innerPack || null,
    container_capacity: product.containerCapacity || null,
    carton_cbm: product.cartonCBM || null,
    remark: product.remark || null,
    is_active: product.isActive !== undefined ? product.isActive : true,
  };
}

/**
 * Get all active products
 * Used for: Homepage, product listing pages (only shows active products)
 */
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true) // Only show active products on website
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    throw new Error(`Failed to fetch products: ${error.message}`);
  }

  return data.map(dbProductToProduct);
}

/**
 * Get single product by slug (generated from product name + item number)
 * Used for: Product detail pages
 * Slug format: "product-name-item-number" (e.g., "s-2-storage-ottoman-vwf24a2064cg-18")
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  // Extract item number from slug (last segment after final dash sequence)
  // The item number typically contains dashes, so we need to find where it starts
  // Pattern: product-name-ITEMNO where ITEMNO matches item_no format

  // Get all active products
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching products:', error);
    throw new Error(`Failed to fetch products: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return null;
  }

  // Find product by generating slug from name+itemNo and matching
  const product = data.find((p) => {
    const productSlug = generateSlugFromName(p.name.en, p.item_no);
    return productSlug === slug;
  });

  if (!product) {
    return null;
  }

  return dbProductToProduct(product);
}

/**
 * Get products by category
 * Used for: Category filtering
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products by category:', error);
    throw new Error(`Failed to fetch products: ${error.message}`);
  }

  return data.map(dbProductToProduct);
}

/**
 * Get all product slugs (for static generation)
 * Used for: generateStaticParams in Next.js
 */
export async function getAllProductSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from('products')
    .select('name, item_no')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching product slugs:', error);
    return [];
  }

  return data.map((p) => generateSlugFromName(p.name.en, p.item_no));
}

/**
 * Create new product (Admin only)
 * Used for: Admin product creation
 */
export async function createProduct(product: Partial<Product> & { itemNo: string; name: { en: string; vi: string }; category: string }): Promise<Product> {
  const dbProduct = productToDbProduct(product);

  const { data, error } = await supabaseAdmin
    .from('products')
    .insert(dbProduct)
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error);
    throw new Error(`Failed to create product: ${error.message}`);
  }

  return dbProductToProduct(data);
}

/**
 * Update existing product (Admin only)
 * Used for: Admin product editing
 */
export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const dbUpdates: any = {};

  if (updates.itemNo) dbUpdates.item_no = updates.itemNo;
  if (updates.name) dbUpdates.name = updates.name;
  if (updates.category) dbUpdates.category = updates.category;
  if (updates.images !== undefined) dbUpdates.images = updates.images;
  if (updates.dimensions !== undefined) dbUpdates.dimensions = updates.dimensions;
  if (updates.packingSize !== undefined) dbUpdates.packing_size = updates.packingSize;
  if (updates.material !== undefined) dbUpdates.material = updates.material;
  if (updates.packagingType !== undefined) dbUpdates.packaging_type = updates.packagingType;
  if (updates.prices !== undefined) dbUpdates.prices = updates.prices;
  if (updates.moq !== undefined) dbUpdates.moq = updates.moq;
  if (updates.innerPack !== undefined) dbUpdates.inner_pack = updates.innerPack;
  if (updates.containerCapacity !== undefined) dbUpdates.container_capacity = updates.containerCapacity;
  if (updates.cartonCBM !== undefined) dbUpdates.carton_cbm = updates.cartonCBM;
  if (updates.remark !== undefined) dbUpdates.remark = updates.remark;
  if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;

  const { data, error } = await supabaseAdmin
    .from('products')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error);
    throw new Error(`Failed to update product: ${error.message}`);
  }

  return dbProductToProduct(data);
}

/**
 * Delete product (Admin only)
 * Used for: Admin product deletion
 */
export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    throw new Error(`Failed to delete product: ${error.message}`);
  }
}

/**
 * Search products by name or item number
 * Used for: Search functionality
 */
export async function searchProducts(query: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`name->>en.ilike.%${query}%,name->>vi.ilike.%${query}%,item_no.ilike.%${query}%`)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching products:', error);
    throw new Error(`Failed to search products: ${error.message}`);
  }

  return data.map(dbProductToProduct);
}
