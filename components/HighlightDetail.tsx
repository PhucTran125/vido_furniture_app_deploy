'use client';

import React, { useEffect, useState } from 'react';
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
  Users
} from 'lucide-react';
import { PageType } from '@/lib/types';

interface HighlightDetailProps {
  type: PageType;

}

export const HighlightDetail: React.FC<HighlightDetailProps> = ({ type }) => {
  const { t } = useLanguage();
  const router = useRouter();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

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
    <BookOpen className="w-6 h-6 text-white" />,
    <CheckSquare className="w-6 h-6 text-white" />,
    <FileText className="w-6 h-6 text-white" />,
    <CreditCard className="w-6 h-6 text-white" />,
    <Factory className="w-6 h-6 text-white" />,
    <ClipboardCheck className="w-6 h-6 text-white" />,
    <FileCheck className="w-6 h-6 text-white" />
  ];

  // Increased icon sizes for Manufacturing section
  const manufacturingIcons = [
    <Scissors className="w-12 h-12 text-accent" />,
    <PenTool className="w-12 h-12 text-accent" />,
    <Hammer className="w-12 h-12 text-accent" />,
    <ShieldCheck className="w-12 h-12 text-accent" />,
    <Cpu className="w-12 h-12 text-accent" />
  ];

  // Increased icon sizes for Sustainability section
  const sustainabilityPoints = [
    {
      title: t.highlights.susP1Title,
      description: t.highlights.susP1Desc,
      icon: <Leaf className="w-10 h-10 text-green-600" />
    },
    {
      title: t.highlights.susP2Title,
      description: t.highlights.susP2Desc,
      icon: <Zap className="w-10 h-10 text-yellow-500" />
    },
    {
      title: t.highlights.susP3Title,
      description: t.highlights.susP3Desc,
      icon: <Recycle className="w-10 h-10 text-blue-500" />
    },
    {
      title: t.highlights.susP4Title,
      description: t.highlights.susP4Desc,
      icon: <Users className="w-10 h-10 text-indigo-500" />
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
              <div className="text-center mb-16 max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">{t.highlights.serviceIntroTitle}</h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {t.highlights.serviceIntroDesc}
                </p>
              </div>

              {/* Step-by-Step Visualization */}
              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-8 md:left-1/2 top-4 bottom-4 w-0.5 bg-gray-200 transform md:-translate-x-1/2"></div>

                <div className="space-y-12 relative">
                  {t.highlights.serviceSteps.map((step, index) => (
                    <div key={index} className={`flex flex-col md:flex-row gap-8 items-start md:items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>

                      {/* Text Content Side */}
                      <div className="pl-20 md:pl-0 md:w-1/2 md:px-10">
                        <div className={`bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                          {/* Mobile Connector Line (Horizontal) */}
                          <div className="absolute top-8 -left-12 w-8 h-0.5 bg-accent md:hidden"></div>

                          <h3 className="font-heading font-bold text-primary text-xl mb-3 flex items-center gap-2 md:block">
                            <span className="inline-block md:hidden text-accent text-sm mr-2">{index + 1}.</span>
                            {step.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                            {step.desc}
                          </p>
                        </div>
                      </div>

                      {/* Center Icon */}
                      <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                        <div className="w-16 h-16 bg-primary rounded-full border-4 border-white shadow-lg flex items-center justify-center z-10 relative">
                          {serviceIcons[index % serviceIcons.length]}
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white">
                            {index + 1}
                          </div>
                        </div>
                      </div>

                      {/* Empty side for layout balance on desktop */}
                      <div className="hidden md:block md:w-1/2"></div>
                    </div>
                  ))}
                </div>

                {/* Final Arrow */}
                <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 bottom-0 translate-y-full pt-4">
                  <ArrowDown className="text-gray-300 animate-bounce" />
                </div>
              </div>

              {/* Call to Action Outro */}
              <div className="mt-24 bg-accent/5 border border-accent/20 rounded-2xl p-8 md:p-12 text-center">
                <h3 className="font-heading font-bold text-2xl text-primary mb-4">{t.highlights.serviceCTA}</h3>
                <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
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
            <div className="animate-in fade-in duration-500 space-y-24">

              {/* Section 1: Manufacturing Excellence (SCALED UP) */}
              <div>
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold text-primary mb-8">{t.highlights.factoryIntroTitle}</h2>
                  <p className="text-gray-600 text-xl max-w-4xl mx-auto leading-relaxed">
                    {t.highlights.factoryIntroDesc}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {t.highlights.manufacturingPoints.map((point, idx) => (
                    <div key={idx} className="bg-gray-50 p-10 rounded-2xl border border-gray-100 hover:border-accent/30 hover:shadow-xl transition-all group flex flex-col items-start text-left">
                      <div className="mb-6 p-4 bg-white rounded-xl inline-block shadow-sm group-hover:scale-110 transition-transform">
                        {manufacturingIcons[idx % manufacturingIcons.length]}
                      </div>
                      <h3 className="font-heading font-bold text-2xl text-primary mb-4">{point.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {point.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Workplace Gallery */}
              <div>
                <div className="text-center mb-12">
                  <span className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mb-2 block">{t.highlights.gallerySub}</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">{t.highlights.galleryTitle}</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    {t.highlights.galleryDesc}
                  </p>
                </div>

                {/* Grid of Real Factory Images (25.jpg - 34.jpg) */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                          // Fallback for missing images
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

              {/* Section 3: Sustainability (SCALED UP) */}
              <div className="bg-[#F9F9F9] -mx-4 md:-mx-10 px-6 md:px-12 py-20 rounded-[3rem]">
                <div className="max-w-none mx-auto">
                  <div className="text-center mb-16">
                    <span className="text-accent font-black text-sm uppercase tracking-[0.3em] mb-4 block">{t.highlights.susValues}</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-primary mb-8">{t.highlights.susTitle}</h2>
                    <p className="text-gray-600 text-xl leading-relaxed max-w-4xl mx-auto">
                      {t.highlights.susIntro}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {sustainabilityPoints.map((point, idx) => (
                      <div key={idx} className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6 items-start">
                        <div className="shrink-0 p-4 bg-gray-50 rounded-xl border border-gray-100">
                          {point.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-primary text-2xl mb-3">{point.title}</h4>
                          <p className="text-gray-600 text-lg leading-relaxed">{point.description}</p>
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

            /* GENERIC CONTENT FOR OTHER PAGES */
            <div className="animate-in fade-in duration-500">
              <div className="flex items-center gap-4 mb-10 text-gray-400">
                <div className="shrink-0 scale-75 md:scale-100">{content.icon}</div>
                <div className="h-px flex-grow bg-gray-100"></div>
              </div>

              <div className="prose prose-sm md:prose-lg prose-gray max-w-none">
                <h2 className="text-xl md:text-2xl font-bold text-primary mb-6">{t.highlights.detailHeader}</h2>
                <p className="text-gray-600 leading-relaxed mb-8">
                  {t.highlights.detailP1}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h4 className="font-bold text-primary mb-3">{t.highlights.subHeader1}</h4>
                    <p className="text-sm text-gray-500">{t.highlights.subP1}</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h4 className="font-bold text-primary mb-3">{t.highlights.subHeader2}</h4>
                    <p className="text-sm text-gray-500">{t.highlights.subP2}</p>
                  </div>
                </div>

                <blockquote className="border-l-4 border-accent pl-6 py-4 bg-gray-50 rounded-r-lg italic text-primary font-medium text-lg md:text-xl mb-12">
                  "{t.highlights.quote}"
                </blockquote>
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
    </div>
  );
};