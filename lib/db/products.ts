import { supabase } from '../supabase/client';
import { supabaseAdmin } from '../supabase/server';
import { Product } from '../types';

// Database product type (matches Supabase schema)
interface DbProduct {
  id: number;
  slug: string;
  item_no: string;
  name_en: string;
  name_vi: string;
  category: string;
  image: string | null;
  description_en: string[] | null;
  description_vi: string[] | null;
  dimensions: any;
  material: any;
  set_components: any;
  created_at: string;
  updated_at: string;
}

// Convert database product to application Product type
function dbProductToProduct(dbProduct: DbProduct): Product {
  return {
    id: String(dbProduct.id), // Convert number to string
    itemNo: dbProduct.item_no,
    name: {
      en: dbProduct.name_en,
      vi: dbProduct.name_vi,
    },
    category: dbProduct.category as any,
    image: dbProduct.image || '', // Convert null to empty string
    description: {
      en: dbProduct.description_en || [],
      vi: dbProduct.description_vi || [],
    },
    dimensions: dbProduct.dimensions,
    material: dbProduct.material,
    setComponents: dbProduct.set_components,
  };
}

// Convert application Product to database format
function productToDbProduct(product: Partial<Product> & { itemNo: string; name: { en: string; vi: string }; category: string }) {
  return {
    item_no: product.itemNo,
    slug: product.itemNo.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name_en: product.name.en,
    name_vi: product.name.vi,
    category: product.category,
    image: product.image || null,
    description_en: product.description?.en || null,
    description_vi: product.description?.vi || null,
    dimensions: product.dimensions || null,
    material: product.material || null,
    set_components: product.setComponents || null,
  };
}

/**
 * Get all products from database
 * Used for: Product listing, homepage, search
 */
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    throw new Error(`Failed to fetch products: ${error.message}`);
  }

  return data.map(dbProductToProduct);
}

/**
 * Get single product by slug
 * Used for: Product detail pages
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Error fetching product:', error);
    throw new Error(`Failed to fetch product: ${error.message}`);
  }

  return dbProductToProduct(data);
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
 * Get all product slugs for static generation
 * Used for: generateStaticParams in Next.js
 */
export async function getAllProductSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from('products')
    .select('slug');

  if (error) {
    console.error('Error fetching product slugs:', error);
    throw new Error(`Failed to fetch product slugs: ${error.message}`);
  }

  return data.map(row => row.slug);
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
export async function updateProduct(id: number, updates: Partial<Product>): Promise<Product> {
  const dbUpdates: any = {};

  if (updates.itemNo) dbUpdates.item_no = updates.itemNo;
  if (updates.name) {
    if (updates.name.en) dbUpdates.name_en = updates.name.en;
    if (updates.name.vi) dbUpdates.name_vi = updates.name.vi;
  }
  if (updates.category) dbUpdates.category = updates.category;
  if (updates.image !== undefined) dbUpdates.image = updates.image || null;
  if (updates.description) {
    if (updates.description.en) dbUpdates.description_en = updates.description.en;
    if (updates.description.vi) dbUpdates.description_vi = updates.description.vi;
  }
  if (updates.dimensions !== undefined) dbUpdates.dimensions = updates.dimensions;
  if (updates.material !== undefined) dbUpdates.material = updates.material;
  if (updates.setComponents !== undefined) dbUpdates.set_components = updates.setComponents;

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
export async function deleteProduct(id: number): Promise<void> {
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
    .or(`name_en.ilike.%${query}%,name_vi.ilike.%${query}%,item_no.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching products:', error);
    throw new Error(`Failed to search products: ${error.message}`);
  }

  return data.map(dbProductToProduct);
}
