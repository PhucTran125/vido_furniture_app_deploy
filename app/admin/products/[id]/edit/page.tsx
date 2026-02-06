'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProductForm } from '@/components/admin/ProductForm';
import { Product } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function EditProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    try {
      const res = await fetch('/api/admin/products');
      const products: Product[] = await res.json();
      const prod = products.find(p => p.id === params.id);
      setProduct(prod || null);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Product</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <ProductForm product={product} mode="edit" />
      </div>
    </div>
  );
}
