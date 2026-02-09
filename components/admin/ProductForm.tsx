'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import { ArrowLeft, Save, Loader2, Plus, X, Upload, Star, Eye, EyeOff, Trash2 } from 'lucide-react';
import { uploadProductImage } from '@/lib/supabase/upload-images';

interface ProductFormProps {
  product?: Product;
  mode: 'create' | 'edit';
}

export function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    itemNo: product?.itemNo || '',
    nameEn: product?.name.en || '',
    nameVi: product?.name.vi || '',
    category: product?.category || 'Ottoman',
    images: product?.images || [],
    isActive: product?.isActive !== undefined ? product.isActive : true,
  });

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !formData.itemNo) {
      alert('Please select a file and enter Item Number first');
      return;
    }

    setUploading(true);
    try {
      const imageType = formData.images.length === 0 ? 'main' : `view-${formData.images.length + 1}`;
      const url = await uploadProductImage(selectedFile, formData.itemNo, imageType);

      const newImage = {
        url,
        isMain: formData.images.length === 0, // First image is main
        displayOrder: formData.images.length + 1,
      };

      setFormData({
        ...formData,
        images: [...formData.images, newImage],
      });

      setSelectedFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    // Reorder and ensure first image is main
    const reorderedImages = newImages.map((img, i) => ({
      ...img,
      displayOrder: i + 1,
      isMain: i === 0,
    }));
    setFormData({ ...formData, images: reorderedImages });
  };

  const setMainImage = (index: number) => {
    const newImages = formData.images.map((img, i) => ({
      ...img,
      isMain: i === index,
    }));
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        itemNo: formData.itemNo,
        name: {
          en: formData.nameEn,
          vi: formData.nameVi,
        },
        category: formData.category,
        images: formData.images,
        isActive: formData.isActive,
      };

      const url = mode === 'create'
        ? '/api/admin/products/create'
        : `/api/admin/products/${product?.id}`;

      const res = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push('/admin/products');
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Active Status Toggle */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {formData.isActive ? (
              <Eye className="text-blue-600" size={24} />
            ) : (
              <EyeOff className="text-gray-400" size={24} />
            )}
            <div>
              <h3 className="font-semibold text-gray-900">Product Visibility</h3>
              <p className="text-sm text-gray-600">
                {formData.isActive
                  ? 'This product is visible on the website'
                  : 'This product is hidden from the website'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${formData.isActive ? 'bg-blue-600' : 'bg-gray-300'
              }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${formData.isActive ? 'translate-x-7' : 'translate-x-1'
                }`}
            />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Item Number */}
        <div>
          <label htmlFor="itemNo" className="block text-sm font-medium text-gray-700 mb-2">
            Item Number *
          </label>
          <input
            type="text"
            id="itemNo"
            required
            value={formData.itemNo}
            onChange={(e) => setFormData({ ...formData, itemNo: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="e.g., VWF23A1424SC-1-PU-43"
          />
          <p className="mt-1 text-xs text-gray-500">Required for image uploads</p>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            id="category"
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
          >
            <option value="Bench">Bench</option>
            <option value="Ottoman">Ottoman</option>
            <option value="Stool">Stool</option>
            <option value="Table">Table</option>
            <option value="Storage">Storage</option>
            <option value="Armchair">Armchair</option>
          </select>
        </div>

        {/* Name (English) */}
        <div>
          <label htmlFor="nameEn" className="block text-sm font-medium text-gray-700 mb-2">
            Name (English) *
          </label>
          <input
            type="text"
            id="nameEn"
            required
            value={formData.nameEn}
            onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="e.g., S/2 Storage Ottoman"
          />
        </div>

        {/* Name (Vietnamese) */}
        <div>
          <label htmlFor="nameVi" className="block text-sm font-medium text-gray-700 mb-2">
            Name (Vietnamese) *
          </label>
          <input
            type="text"
            id="nameVi"
            required
            value={formData.nameVi}
            onChange={(e) => setFormData({ ...formData, nameVi: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="e.g., Ghế Đôn Lưu Trữ Bộ 2"
          />
        </div>
      </div>

      {/* Images Section */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Product Images</h3>

        {/* Image Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* Existing Images */}
          {formData.images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-300 bg-gray-100">
                <img
                  src={image.url}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Main Image Star */}
              {image.isMain && (
                <div className="absolute top-2 left-2 bg-yellow-400 rounded-full p-1.5 shadow-lg">
                  <Star size={16} className="fill-yellow-400 text-white" />
                </div>
              )}

              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                {!image.isMain && (
                  <button
                    type="button"
                    onClick={() => setMainImage(index)}
                    className="bg-white text-gray-700 p-2 rounded-full hover:bg-yellow-100 transition-colors"
                    title="Set as main image"
                  >
                    <Star size={18} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="bg-white text-red-600 p-2 rounded-full hover:bg-red-100 transition-colors"
                  title="Remove image"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Image Number */}
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}

          {/* Add Image Placeholder */}
          <div className="aspect-square">
            <label className="w-full h-full border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
                className="hidden"
                disabled={!formData.itemNo}
              />
              <Plus size={32} className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-500 text-center px-2">
                {selectedFile ? selectedFile.name : 'Add Image'}
              </span>
            </label>
          </div>
        </div>

        {/* Upload Button */}
        {selectedFile && (
          <div className="mt-4 flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Selected: {selectedFile.name}</p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="flex items-center gap-2 bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Upload
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              <X size={20} />
            </button>
          </div>
        )}

        <p className="mt-4 text-sm text-gray-500">
          💡 <strong>Tip:</strong> Click the placeholder to select an image, then click Upload.
          The first image will automatically be set as the main image. Click the star icon to change the main image.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={20} />
              {mode === 'create' ? 'Create Product' : 'Save Changes'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
