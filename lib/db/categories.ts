import { supabase } from '@/lib/supabase/client';
import { supabaseAdmin } from '../supabase/server';

export interface Category {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Get all categories ordered by name
 */
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }

  return data || [];
}

/**
 * Get a single category by ID
 */
export async function getCategoryById(id: number): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching category:', error);
    return null;
  }

  return data;
}

/**
 * Count how many products belong to a category
 */
export async function getCategoryProductCount(categoryId: number): Promise<number> {
  const { count, error } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', categoryId);

  if (error) {
    console.error('Error counting products in category:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Create a new category (Admin only)
 */
export async function createCategory(name: string): Promise<Category> {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .insert({ name })
    .select()
    .single();

  if (error) {
    console.error('Error creating category:', error);
    throw new Error(`Failed to create category: ${error.message}`);
  }

  return data;
}

/**
 * Update a category name (Admin only)
 */
export async function updateCategory(id: number, name: string): Promise<Category> {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .update({ name })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating category:', error);
    throw new Error(`Failed to update category: ${error.message}`);
  }

  return data;
}

/**
 * Delete a category (Admin only)
 * Will fail if products still reference this category
 */
export async function deleteCategory(id: number): Promise<void> {
  const { error } = await supabaseAdmin
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting category:', error);
    throw new Error(`Failed to delete category: ${error.message}`);
  }
}
