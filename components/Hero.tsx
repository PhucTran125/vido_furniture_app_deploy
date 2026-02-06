'use client';

import React from 'react';
import { Button } from './ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';

export const Hero: React.FC = () => {
  const { t } = useLanguage();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div id="home" className="relative h-[60vh] md:h-[75vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-primary">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 opacity-60">
        <img
          src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=2000"
          alt="Luxury furniture manufacturing"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <div className="mb-6 inline-block px-4 py-1.5 border border-accent/50 rounded-full bg-black/40 backdrop-blur-sm">
          <span className="text-accent text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase">{t.hero.badge}</span>
        </div>
        <h1 className="font-heading font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-6 leading-[1.15] drop-shadow-2xl">
          {t.hero.titleStart} <span className="text-accent block sm:inline">{t.hero.titleEnd}</span>
        </h1>
        <p className="font-sans text-base sm:text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed font-light opacity-90">
          {t.hero.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center max-w-xs sm:max-w-none mx-auto">
          <Button
            variant="primary"
            className="w-full sm:w-auto px-10 py-4 text-xs sm:text-sm tracking-[0.2em] font-black"
            onClick={() => scrollToSection('products')}
          >
            {t.hero.explore}
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto px-10 py-4 border-white text-white hover:bg-white hover:text-primary tracking-[0.2em] font-black"
            onClick={() => scrollToSection('contact')}
          >
            {t.hero.contact}
          </Button>
        </div>
      </div>
    </div>
  );
};