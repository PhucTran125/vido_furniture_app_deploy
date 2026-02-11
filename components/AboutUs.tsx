'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Section } from './ui/Section';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe, Target, Heart, ShieldCheck, TreePine, FlameKindling, Download, ExternalLink, Eye, X, ZoomIn, ZoomOut } from 'lucide-react';

export const AboutUs: React.FC = () => {
  const { t } = useLanguage();
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string; pdf: string } | null>(null);
  const [lightboxZoom, setLightboxZoom] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openLightbox = useCallback((src: string, alt: string, pdf: string) => {
    setLightboxImage({ src, alt, pdf });
    setLightboxZoom(false);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxImage(null);
    setLightboxZoom(false);
    document.body.style.overflow = '';
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
    };
    if (lightboxImage) {
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [lightboxImage, closeLightbox]);

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
      </Section>

      {/* Certifications & Compliance Section */}
      <div className="bg-gray-50 border-t border-gray-100">
        <Section className="!py-10 md:!py-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-3">
              <ShieldCheck size={20} className="text-accent" />
              <span className="text-accent font-bold text-[10px] uppercase tracking-[0.3em]">
                {t.about.certsTitle}
              </span>
            </div>
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary">
              {t.about.certsTitle}
            </h2>
            <p className="text-gray-500 text-sm md:text-base mt-3 max-w-2xl mx-auto">
              {t.about.certsSubtitle}
            </p>
            <div className="w-12 h-1 bg-accent mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

            {/* FSC Certificate Card */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden group">
              <div className="bg-green-50 px-6 py-4 border-b border-green-100 flex items-center gap-3">
                <div className="p-2.5 bg-green-600 rounded-lg text-white">
                  <TreePine size={22} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-primary text-base">
                    {t.about.certFscTitle}
                  </h3>
                  <p className="text-xs text-gray-500">{t.about.certFscIssuer}</p>
                </div>
                <span className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  {t.about.certStatus}
                </span>
              </div>

              {/* Certificate Preview Image */}
              <div
                className="relative cursor-pointer group/preview mx-6 mt-5 rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all"
                onClick={() => openLightbox(
                  '/certifications/fsc-certificate-preview-1.png',
                  t.about.certFscTitle,
                  '/certifications/fsc-certificate-summertree.pdf'
                )}
              >
                <div className="relative aspect-[4/3] bg-gray-50">
                  <Image
                    src="/certifications/fsc-certificate-preview-1.png"
                    alt={t.about.certFscTitle}
                    fill
                    className="object-contain object-top"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover/preview:bg-black/40 transition-all flex items-center justify-center">
                  <div className="opacity-0 group-hover/preview:opacity-100 transition-all transform scale-90 group-hover/preview:scale-100 bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-lg">
                    <Eye size={24} className="text-primary" />
                  </div>
                </div>
              </div>

              <div className="px-6 py-5 space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-gray-400 font-medium shrink-0">{t.about.certNumber}:</span>
                    <span className="text-primary font-semibold">FCOC43086</span>
                  </div>
                  <p className="text-gray-600">{t.about.certFscScope}</p>
                  <p className="text-gray-600">{t.about.certFscClaims}</p>
                  <p className="text-green-600 font-medium">{t.about.certFscValid}</p>
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() => openLightbox(
                      '/certifications/fsc-certificate-preview-1.png',
                      t.about.certFscTitle,
                      '/certifications/fsc-certificate-summertree.pdf'
                    )}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Eye size={16} />
                    {t.about.certView}
                  </button>
                  <a
                    href="/certifications/fsc-certificate-summertree.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Download size={16} />
                    {t.about.certDownload}
                  </a>
                </div>
              </div>
            </div>

            {/* SGS Test Report Card */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden group">
              <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex items-center gap-3">
                <div className="p-2.5 bg-orange-500 rounded-lg text-white">
                  <FlameKindling size={22} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-primary text-base">
                    {t.about.certSgsTitle}
                  </h3>
                  <p className="text-xs text-gray-500">{t.about.certSgsIssuer}</p>
                </div>
                <span className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  {t.about.certStatus}
                </span>
              </div>

              {/* Certificate Preview Image */}
              <div
                className="relative cursor-pointer group/preview mx-6 mt-5 rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all"
                onClick={() => openLightbox(
                  '/certifications/sgs-report-preview-1.png',
                  t.about.certSgsTitle,
                  '/certifications/sgs-test-report-tb117.pdf'
                )}
              >
                <div className="relative aspect-[4/3] bg-gray-50">
                  <Image
                    src="/certifications/sgs-report-preview-1.png"
                    alt={t.about.certSgsTitle}
                    fill
                    className="object-contain object-top"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover/preview:bg-black/40 transition-all flex items-center justify-center">
                  <div className="opacity-0 group-hover/preview:opacity-100 transition-all transform scale-90 group-hover/preview:scale-100 bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-lg">
                    <Eye size={24} className="text-primary" />
                  </div>
                </div>
              </div>

              <div className="px-6 py-5 space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-gray-400 font-medium shrink-0">{t.about.certNumber}:</span>
                    <span className="text-primary font-semibold">VNHL2510033135HG</span>
                  </div>
                  <p className="text-gray-600">{t.about.certSgsScope}</p>
                  <p className="text-green-600 font-semibold">{t.about.certSgsResult}</p>
                  <p className="text-gray-600">{t.about.certSgsMarket}</p>
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() => openLightbox(
                      '/certifications/sgs-report-preview-1.png',
                      t.about.certSgsTitle,
                      '/certifications/sgs-test-report-tb117.pdf'
                    )}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Eye size={16} />
                    {t.about.certView}
                  </button>
                  <a
                    href="/certifications/sgs-test-report-tb117.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Download size={16} />
                    {t.about.certDownload}
                  </a>
                </div>
              </div>
            </div>

          </div>
        </Section>
      </div>

      {/* Certificate Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            aria-label={t.about.certClose}
          >
            <X size={24} />
          </button>

          {/* Toolbar */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2">
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxZoom(!lightboxZoom); }}
              className="p-1.5 hover:bg-white/20 rounded-full text-white transition-colors"
              aria-label={lightboxZoom ? 'Zoom out' : 'Zoom in'}
            >
              {lightboxZoom ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
            </button>
            <div className="w-px h-5 bg-white/30" />
            <a
              href={lightboxImage.pdf}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 hover:bg-white/20 rounded-full text-white transition-colors"
              aria-label={t.about.certDownload}
            >
              <Download size={18} />
            </a>
            <a
              href={lightboxImage.pdf}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 hover:bg-white/20 rounded-full text-white transition-colors"
              aria-label="Open in new tab"
            >
              <ExternalLink size={18} />
            </a>
          </div>

          {/* Certificate Image */}
          <div
            className={`relative bg-white rounded-xl shadow-2xl overflow-auto transition-all duration-300 ${
              lightboxZoom
                ? 'max-w-[95vw] max-h-[90vh] w-auto'
                : 'max-w-3xl max-h-[85vh] w-full'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`relative ${lightboxZoom ? 'w-[1200px]' : 'w-full'}`}>
              <Image
                src={lightboxImage.src}
                alt={lightboxImage.alt}
                width={1200}
                height={1600}
                className="w-full h-auto"
                priority
              />
            </div>

            {/* Bottom bar with title and download */}
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 px-6 py-3 flex items-center justify-between">
              <h3 className="font-heading font-bold text-primary text-sm md:text-base truncate">
                {lightboxImage.alt}
              </h3>
              <a
                href={lightboxImage.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Download size={14} />
                {t.about.certDownload}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};