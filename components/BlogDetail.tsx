'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { BlogPost, getLocalizedString, getLocalizedRichContent } from '@/lib/types';
import { Section } from './ui/Section';
import { generateHTML } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import DOMPurify from 'isomorphic-dompurify';
import { ArrowLeft, Calendar, User, Share2, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface BlogDetailProps {
  blog: BlogPost;
}

export const BlogDetail: React.FC<BlogDetailProps> = ({ blog }) => {
  const [copied, setCopied] = useState(false);
  const { language } = useLanguage();

  const title = getLocalizedString(blog.title, language);
  const shortDescription = getLocalizedString(blog.shortDescription, language);
  const localizedContent = getLocalizedRichContent(blog.content, language);

  // Convert Tiptap JSON content to HTML for display
  const htmlContent = useMemo(() => {
    if (!localizedContent) return '';

    try {
      const rawHtml = generateHTML(localizedContent, [
        StarterKit.configure({
          link: {
            HTMLAttributes: {
              class: 'text-accent underline hover:text-primary transition-colors cursor-pointer',
              target: '_blank',
              rel: 'noopener noreferrer',
            },
          },
        }),
        Image.configure({
          HTMLAttributes: { class: 'max-w-full rounded-xl my-8 mx-auto shadow-sm' },
        }),
      ]);
      return DOMPurify.sanitize(rawHtml, {
        ADD_TAGS: ['img'],
        ADD_ATTR: ['class', 'src', 'alt', 'href', 'target', 'rel'],
      });
    } catch (e) {
      console.error('Error rendering blog content:', e);
      return '<p>Error loading content.</p>';
    }
  }, [localizedContent]);

  const { t } = useLanguage();

  // Format date
  const publishDate = blog.publishDate 
    ? new Date(blog.publishDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Recently';

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text: shortDescription,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article className="bg-white min-h-screen pb-24">
      {/* Article Header (Hero) */}
      <div className="relative bg-primary pt-32 pb-24 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        {/* Background Pattern/Gradient */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none"></div>
        
        <div className="relative max-w-4xl mx-auto z-10">
          {/* Back button */}
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors mb-8 group"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            {t.blog.back}
          </Link>

          {/* Meta info */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-accent mb-6 uppercase tracking-wider">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm">
              <Calendar size={16} />
              {publishDate}
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm">
              <User size={16} />
              {blog.author}
            </div>
          </div>

          <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl text-white leading-[1.1] mb-8">
            {title}
          </h1>

          {shortDescription && (
            <p className="text-xl text-white/80 max-w-3xl mx-auto font-light leading-relaxed">
              {shortDescription}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        {/* Cover Image */}
        {blog.coverImage && (
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white mb-16 border-4 border-white aspect-[21/9]">
            <NextImage
              src={blog.coverImage}
              alt={title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        )}

        {/* Action Bar (Share) */}
        <div className="flex justify-end mb-12 border-b border-gray-100 pb-6">
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-accent transition-colors bg-gray-50 hover:bg-accent/5 px-4 py-2 rounded-full border border-gray-200"
          >
            {copied ? <Check size={16} className="text-green-600" /> : <Share2 size={16} />}
            {copied ? 'Link Copied!' : t.blog.share}
          </button>
        </div>

        {/* Rich Text Content */}
        <div 
          className="prose prose-lg md:prose-xl max-w-none 
                     prose-headings:font-heading prose-headings:font-bold prose-headings:text-primary
                     prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                     prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                     prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-6
                     prose-a:text-accent prose-a:no-underline hover:prose-a:text-primary prose-a:font-medium
                     prose-img:rounded-xl prose-img:shadow-md prose-img:my-10
                     prose-ul:text-gray-600 prose-ol:text-gray-600
                     prose-li:my-2
                     prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:text-lg prose-blockquote:font-medium prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:rounded-r-lg
                     prose-strong:text-gray-900"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Footer Area */}
        <div className="mt-24 pt-10 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-gray-50 rounded-2xl p-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-heading font-bold text-xl shadow-inner">
                {blog.author.charAt(0)}
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">{t.blog.author}</p>
                <p className="text-xl font-bold font-heading text-gray-900">{blog.author}</p>
              </div>
            </div>
            
            <Link 
              href="/blog" 
              className="w-full sm:w-auto text-center bg-white border border-gray-200 text-gray-700 hover:text-accent hover:border-accent px-6 py-3 rounded-xl font-medium transition-all shadow-sm hover:shadow"
            >
              {t.blog.viewAll}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

