import { supabase } from './supabase/client';
import { Product } from './types';

/**
 * Database helper utilities for working with products in Supabase
 */

/**
 * Fetch all active products
 */
export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return mapDbProductsToProducts(data || []);
}

/**
 * Fetch a single product by item number
 */
export async function getProductByItemNo(itemNo: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('item_no', itemNo)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return mapDbProductToProduct(data);
}

/**
 * Fetch products by category
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }

  return mapDbProductsToProducts(data || []);
}

/**
 * Map database product to TypeScript Product interface
 * Handles the conversion from snake_case database columns to camelCase
 */
function mapDbProductToProduct(dbProduct: any): Product {
  return {
    id: dbProduct.id,
    itemNo: dbProduct.item_no,
    category: dbProduct.category,
    name: dbProduct.name,
    description: dbProduct.description,
    material: dbProduct.material,
    packagingType: dbProduct.packaging_type,
    remark: dbProduct.remark,
    images: dbProduct.images || [],
    dimensions: dbProduct.dimensions,
    packingSize: dbProduct.packing_size,
    prices: dbProduct.prices,
    moq: dbProduct.moq,
    innerPack: dbProduct.inner_pack,
    containerCapacity: dbProduct.container_capacity,
    cartonCBM: dbProduct.carton_cbm,
    setComponents: dbProduct.set_components,
    isActive: dbProduct.is_active,
    createdAt: dbProduct.created_at,
    updatedAt: dbProduct.updated_at,
  };
}

/**
 * Map array of database products to TypeScript Product interfaces
 */
function mapDbProductsToProducts(dbProducts: any[]): Product[] {
  return dbProducts.map(mapDbProductToProduct);
}

/**
 * Get all unique categories from products
 */
export async function getCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('products')
    .select('category')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  // Get unique categories
  const categories = [...new Set(data.map(p => p.category))];
  return categories.sort();
}
