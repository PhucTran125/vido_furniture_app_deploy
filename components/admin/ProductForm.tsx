'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface ProductFormProps {
  product?: Product;
  mode: 'create' | 'edit';
}

export function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    itemNo: product?.itemNo || '',
    nameEn: product?.name.en || '',
    nameVi: product?.name.vi || '',
    category: product?.category || 'Bench',
    image: product?.image || '',
    descriptionEn: product?.description?.en.join('\n') || '',
    descriptionVi: product?.description?.vi.join('\n') || '',
  });

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
        image: formData.image || undefined,
        description: {
          en: formData.descriptionEn.split('\n').filter(line => line.trim()),
          vi: formData.descriptionVi.split('\n').filter(line => line.trim()),
        },
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
            placeholder="e.g., VWF22A1091LX-9C"
          />
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
            placeholder="e.g., Minimalist Gold-Leg Bench"
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
            placeholder="e.g., Ghế Băng Chân Vàng Tối Giản"
          />
        </div>

        {/* Image Path */}
        <div className="md:col-span-2">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
            Image Path
          </label>
          <input
            type="text"
            id="image"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="e.g., Picture/1 (1).jpg"
          />
          <p className="mt-1 text-sm text-gray-500">
            Path relative to public folder
          </p>
        </div>

        {/* Description (English) */}
        <div className="md:col-span-2">
          <label htmlFor="descriptionEn" className="block text-sm font-medium text-gray-700 mb-2">
            Description (English)
          </label>
          <textarea
            id="descriptionEn"
            rows={4}
            value={formData.descriptionEn}
            onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="One bullet point per line"
          />
          <p className="mt-1 text-sm text-gray-500">
            Enter each bullet point on a new line
          </p>
        </div>

        {/* Description (Vietnamese) */}
        <div className="md:col-span-2">
          <label htmlFor="descriptionVi" className="block text-sm font-medium text-gray-700 mb-2">
            Description (Vietnamese)
          </label>
          <textarea
            id="descriptionVi"
            rows={4}
            value={formData.descriptionVi}
            onChange={(e) => setFormData({ ...formData, descriptionVi: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="Mỗi dòng một điểm"
          />
          <p className="mt-1 text-sm text-gray-500">
            Mỗi bullet point trên một dòng mới
          </p>
        </div>
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
          className="flex items-center gap-2 bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
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
