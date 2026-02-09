import { supabase } from './client';

/**
 * Upload a single image to Supabase Storage
 * @param file - File object from input
 * @param itemNo - Product item number
 * @param imageType - Type of image (main, view-1, etc.)
 * @returns Public URL of uploaded image
 */
export async function uploadProductImage(
  file: File,
  itemNo: string,
  imageType: string
): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${imageType}.${fileExt}`;
  const filePath = `${itemNo}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true, // Replace if exists
    });

  if (error) {
    console.error('Upload error:', error);
    throw error;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  return publicUrl;
}

/**
 * Upload multiple images for a product
 * @param files - Array of files with metadata
 * @param itemNo - Product item number
 * @returns Array of ProductImage objects
 */
export async function uploadProductImages(
  files: { file: File; isMain: boolean; displayOrder: number }[],
  itemNo: string
) {
  const uploadedImages = [];

  for (const { file, isMain, displayOrder } of files) {
    const imageType = isMain ? 'main' : `view-${displayOrder}`;

    try {
      const url = await uploadProductImage(file, itemNo, imageType);

      uploadedImages.push({
        url,
        isMain,
        displayOrder,
      });
    } catch (error) {
      console.error(`Failed to upload ${imageType}:`, error);
      throw error;
    }
  }

  return uploadedImages;
}

/**
 * Delete an image from Supabase Storage
 * @param itemNo - Product item number
 * @param imageType - Type of image to delete
 */
export async function deleteProductImage(
  itemNo: string,
  imageType: string
): Promise<void> {
  const { error } = await supabase.storage
    .from('product-images')
    .remove([`${itemNo}/${imageType}`]);

  if (error) {
    console.error('Delete error:', error);
    throw error;
  }
}

/**
 * Delete all images for a product
 * @param itemNo - Product item number
 */
export async function deleteAllProductImages(itemNo: string): Promise<void> {
  // List all files in the product folder
  const { data: files, error: listError } = await supabase.storage
    .from('product-images')
    .list(itemNo);

  if (listError) {
    console.error('List error:', listError);
    throw listError;
  }

  if (!files || files.length === 0) {
    return;
  }

  // Delete all files
  const filePaths = files.map(file => `${itemNo}/${file.name}`);
  const { error: deleteError } = await supabase.storage
    .from('product-images')
    .remove(filePaths);

  if (deleteError) {
    console.error('Delete error:', deleteError);
    throw deleteError;
  }
}

/**
 * Get public URL for an image
 * @param itemNo - Product item number
 * @param imageType - Type of image
 * @returns Public URL
 */
export function getProductImageUrl(itemNo: string, imageType: string): string {
  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(`${itemNo}/${imageType}.jpg`);

  return data.publicUrl;
}

/**
 * Get transformed image URL (resize, quality, etc.)
 * @param url - Original image URL
 * @param options - Transformation options
 * @returns Transformed URL
 */
export function getTransformedImageUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
  }
): string {
  const params = new URLSearchParams();

  if (options.width) params.append('width', options.width.toString());
  if (options.height) params.append('height', options.height.toString());
  if (options.quality) params.append('quality', options.quality.toString());
  if (options.format) params.append('format', options.format);

  return `${url}?${params.toString()}`;
}
