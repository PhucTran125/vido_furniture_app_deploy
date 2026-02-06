'use client';

import React from 'react';
import Link from 'next/link';
import { Section } from './ui/Section';
import { Product } from '@/lib/types';
import { Maximize2, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { generateSlug } from '@/lib/utils';

interface FeaturedCollectionProps {
  products: Product[];
}

export const FeaturedCollection: React.FC<FeaturedCollectionProps> = ({ products }) => {
  const { t, language } = useLanguage();
  // Using the first 4 products as featured items
  const featuredProducts = products.slice(0, 4);

  const scrollToProducts = () => {
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Section id="featured" className="bg-[#FFFFFF] !py-12 md:!py-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12 md:mb-16">
        <div className="max-w-2xl">
          <div className="inline-block mb-4">
            <span className="text-accent font-black text-[11px] uppercase tracking-[0.4em] border-l-4 border-accent pl-4">
              {t.featured.badge}
            </span>
          </div>
          <h2 className="font-heading font-black text-4xl md:text-5xl text-primary mb-6 leading-tight">
            {t.featured.title}
          </h2>
          <p className="text-gray-500 leading-relaxed text-lg font-light">
            {t.featured.description}
          </p>
        </div>
        <button
          onClick={scrollToProducts}
          className="flex items-center gap-3 text-primary text-xs font-black uppercase tracking-[0.2em] hover:text-accent transition-all group"
        >
          {t.featured.viewAll}
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {featuredProducts.map((product) => {
          const slug = generateSlug(product);
          return (
            <Link
              key={product.id}
              href={`/products/${slug}`}
              className="group cursor-pointer flex flex-col h-full"
            >
              <div className="relative overflow-hidden mb-6 bg-[#F8F8F8] aspect-square border border-gray-100 rounded-sm">
                <img
                  src={`/${product.image}`}
                  alt={product.name[language]}
                  loading="lazy"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <div
                    className="bg-white text-primary px-6 py-3 rounded-sm uppercase text-[10px] font-bold tracking-[0.2em] hover:bg-accent hover:text-white transition-all shadow-2xl transform translate-y-4 group-hover:translate-y-0 duration-500 flex items-center gap-2"
                  >
                    <Maximize2 size={16} />
                    {t.featured.quickView}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[9px] text-gray-400 font-mono tracking-widest uppercase">{product.itemNo}</p>
                <h3 className="font-heading font-bold text-lg text-primary group-hover:text-accent transition-colors">
                  {product.name[language]}
                </h3>
                <p className="text-[10px] text-accent font-bold uppercase tracking-widest pt-1">{product.category}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 md:hidden flex justify-center">
        <button
          onClick={scrollToProducts}
          className="flex items-center gap-3 bg-primary text-white px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl"
        >
          {t.featured.viewAll} <ArrowRight size={16} />
        </button>
      </div>
    </Section>
  );
};