'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import { ArrowLeft, Save, Loader2, Plus, X, Upload, Star, Eye, EyeOff, Trash2 } from 'lucide-react';
import heic2any from 'heic2any';
import { uploadProductImage } from '@/lib/supabase/upload-images';

interface ProductFormProps {
  product?: Product;
  mode: 'create' | 'edit';
}

// Helper: ensure value is string[]
function toStringArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === 'string' && val) return [val];
  return [];
}

interface CategoryOption {
  id: number;
  name: string;
}

export function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  useEffect(() => {
    fetch('/api/admin/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => {});
  }, []);

  const [formData, setFormData] = useState({
    itemNo: product?.itemNo || '',
    nameEn: product?.name.en || '',
    nameVi: product?.name.vi || '',
    category: product?.category || '',
    categoryId: product?.categoryId || '',
    images: product?.images || [],
    isActive: product?.isActive !== undefined ? product.isActive : true,

    // Localized string[] fields
    descriptionEn: toStringArray(product?.description?.en),
    descriptionVi: toStringArray(product?.description?.vi),
    materialEn: toStringArray(product?.material?.en),
    materialVi: toStringArray(product?.material?.vi),
    dimensionsEn: toStringArray(product?.dimensions?.en),
    dimensionsVi: toStringArray(product?.dimensions?.vi),

    // Localized string fields
    packagingTypeEn: product?.packagingType?.en || '',
    packagingTypeVi: product?.packagingType?.vi || '',
    remarkEn: product?.remark?.en || '',
    remarkVi: product?.remark?.vi || '',

    // Simple fields
    packingSize: product?.packingSize || '',
    moq: product?.moq ?? '',
    innerPack: product?.innerPack || '',
    containerCapacity: product?.containerCapacity ?? '',
    cartonCBM: product?.cartonCBM ?? '',

    // Prices
    priceFobFuzhou: product?.prices?.fobFuzhou ?? '',
    priceMailOrder: product?.prices?.mailOrder ?? '',
    priceUkFrUs: product?.prices?.ukFrUs ?? '',
  });

  // --- Array field helpers ---
  const updateArrayItem = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev as any)[field].map((item: string, i: number) => i === index ? value : item),
    }));
  };

  const addArrayItem = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev as any)[field], ''],
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev as any)[field].filter((_: string, i: number) => i !== index),
    }));
  };

  // --- Image helpers ---
  const convertHeicToJpeg = async (file: File): Promise<File> => {
    const blob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.9 }) as Blob;
    const name = file.name.replace(/\.heic$/i, '.jpg');
    return new File([blob], name, { type: 'image/jpeg' });
  };

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
      let fileToUpload = selectedFile;
      if (/\.heic$/i.test(selectedFile.name)) {
        fileToUpload = await convertHeicToJpeg(selectedFile);
      }

      const imageType = formData.images.length === 0 ? 'main' : `view-${formData.images.length + 1}`;
      const url = await uploadProductImage(fileToUpload, formData.itemNo, imageType);

      const newImage = {
        url,
        isMain: formData.images.length === 0,
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

  // --- Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const selectedCategory = categories.find(c => c.id === Number(formData.categoryId));
      const payload: any = {
        itemNo: formData.itemNo,
        name: { en: formData.nameEn, vi: formData.nameVi },
        category: selectedCategory?.name || formData.category,
        categoryId: formData.categoryId ? Number(formData.categoryId) : null,
        images: formData.images,
        isActive: formData.isActive,
      };

      // Localized string[] fields - only include if has content
      if (formData.descriptionEn.some(s => s) || formData.descriptionVi.some(s => s)) {
        payload.description = {
          en: formData.descriptionEn.filter(s => s),
          vi: formData.descriptionVi.filter(s => s),
        };
      }
      if (formData.materialEn.some(s => s) || formData.materialVi.some(s => s)) {
        payload.material = {
          en: formData.materialEn.filter(s => s),
          vi: formData.materialVi.filter(s => s),
        };
      }
      if (formData.dimensionsEn.some(s => s) || formData.dimensionsVi.some(s => s)) {
        payload.dimensions = {
          en: formData.dimensionsEn.filter(s => s),
          vi: formData.dimensionsVi.filter(s => s),
        };
      }

      // Localized string fields
      if (formData.packagingTypeEn || formData.packagingTypeVi) {
        payload.packagingType = { en: formData.packagingTypeEn, vi: formData.packagingTypeVi };
      }
      if (formData.remarkEn || formData.remarkVi) {
        payload.remark = { en: formData.remarkEn, vi: formData.remarkVi };
      }

      // Simple fields
      if (formData.packingSize) payload.packingSize = formData.packingSize;
      if (formData.moq !== '') payload.moq = Number(formData.moq);
      if (formData.innerPack) payload.innerPack = formData.innerPack;
      if (formData.containerCapacity !== '') payload.containerCapacity = Number(formData.containerCapacity);
      if (formData.cartonCBM !== '') payload.cartonCBM = Number(formData.cartonCBM);

      // Prices
      const prices: any = {};
      if (formData.priceFobFuzhou !== '') prices.fobFuzhou = Number(formData.priceFobFuzhou);
      if (formData.priceMailOrder !== '') prices.mailOrder = Number(formData.priceMailOrder);
      if (formData.priceUkFrUs !== '') prices.ukFrUs = Number(formData.priceUkFrUs);
      if (Object.keys(prices).length > 0) payload.prices = prices;

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

  // --- Reusable array field renderer ---
  const renderArrayField = (label: string, field: string, placeholder: string) => {
    const items: string[] = (formData as any)[field];
    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">{label}</label>
          <button
            type="button"
            onClick={() => addArrayItem(field)}
            className="flex items-center gap-1 text-xs font-medium text-accent hover:text-accent/80 transition-colors"
          >
            <Plus size={14} />
            Add
          </button>
        </div>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-xs text-gray-400 w-5 text-right shrink-0">{index + 1}.</span>
              <input
                type="text"
                value={item}
                onChange={(e) => updateArrayItem(field, index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder={placeholder}
              />
              <button
                type="button"
                onClick={() => removeArrayItem(field, index)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors shrink-0"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-xs text-gray-400 italic">No items yet. Click &quot;Add&quot; to start.</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${formData.isActive ? 'bg-blue-600' : 'bg-gray-300'}`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${formData.isActive ? 'translate-x-7' : 'translate-x-1'}`}
            />
          </button>
        </div>
      </div>

      {/* ===== Basic Info ===== */}
      <fieldset className="border border-gray-200 rounded-lg p-6">
        <legend className="text-lg font-semibold text-gray-900 px-2">Basic Information</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <label htmlFor="itemNo" className="block text-sm font-medium text-gray-700 mb-2">Item Number *</label>
            <input type="text" id="itemNo" required value={formData.itemNo}
              onChange={(e) => setFormData({ ...formData, itemNo: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="e.g., VWF23A1424SC-1-PU-43" />
          </div>
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select id="categoryId" required value={formData.categoryId}
              onChange={(e) => {
                const catId = e.target.value;
                const cat = categories.find(c => c.id === Number(catId));
                setFormData({ ...formData, categoryId: catId, category: cat?.name || '' });
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent">
              <option value="">Select a category...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="nameEn" className="block text-sm font-medium text-gray-700 mb-2">Name (English) *</label>
            <input type="text" id="nameEn" required value={formData.nameEn}
              onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="e.g., S/2 Storage Ottoman" />
          </div>
          <div>
            <label htmlFor="nameVi" className="block text-sm font-medium text-gray-700 mb-2">Name (Vietnamese) *</label>
            <input type="text" id="nameVi" required value={formData.nameVi}
              onChange={(e) => setFormData({ ...formData, nameVi: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="e.g., Ghe Don Luu Tru Bo 2" />
          </div>
        </div>
      </fieldset>

      {/* ===== Description ===== */}
      <fieldset className="border border-gray-200 rounded-lg p-6">
        <legend className="text-lg font-semibold text-gray-900 px-2">Description</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {renderArrayField('English', 'descriptionEn', 'Enter description line...')}
          {renderArrayField('Vietnamese', 'descriptionVi', 'Nhap dong mo ta...')}
        </div>
      </fieldset>

      {/* ===== Materials ===== */}
      <fieldset className="border border-gray-200 rounded-lg p-6">
        <legend className="text-lg font-semibold text-gray-900 px-2">Materials</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {renderArrayField('English', 'materialEn', 'e.g., MDF board, Velvet fabric...')}
          {renderArrayField('Vietnamese', 'materialVi', 'e.g., Go MDF, Vai nhung...')}
        </div>
      </fieldset>

      {/* ===== Dimensions ===== */}
      <fieldset className="border border-gray-200 rounded-lg p-6">
        <legend className="text-lg font-semibold text-gray-900 px-2">Dimensions</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {renderArrayField('English', 'dimensionsEn', 'e.g., Large: 60x40x45 cm')}
          {renderArrayField('Vietnamese', 'dimensionsVi', 'e.g., Lon: 60x40x45 cm')}
        </div>
        <div className="mt-4">
          <label htmlFor="packingSize" className="block text-sm font-medium text-gray-700 mb-2">Packing Size</label>
          <input type="text" id="packingSize" value={formData.packingSize}
            onChange={(e) => setFormData({ ...formData, packingSize: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="e.g., 62x42x47 cm" />
        </div>
      </fieldset>

      {/* ===== Packaging & Remark ===== */}
      <fieldset className="border border-gray-200 rounded-lg p-6">
        <legend className="text-lg font-semibold text-gray-900 px-2">Packaging & Remark</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <label htmlFor="packagingTypeEn" className="block text-sm font-medium text-gray-700 mb-2">Packaging Type (English)</label>
            <input type="text" id="packagingTypeEn" value={formData.packagingTypeEn}
              onChange={(e) => setFormData({ ...formData, packagingTypeEn: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="e.g., Carton box" />
          </div>
          <div>
            <label htmlFor="packagingTypeVi" className="block text-sm font-medium text-gray-700 mb-2">Packaging Type (Vietnamese)</label>
            <input type="text" id="packagingTypeVi" value={formData.packagingTypeVi}
              onChange={(e) => setFormData({ ...formData, packagingTypeVi: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="e.g., Thung carton" />
          </div>
          <div>
            <label htmlFor="remarkEn" className="block text-sm font-medium text-gray-700 mb-2">Remark (English)</label>
            <textarea id="remarkEn" value={formData.remarkEn} rows={3}
              onChange={(e) => setFormData({ ...formData, remarkEn: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="Additional notes..." />
          </div>
          <div>
            <label htmlFor="remarkVi" className="block text-sm font-medium text-gray-700 mb-2">Remark (Vietnamese)</label>
            <textarea id="remarkVi" value={formData.remarkVi} rows={3}
              onChange={(e) => setFormData({ ...formData, remarkVi: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="Ghi chu them..." />
          </div>
        </div>
      </fieldset>

      {/* ===== Pricing ===== */}
      <fieldset className="border border-gray-200 rounded-lg p-6">
        <legend className="text-lg font-semibold text-gray-900 px-2">Pricing (USD)</legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div>
            <label htmlFor="priceFob" className="block text-sm font-medium text-gray-700 mb-2">FOB Fuzhou</label>
            <input type="number" id="priceFob" step="0.01" value={formData.priceFobFuzhou}
              onChange={(e) => setFormData({ ...formData, priceFobFuzhou: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="0.00" />
          </div>
          <div>
            <label htmlFor="priceMail" className="block text-sm font-medium text-gray-700 mb-2">Mail Order</label>
            <input type="number" id="priceMail" step="0.01" value={formData.priceMailOrder}
              onChange={(e) => setFormData({ ...formData, priceMailOrder: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="0.00" />
          </div>
          <div>
            <label htmlFor="priceUk" className="block text-sm font-medium text-gray-700 mb-2">UK / FR / US</label>
            <input type="number" id="priceUk" step="0.01" value={formData.priceUkFrUs}
              onChange={(e) => setFormData({ ...formData, priceUkFrUs: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="0.00" />
          </div>
        </div>
      </fieldset>

      {/* ===== Logistics ===== */}
      <fieldset className="border border-gray-200 rounded-lg p-6">
        <legend className="text-lg font-semibold text-gray-900 px-2">Logistics</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          <div>
            <label htmlFor="moq" className="block text-sm font-medium text-gray-700 mb-2">MOQ</label>
            <input type="number" id="moq" value={formData.moq}
              onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="e.g., 100" />
          </div>
          <div>
            <label htmlFor="innerPack" className="block text-sm font-medium text-gray-700 mb-2">Inner Pack</label>
            <input type="text" id="innerPack" value={formData.innerPack}
              onChange={(e) => setFormData({ ...formData, innerPack: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="e.g., 1pc/ctn" />
          </div>
          <div>
            <label htmlFor="containerCapacity" className="block text-sm font-medium text-gray-700 mb-2">Container Capacity</label>
            <input type="number" id="containerCapacity" value={formData.containerCapacity}
              onChange={(e) => setFormData({ ...formData, containerCapacity: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="e.g., 500" />
          </div>
          <div>
            <label htmlFor="cartonCBM" className="block text-sm font-medium text-gray-700 mb-2">Carton CBM</label>
            <input type="number" id="cartonCBM" step="0.001" value={formData.cartonCBM}
              onChange={(e) => setFormData({ ...formData, cartonCBM: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="e.g., 0.125" />
          </div>
        </div>
      </fieldset>

      {/* ===== Images ===== */}
      <fieldset className="border border-gray-200 rounded-lg p-6">
        <legend className="text-lg font-semibold text-gray-900 px-2">Product Images</legend>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {formData.images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-300 bg-gray-100">
                <img src={image.url} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
              </div>
              {image.isMain && (
                <div className="absolute top-2 left-2 bg-yellow-400 rounded-full p-1.5 shadow-lg">
                  <Star size={16} className="fill-yellow-400 text-white" />
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                {!image.isMain && (
                  <button type="button" onClick={() => setMainImage(index)}
                    className="bg-white text-gray-700 p-2 rounded-full hover:bg-yellow-100 transition-colors" title="Set as main image">
                    <Star size={18} />
                  </button>
                )}
                <button type="button" onClick={() => removeImage(index)}
                  className="bg-white text-red-600 p-2 rounded-full hover:bg-red-100 transition-colors" title="Remove image">
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}

          <div className="aspect-square">
            <label className="w-full h-full border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-colors">
              <input type="file" accept="image/*,.heic,.heif"
                onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileSelect(file); }}
                className="hidden" disabled={!formData.itemNo} />
              <Plus size={32} className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-500 text-center px-2">
                {selectedFile ? selectedFile.name : 'Add Image'}
              </span>
            </label>
          </div>
        </div>

        {selectedFile && (
          <div className="mt-4 flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Selected: {selectedFile.name}</p>
              <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
            </div>
            <button type="button" onClick={handleUpload} disabled={uploading}
              className="flex items-center gap-2 bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {uploading ? (<><Loader2 size={18} className="animate-spin" />Uploading...</>) : (<><Upload size={18} />Upload</>)}
            </button>
            <button type="button" onClick={() => setSelectedFile(null)} className="text-gray-500 hover:text-gray-700 p-2">
              <X size={20} />
            </button>
          </div>
        )}
      </fieldset>

      {/* ===== Actions ===== */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <button type="button" onClick={() => router.back()}
          className="flex items-center gap-2 px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
          Cancel
        </button>
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {saving ? (<><Loader2 size={20} className="animate-spin" />Saving...</>) : (<><Save size={20} />{mode === 'create' ? 'Create Product' : 'Save Changes'}</>)}
        </button>
      </div>
    </form>
  );
}
