'use client';

import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogApi } from '@/lib/api';
import { Blog, BlogFormData } from '@/types';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  BookOpen, 
  X, 
  Loader2, 
  Eye, 
  EyeOff,
  Calendar,
  User,
  Tag
} from 'lucide-react';
import { getImageUrl, PLACEHOLDER_IMAGE } from '@/lib/utils';
import { queryKeys } from '@/lib/constants/query-keys';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function AdminBlogsPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showForm, setShowForm] = useState(false);
  const [editBlog, setEditBlog] = useState<Blog | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  const [form, setForm] = useState<BlogFormData>({
    title: '',
    shortDescription: '',
    content: '',
    author: '',
    category: '',
    tags: [],
    status: 'draft',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [tagInput, setTagInput] = useState('');

  const { data, isLoading, isError, error } = useQuery<Blog[]>({
    queryKey: queryKeys.blogs.admin(),
    queryFn: async () => {
      const res = await blogApi.getAllAdmin();
      return res.data.blogs as Blog[];
    },
  });

  const invalidateBlogQueries = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.blogs.admin() });
    queryClient.invalidateQueries({ queryKey: queryKeys.blogs.public() });
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => blogApi.delete(id),
    onSuccess: () => {
      invalidateBlogQueries();
      toast.success('Blog deleted successfully');
    },
    onError: () => toast.error('Failed to delete blog'),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id: string) => blogApi.toggleStatus(id),
    onSuccess: () => {
      invalidateBlogQueries();
      toast.success('Blog status updated');
    },
    onError: () => toast.error('Failed to update status'),
  });

  const blogs = data ?? [];

  // Filter blogs
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = 
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || blog.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const openCreate = () => {
    setEditBlog(null);
    setForm({
      title: '',
      shortDescription: '',
      content: '',
      author: '',
      category: '',
      tags: [],
      status: 'draft',
    });
    setImageFile(null);
    setImagePreview('');
    setTagInput('');
    setShowForm(true);
  };

  const openEdit = (blog: Blog) => {
    setEditBlog(blog);
    setForm({
      title: blog.title,
      shortDescription: blog.shortDescription,
      content: blog.content,
      author: blog.author,
      category: blog.category,
      tags: blog.tags,
      seoMetaTitle: blog.seoMetaTitle,
      seoMetaDescription: blog.seoMetaDescription,
      status: blog.status,
    });
    setImageFile(null);
    setImagePreview(getImageUrl(blog.featuredImage));
    setTagInput('');
    setShowForm(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm((f) => ({ ...f, tags: [...f.tags, tag] }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setForm((f) => ({
      ...f,
      tags: f.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSave = async () => {
    // Validation
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!form.shortDescription.trim()) {
      toast.error('Short description is required');
      return;
    }
    if (!form.content.trim()) {
      toast.error('Content is required');
      return;
    }
    if (!form.author.trim()) {
      toast.error('Author name is required');
      return;
    }
    if (!form.category.trim()) {
      toast.error('Category is required');
      return;
    }
    if (!editBlog && !imageFile) {
      toast.error('Featured image is required');
      return;
    }

    setSaving(true);
    try {
      const formData: BlogFormData = {
        ...form,
        featuredImage: imageFile || undefined,
      };

      if (editBlog) {
        await blogApi.update(editBlog._id, formData);
        toast.success('Blog updated successfully');
      } else {
        await blogApi.create(formData);
        toast.success('Blog created successfully');
      }

      invalidateBlogQueries();
      setShowForm(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save blog';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Blog Management
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {filteredBlogs.length} {filteredBlogs.length === 1 ? 'blog' : 'blogs'} 
            {statusFilter !== 'all' && ` • ${statusFilter}`}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          Create Blog
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search blogs by title, author, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-[#1f1f1f] bg-white dark:bg-[#111] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-[#1f1f1f] bg-white dark:bg-[#111] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#1f1f1f] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white dark:bg-[#111] border-b border-gray-200 dark:border-[#1f1f1f] p-5 flex items-center justify-between z-10">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {editBlog ? 'Edit Blog' : 'Create New Blog'}
              </h3>
              <button 
                onClick={() => setShowForm(false)} 
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Featured Image *
                </label>
                <div className="flex flex-col gap-3">
                  {imagePreview && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 dark:border-[#1f1f1f]">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-emerald-900/20 dark:file:text-emerald-400"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-[#1f1f1f] bg-white dark:bg-[#0d0d0d] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  placeholder="Enter blog title"
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 mt-1">{form.title.length}/200 characters</p>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Short Description *
                </label>
                <textarea
                  value={form.shortDescription}
                  onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))}
                  className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-[#1f1f1f] bg-white dark:bg-[#0d0d0d] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 min-h-[80px]"
                  placeholder="Brief description for blog card"
                  maxLength={300}
                />
                <p className="text-xs text-gray-500 mt-1">{form.shortDescription.length}/300 characters</p>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Content *
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-[#1f1f1f] bg-white dark:bg-[#0d0d0d] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 min-h-[300px] font-mono"
                  placeholder="Full blog content (supports HTML/Markdown)"
                />
                <p className="text-xs text-gray-500 mt-1">You can use HTML tags for rich formatting</p>
              </div>

              {/* Author & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Author *
                  </label>
                  <input
                    value={form.author}
                    onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                    className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-[#1f1f1f] bg-white dark:bg-[#0d0d0d] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    placeholder="Author name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <input
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-[#1f1f1f] bg-white dark:bg-[#0d0d0d] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    placeholder="e.g., Market Trends, Tips"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-[#1f1f1f] bg-white dark:bg-[#0d0d0d] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    placeholder="Add a tag and press Enter"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-emerald-900 dark:hover:text-emerald-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* SEO Fields */}
              <div className="border-t border-gray-200 dark:border-[#1f1f1f] pt-5">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">SEO Settings (Optional)</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Meta Title
                    </label>
                    <input
                      value={form.seoMetaTitle || ''}
                      onChange={(e) => setForm((f) => ({ ...f, seoMetaTitle: e.target.value }))}
                      className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-[#1f1f1f] bg-white dark:bg-[#0d0d0d] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                      placeholder="SEO meta title"
                      maxLength={60}
                    />
                    <p className="text-xs text-gray-500 mt-1">{(form.seoMetaTitle || '').length}/60 characters</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      value={form.seoMetaDescription || ''}
                      onChange={(e) => setForm((f) => ({ ...f, seoMetaDescription: e.target.value }))}
                      className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-[#1f1f1f] bg-white dark:bg-[#0d0d0d] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 min-h-[60px]"
                      placeholder="SEO meta description"
                      maxLength={160}
                    />
                    <p className="text-xs text-gray-500 mt-1">{(form.seoMetaDescription || '').length}/160 characters</p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as 'published' | 'draft' }))}
                  className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-[#1f1f1f] bg-white dark:bg-[#0d0d0d] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            {/* Form Actions */}
            <div className="sticky bottom-0 bg-white dark:bg-[#111] border-t border-gray-200 dark:border-[#1f1f1f] p-5 flex gap-3 justify-end">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? 'Saving...' : editBlog ? 'Update Blog' : 'Create Blog'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blogs List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      ) : isError ? (
        <div className="text-center py-12 bg-white dark:bg-[#111] rounded-2xl border border-red-200 dark:border-red-900">
          <BookOpen className="w-12 h-12 text-red-300 dark:text-red-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-red-700 dark:text-red-300">Unable to load blogs</p>
          <p className="text-xs text-red-500 dark:text-red-400 mt-2">{error instanceof Error ? error.message : 'An unexpected error occurred.'}</p>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#1f1f1f]">
          <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No blogs found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBlogs.map((blog) => (
            <div
              key={blog._id}
              className="group bg-white dark:bg-[#111] rounded-xl border border-gray-200 dark:border-[#1f1f1f] overflow-hidden hover:shadow-lg transition-all"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-100 dark:bg-gray-900">
                <Image
                  src={getImageUrl(blog.featuredImage)}
                  alt={blog.title}
                  fill
                  unoptimized
                  className="object-cover"
                  onError={(event) => {
                    const target = event.target as HTMLImageElement;
                    if (target && target.src !== PLACEHOLDER_IMAGE) {
                      target.src = PLACEHOLDER_IMAGE;
                    }
                  }}
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      blog.status === 'published'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {blog.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Tag className="w-3.5 h-3.5" />
                  {blog.category}
                </div>

                <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2">
                  {blog.title}
                </h3>

                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                  {blog.shortDescription}
                </p>

                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    {blog.author}
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(blog.publishDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>

                {blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {blog.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {blog.tags.length > 3 && (
                      <span className="px-2 py-0.5 text-gray-500 text-xs">
                        +{blog.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={() => toggleStatusMutation.mutate(blog._id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    title={blog.status === 'published' ? 'Unpublish' : 'Publish'}
                  >
                    {blog.status === 'published' ? (
                      <><EyeOff className="w-3.5 h-3.5" /> Draft</>
                    ) : (
                      <><Eye className="w-3.5 h-3.5" /> Publish</>
                    )}
                  </button>
                  <a
                    href={`/blog/${blog.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/40 rounded-lg transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </a>
                  <button
                    onClick={() => openEdit(blog)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this blog? This action cannot be undone.')) {
                        deleteMutation.mutate(blog._id);
                      }
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors ml-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
