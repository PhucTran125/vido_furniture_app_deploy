'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { Section } from './ui/Section';
import { BlogPost, getLocalizedString } from '@/lib/types';
import { ArrowRight, Calendar, User, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface BlogProps {
  blogs: BlogPost[];
  currentPage: number;
  totalPages: number;
}

export const Blog: React.FC<BlogProps> = ({ blogs, currentPage, totalPages }) => {
  const { t, language } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-primary py-16 px-4 text-center">
        <span className="text-accent font-bold text-[10px] md:text-xs uppercase tracking-[0.3em] mb-3 block opacity-90">
          {t.blog.featuredBadge}
        </span>
        <h1 className="font-heading font-bold text-4xl md:text-5xl text-white mb-4">
          {t.blog.title}
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base">
          {t.blog.featuredDesc}
        </p>
        <div className="w-16 h-1 bg-accent mx-auto mt-6 rounded-full"></div>
      </div>

      <Section className="!py-16 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          {blogs.length === 0 ? (
            <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="text-gray-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t.blog.noPosts}</h3>
              <p className="text-gray-500">{t.blog.noPostsDesc}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <Link 
                    key={blog.id} 
                    href={`/blog/${blog.slug}`}
                    className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 h-full"
                  >
                    {/* Cover Image */}
                    <div className="aspect-[16/10] relative overflow-hidden bg-gray-100">
                      {blog.coverImage ? (
                        <NextImage
                          src={blog.coverImage}
                          alt={getLocalizedString(blog.title, language)}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100/50">
                          <span className="font-heading text-xl opacity-50">VIDO</span>
                        </div>
                      )}
                      
                      {/* Optional Category Badge could go here */}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-6 md:p-8">
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
                        {getLocalizedString(blog.title, language)}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                        {getLocalizedString(blog.shortDescription, language) || 'Read full article...'}
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-16 flex justify-center items-center gap-2 text-sm font-medium">
                  {currentPage > 1 && (
                    <Link 
                      href={`/blog?page=${currentPage - 1}`}
                      className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:text-accent hover:border-accent transition-colors"
                    >
                      Previous
                    </Link>
                  )}
                  
                  <div className="flex gap-1">
                    {(() => {
                      const pages: (number | 'ellipsis')[] = [];
                      if (totalPages <= 7) {
                        for (let i = 1; i <= totalPages; i++) pages.push(i);
                      } else {
                        pages.push(1);
                        if (currentPage > 3) pages.push('ellipsis');
                        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                          pages.push(i);
                        }
                        if (currentPage < totalPages - 2) pages.push('ellipsis');
                        pages.push(totalPages);
                      }
                      return pages.map((page, idx) =>
                        page === 'ellipsis' ? (
                          <span key={`ellipsis-${idx}`} className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>
                        ) : (
                          <Link
                            key={page}
                            href={`/blog?page=${page}`}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                              currentPage === page
                                ? 'bg-accent text-white border border-accent'
                                : 'border border-gray-200 text-gray-600 hover:text-accent hover:border-accent'
                            }`}
                          >
                            {page}
                          </Link>
                        )
                      );
                    })()}
                  </div>

                  {currentPage < totalPages && (
                    <Link 
                      href={`/blog?page=${currentPage + 1}`}
                      className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:text-accent hover:border-accent transition-colors"
                    >
                      Next
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </Section>
    </div>
  );
};
