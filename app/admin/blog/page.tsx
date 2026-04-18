import React from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { getAllBlogs } from '@/lib/db/blogs';
import { getLocalizedString } from '@/lib/types';
import { BlogStatusBadge } from '@/components/admin/BlogStatusBadge'; // We'll create this next
import { DeleteBlogButton } from '@/components/admin/DeleteBlogButton';

export const dynamic = 'force-dynamic';

export default async function AdminBlogPage() {
  const blogs = await getAllBlogs();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold font-heading text-primary">Blog Posts</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage your news and industry insights</p>
        </div>
        <Link
          href="/admin/blog/create"
          className="flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-lg hover:bg-accent/90 transition-colors shadow-sm font-medium"
        >
          <Plus size={20} />
          Create Post
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Post</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Author</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Publish Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {blog.coverImage ? (
                        <img src={blog.coverImage} alt={getLocalizedString(blog.title, 'en')} className="w-12 h-12 rounded object-cover border border-gray-200" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-400 text-xs">
                          No Img
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{getLocalizedString(blog.title, 'en')}</p>
                        <p className="text-xs text-gray-500 mt-1 max-w-md truncate">
                          {getLocalizedString(blog.shortDescription, 'en') || 'No description'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {blog.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <BlogStatusBadge status={blog.status} />
                    {blog.isFeatured && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {blog.publishDate 
                      ? new Date(blog.publishDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })
                      : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/blog/${blog.id}/edit`}
                        className="p-2 text-gray-400 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                        title="Edit Post"
                      >
                        <Edit size={18} />
                      </Link>
                      <DeleteBlogButton id={blog.id} title={getLocalizedString(blog.title, 'en')} />
                    </div>
                  </td>
                </tr>
              ))}
              
              {blogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <p className="text-lg font-medium mb-2">No blog posts found</p>
                    <p className="text-sm">Click the "Create Post" button to write your first post.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
