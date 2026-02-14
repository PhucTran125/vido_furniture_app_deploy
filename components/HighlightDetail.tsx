'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Section } from './ui/Section';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { ImageModal } from './ui/ImageModal';
import {
  Award,
  Headset,
  Factory,
  ArrowLeft,
  BookOpen,
  CheckSquare,
  FileText,
  CreditCard,
  ClipboardCheck,
  FileCheck,
  ArrowDown,
  Scissors,
  Hammer,
  ShieldCheck,
  Cpu,
  PenTool,
  Image as ImageIcon,
  Maximize2,
  Leaf,
  Zap,
  Recycle,
  Users,
  TreePine,
  FlameKindling,
  Download,
  ExternalLink,
  Eye,
  X,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import Image from 'next/image';
import { PageType } from '@/lib/types';

interface HighlightDetailProps {
  type: PageType;

}

export const HighlightDetail: React.FC<HighlightDetailProps> = ({ type }) => {
  const { t } = useLanguage();
  const router = useRouter();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [certLightbox, setCertLightbox] = useState<{ src: string; alt: string; pdf: string } | null>(null);
  const [certZoom, setCertZoom] = useState(false);

  const openCertLightbox = useCallback((src: string, alt: string, pdf: string) => {
    setCertLightbox({ src, alt, pdf });
    setCertZoom(false);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeCertLightbox = useCallback(() => {
    setCertLightbox(null);
    setCertZoom(false);
    document.body.style.overflow = '';
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCertLightbox();
    };
    if (certLightbox) {
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [certLightbox, closeCertLightbox]);

  const getContent = () => {
    switch (type) {
      case 'export-quality':
        return {
          title: t.highlights.quality,
          icon: <Award size={64} className="text-accent" />,
          badge: t.highlights.badgeQuality
        };
      case 'customer-service':
        return {
          title: t.highlights.service,
          icon: <Headset size={64} className="text-accent" />,
          badge: t.highlights.badgeService
        };
      case 'factory':
        return {
          title: t.highlights.factory,
          icon: <Factory size={64} className="text-accent" />,
          badge: t.highlights.badgeFactory
        };
      default:
        return { title: "Detail", icon: null, badge: "" };
    }
  };

  const content = getContent();

  const serviceIcons = [
    <BookOpen className="w-4 h-4 text-white" />,
    <CheckSquare className="w-4 h-4 text-white" />,
    <FileText className="w-4 h-4 text-white" />,
    <CreditCard className="w-4 h-4 text-white" />,
    <Factory className="w-4 h-4 text-white" />,
    <ClipboardCheck className="w-4 h-4 text-white" />,
    <FileCheck className="w-4 h-4 text-white" />
  ];

  // Increased icon sizes for Manufacturing section
  const manufacturingIcons = [
    <Scissors className="w-7 h-7 text-accent" />,
    <PenTool className="w-7 h-7 text-accent" />,
    <Hammer className="w-7 h-7 text-accent" />,
    <ShieldCheck className="w-7 h-7 text-accent" />,
    <Cpu className="w-7 h-7 text-accent" />
  ];

  // Increased icon sizes for Sustainability section
  const sustainabilityPoints = [
    {
      title: t.highlights.susP1Title,
      description: t.highlights.susP1Desc,
      icon: <Leaf className="w-6 h-6 text-green-600" />
    },
    {
      title: t.highlights.susP2Title,
      description: t.highlights.susP2Desc,
      icon: <Zap className="w-6 h-6 text-yellow-500" />
    },
    {
      title: t.highlights.susP3Title,
      description: t.highlights.susP3Desc,
      icon: <Recycle className="w-6 h-6 text-blue-500" />
    },
    {
      title: t.highlights.susP4Title,
      description: t.highlights.susP4Desc,
      icon: <Users className="w-6 h-6 text-indigo-500" />
    }
  ];


  const factoryImages = Array.from({ length: 9 }, (_, i) => `/Picture/${25 + i}.jpg`);

  return (
    <div className="bg-white">
      {/* Header section */}
      <div className="bg-primary py-12 md:py-16 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 hidden md:block">
          {content.icon}
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-accent font-semibold text-[10px] md:text-sm uppercase tracking-[0.4em] mb-4 block">
            {content.badge}
          </span>
          <h1 className="font-heading font-bold text-3xl md:text-6xl text-white leading-tight mb-8">
            {content.title}
          </h1>
          <div className="w-16 md:w-24 h-1 bg-accent mx-auto"></div>
        </div>
      </div>

      <Section className="bg-white !py-10 md:!py-20">
        <div className="max-w-5xl mx-auto">

          {/* CUSTOMER SERVICE CONTENT */}
          {type === 'customer-service' ? (
            <div className="animate-in fade-in duration-500">
              {/* Intro Text */}
              <div className="text-center mb-10 max-w-3xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-primary mb-4">{t.highlights.serviceIntroTitle}</h2>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  {t.highlights.serviceIntroDesc}
                </p>
              </div>

              {/* Step-by-Step Visualization */}
              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-0.5 bg-gray-200 transform md:-translate-x-1/2"></div>

                <div className="space-y-6 relative">
                  {t.highlights.serviceSteps.map((step, index) => (
                    <div key={index} className="relative flex flex-col md:grid md:grid-cols-[1fr_2.75rem_1fr] md:items-center md:gap-4">

                      {/* Left Side */}
                      <div className={`pl-16 md:pl-0 ${index % 2 === 0 ? 'md:order-1 hidden md:block' : 'md:order-1'}`}>
                        {index % 2 !== 0 ? (
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative md:text-right">
                            <div className="absolute top-5 -left-10 w-6 h-0.5 bg-accent md:hidden"></div>
                            <h3 className="font-heading font-bold text-primary text-sm md:text-base mb-1.5 flex items-center gap-2 md:block">
                              <span className="inline-block md:hidden text-accent text-xs mr-1">{index + 1}.</span>
                              {step.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-xs md:text-sm">{step.desc}</p>
                          </div>
                        ) : <div />}
                      </div>

                      {/* Center Icon */}
                      <div className="absolute left-6 md:static md:order-2 flex items-center justify-center transform -translate-x-1/2 md:translate-x-0">
                        <div className="w-11 h-11 bg-primary rounded-full border-[3px] border-white shadow-md flex items-center justify-center z-10 relative mx-auto">
                          {serviceIcons[index % serviceIcons.length]}
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center text-[9px] font-bold text-white border-2 border-white">
                            {index + 1}
                          </div>
                        </div>
                      </div>

                      {/* Right Side */}
                      <div className={`pl-16 md:pl-0 ${index % 2 !== 0 ? 'md:order-3 hidden md:block' : 'md:order-3'}`}>
                        {index % 2 === 0 ? (
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative md:text-left">
                            <div className="absolute top-5 -left-10 w-6 h-0.5 bg-accent md:hidden"></div>
                            <h3 className="font-heading font-bold text-primary text-sm md:text-base mb-1.5 flex items-center gap-2 md:block">
                              <span className="inline-block md:hidden text-accent text-xs mr-1">{index + 1}.</span>
                              {step.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-xs md:text-sm">{step.desc}</p>
                          </div>
                        ) : <div />}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Final Arrow */}
                <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 bottom-0 translate-y-full pt-4">
                  <ArrowDown className="text-gray-300 animate-bounce" />
                </div>
              </div>

              {/* Call to Action Outro */}
              <div className="mt-16 bg-accent/5 border border-accent/20 rounded-2xl p-6 md:p-8 text-center">
                <h3 className="font-heading font-bold text-xl text-primary mb-3">{t.highlights.serviceCTA}</h3>
                <p className="text-gray-600 text-sm md:text-base mb-6 max-w-2xl mx-auto">
                  {t.highlights.serviceCTADesc}
                </p>
                <button
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-primary text-white px-8 py-4 font-bold uppercase tracking-[0.2em] hover:bg-accent transition-colors shadow-lg"
                >
                  {t.highlights.serviceBtn}
                </button>
              </div>

            </div>
          ) : type === 'factory' ? (

            /* FACTORY CONTENT */
            <div className="animate-in fade-in duration-500 space-y-14">

              {/* Section 1: Manufacturing Excellence */}
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-xl md:text-2xl font-bold text-primary mb-4">{t.highlights.factoryIntroTitle}</h2>
                  <p className="text-gray-600 text-sm md:text-base max-w-4xl mx-auto leading-relaxed">
                    {t.highlights.factoryIntroDesc}
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                  {t.highlights.manufacturingPoints.map((point, idx) => (
                    <div key={idx} className="bg-gray-50 p-5 rounded-xl border border-gray-100 hover:border-accent/30 hover:shadow-lg transition-all group flex flex-col items-start text-left w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)]">
                      <div className="mb-3 p-2.5 bg-white rounded-lg inline-block shadow-sm group-hover:scale-110 transition-transform">
                        {manufacturingIcons[idx % manufacturingIcons.length]}
                      </div>
                      <h3 className="font-heading font-bold text-sm md:text-base text-primary mb-2">{point.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-xs md:text-sm">
                        {point.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Workplace Gallery */}
              <div>
                <div className="text-center mb-6">
                  <span className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-1 block">{t.highlights.gallerySub}</span>
                  <h2 className="text-xl md:text-2xl font-bold text-primary mb-3">{t.highlights.galleryTitle}</h2>
                  <p className="text-gray-600 text-sm max-w-2xl mx-auto">
                    {t.highlights.galleryDesc}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {factoryImages.map((img, index) => (
                    <div
                      key={index}
                      onClick={() => setLightboxIndex(index)}
                      className="group cursor-pointer relative aspect-square overflow-hidden rounded-lg bg-gray-100 shadow-sm"
                    >
                      <img
                        src={img}
                        alt={`${t.highlights.imageLabel} ${index + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://placehold.co/800x800/EAEAEA/999999?text=Image+${index + 25}`;
                        }}
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Maximize2 className="text-white drop-shadow-md transform scale-90 group-hover:scale-100 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Sustainability */}
              <div className="bg-[#F9F9F9] -mx-4 md:-mx-10 px-5 md:px-8 py-10 rounded-2xl">
                <div className="max-w-none mx-auto">
                  <div className="text-center mb-8">
                    <span className="text-accent font-bold text-xs uppercase tracking-[0.3em] mb-2 block">{t.highlights.susValues}</span>
                    <h2 className="text-xl md:text-2xl font-bold text-primary mb-4">{t.highlights.susTitle}</h2>
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-4xl mx-auto">
                      {t.highlights.susIntro}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sustainabilityPoints.map((point, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-4 items-start">
                        <div className="shrink-0 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                          {point.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-primary text-sm md:text-base mb-1.5">{point.title}</h4>
                          <p className="text-gray-600 text-xs md:text-sm leading-relaxed">{point.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Lightbox Modal */}
              <ImageModal
                isOpen={lightboxIndex !== null}
                imageUrl={lightboxIndex !== null ? factoryImages[lightboxIndex] : ''}
                altText="Workplace Gallery"
                onClose={() => setLightboxIndex(null)}
                showNavigation={true}
                enableZoom={false} // Disabled zoom as requested
                onNext={() => setLightboxIndex(prev => prev === null ? null : (prev + 1) % factoryImages.length)}
                onPrev={() => setLightboxIndex(prev => prev === null ? null : (prev - 1 + factoryImages.length) % factoryImages.length)}
              />

            </div>
          ) : (

            /* EXPORT QUALITY CONTENT */
            <div className="animate-in fade-in duration-500">
              {/* Intro */}
              <div className="text-center mb-16 max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">{t.highlights.detailHeader}</h2>
                <p className="text-gray-600 text-lg leading-relaxed">{t.highlights.detailP1}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-primary mb-3">{t.highlights.subHeader1}</h4>
                  <p className="text-sm text-gray-500">{t.highlights.subP1}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-primary mb-3">{t.highlights.subHeader2}</h4>
                  <p className="text-sm text-gray-500">{t.highlights.subP2}</p>
                </div>
              </div>

              <blockquote className="border-l-4 border-accent pl-6 py-4 bg-gray-50 rounded-r-lg italic text-primary font-medium text-lg md:text-xl mb-16">
                "{t.highlights.quote}"
              </blockquote>

              {/* Certifications & Compliance Section */}
              <div className="bg-gray-50 -mx-4 md:-mx-10 px-6 md:px-12 py-16 rounded-[2rem]">
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
                      onClick={() => openCertLightbox(
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
                          onClick={() => openCertLightbox(
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
                      onClick={() => openCertLightbox(
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
                          onClick={() => openCertLightbox(
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
              </div>
            </div>
          )}

          {/* Navigation Footer */}
          <div className="mt-12 md:mt-16 pt-8 border-t border-gray-100 flex justify-center md:justify-start">
            <button
              onClick={() => router.push('/')}
              className="group w-full md:w-auto flex items-center justify-center gap-2 border border-primary px-8 py-3.5 md:py-2.5 rounded-md text-accent font-bold hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95 touch-manipulation"
            >
              <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
              {t.highlights.back}
            </button>
          </div>
        </div>
      </Section>

      {/* Certificate Lightbox Modal */}
      {certLightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8"
          onClick={closeCertLightbox}
        >
          <button
            onClick={closeCertLightbox}
            className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X size={24} />
          </button>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2">
            <button
              onClick={(e) => { e.stopPropagation(); setCertZoom(!certZoom); }}
              className="p-1.5 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              {certZoom ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
            </button>
            <div className="w-px h-5 bg-white/30" />
            <a
              href={certLightbox.pdf}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <Download size={18} />
            </a>
            <a
              href={certLightbox.pdf}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <ExternalLink size={18} />
            </a>
          </div>

          <div
            className={`relative bg-white rounded-xl shadow-2xl overflow-auto transition-all duration-300 ${
              certZoom ? 'max-w-[95vw] max-h-[90vh] w-auto' : 'max-w-3xl max-h-[85vh] w-full'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`relative ${certZoom ? 'w-[1200px]' : 'w-full'}`}>
              <Image
                src={certLightbox.src}
                alt={certLightbox.alt}
                width={1200}
                height={1600}
                className="w-full h-auto"
                priority
              />
            </div>
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 px-6 py-3 flex items-center justify-between">
              <h3 className="font-heading font-bold text-primary text-sm md:text-base truncate">
                {certLightbox.alt}
              </h3>
              <a
                href={certLightbox.pdf}
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