'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import { Section } from './ui/Section';
import { ImageModal } from './ui/ImageModal';
import { ArrowLeft, ArrowRight, Layers, Ruler, FileText, Package, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProductDetailProps {
  product: Product;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentImageIndex(0); // Reset to first image when product changes
  }, [product]);

  const scrollToContact = () => {
    // Navigate to home and scroll to contact
    router.push('/#contact');
    setTimeout(() => {
      const element = document.getElementById('contact');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Manual mapping of product IDs to their specific gallery images
  // No calculations, just explicit definition as requested
  const galleryImages = useMemo(() => {
    switch (product.id) {
      case '1':
        return [
          '/Picture/1.jpg',
          '/Picture/2.jpg',
          '/Picture/3.jpg',
          '/Picture/4.jpg'
        ];
      case '2':
        return [
          '/Picture/5.jpg',
          '/Picture/6.jpg',
          '/Picture/7.jpg',
          '/Picture/8.jpg'
        ];
      case '3':
        return [
          '/Picture/9.jpg',
          '/Picture/10.jpg',
          '/Picture/11.jpg',
          '/Picture/12.jpg'
        ];
      case '4':
        return [
          '/Picture/13.jpg',
          '/Picture/14.jpg',
          '/Picture/15.jpg',
          '/Picture/16.jpg'
        ];
      case '5':
        return [
          '/Picture/17.jpg',
          '/Picture/18.jpg',
          '/Picture/19.jpg',
          '/Picture/20.jpg'
        ];
      case '6':
        return [
          '/Picture/21.jpg',
          '/Picture/22.jpg',
          '/Picture/23.jpg',
          '/Picture/24.jpg'
        ];
      default:
        // Fallback to the main product image if ID is not one of the known ones
        return [`/${product.image}`];
    }
  }, [product.id, product.image]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  // Unified layout for all products - no conditional logic needed

  // Helper to format keys from Vietnamese/Code to readable text in current language
  const formatKey = (key: string) => {
    const mapEn: Record<string, string> = {
      // Dimensions
      dai: "Length", rong: "Width", cao: "Height",
      duong_kinh_mat_ghe: "Seat Diameter",
      chieu_cao_tong_the: "Total Height",
      do_sau_long_ghe: "Internal Depth",
      mat_ghe: "Seat Surface",
      chieu_cao: "Height",
      chieu_cao_mat_ngoi: "Seat Height",
      tui_hong: "Side Pocket",
      duong_kinh: "Diameter",
      ban_lon: "Large Table",
      ban_nho: "Small Table",
      dung_tich_luu_tru_lit: "Storage Capacity (L)",
      ghe_don: "Ottoman",
      ghe_bang: "Bench",

      // Materials
      vai: "Fabric",
      go: "Wood",
      chan_ghe: "Legs",
      khung: "Frame",
      mat_ban: "Table Top",
      be_mat: "Surface Finish",
      vo_boc: "Upholstery",
      dem_mut: "Foam",
      khung_va_chan: "Frame & Legs",
      vai_boc: "Fabric Cover",
    };

    const mapVi: Record<string, string> = {
      dai: "Dài", rong: "Rộng", cao: "Cao",
      duong_kinh_mat_ghe: "Đường kính mặt ghế",
      chieu_cao_tong_he: "Chiều cao tổng thể",
      do_sau_long_ghe: "Độ sâu lòng ghế",
      mat_ghe: "Mặt ghế",
      chieu_cao: "Chiều cao",
      chieu_cao_mat_ngoi: "Chiều cao mặt ngồi",
      tui_hong: "Túi hông",
      duong_kinh: "Đường kính",
      ban_lon: "Bàn lớn",
      ban_nho: "Bàn nhỏ",
      dung_tich_luu_tru_lit: "Dung tích lưu trữ",
      ghe_don: "Ghế đôn",
      ghe_bang: "Ghế băng",

      vai: "Vải",
      go: "Gỗ",
      chan_ghe: "Chân ghế",
      khung: "Khung",
      mat_ban: "Mặt bàn",
      be_mat: "Bề mặt",
      vo_boc: "Vỏ bọc",
      dem_mut: "Đệm mút",
      khung_va_chan: "Khung và Chân",
      vai_boc: "Vải bọc",
    };

    if (language === 'en' && mapEn[key]) return mapEn[key];
    if (language === 'vi' && mapVi[key]) return mapVi[key];

    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Unified render function for dimensions and materials
  const renderSpecificationValue = (value: any): React.ReactNode => {
    if (value && typeof value === 'object' && 'en' in value && 'vi' in value) {
      return <span className="text-gray-900 text-base md:text-lg font-medium">{value[language]}</span>;
    }

    if (Array.isArray(value)) {
      return (
        <span className="text-gray-900 text-base md:text-lg font-medium">
          {value.map((item, idx) => {
            const content = (item && typeof item === 'object' && 'en' in item) ? item[language] : item;
            return (
              <React.Fragment key={idx}>
                {idx > 0 && ", "}
                {content}
              </React.Fragment>
            );
          })}
        </span>
      );
    }

    // Handle nested objects (e.g., dimensions with sub-objects for tables)
    if (typeof value === 'object' && value !== null) {
      return (
        <div className="space-y-2 mt-2">
          {Object.entries(value).map(([k, v]) => (
            <div key={k} className="grid grid-cols-[auto_1fr] gap-x-4 items-baseline">
              <div className="text-sm md:text-base font-semibold text-gray-400 whitespace-nowrap">
                {formatKey(k)}:
              </div>
              <div className="text-sm md:text-base font-medium text-gray-700">
                {renderSpecificationValue(v)}
              </div>
            </div>
          ))}
        </div>
      );
    }

    const strVal = String(value);
    return <span className="text-gray-900 text-base md:text-lg font-medium">{strVal}</span>;
  };

  // Render dimensions or materials in a unified grid layout
  const renderSpecificationSection = (data: any) => {
    if (!data || typeof data !== 'object') return null;

    const entries = Object.entries(data);

    return (
      <div className="space-y-3">
        {entries.map(([key, value]) => (
          <div key={key} className="grid grid-cols-[auto_1fr] gap-x-6 items-baseline">
            <div className="text-base md:text-lg font-bold text-gray-500 whitespace-nowrap">
              {formatKey(key)}:
            </div>
            <div className="text-base md:text-lg font-medium text-gray-900">
              {renderSpecificationValue(value)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render set components with nested structure handling
  const renderSetComponentValue = (value: any): React.ReactNode => {
    if (value && typeof value === 'object' && 'en' in value && 'vi' in value) {
      return <span className="text-gray-900 text-base md:text-lg font-medium">{value[language]}</span>;
    }

    if (typeof value === 'object' && value !== null) {
      return (
        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 mt-2 items-baseline">
          {Object.entries(value).map(([k, v]) => (
            <React.Fragment key={k}>
              <div className="text-base md:text-lg font-bold text-gray-500">{formatKey(k)}:</div>
              <div className="text-base md:text-lg font-medium text-gray-900 break-words">{renderSetComponentValue(v)}</div>
            </React.Fragment>
          ))}
        </div>
      );
    }

    const strVal = String(value);
    return <span className="text-gray-900 text-base md:text-lg font-medium">{strVal}</span>;
  };

  const name = typeof product.name === 'object' ? product.name[language] : product.name;
  const description = product.description ? product.description[language] : undefined;

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb / Back Navigation */}
      <div className="bg-gray-50 border-b border-gray-200 sticky top-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-accent transition-colors uppercase tracking-wider"
          >
            <ArrowLeft size={16} />
            {t.highlights.back}
          </button>
        </div>
      </div>

      <Section className="!pt-8 !pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left: Product Image Gallery */}
          <div
            className="bg-[#F8F8F8] border border-gray-100 rounded-sm overflow-hidden sticky top-40 group relative aspect-square cursor-zoom-in"
            onClick={() => setIsModalOpen(true)}
          >
            {/* Main Image */}
            <img
              key={currentImageIndex} // Key forces re-render for simple animation
              src={galleryImages[currentImageIndex]}
              alt={`${name} - View ${currentImageIndex + 1}`}
              className="w-full h-full object-cover transition-opacity duration-300 animate-in fade-in"
              // Fallback to original if generated path fails
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                // Prevent infinite loop if product.image is also broken or same
                if (target.src !== window.location.origin + '/' + product.image && !target.src.includes(product.image)) {
                  target.src = `/${product.image}`;
                }
              }}
            />

            {/* Hover Zoom Hint */}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
              <div className="bg-white/90 text-primary px-4 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2">
                <Maximize2 size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">Full Screen</span>
              </div>
            </div>

            {/* Navigation Arrows (Stop propagation to prevent modal open) */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-primary hover:text-accent p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 focus:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-primary hover:text-accent p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 focus:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 pointer-events-none">
              {galleryImages.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full shadow-sm transition-all duration-300 ${idx === currentImageIndex ? 'bg-accent w-6' : 'bg-white/70'}`}
                />
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-8">
            <div>
              <span className="inline-block py-1 px-3 bg-accent/10 text-accent text-sm font-bold uppercase tracking-[0.2em] mb-4">
                {product.category}
              </span>
              <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-primary leading-tight mb-4">
                {name}
              </h1>
              <p className="font-mono text-gray-400 text-lg md:text-xl tracking-widest uppercase">
                Item No: <span className="text-primary font-bold">{product.itemNo}</span>
              </p>
            </div>

            <div className="h-px bg-gray-100 w-full"></div>

            {/* Detailed Description */}
            {description && (
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 font-bold text-primary text-xl md:text-2xl">
                  <FileText size={24} className="text-accent" />
                  {language === 'vi' ? 'Mô Tả Chi Tiết' : 'Description'}
                </h3>
                <ul className="space-y-3">
                  {description.map((line, idx) => (
                    <li key={idx} className="flex gap-3 text-gray-800 leading-relaxed text-lg md:text-xl">
                      <span className="block w-2 h-2 mt-2.5 rounded-full bg-accent shrink-0"></span>
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications Container - Unified Layout */}
            <div className="flex flex-col gap-6 pt-4">

              {/* Dimensions */}
              {product.dimensions && (
                <div className="bg-gray-50 p-8 rounded-lg border border-gray-100 w-full">
                  <h3 className="flex items-center gap-3 font-bold text-primary mb-6 uppercase text-base md:text-lg tracking-widest">
                    <Ruler size={22} className="text-accent" />
                    {language === 'vi' ? 'Kích Thước' : 'Dimensions'}
                  </h3>
                  {renderSpecificationSection(product.dimensions)}
                </div>
              )}

              {/* Materials */}
              {product.material && (
                <div className="bg-gray-50 p-8 rounded-lg border border-gray-100 w-full">
                  <h3 className="flex items-center gap-3 font-bold text-primary mb-6 uppercase text-base md:text-lg tracking-widest">
                    <Layers size={22} className="text-accent" />
                    {language === 'vi' ? 'Chất Liệu' : 'Materials'}
                  </h3>
                  {renderSpecificationSection(product.material)}
                </div>
              )}
            </div>

            {/* Set Components (if any) */}
            {product.setComponents && (
              <div className="bg-white border border-dashed border-gray-300 p-8 rounded-lg w-full">
                <h3 className="flex items-center gap-3 font-bold text-primary mb-6 uppercase text-base md:text-lg tracking-widest">
                  <Package size={22} className="text-accent" />
                  {language === 'vi' ? 'Chi Tiết Bộ Sưu Tập' : 'Set Components'}
                </h3>
                {/* Explicitly map entries to use Grid layout properly */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {Object.entries(product.setComponents).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-6 rounded-md border border-gray-100">
                      <h4 className="font-bold text-primary text-lg mb-3 pb-2 border-b border-gray-200">
                        {formatKey(key)}
                      </h4>
                      {renderSetComponentValue(value)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-8">
              <button
                onClick={scrollToContact}
                className="w-full sm:w-auto bg-primary text-white px-10 py-5 font-bold uppercase tracking-[0.2em] text-sm md:text-base hover:bg-accent transition-colors shadow-xl flex items-center justify-center gap-3"
              >
                {t.card.inquire}
                <ArrowRight size={20} />
              </button>
              <p className="mt-4 text-sm text-gray-500 text-center sm:text-left italic">
                * {language === 'vi' ? 'Liên hệ để nhận báo giá chi tiết và tùy chọn' : 'Contact for detailed quotation and customization options'}
              </p>
            </div>

          </div>
        </div>
      </Section>

      {/* Full Screen Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageUrl={galleryImages[currentImageIndex]}
        altText={name}
      />
    </div>
  );
};