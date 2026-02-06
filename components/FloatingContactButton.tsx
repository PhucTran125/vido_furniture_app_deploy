'use client';

import React, { useEffect, useState } from 'react';
import { Phone } from 'lucide-react';

export const FloatingContactButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button after scrolling down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={scrollToContact}
      className={`
        fixed bottom-6 right-6 z-50 
        bg-accent text-white p-4 rounded-full shadow-lg 
        hover:bg-primary hover:shadow-2xl 
        transition-all duration-500 transform 
        group
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
      `}
      aria-label="Contact Us"
      title="Contact Us"
    >
      {/* Animated ripple ring on hover */}
      <div className="absolute inset-0 rounded-full border-2 border-accent opacity-0 group-hover:animate-ping"></div>

      {/* Icon */}
      <Phone size={24} className="relative z-10 fill-current" />
    </button>
  );
};