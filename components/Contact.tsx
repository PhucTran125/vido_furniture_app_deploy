'use client';

import React from 'react';
import { Section } from './ui/Section';
import { COMPANY_INFO } from '@/lib/constants';
import { MapPin, Phone, Mail, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const Contact: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <Section id="contact" className="bg-white !py-10 md:!py-20">
      <div className="max-w-5xl mx-auto">
        <div className="bg-[#f8f9fa] p-6 md:p-10 rounded-[20px] shadow-sm border border-gray-100 mx-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">

            {/* Company Address Section */}
            <div className="flex items-start gap-4 md:gap-5">
              <div className="bg-[#eeeeee] p-3.5 rounded-full shrink-0 flex items-center justify-center">
                <MapPin size={28} className="text-accent" />
              </div>
              <div className="space-y-3">
                <h4 className="font-heading font-bold text-gray-900 text-lg tracking-tight leading-none">{t.contact.address}</h4>
                <div className="space-y-2">
                  <p className="text-black font-bold text-base leading-snug">
                    {language === 'vi' ? 'CÔNG TY CỔ PHẦN NỘI THẤT VIDO VIỆT NAM (VIDO FURNITURE JSC)' : 'VIDO VIET NAM FURNITURE JOINT STOCK COMPANY (VIDO FURNITURE JSC)'}
                  </p>
                  <p className="text-gray-800 font-medium text-base leading-relaxed">
                    {t.contact.fullAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Hotlines, Tax Code, Email */}
            <div className="space-y-10">

              {/* Hotlines */}
              <div className="flex items-start gap-4 md:gap-5">
                <div className="bg-[#eeeeee] p-3.5 rounded-full shrink-0 flex items-center justify-center">
                  <Phone size={28} className="text-accent" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-heading font-bold text-gray-900 text-lg tracking-tight leading-none mb-4">{t.contact.hotline}</h4>
                  <div className="space-y-4">
                    {COMPANY_INFO.contacts.map((contact, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-300 pb-2 last:border-0">
                        <span className="text-black text-base font-bold tracking-wide uppercase">
                          {language === 'vi' ? contact.nameVi : contact.name}
                        </span>
                        <a href={`tel:${contact.phone}`} className="text-primary font-black text-lg md:text-xl hover:text-accent transition-colors font-mono">
                          {contact.phone}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tax Code */}
              <div className="flex items-start gap-4 md:gap-5">
                <div className="bg-[#eeeeee] p-3.5 rounded-full shrink-0 flex items-center justify-center">
                  <FileText size={28} className="text-accent" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-heading font-bold text-gray-900 text-lg tracking-tight leading-none mb-2">{t.contact.taxCode}</h4>
                  <p className="text-gray-800 font-bold text-base md:text-lg">{COMPANY_INFO.taxCode}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 md:gap-5">
                <div className="bg-[#eeeeee] p-3.5 rounded-full shrink-0 flex items-center justify-center">
                  <Mail size={28} className="text-accent" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-heading font-bold text-gray-900 text-lg tracking-tight leading-none mb-2">{t.contact.email}</h4>
                  <a href={`mailto:${COMPANY_INFO.email}`} className="text-accent font-bold hover:underline text-base md:text-lg break-all">
                    {COMPANY_INFO.email}
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};