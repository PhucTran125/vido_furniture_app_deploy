'use client';

import React from 'react';
import { Section } from './ui/Section';
import { useLanguage } from '@/contexts/LanguageContext';
import { DollarSign, Users, Award, Factory } from 'lucide-react';

const icons = [DollarSign, Users, Award, Factory];

export const Achievements: React.FC = () => {
  const { t } = useLanguage();

  const items = [
    { number: t.achievements.stat1Number, desc: t.achievements.stat1Desc },
    { number: t.achievements.stat2Number, desc: t.achievements.stat2Desc },
    { number: t.achievements.stat3Number, desc: t.achievements.stat3Desc },
    { number: t.achievements.stat4Number, desc: t.achievements.stat4Desc },
  ];

  return (
    <Section id="achievements" className="bg-white !py-14 md:!py-20">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-3">
            {t.achievements.title}
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            {t.achievements.subtitle}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {items.map((item, idx) => {
            const Icon = icons[idx];
            return (
              <div
                key={idx}
                className="bg-[#3B5F60] rounded-2xl p-6 md:p-8 flex flex-col items-center text-center transition-transform hover:scale-[1.03]"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-white/30 flex items-center justify-center mb-5">
                  <Icon className="w-7 h-7 md:w-8 md:h-8 text-white" strokeWidth={1.5} />
                </div>
                <span className="text-3xl md:text-4xl font-bold text-white mb-2 font-heading">
                  {item.number}
                </span>
                <p className="text-white/80 text-xs md:text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
};
