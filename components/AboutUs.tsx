'use client';

import React, { useEffect } from 'react';
import { Section } from './ui/Section';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import { Globe, Target, Heart, Award, Factory, Headset, ArrowRight } from 'lucide-react';

export const AboutUs: React.FC = () => {
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white">
      {/* Compact Header */}
      <div className="bg-primary py-8 px-4 text-center">
        <span className="text-accent font-bold text-[10px] uppercase tracking-[0.3em] mb-2 block opacity-80">
          {t.about.badge}
        </span>
        <h1 className="font-heading font-bold text-3xl text-white">
          {t.about.title}
        </h1>
        <div className="w-12 h-1 bg-accent mx-auto mt-4 rounded-full"></div>
      </div>

      <Section className="!py-10 md:!py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

          {/* Left Column: Narrative Content */}
          <div className="lg:col-span-7 space-y-5 text-gray-600 text-justify">
            <p className="font-medium text-primary text-lg border-l-4 border-accent pl-4 leading-relaxed">
              {t.about.p1}
            </p>

            <div className="space-y-4 text-base leading-relaxed opacity-90">
              <p>{t.about.p2}</p>
              <p>{t.about.p3}</p>
            </div>

            {/* Integrated Quote */}
            <div className="mt-6 bg-gray-50 p-5 rounded-r-xl border-l-4 border-gray-300">
              <p className="italic text-gray-700 font-medium text-sm md:text-base">
                "{t.about.p4}"
              </p>
            </div>
          </div>

          {/* Right Column: Values Sidebar (Compact) */}
          <div className="lg:col-span-5 flex flex-col gap-4">

            {/* Vision */}
            <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm hover:border-accent/30 transition-all hover:shadow-md group">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-accent/10 rounded-lg text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                  <Globe size={18} />
                </div>
                <h3 className="font-heading font-bold text-primary text-sm uppercase tracking-wide">{t.about.visionTitle}</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                {t.about.visionDesc}
              </p>
            </div>

            {/* Mission */}
            <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm hover:border-accent/30 transition-all hover:shadow-md group">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-accent/10 rounded-lg text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                  <Target size={18} />
                </div>
                <h3 className="font-heading font-bold text-primary text-sm uppercase tracking-wide">{t.about.missionTitle}</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                {t.about.missionDesc}
              </p>
            </div>

            {/* Values */}
            <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm hover:border-accent/30 transition-all hover:shadow-md group">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-accent/10 rounded-lg text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                  <Heart size={18} />
                </div>
                <h3 className="font-heading font-bold text-primary text-sm uppercase tracking-wide">{t.about.valuesTitle}</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                {t.about.valuesDesc}
              </p>
            </div>

          </div>
        </div>

        {/* Explore Navigation */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:justify-center">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-widest whitespace-nowrap">
              {t.highlights.exploreMore}
            </span>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => router.push('/highlights/export-quality')}
                className="group flex-1 sm:flex-none flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 border border-accent px-4 py-2.5 rounded-md text-white text-sm font-semibold transition-all shadow-sm active:scale-95 touch-manipulation"
              >
                <Award size={15} className="shrink-0" />
                <span className="truncate">{t.highlights.goToQuality}</span>
                <ArrowRight size={13} className="shrink-0 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => router.push('/highlights/factory')}
                className="group flex-1 sm:flex-none flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 border border-accent px-4 py-2.5 rounded-md text-white text-sm font-semibold transition-all shadow-sm active:scale-95 touch-manipulation"
              >
                <Factory size={15} className="shrink-0" />
                <span className="truncate">{t.highlights.goToFactory}</span>
                <ArrowRight size={13} className="shrink-0 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => router.push('/highlights/customer-service')}
                className="group flex-1 sm:flex-none flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 border border-accent px-4 py-2.5 rounded-md text-white text-sm font-semibold transition-all shadow-sm active:scale-95 touch-manipulation"
              >
                <Headset size={15} className="shrink-0" />
                <span className="truncate">{t.highlights.goToService}</span>
                <ArrowRight size={13} className="shrink-0 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};
