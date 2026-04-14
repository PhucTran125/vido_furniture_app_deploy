'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BlogPost, BlogStatus, VALID_STATUS_TRANSITIONS } from '@/lib/types';
import { TiptapEditor } from './TiptapEditor';
import { ArrowLeft, Save, Loader2, Upload, X, Image as ImageIcon, Star } from 'lucide-react';

const STATUS_LABELS: Record<BlogStatus, string> = {
  draft: 'Draft (Hidden)',
  published: 'Published (Public)',
  archived: 'Archived (Hidden)',
};

interface BlogFormProps {
  blog?: BlogPost;
  mode: 'create' | 'edit';
}

export function BlogForm({ blog, mode }: BlogFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: blog?.title || '',
    shortDescription: blog?.shortDescription || '',
    content: blog?.content || null,
    coverImage: blog?.coverImage || '',
    status: blog?.status || 'draft' as BlogStatus,
    publishDate: blog?.publishDate ? new Date(blog.publishDate).toISOString().slice(0, 16) : '',
    isFeatured: blog?.isFeatured ?? false,
    featuredOrder: blog?.featuredOrder ?? '',
  });

  // --- Image Upload ---
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', selectedFile);

      const res = await fetch('/api/admin/blogs/upload', {
        method: 'POST',
        body: form,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Upload failed');
      }

      const { url } = await res.json();
      setFormData({ ...formData, coverImage: url });
      setSelectedFile(null);
    } catch (error: any) {
      console.error('Upload error:', error);
      setErrorMessage(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  // --- Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.title || !formData.content) {
      setErrorMessage('Title and content are required');
      return;
    }

    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        title: formData.title,
        content: formData.content,
      };

      // For create mode, include status directly
      if (mode === 'create') {
        payload.status = formData.status;
      }

      if (formData.shortDescription) payload.shortDescription = formData.shortDescription;
      if (formData.coverImage) payload.coverImage = formData.coverImage;
      if (formData.publishDate) payload.publishDate = new Date(formData.publishDate).toISOString();
      payload.isFeatured = formData.isFeatured;
      payload.featuredOrder = formData.isFeatured && formData.featuredOrder !== ''
        ? Number(formData.featuredOrder)
        : null;

      const url = mode === 'create'
        ? '/api/admin/blogs'
        : `/api/admin/blogs/${blog?.id}`;

      const res = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMessage(data.error || 'Failed to save blog post');
        setSaving(false);
        return;
      }

      // For edit mode, handle status change separately via the status endpoint
      if (mode === 'edit' && blog && formData.status !== blog.status) {
        const statusRes = await fetch(`/api/admin/blogs/${blog.id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: formData.status }),
        });
        if (!statusRes.ok) {
          const statusData = await statusRes.json();
          setErrorMessage(statusData.error || 'Content saved but status change failed');
          setSaving(false);
          return;
        }
      }

      router.push('/admin/blog');
      router.refresh();
    } catch (error) {
      console.error('Error saving blog:', error);
      setErrorMessage('Failed to save blog post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
      {/* Error Banner */}
      {errorMessage && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          <span>{errorMessage}</span>
          <button type="button" onClick={() => setErrorMessage(null)} className="text-red-500 hover:text-red-700 font-bold ml-4">&times;</button>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {mode === 'create' ? 'Create New Blog Post' : 'Edit Blog Post'}
        </h1>
        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={18} />
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50">
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {mode === 'create' ? 'Publish Post' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Post Title *</label>
              <input type="text" id="title" required value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="e.g., Top 10 Furniture Trends in 2026" />
            </div>

            <div>
              <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
              <textarea id="shortDescription" rows={3} value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="A brief summary for the blog card..." />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-4">Content *</label>
            <TiptapEditor
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="Write your blog post here..."
            />
          </div>
        </div>

        {/* Sidebar Settings Column */}
        <div className="space-y-6">
          {/* Status Settings */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">Publishing</h3>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select id="status" value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as BlogStatus })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent">
                {mode === 'create' ? (
                  <>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="published">Published (Public)</option>
                  </>
                ) : (
                  <>
                    <option value={blog?.status}>{STATUS_LABELS[blog?.status || 'draft']}</option>
                    {VALID_STATUS_TRANSITIONS[blog?.status || 'draft'].map((s) => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </>
                )}
              </select>
            </div>

            <div>
              <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700 mb-2">Publish Date</label>
              <input type="datetime-local" id="publishDate" value={formData.publishDate}
                onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent" />
              <p className="text-xs text-gray-500 mt-1">Leave empty to auto-set on publish.</p>
            </div>
          </div>

          {/* Featured on Home */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="flex items-center gap-2 font-semibold text-gray-900 border-b pb-2">
              <Star size={16} className="text-accent" />
              Featured on Home
            </h3>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
              />
              <span className="text-sm text-gray-700">
                Show this post in the <span className="font-medium">Featured Blogs</span> section on the home page.
              </span>
            </label>

            {formData.isFeatured && (
              <div>
                <label htmlFor="featuredOrder" className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  id="featuredOrder"
                  min={1}
                  max={99}
                  value={formData.featuredOrder}
                  onChange={(e) => setFormData({ ...formData, featuredOrder: e.target.value })}
                  placeholder="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lower numbers appear first. Only the top 4 featured posts are shown on the home page.
                </p>
              </div>
            )}
          </div>

          {/* Cover Image */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">Cover Image</h3>
            
            {formData.coverImage ? (
              <div className="relative group rounded-lg overflow-hidden border border-gray-200">
                <img src={formData.coverImage} alt="Cover" className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button type="button" onClick={() => setFormData({ ...formData, coverImage: '' })}
                    className="bg-white text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-50">
                    Remove Image
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                <ImageIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <label className="cursor-pointer text-sm font-medium text-accent hover:text-accent/80">
                  <span>Upload a file</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
                </label>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, WebP up to 5MB</p>
              </div>
            )}

            {selectedFile && !formData.coverImage && (
              <div className="flex items-center justify-between p-3 bg-blue-50 text-blue-800 rounded-lg text-sm">
                <span className="truncate max-w-[150px]">{selectedFile.name}</span>
                <button type="button" onClick={handleUpload} disabled={uploading}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 disabled:opacity-50">
                  {uploading ? 'Uploading...' : 'Upload Now'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
