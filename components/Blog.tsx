'use client';

import React, { useEffect } from 'react';
import { Section } from './ui/Section';
import { useLanguage } from '@/contexts/LanguageContext';

export const Blog: React.FC = () => {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-primary py-12 px-4 text-center">
        <span className="text-accent font-bold text-[10px] uppercase tracking-[0.3em] mb-2 block opacity-80">
          {t.blog.badge}
        </span>
        <h1 className="font-heading font-bold text-3xl md:text-4xl text-white">
          {t.blog.title}
        </h1>
        <div className="w-12 h-1 bg-accent mx-auto mt-4 rounded-full"></div>
      </div>

      <Section className="!py-16">
        {/* Placeholder container */}
        <div className="min-h-[400px] flex items-center justify-center">
          <p className="text-gray-300 font-light italic">Coming Soon...</p>
        </div>
      </Section>
    </div>
  );
};