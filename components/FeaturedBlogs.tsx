'use client';

import React from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { Section } from './ui/Section';
import { BlogPost } from '@/lib/types';
import { ArrowRight, Calendar, User, BookOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FeaturedBlogsProps {
  blogs: BlogPost[];
}

export const FeaturedBlogs: React.FC<FeaturedBlogsProps> = ({ blogs }) => {
  const { t } = useLanguage();

  if (!blogs || blogs.length === 0) return null;

  return (
    <div className="bg-white">
      <Section className="!py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <span className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-[0.2em] mb-4">
                <BookOpen size={16} />
                {t.blog.featuredBadge}
              </span>
              <h2 className="font-heading font-bold text-4xl md:text-5xl text-gray-900 mb-4">
                {t.blog.featuredTitle}
              </h2>
              <p className="text-gray-600 text-lg">
                {t.blog.featuredDesc}
              </p>
            </div>
            <Link 
              href="/blog" 
              className="group flex flex-shrink-0 items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 hover:text-accent hover:border-accent px-6 py-3 rounded-xl font-medium transition-all shadow-sm hover:shadow"
            >
              {t.blog.viewAll}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Featured Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <Link 
                key={blog.id} 
                href={`/blog/${blog.slug}`}
                className={`group flex flex-col bg-white rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 h-full
                  ${index === 0 && blogs.length === 3 ? 'md:col-span-2 lg:col-span-1 md:flex-row lg:flex-col' : ''}
                `}
              >
                {/* Cover Image */}
                <div className={`relative overflow-hidden bg-gray-100 ${
                  index === 0 && blogs.length === 3 ? 'md:w-1/2 lg:w-full aspect-[16/10] md:aspect-auto lg:aspect-[16/10]' : 'aspect-[16/10]'
                }`}>
                  {blog.coverImage ? (
                    <NextImage
                      src={blog.coverImage}
                      alt={blog.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100/50">
                      <span className="font-heading text-xl opacity-50">VIDO</span>
                    </div>
                  )}
                  {blog.isFeatured && (
                    <div className="absolute top-4 left-4 bg-accent/90 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                      Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className={`flex flex-col flex-1 p-6 md:p-8 ${
                  index === 0 && blogs.length === 3 ? 'md:w-1/2 lg:w-full' : ''
                }`}>
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-accent" />
                      {blog.publishDate ? new Date(blog.publishDate).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      }) : ''}
                    </div>
                    <div className="flex items-center gap-1.5 line-clamp-1">
                      <User size={14} className="text-accent" />
                      {blog.author}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading font-bold text-xl text-gray-900 mb-3 line-clamp-2 group-hover:text-accent transition-colors">
                    {blog.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                    {blog.shortDescription || 'Read full article...'}
                  </p>

                  {/* Read More */}
                  <div className="mt-auto flex items-center gap-2 text-sm font-bold text-primary group-hover:text-accent transition-colors">
                    {t.blog.readMore} 
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
};
