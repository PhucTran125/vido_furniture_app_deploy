'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe, ChevronDown, Check, Heart, Trash2, Send } from 'lucide-react';
import { Button } from './ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Product, getMainImageUrl } from '@/lib/types';
import { generateSlug } from '@/lib/utils';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { wishlist, wishlistCount, removeFromWishlist } = useWishlist();
  const pathname = usePathname();

  // Dropdown states
  const [isDesktopLangOpen, setIsDesktopLangOpen] = useState(false);
  const [isMobileLangOpen, setIsMobileLangOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  const desktopLangRef = useRef<HTMLDivElement>(null);
  const mobileLangRef = useRef<HTMLDivElement>(null);
  const wishlistPanelRef = useRef<HTMLDivElement>(null);

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
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // Fetch wishlist products when panel opens
  const fetchWishlistProducts = useCallback(async () => {
    if (wishlist.length === 0) {
      setWishlistProducts([]);
      return;
    }
    setLoadingWishlist(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const allProducts: Product[] = await res.json();
        const filtered = allProducts.filter((p) => wishlist.includes(p.id));
        setWishlistProducts(filtered);
      }
    } catch {
      // silently fail
    } finally {
      setLoadingWishlist(false);
    }
  }, [wishlist]);

  useEffect(() => {
    if (isWishlistOpen) {
      fetchWishlistProducts();
    }
  }, [isWishlistOpen, fetchWishlistProducts]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (desktopLangRef.current && !desktopLangRef.current.contains(event.target as Node)) {
        setIsDesktopLangOpen(false);
      }
      if (mobileLangRef.current && !mobileLangRef.current.contains(event.target as Node)) {
        setIsMobileLangOpen(false);
      }
      if (wishlistPanelRef.current && !wishlistPanelRef.current.contains(event.target as Node)) {
        setIsWishlistOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close wishlist on route change
  useEffect(() => {
    setIsWishlistOpen(false);
  }, [pathname]);

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

  const handleInquireAll = () => {
    setIsWishlistOpen(false);
    setTimeout(() => {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

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
              <img
                src="/logo.jpg"
                alt="VIDO Furniture"
                className="h-20 w-auto object-contain"
              />
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

            {/* Wishlist Icon */}
            <div className="relative" ref={wishlistPanelRef}>
              <button
                onClick={() => setIsWishlistOpen(!isWishlistOpen)}
                className="relative p-2 text-gray-600 hover:text-accent transition-colors focus:outline-none"
                aria-label="Wishlist"
              >
                <Heart size={20} className={wishlistCount > 0 ? 'fill-red-500 text-red-500' : ''} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center leading-none">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                )}
              </button>

              {/* Wishlist Dropdown Panel */}
              {isWishlistOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-100 overflow-hidden z-50">
                  {/* Panel Header */}
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-sm text-primary">{t.wishlist.title} ({wishlistCount})</h3>
                    <button
                      onClick={() => setIsWishlistOpen(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Panel Body */}
                  <div className="max-h-80 overflow-y-auto">
                    {loadingWishlist ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : wishlistProducts.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <Heart size={32} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-sm font-semibold text-gray-500">{t.wishlist.empty}</p>
                        <p className="text-xs text-gray-400 mt-1">{t.wishlist.emptyDesc}</p>
                      </div>
                    ) : (
                      wishlistProducts.map((product) => {
                        const slug = generateSlug(product);
                        const name = product.name[language];
                        return (
                          <div
                            key={product.id}
                            className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                          >
                            {/* Product Image */}
                            <Link
                              href={`/products/${slug}`}
                              onClick={() => setIsWishlistOpen(false)}
                              className="w-14 h-14 flex-shrink-0 bg-gray-100 rounded overflow-hidden"
                            >
                              <img
                                src={getMainImageUrl(product)}
                                alt={name}
                                className="w-full h-full object-cover"
                              />
                            </Link>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <Link
                                href={`/products/${slug}`}
                                onClick={() => setIsWishlistOpen(false)}
                                className="text-sm font-semibold text-primary hover:text-accent transition-colors line-clamp-1 block"
                              >
                                {name}
                              </Link>
                              <p className="text-[10px] text-gray-400 uppercase tracking-wider">{product.category}</p>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => removeFromWishlist(product.id)}
                              className="p-1.5 text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                              title={t.wishlist.remove}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Panel Footer */}
                  {wishlistProducts.length > 0 && (
                    <div className="px-4 py-3 border-t border-gray-100">
                      <button
                        onClick={handleInquireAll}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-accent/90 transition-colors"
                      >
                        <Send size={14} />
                        {t.wishlist.inquireAll}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

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
            {/* Mobile Wishlist Icon */}
            <button
              onClick={() => setIsWishlistOpen(!isWishlistOpen)}
              className="relative p-2 text-gray-600 hover:text-accent transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={20} className={wishlistCount > 0 ? 'fill-red-500 text-red-500' : ''} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center leading-none">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </button>

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

      {/* Mobile Wishlist Panel (full-width below header) */}
      {isWishlistOpen && (
        <div
          ref={wishlistPanelRef}
          className="md:hidden absolute left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50"
        >
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-primary">{t.wishlist.title} ({wishlistCount})</h3>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {loadingWishlist ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : wishlistProducts.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Heart size={32} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm font-semibold text-gray-500">{t.wishlist.empty}</p>
                <p className="text-xs text-gray-400 mt-1">{t.wishlist.emptyDesc}</p>
              </div>
            ) : (
              wishlistProducts.map((product) => {
                const slug = generateSlug(product);
                const name = product.name[language];
                return (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0"
                  >
                    <Link
                      href={`/products/${slug}`}
                      onClick={() => setIsWishlistOpen(false)}
                      className="w-14 h-14 flex-shrink-0 bg-gray-100 rounded overflow-hidden"
                    >
                      <img
                        src={getMainImageUrl(product)}
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${slug}`}
                        onClick={() => setIsWishlistOpen(false)}
                        className="text-sm font-semibold text-primary hover:text-accent transition-colors line-clamp-1 block"
                      >
                        {name}
                      </Link>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">{product.category}</p>
                    </div>
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="p-1.5 text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                      title={t.wishlist.remove}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {wishlistProducts.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100">
              <button
                onClick={handleInquireAll}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-accent/90 transition-colors"
              >
                <Send size={14} />
                {t.wishlist.inquireAll}
              </button>
            </div>
          )}
        </div>
      )}

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
