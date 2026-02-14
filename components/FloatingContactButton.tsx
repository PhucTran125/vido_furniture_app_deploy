'use client';

import React, { useEffect, useState } from 'react';
import { Phone } from 'lucide-react';
import { COMPANY_INFO } from '@/lib/constants';

export const FloatingContactButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const salesContact = COMPANY_INFO.contacts[0];

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <a
      href={`tel:${salesContact.phone.replace(/[\s()]/g, '')}`}
      className={`
        fixed bottom-6 right-6 z-50
        flex items-center justify-end
        bg-accent hover:bg-primary
        text-white
        rounded-full shadow-lg hover:shadow-2xl
        h-14 pr-[17px]
        w-14 hover:w-56
        transition-all duration-300 ease-in-out
        overflow-hidden
        group
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}
      `}
      aria-label={`Call ${salesContact.phone}`}
    >
      {/* Phone number - appears to the left of the icon */}
      <span className="whitespace-nowrap overflow-hidden max-w-0 group-hover:max-w-[180px] opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75 font-bold text-sm tracking-wide mr-3">
        {salesContact.phone}
      </span>

      {/* Phone icon - stays fixed at right edge */}
      <Phone size={22} className="shrink-0 fill-current" />
    </a>
  );
};
