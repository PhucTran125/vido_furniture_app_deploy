'use client';

import React, { useEffect, useState } from 'react';
import { Phone } from 'lucide-react';
import { COMPANY_INFO } from '@/lib/constants';

export const FloatingContactButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sales01 = COMPANY_INFO.contacts[0];
  const sales02 = COMPANY_INFO.contacts[1];

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
      }`}
    >
      {/* Phone Button — hover shows 2 phone number rows to the left */}
      <div className="group flex items-end gap-2">
        {/* Phone number capsules — appear to the left on hover */}
        <div className="flex flex-col items-end gap-2 max-w-0 opacity-0 group-hover:max-w-[250px] group-hover:opacity-100 overflow-hidden transition-all duration-300 ease-in-out">
          <a
            href={`tel:${sales01.phone.replace(/[\s()]/g, '')}`}
            className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white rounded-full pl-5 pr-4 py-2.5 shadow-lg hover:shadow-2xl transition-colors whitespace-nowrap"
          >
            <span className="text-sm font-bold tracking-wide">{sales01.phone}</span>
            <Phone size={16} className="shrink-0 fill-current" />
          </a>
          <a
            href={`tel:${sales02.phone.replace(/[\s()]/g, '')}`}
            className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white rounded-full pl-5 pr-4 py-2.5 shadow-lg hover:shadow-2xl transition-colors whitespace-nowrap"
          >
            <span className="text-sm font-bold tracking-wide">{sales02.phone}</span>
            <Phone size={16} className="shrink-0 fill-current" />
          </a>
        </div>

        {/* Main phone circle */}
        <div className="w-14 h-14 rounded-full shadow-lg group-hover:shadow-2xl flex items-center justify-center bg-accent group-hover:bg-primary text-white transition-all duration-300 cursor-pointer shrink-0">
          <Phone size={22} className="fill-current" />
        </div>
      </div>

      {/* Zalo Button */}
      <a
        href={`https://zalo.me/${sales02.phone.replace(/[\s()+]/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full shadow-lg hover:shadow-2xl flex items-center justify-center overflow-hidden transition-all duration-300"
        aria-label="Chat on Zalo"
      >
        <img src="/zalo.png" alt="Zalo" className="w-full h-full object-cover" />
      </a>

      {/* WeChat Button */}
      <a
        href={`weixin://dl/chat?${sales01.phone.replace(/[\s()+]/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full shadow-lg hover:shadow-2xl flex items-center justify-center overflow-hidden transition-all duration-300"
        aria-label="Chat on WeChat"
      >
        <img src="/wechat.png" alt="WeChat" className="w-full h-full object-cover" />
      </a>
    </div>
  );
};
