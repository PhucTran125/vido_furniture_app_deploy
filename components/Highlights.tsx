'use client';

import React from 'react';
import Link from 'next/link';
import { Award, Headset, Factory } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const Highlights: React.FC = () => {
  const { t } = useLanguage();

  const highlights = [
    {
      icon: <Award size={48} className="text-accent mb-4" />,
      title: t.highlights.quality,
      description: t.highlights.qualityDesc,
      href: '/highlights/export-quality'
    },
    {
      icon: <Headset size={48} className="text-accent mb-4" />,
      title: t.highlights.service,
      description: t.highlights.serviceDesc,
      href: '/highlights/customer-service'
    },
    {
      icon: <Factory size={48} className="text-accent mb-4" />,
      title: t.highlights.factory,
      description: t.highlights.factoryDesc,
      href: '/highlights/factory'
    }
  ];

  return (
    <div className="bg-primary text-white py-8 md:py-10 border-b-4 border-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
          {highlights.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="group flex flex-col items-center pt-8 md:pt-0 px-4 cursor-pointer"
            >
              <div className="transform transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </div>
              <h3 className="font-heading font-semibold text-xl mb-2 transition-transform duration-300 group-hover:scale-125 group-hover:text-accent origin-center">
                {item.title}
              </h3>
              <p className="text-gray-300 font-sans text-sm transition-opacity duration-300 group-hover:opacity-100 opacity-80">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};