'use client';

import React from 'react';
import Link from 'next/link';
import { Award, Headset, Factory, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const Highlights: React.FC = () => {
  const { t } = useLanguage();

  const highlights = [
    {
      icon: <Award size={36} strokeWidth={1.5} className="text-accent mb-3" />,
      badge: t.highlights.badgeQuality,
      title: t.highlights.quality,
      description: t.highlights.qualityDesc,
      href: '/highlights/export-quality',
    },
    {
      icon: <Factory size={36} strokeWidth={1.5} className="text-accent mb-3" />,
      badge: t.highlights.badgeFactory,
      title: t.highlights.factory,
      description: t.highlights.factoryDesc,
      href: '/highlights/factory',
    },
    {
      icon: <Headset size={36} strokeWidth={1.5} className="text-accent mb-3" />,
      badge: t.highlights.badgeService,
      title: t.highlights.service,
      description: t.highlights.serviceDesc,
      href: '/highlights/customer-service',
    },
  ];

  return (
    <div className="bg-primary text-white py-5 md:py-6 border-b-4 border-accent shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
          {highlights.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="group flex flex-col items-center pt-5 md:pt-0 px-6 cursor-pointer"
            >
              {/* Icon */}
              <div className="transform transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </div>

              {/* Badge tag */}
              <span className="inline-block text-[10px] font-bold uppercase tracking-[0.25em] text-accent/70 border border-accent/30 rounded-full px-3 py-0.5 mb-3">
                {item.badge}
              </span>

              {/* Title */}
              <h3 className="font-heading font-semibold text-xl mb-2 group-hover:text-accent transition-colors duration-200">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-gray-300 font-sans text-sm transition-opacity duration-300 group-hover:opacity-100 opacity-80 mb-3">
                {item.description}
              </p>

              {/* Explore button */}
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-accent border border-accent/40 rounded-full px-4 py-1.5 group-hover:bg-accent group-hover:text-primary transition-all duration-250 mt-auto">
                {t.highlights.highlightsExplore}
                <ArrowRight size={12} className="transform group-hover:translate-x-0.5 transition-transform duration-200" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};