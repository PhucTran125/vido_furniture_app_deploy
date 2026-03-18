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
  ZoomOut,
  ArrowRight
} from 'lucide-react';
import Image from 'next/image';
import { PageType } from '@/lib/types';
import { ContactModal } from './ContactModal';

interface HighlightDetailProps {
  type: PageType;

}

export const HighlightDetail: React.FC<HighlightDetailProps> = ({ type }) => {
  const { t } = useLanguage();
  const router = useRouter();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [certLightbox, setCertLightbox] = useState<{ src: string; alt: string; pdf: string } | null>(null);
  const [certZoom, setCertZoom] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [materialLightbox, setMaterialLightbox] = useState<{ images: string[]; index: number; title: string } | null>(null);
  const [containerLightboxIndex, setContainerLightboxIndex] = useState<number | null>(null);

  const openMaterialLightbox = useCallback((images: string[], index: number, title: string) => {
    setMaterialLightbox({ images, index, title });
    document.body.style.overflow = 'hidden';
  }, []);

  const closeMaterialLightbox = useCallback(() => {
    setMaterialLightbox(null);
    document.body.style.overflow = '';
  }, []);

  const materialCollections = [
    {
      key: 'fabric',
      name: t.highlights.materialFabricName,
      desc: t.highlights.materialFabricDesc,
      coverImage: 'https://hrwtfycipxfzcsrmpetr.supabase.co/storage/v1/object/public/product-images/site-assets/materials/fabric/premium-velvet-fabric-vido-furniture.webp.jpg',
      images: [
        'https://hrwtfycipxfzcsrmpetr.supabase.co/storage/v1/object/public/product-images/site-assets/materials/fabric/premium-velvet-fabric-vido-furniture.webp.jpg',
        'https://hrwtfycipxfzcsrmpetr.supabase.co/storage/v1/object/public/product-images/site-assets/materials/fabric/premium-boucle-fabric-vido-furniture.webp.jpg',
        'https://hrwtfycipxfzcsrmpetr.supabase.co/storage/v1/object/public/product-images/site-assets/materials/fabric/premium-canvas-fabric-vido-furniture.webp.jpg',
        'https://hrwtfycipxfzcsrmpetr.supabase.co/storage/v1/object/public/product-images/site-assets/materials/fabric/premium-chenille-fabric-vido-furniture.webp.jpg',
        'https://hrwtfycipxfzcsrmpetr.supabase.co/storage/v1/object/public/product-images/site-assets/materials/fabric/premium-corduroy-fabric-vido-furniture.webp.jpg',
        'https://hrwtfycipxfzcsrmpetr.supabase.co/storage/v1/object/public/product-images/site-assets/materials/fabric/premium-linen-fabric-vido-furniture.webp.jpg',
      ],
    },
    {
      key: 'wood',
      name: t.highlights.materialWoodName,
      desc: t.highlights.materialWoodDesc,
      coverImage: 'https://hrwtfycipxfzcsrmpetr.supabase.co/storage/v1/object/public/product-images/site-assets/materials/wood/sustainable-natural-wood-fsc-certified-vido-vietnam-furniture.jpg',
      images: [
        'https://hrwtfycipxfzcsrmpetr.supabase.co/storage/v1/object/public/product-images/site-assets/materials/wood/sustainable-natural-wood-fsc-certified-vido-vietnam-furniture.jpg',
        'https://hrwtfycipxfzcsrmpetr.supabase.co/storage/v1/object/public/product-images/site-assets/materials/wood/carb-p2-compliant-mdf-board-vido-furniture.jpg',
        'https://hrwtfycipxfzcsrmpetr.supabase.co/storage/v1/object/public/product-images/site-assets/materials/wood/high-durability-plywood-core-furniture-material.jpg',
      ],
    },
    {
      key: 'foam',
      name: t.highlights.materialFoamName,
      desc: t.highlights.materialFoamDesc,
      coverImage: 'https://hrwtfycipxfzcsrmpetr.supabase.co/storage/v1/object/public/product-images/site-assets/materials/foam/z7619706794311_8b05f54b2b24e19ee0e5a65d77e87279.jpg',
      images: [
        'https://hrwtfycipxfzcsrmpetr.supabase.co/storage/v1/object/public/product-images/site-assets/materials/foam/z7619706794311_8b05f54b2b24e19ee0e5a65d77e87279.jpg',
        'https://hrwtfycipxfzcsrmpetr.supabase.co/storage/v1/object/public/product-images/site-assets/materials/foam/z7619718467917_d4bce6bc4c7f6816051c3e2178cff975.jpg',
        'https://hrwtfycipxfzcsrmpetr.supabase.co/storage/v1/object/public/product-images/site-assets/materials/foam/z7619743642329_eaaacd3f904c65440622e1cbd8dd87fb.jpg',
      ],
    },
  ];

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

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!materialLightbox) return;
      if (e.key === 'Escape') closeMaterialLightbox();
      if (e.key === 'ArrowRight') setMaterialLightbox(prev => prev ? { ...prev, index: (prev.index + 1) % prev.images.length } : null);
      if (e.key === 'ArrowLeft') setMaterialLightbox(prev => prev ? { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length } : null);
    };
    if (materialLightbox) {
      window.addEventListener('keydown', handleKey);
      return () => window.removeEventListener('keydown', handleKey);
    }
  }, [materialLightbox, closeMaterialLightbox]);

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

  const containerImages = [
    'https://hrwtfycipxfzcsrmpetr.supabase.co/storage/v1/object/public/product-images/site-assets/export-quality/professional-container-loading-at-vido-furniture-factory-in-vietnam,-optimizing-space-for-40ft-hc-containers..jpg',
    'https://hrwtfycipxfzcsrmpetr.supabase.co/storage/v1/object/public/product-images/site-assets/export-quality/professional-container-loading-at-vido-furniture-protection-packaging-sea-freight.jpg',
    'https://hrwtfycipxfzcsrmpetr.supabase.co/storage/v1/object/public/product-images/site-assets/export-quality/export-standard-5-ply-carton-packaging-vido-vietnam.jpg',
    'https://hrwtfycipxfzcsrmpetr.supabase.co/storage/v1/object/public/product-images/site-assets/export-quality/maximum-cbm-loading-efficiency-for-export.jpg',
    'https://hrwtfycipxfzcsrmpetr.supabase.co/storage/v1/object/public/product-images/site-assets/export-quality/professional-furniture-loading-staff-vido-factory-vido-vietam.jpg',
    'https://hrwtfycipxfzcsrmpetr.supabase.co/storage/v1/object/public/product-images/site-assets/export-quality/secure-container-sealing-for-international-shipping.jpg',
  ];

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
                  onClick={() => setIsContactOpen(true)}
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
                      <Image
                        src={img}
                        alt={`${t.highlights.imageLabel} ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                        loading="lazy"
                        quality={75}
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Maximize2 className="text-white drop-shadow-md transform scale-90 group-hover:scale-100 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Certifications & Social Compliance */}
              <div className="bg-gray-50 -mx-4 md:-mx-10 px-6 md:px-12 py-16 rounded-[2rem]">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 mb-3">
                    <ShieldCheck size={20} className="text-accent" />
                    <span className="text-accent font-bold text-[10px] uppercase tracking-[0.3em]">
                      {t.about.certsTitle}
                    </span>
                  </div>
                  <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary">
                    {t.highlights.factoryCertsTitle}
                  </h2>
                  <p className="text-gray-500 text-sm md:text-base mt-3 max-w-3xl mx-auto leading-relaxed">
                    {t.highlights.factoryCertsDesc}
                  </p>
                  <div className="w-12 h-1 bg-accent mx-auto mt-4 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">

                  {/* FSC Certificate Card */}
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden group">
                    <div className="bg-green-50 px-6 py-4 border-b border-green-100 flex items-center gap-3">
                      <div className="p-2.5 bg-green-600 rounded-lg text-white">
                        <TreePine size={22} />
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-primary text-sm">
                          {t.about.certFscTitle}
                        </h3>
                        <p className="text-xs text-gray-500">{t.about.certFscIssuer}</p>
                      </div>
                    </div>
                    <div
                      className="relative cursor-pointer group/preview mx-4 mt-4 rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all"
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
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover/preview:bg-black/40 transition-all flex items-center justify-center">
                        <div className="opacity-0 group-hover/preview:opacity-100 transition-all transform scale-90 group-hover/preview:scale-100 bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-lg">
                          <Eye size={24} className="text-primary" />
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-4 space-y-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        {t.about.certStatus}
                      </span>
                      <p className="text-xs text-gray-600">{t.about.certFscScope}</p>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => openCertLightbox(
                            '/certifications/fsc-certificate-preview-1.png',
                            t.about.certFscTitle,
                            '/certifications/fsc-certificate-summertree.pdf'
                          )}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          <Eye size={14} />
                          {t.about.certView}
                        </button>
                        <a
                          href="/certifications/fsc-certificate-summertree.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Download size={14} />
                          {t.about.certDownload}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* SGS Certificate Card */}
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden group">
                    <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex items-center gap-3">
                      <div className="p-2.5 bg-orange-500 rounded-lg text-white">
                        <FlameKindling size={22} />
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-primary text-sm">
                          {t.about.certSgsTitle}
                        </h3>
                        <p className="text-xs text-gray-500">{t.about.certSgsIssuer}</p>
                      </div>
                    </div>
                    <div
                      className="relative cursor-pointer group/preview mx-4 mt-4 rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all"
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
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover/preview:bg-black/40 transition-all flex items-center justify-center">
                        <div className="opacity-0 group-hover/preview:opacity-100 transition-all transform scale-90 group-hover/preview:scale-100 bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-lg">
                          <Eye size={24} className="text-primary" />
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-4 space-y-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        {t.about.certStatus}
                      </span>
                      <p className="text-xs text-gray-600">{t.about.certSgsScope}</p>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => openCertLightbox(
                            '/certifications/sgs-report-preview-1.png',
                            t.about.certSgsTitle,
                            '/certifications/sgs-test-report-tb117.pdf'
                          )}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          <Eye size={14} />
                          {t.about.certView}
                        </button>
                        <a
                          href="/certifications/sgs-test-report-tb117.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Download size={14} />
                          {t.about.certDownload}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* BSCI Certificate Card */}
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden group">
                    <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex items-center gap-3">
                      <div className="p-2.5 bg-blue-600 rounded-lg text-white">
                        <ShieldCheck size={22} />
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-primary text-sm">
                          {t.about.certBsciTitle}
                        </h3>
                        <p className="text-xs text-gray-500">{t.about.certBsciIssuer}</p>
                      </div>
                    </div>
                    <div
                      className="relative cursor-pointer group/preview mx-4 mt-4 rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all"
                      onClick={() => openCertLightbox(
                        '/certifications/bsci-report-preview-1.png',
                        t.about.certBsciTitle,
                        '/certifications/bsci-audit-report.pdf'
                      )}
                    >
                      <div className="relative aspect-[4/3] bg-gray-50">
                        <Image
                          src="/certifications/bsci-report-preview-1.png"
                          alt={t.about.certBsciTitle}
                          fill
                          className="object-contain object-top"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover/preview:bg-black/40 transition-all flex items-center justify-center">
                        <div className="opacity-0 group-hover/preview:opacity-100 transition-all transform scale-90 group-hover/preview:scale-100 bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-lg">
                          <Eye size={24} className="text-primary" />
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-4 space-y-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        {t.about.certStatus}
                      </span>
                      <p className="text-xs text-gray-600">{t.about.certBsciScope}</p>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => openCertLightbox(
                            '/certifications/bsci-report-preview-1.png',
                            t.about.certBsciTitle,
                            '/certifications/bsci-audit-report.pdf'
                          )}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          <Eye size={14} />
                          {t.about.certView}
                        </button>
                        <a
                          href="/certifications/bsci-audit-report.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Download size={14} />
                          {t.about.certDownload}
                        </a>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Section 4: Sustainability */}
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

              {/* Premium & Compliant Materials Section */}
              <div className="bg-gray-50 -mx-4 md:-mx-10 px-6 md:px-12 py-16 rounded-[2rem]">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 mb-3">
                    <ShieldCheck size={20} className="text-accent" />
                    <span className="text-accent font-bold text-[10px] uppercase tracking-[0.3em]">
                      {t.highlights.materialsTitle}
                    </span>
                  </div>
                  <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary">
                    {t.highlights.materialsTitle}
                  </h2>
                  <p className="text-gray-500 text-sm md:text-base mt-3 max-w-2xl mx-auto">
                    {t.highlights.materialsSubtitle}
                  </p>
                  <div className="w-12 h-1 bg-accent mx-auto mt-4 rounded-full"></div>
                </div>

                {/* Material Collections Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                  {materialCollections.map((material) => (
                    <div
                      key={material.key}
                      className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
                      onClick={() => openMaterialLightbox(material.images, 0, material.name)}
                    >
                      {/* Cover Image */}
                      <Image
                        src={material.coverImage}
                        alt={material.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                        loading="lazy"
                        quality={75}
                      />

                      {/* Default overlay - material name + arrow */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:opacity-0 transition-opacity duration-500 flex flex-col justify-end p-6">
                        <h3 className="font-heading font-bold text-white text-xl md:text-2xl mb-2">{material.name}</h3>
                        <div className="w-10 h-10 border-2 border-white/80 rounded-md flex items-center justify-center">
                          <ArrowRight size={18} className="text-white" />
                        </div>
                      </div>

                      {/* Hover overlay - description revealed */}
                      <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center items-center p-6 text-center">
                        <h3 className="font-heading font-bold text-white text-xl mb-3">{material.name}</h3>
                        <p className="text-white/85 text-sm leading-relaxed mb-4">{material.desc}</p>
                        <span className="inline-flex items-center gap-2 text-accent text-sm font-semibold">
                          {t.highlights.materialViewGallery}
                          <ArrowRight size={16} />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Certifications Sub-section */}
                <div className="text-center mb-8">
                  <h3 className="font-heading font-bold text-xl md:text-2xl text-primary">
                    {t.about.certsTitle}
                  </h3>
                  <p className="text-gray-500 text-sm mt-2 max-w-2xl mx-auto">
                    {t.about.certsSubtitle}
                  </p>
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

              {/* Container Loading Optimization Section */}
              <div className="mt-16">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 mb-3">
                    <ShieldCheck size={20} className="text-accent" />
                    <span className="text-accent font-bold text-[10px] uppercase tracking-[0.3em]">
                      {t.highlights.containerTitle}
                    </span>
                  </div>
                  <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary">
                    {t.highlights.containerTitle}
                  </h2>
                  <p className="text-gray-500 text-sm md:text-base mt-3 max-w-2xl mx-auto">
                    {t.highlights.containerDesc}
                  </p>
                  <div className="w-12 h-1 bg-accent mx-auto mt-4 rounded-full"></div>
                </div>

                {/* Key Points */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  {[
                    { title: t.highlights.containerPlanning, desc: t.highlights.containerPlanningDesc },
                    { title: t.highlights.containerPackaging, desc: t.highlights.containerPackagingDesc },
                    { title: t.highlights.containerEfficiency, desc: t.highlights.containerEfficiencyDesc },
                  ].map((point, idx) => (
                    <div key={idx} className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:border-accent/30 hover:shadow-lg transition-all">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                        <span className="text-accent font-bold text-lg">{idx + 1}</span>
                      </div>
                      <h4 className="font-bold text-primary mb-2">{point.title}</h4>
                      <p className="text-sm text-gray-500 leading-relaxed">{point.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Image Gallery - Masonry-style layout */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { src: 'https://hrwtfycipxfzcsrmpetr.supabase.co/storage/v1/object/public/product-images/site-assets/export-quality/professional-container-loading-at-vido-furniture-factory-in-vietnam,-optimizing-space-for-40ft-hc-containers..jpg', alt: 'Container loading at VIDO factory' },
                    { src: 'https://hrwtfycipxfzcsrmpetr.supabase.co/storage/v1/object/public/product-images/site-assets/export-quality/professional-container-loading-at-vido-furniture-protection-packaging-sea-freight.jpg', alt: 'Protection packaging for sea freight' },
                    { src: 'https://hrwtfycipxfzcsrmpetr.supabase.co/storage/v1/object/public/product-images/site-assets/export-quality/export-standard-5-ply-carton-packaging-vido-vietnam.jpg', alt: 'Export standard 5-ply carton packaging' },
                    { src: 'https://hrwtfycipxfzcsrmpetr.supabase.co/storage/v1/object/public/product-images/site-assets/export-quality/maximum-cbm-loading-efficiency-for-export.jpg', alt: 'Maximum CBM loading efficiency' },
                    { src: 'https://hrwtfycipxfzcsrmpetr.supabase.co/storage/v1/object/public/product-images/site-assets/export-quality/professional-furniture-loading-staff-vido-factory-vido-vietam.jpg', alt: 'Professional loading staff at VIDO factory' },
                    { src: 'https://hrwtfycipxfzcsrmpetr.supabase.co/storage/v1/object/public/product-images/site-assets/export-quality/secure-container-sealing-for-international-shipping.jpg', alt: 'Secure container sealing for shipping' },
                  ].map((img, index) => (
                    <div
                      key={index}
                      onClick={() => setContainerLightboxIndex(index)}
                      className={`group cursor-pointer relative overflow-hidden rounded-lg bg-gray-100 shadow-sm ${
                        index === 0 || index === 5 ? 'md:col-span-2 aspect-[2/1]' : 'aspect-square'
                      }`}
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes={index === 0 || index === 5 ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 50vw, 33vw'}
                        className="object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                        loading="lazy"
                        quality={75}
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Maximize2 className="text-white drop-shadow-md transform scale-90 group-hover:scale-100 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Container Loading Lightbox */}
              <ImageModal
                isOpen={containerLightboxIndex !== null}
                imageUrl={containerLightboxIndex !== null ? containerImages[containerLightboxIndex] : ''}
                altText="Container Loading"
                onClose={() => setContainerLightboxIndex(null)}
                showNavigation={true}
                enableZoom={false}
                onNext={() => setContainerLightboxIndex(prev => prev === null ? null : (prev + 1) % containerImages.length)}
                onPrev={() => setContainerLightboxIndex(prev => prev === null ? null : (prev - 1 + containerImages.length) % containerImages.length)}
              />
            </div>
          )}

          {/* Navigation Footer */}
          <div className="mt-12 md:mt-16 pt-8 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 sm:justify-between">
              {/* Back to Overview */}
              <button
                onClick={() => router.push('/')}
                className="group w-full sm:w-auto flex items-center justify-center gap-2 border border-primary px-6 py-3 rounded-md text-accent font-bold hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95 touch-manipulation shrink-0"
              >
                <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                {t.highlights.back}
              </button>

              {/* Explore Other Highlights */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-widest whitespace-nowrap hidden sm:block">
                  {t.highlights.exploreMore}
                </span>
                <div className="flex gap-2 w-full sm:w-auto">
                  {type !== 'export-quality' && (
                    <button
                      onClick={() => router.push('/highlights/export-quality')}
                      className="group flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-50 hover:bg-primary border border-gray-200 hover:border-primary px-4 py-2.5 rounded-md text-primary hover:text-white text-sm font-semibold transition-all shadow-sm active:scale-95 touch-manipulation"
                    >
                      <Award size={15} className="shrink-0" />
                      <span className="truncate">{t.highlights.goToQuality}</span>
                      <ArrowRight size={13} className="shrink-0 opacity-0 group-hover:opacity-100 transition-all -ml-1 group-hover:ml-0" />
                    </button>
                  )}
                  {type !== 'customer-service' && (
                    <button
                      onClick={() => router.push('/highlights/customer-service')}
                      className="group flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-50 hover:bg-primary border border-gray-200 hover:border-primary px-4 py-2.5 rounded-md text-primary hover:text-white text-sm font-semibold transition-all shadow-sm active:scale-95 touch-manipulation"
                    >
                      <Headset size={15} className="shrink-0" />
                      <span className="truncate">{t.highlights.goToService}</span>
                      <ArrowRight size={13} className="shrink-0 opacity-0 group-hover:opacity-100 transition-all -ml-1 group-hover:ml-0" />
                    </button>
                  )}
                  {type !== 'factory' && (
                    <button
                      onClick={() => router.push('/highlights/factory')}
                      className="group flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-50 hover:bg-primary border border-gray-200 hover:border-primary px-4 py-2.5 rounded-md text-primary hover:text-white text-sm font-semibold transition-all shadow-sm active:scale-95 touch-manipulation"
                    >
                      <Factory size={15} className="shrink-0" />
                      <span className="truncate">{t.highlights.goToFactory}</span>
                      <ArrowRight size={13} className="shrink-0 opacity-0 group-hover:opacity-100 transition-all -ml-1 group-hover:ml-0" />
                    </button>
                  )}
                </div>
              </div>
            </div>
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

      {/* Material Gallery Lightbox */}
      {materialLightbox && (
        <ImageModal
          isOpen={true}
          imageUrl={materialLightbox.images[materialLightbox.index]}
          altText={`${materialLightbox.title} ${materialLightbox.index + 1}`}
          onClose={closeMaterialLightbox}
          showNavigation={materialLightbox.images.length > 1}
          enableZoom={false}
          onNext={() => setMaterialLightbox(prev => prev ? { ...prev, index: (prev.index + 1) % prev.images.length } : null)}
          onPrev={() => setMaterialLightbox(prev => prev ? { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length } : null)}
        />
      )}

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
};