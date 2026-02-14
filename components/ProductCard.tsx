'use client';

import React from 'react';
import Link from 'next/link';
import { Product, getMainImageUrl } from '@/lib/types';
import { Maximize2, Heart, Send } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { generateSlug } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  id?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, id }) => {
  const { t, language } = useLanguage();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const name = typeof product.name === 'object' ? product.name[language] : product.name;
  const slug = generateSlug(product);
  const wishlisted = isInWishlist(product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleInquiryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      id={id}
      className="group flex flex-col h-full bg-white border border-gray-100 hover:border-accent/40 hover:shadow-xl transition-all duration-300 rounded-sm overflow-hidden"
    >
      {/* Image Container */}
      <Link
        href={`/products/${slug}`}
        className="relative aspect-square bg-[#F9F9F9] overflow-hidden cursor-pointer block"
      >
        <img
          src={getMainImageUrl(product)}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
          <div className="bg-white/90 text-primary rounded-full p-4 shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300 hover:bg-accent hover:text-white">
            <Maximize2 size={24} strokeWidth={1.5} />
          </div>
        </div>
      </Link>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-grow text-center">
        <Link href={`/products/${slug}`}>
          <h3 className="font-heading font-bold text-lg text-primary leading-tight cursor-pointer hover:text-accent transition-colors mb-2">
            {name}
          </h3>
        </Link>

        <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em]">{product.category}</p>

        {/* Hover Action Buttons */}
        <div className="flex items-center justify-center gap-3 mt-3 max-h-0 opacity-0 group-hover:max-h-16 group-hover:opacity-100 transition-all duration-300 overflow-hidden">
          <button
            onClick={handleInquiryClick}
            className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-accent/90 transition-colors"
          >
            <Send size={13} />
            {t.card.inquire}
          </button>
          <button
            onClick={handleWishlistClick}
            className={`p-2 rounded-sm border transition-colors ${
              wishlisted
                ? 'bg-red-50 border-red-200 text-red-500'
                : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200'
            }`}
            title={wishlisted ? t.card.removedFromWishlist : t.card.addedToWishlist}
          >
            <Heart size={16} className={wishlisted ? 'fill-current' : ''} />
          </button>
        </div>
      </div>
    </div>
  );
};
