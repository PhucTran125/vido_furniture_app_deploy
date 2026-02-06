'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { Maximize2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { generateSlug } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  id?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, id }) => {
  const { language } = useLanguage();

  const name = typeof product.name === 'object' ? product.name[language] : product.name;
  const slug = generateSlug(product);

  return (
    <div
      id={id}
      className="group flex flex-col h-full bg-white border border-gray-100 hover:border-accent/40 hover:shadow-xl transition-all duration-300 rounded-sm overflow-hidden"
    >
      {/* High-End Image Container */}
      <Link
        href={`/products/${slug}`}
        className="relative aspect-square bg-[#F9F9F9] overflow-hidden cursor-pointer block"
      >
        <img
          src={`/${product.image}`}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
        />

        {/* Modern Hover Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
          <div className="bg-white/90 text-primary rounded-full p-4 shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300 hover:bg-accent hover:text-white">
            <Maximize2 size={24} strokeWidth={1.5} />
          </div>
        </div>
      </Link>

      {/* Simplified Content Area - Name and Category Only */}
      <div className="p-5 flex flex-col flex-grow text-center">
        <Link href={`/products/${slug}`}>
          <h3 className="font-heading font-bold text-lg text-primary leading-tight cursor-pointer hover:text-accent transition-colors mb-2">
            {name}
          </h3>
        </Link>

        <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em]">{product.category}</p>
      </div>
    </div>
  );
};