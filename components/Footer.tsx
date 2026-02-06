'use client';

import React from 'react';
import Link from 'next/link';
import { COMPANY_INFO } from '@/lib/constants';
import { useLanguage } from '@/contexts/LanguageContext';

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-secondary text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Simplified 2-Column Grid: Brand & Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10 border-b border-white/20 pb-10">

          {/* Brand Column */}
          <div className="space-y-8">
            <Link
              href="/"
              className="font-heading font-bold text-4xl sm:text-5xl tracking-wider text-white text-left block active:scale-95 transition-transform"
            >
              VIDO FURNITURE
            </Link>
            <p className="text-white text-lg sm:text-xl leading-relaxed max-w-xl font-light opacity-100">
              {t.footer.description}
            </p>
          </div>

          {/* Contact Column */}
          <div className="lg:pl-20">
            <h4 className="font-heading font-bold text-xl mb-8 text-accent uppercase tracking-[0.2em]">
              {t.footer.contactHeader}
            </h4>
            <div className="space-y-6">
              <p className="text-white text-lg leading-relaxed opacity-100">
                {t.contact.fullAddress}
              </p>
              <div className="space-y-4 pt-2">
                {COMPANY_INFO.contacts.map((contact, idx) => (
                  <p key={idx} className="text-lg text-white opacity-100 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="font-bold uppercase text-sm sm:text-base opacity-90">
                      {language === 'vi' ? contact.nameVi : contact.name}:
                    </span>
                    <span className="font-mono font-bold text-xl tracking-tight">{contact.phone}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Design Credit */}
        <div className="flex flex-col md:flex-row justify-between items-center text-base text-white/90 gap-6">
          <p className="text-center md:text-left">
            © 2025 {t.contact.companyName}. {t.footer.rights}
          </p>
          <p className="font-bold tracking-[0.2em] uppercase text-xs text-white">
            {t.footer.designed}
          </p>
        </div>
      </div>
    </footer>
  );
};