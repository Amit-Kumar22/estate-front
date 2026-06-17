'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import Modal from '@/components/common/Modal';
import Link from 'next/link';

import {
  BookOpen,
  Calendar,
  User,
  Tag,
  ArrowRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { blogService } from '@/lib/api';
import { queryKeys } from '@/lib/constants/query-keys';
import { getImageUrl } from '@/lib/utils';
import { ApiResponse, Blog } from '@/types';

export default function BlogSection() {
  const { data, isLoading, isError, error } = useQuery<ApiResponse<{ blogs: Blog[] }>>({
    queryKey: queryKeys.blogs.public(),
    queryFn: () => blogService.getAll({ limit: 6 }),
  });

  const blogs: Blog[] = data?.data?.blogs || [];
  const [selectedBlog, setSelectedBlog] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
  
    <section className="py-10 md:py-14 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-medium mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            Latest Updates
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Our Blog
          </h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Stay updated with the latest insights, trends, and news from the real estate world
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-7 h-7 animate-spin text-emerald-500" />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="max-w-md mx-auto text-center py-8 px-4">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
              Failed to Load Blogs
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              {error instanceof Error ? error.message : 'Unable to fetch blog posts'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && blogs.length === 0 && (
          <div className="max-w-md mx-auto text-center py-8 px-4">
            <BookOpen className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
              No Blogs Yet
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Blog posts will appear here once they are published.
            </p>
          </div>
        )}

        {/* Blogs Grid */}
        {!isLoading && !isError && blogs.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {blogs.map((blog, index) => (
                <motion.article
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-white dark:bg-[#111] rounded-2xl overflow-hidden border border-gray-200 dark:border-[#1f1f1f] hover:border-emerald-300 dark:hover:border-emerald-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2"
                >
                  {/* Featured Image */}
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="block relative h-60 overflow-hidden"
                  >

                    <Image
                      src={getImageUrl(blog.featuredImage)}
                      alt={blog.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white text-xs font-medium">
                        <Tag className="w-3 h-3" />
                        {blog.category}
                      </span>
                    </div>

                  </Link>

                  {/* Content */}
                  <div className="p-5">
                    {/* Meta Info */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(blog.publishDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {blog.author}
                      </div>
                    </div>

                    {/* Title */}
                    <Link href={`/blog/${blog.slug}`}>
                      <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {blog.title}
                      </h3>
                    </Link>

                    {/* Description */}
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                      {blog.shortDescription}
                    </p>

                    {/* Read More Link */}
                    {/* Read More Button */}
                    <button
                      onClick={() => {
                        setSelectedBlog(blog);
                        setShowModal(true);
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 font-semibold transition-all duration-300"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* View All Button */}
            {data?.pagination && data.pagination.total > 6 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-center mt-8"
              >
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5"
                >
                  View All Blogs
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            )}
          </>
          )}
      </div>
    </section>
              
       
     

    <Modal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      title={selectedBlog?.title}
    >
      {selectedBlog && (
        <div className="space-y-4">
          <img
            src={getImageUrl(selectedBlog.featuredImage)}
            alt={selectedBlog.title}
            className="w-full h-64 object-cover rounded-xl"
          />

          <div className="flex gap-3 text-sm text-gray-500">
            <span>👤 {selectedBlog.author}</span>
            <span>
              📅 {new Date(selectedBlog.publishDate).toLocaleDateString()}
            </span>
          </div>

          <p className="text-gray-700 leading-7 whitespace-pre-line">
            {selectedBlog.content}
          </p>
        </div>
      )}
    </Modal>
  </>
  );
}
    
    


