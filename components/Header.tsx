'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe, ChevronDown, Check } from 'lucide-react';
import { Button } from './ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();

  // Dropdown states
  const [isDesktopLangOpen, setIsDesktopLangOpen] = useState(false);
  const [isMobileLangOpen, setIsMobileLangOpen] = useState(false);

  const desktopLangRef = useRef<HTMLDivElement>(null);
  const mobileLangRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  const selectLanguage = (lang: 'en' | 'vi') => {
    setLanguage(lang);
    setIsDesktopLangOpen(false);
    setIsMobileLangOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false);
    // Small delay to ensure navigation completes
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (desktopLangRef.current && !desktopLangRef.current.contains(event.target as Node)) {
        setIsDesktopLangOpen(false);
      }
      if (mobileLangRef.current && !mobileLangRef.current.contains(event.target as Node)) {
        setIsMobileLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navLinks: Array<{ label: string; href: string; id: string; sectionId?: string }> = [
    { label: t.nav.home, href: '/', id: 'home' },
    { label: t.nav.about, href: '/about', id: 'about' },
    { label: t.nav.products, href: '/products', id: 'products' },
    { label: t.nav.blog, href: '/blog', id: 'blog' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  const renderLangOptions = () => (
    <>
      <button
        onClick={() => selectLanguage('en')}
        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${language === 'en' ? 'text-accent font-bold bg-gray-50/50' : 'text-gray-700'}`}
      >
        English
        {language === 'en' && <Check size={14} className="text-accent" />}
      </button>
      <button
        onClick={() => selectLanguage('vi')}
        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${language === 'vi' ? 'text-accent font-bold bg-gray-50/50' : 'text-gray-700'}`}
      >
        Tiếng Việt
        {language === 'vi' && <Check size={14} className="text-accent" />}
      </button>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/"
              className="flex items-center gap-3 group focus:outline-none"
            >
              <svg className="h-14 w-auto" viewBox="0 0 300 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 50 L60 15 L130 15 L80 50 Z" fill="#8CC63F" />
                <path d="M90 50 L180 10 L270 50 L270 110 L230 110 L230 70 L180 45 L130 70 L90 50 Z" fill="#1a1a1a" />
                <text x="60" y="110" fontFamily="Montserrat, sans-serif" fontWeight="700" fontSize="55" fill="#F39200" letterSpacing="4">VIDO</text>
              </svg>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              link.sectionId ? (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.sectionId!)}
                  className="font-bold text-sm uppercase tracking-widest transition-colors focus:outline-none text-[#666666] hover:text-accent"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.id}
                  href={link.href}
                  className={`font-bold text-sm uppercase tracking-widest transition-colors ${isActive(link.href) ? 'text-accent' : 'text-[#666666] hover:text-accent'}`}
                  onClick={handleNavClick}
                >
                  {link.label}
                </Link>
              )
            ))}

            <div className="relative" ref={desktopLangRef}>
              <button
                onClick={() => setIsDesktopLangOpen(!isDesktopLangOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded text-sm font-semibold text-gray-600 hover:text-accent hover:border-accent transition-all focus:outline-none bg-white"
              >
                <Globe size={16} />
                <span>{language === 'en' ? 'English' : 'Tiếng Việt'}</span>
                <ChevronDown size={14} className={`transform transition-transform duration-200 ${isDesktopLangOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDesktopLangOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                  {renderLangOptions()}
                </div>
              )}
            </div>

            <button onClick={() => scrollToSection('contact')}>
              <Button variant="primary">
                {t.nav.contact}
              </Button>
            </button>
          </nav>

          {/* Mobile Menu & Language */}
          <div className="flex items-center gap-3 md:hidden">
            <div className="relative" ref={mobileLangRef}>
              <button
                onClick={() => setIsMobileLangOpen(!isMobileLangOpen)}
                className="flex items-center gap-1 p-2 text-gray-700 hover:text-accent transition-colors"
              >
                <Globe size={20} />
                <span className="text-sm font-bold">{language === 'en' ? 'EN' : 'VN'}</span>
                <ChevronDown size={14} className={`transform transition-transform duration-200 ${isMobileLangOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMobileLangOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                  {renderLangOptions()}
                </div>
              )}
            </div>

            <button
              onClick={toggleMenu}
              className="text-gray-500 hover:text-primary focus:outline-none p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              link.sectionId ? (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.sectionId!)}
                  className="block w-full text-left px-3 py-2 text-base font-bold uppercase tracking-widest text-[#666666] hover:text-accent hover:bg-gray-50 focus:outline-none"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={handleNavClick}
                  className="block px-3 py-2 text-base font-bold uppercase tracking-widest text-[#666666] hover:text-accent hover:bg-gray-50"
                >
                  {link.label}
                </Link>
              )
            ))}
            <div className="px-3 py-3">
              <button onClick={() => scrollToSection('contact')} className="w-full">
                <Button fullWidth>
                  {t.nav.contact}
                </Button>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};