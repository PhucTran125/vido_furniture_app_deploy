'use client';

import React, { useMemo, useState } from 'react';
import { Section } from './ui/Section';
import { ProductCard } from './ProductCard';
import { Product } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProductGridProps {
  products: Product[];
}
import { Search, Filter, X } from 'lucide-react';

export const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get unique categories from products
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['all', ...Array.from(cats)];
  }, [products]);

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = searchQuery === '' ||
        product.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.name.vi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.itemNo.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <Section id="products" className="bg-gray-50 border-t border-gray-200">
      <div className="text-center mb-8">
        <span className="text-accent font-semibold text-sm uppercase tracking-widest mb-2 block">{t.products.badge}</span>
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-6">{t.products.title}</h2>
        <p className="text-gray-500 max-w-2xl mx-auto font-light">
          {t.products.description}
        </p>
      </div>

      {/* Controls Container */}
      <div className="max-w-7xl mx-auto mb-10 space-y-6">

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-sm leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-accent focus:border-accent sm:text-sm transition-shadow shadow-sm"
            placeholder={t.products.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
                ${selectedCategory === category
                  ? 'bg-primary text-white border-primary shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-accent hover:text-accent'}
              `}
            >
              {category === 'All' ? t.products.filterAll : category}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="text-center text-sm text-gray-500 font-mono">
          {t.products.showing} <span className="font-bold text-primary">{filteredProducts.length}</span> {t.products.results}
        </div>
      </div>

      {/* Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={`product-card-grid-${product.id}`}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
          <Filter className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">{t.products.noResults}</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="mt-4 text-accent hover:underline font-medium"
          >
            {t.products.filterAll}
          </button>
        </div>
      )}
    </Section>
  );
};