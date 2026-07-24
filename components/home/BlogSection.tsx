'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Modal from '@/components/common/Modal';
import Link from 'next/link';
import { BookOpen, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { blogService } from '@/lib/api';
import { queryKeys } from '@/lib/constants/query-keys';
import { getImageUrl } from '@/lib/utils';
import { ApiResponse, Blog } from '@/types';

/* ─── shared constants ──────────────────────────────────────────── */

const OVERLAY =
  'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.28) 55%, transparent 100%)';

const glassStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.14)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.24)',
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/* ─── main component ─────────────────────────────────────────────── */

export default function BlogSection() {
  const { data, isLoading, isError, error } = useQuery<ApiResponse<{ blogs: Blog[] }>>({
    queryKey: queryKeys.blogs.public(),
    queryFn: () => blogService.getAll({ limit: 6 }),
  });

  const blogs: Blog[] = data?.data?.blogs || [];
  const [selectedBlog, setSelectedBlog] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const handleReadMore = (blog: Blog) => {
    setSelectedBlog(blog);
    setShowModal(true);
  };

  /* blogs[0] = featured, blogs[1-4] = small right grid, blogs[5] = extra */
  const mainBlogs  = blogs.slice(0, 5);
  const extraBlog  = blogs[5] ?? null;

  return (
    <>
      <section className="py-10 md:py-14 bg-white dark:bg-black">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">

          {/* ── Section Header (content unchanged) ─────────────── */}
          <div className="text-center mb-8 md:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-xs font-medium mb-3">
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

          {/* ── Loading ──────────────────────────────────────────── */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-7 h-7 animate-spin text-green-500" />
            </div>
          )}

          {/* ── Error ────────────────────────────────────────────── */}
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
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* ── Empty ────────────────────────────────────────────── */}
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

          {/* ── Blog Grid ────────────────────────────────────────── */}
          {!isLoading && !isError && blogs.length > 0 && (
            <>
              {/*
                Responsive asymmetric grid
                ─────────────────────────────────────────────────────
                Mobile  (< md):  1 column, all cards stacked
                Tablet  (md):    2 columns, featured spans both cols
                Desktop (lg):    3 cols × 2 rows (220 px each)
                                 featured col-1 row-span-2 | 4 small 2×2
                ─────────────────────────────────────────────────────
              */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[220px_220px] gap-4 mb-4">
                {mainBlogs.map((blog, index) => {
                  const isFeatured = index === 0;

                  return (
                    <motion.article
                      key={blog._id}
                      initial={{ opacity: 0, y: 28 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.52, delay: index * 0.1 }}
                      onClick={() => handleReadMore(blog)}
                      className={[
                        'group relative overflow-hidden cursor-pointer',
                        isFeatured
                          ? 'rounded-[24px] h-72 md:col-span-2 md:h-72 lg:col-span-1 lg:row-span-2 lg:h-auto'
                          : 'rounded-[20px] h-52 lg:h-auto',
                      ].join(' ')}
                      style={{
                        boxShadow: isFeatured
                          ? '0 8px 32px rgba(0,0,0,0.16)'
                          : '0 4px 18px rgba(0,0,0,0.13)',
                        transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.transform = isFeatured ? 'translateY(-8px)' : 'scale(1.03)';
                        el.style.boxShadow = isFeatured
                          ? '0 24px 64px rgba(0,0,0,0.30)'
                          : '0 14px 44px rgba(0,0,0,0.26)';
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.transform = isFeatured ? 'translateY(0)' : 'scale(1)';
                        el.style.boxShadow = isFeatured
                          ? '0 8px 32px rgba(0,0,0,0.16)'
                          : '0 4px 18px rgba(0,0,0,0.13)';
                      }}
                    >
                      {/* Full-bleed image */}
                      <div className="absolute inset-0">
                        <Image
                          src={getImageUrl(blog.featuredImage)}
                          alt={blog.title}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.08]"
                        />
                        <div className="absolute inset-0" style={{ background: OVERLAY }} />
                      </div>

                      {/* Bottom overlay — category · author · date · title */}
                      <div
                        className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none"
                        style={{ padding: isFeatured ? '20px' : '14px' }}
                      >
                        {/* Category badge */}
                        <span
                          className="inline-block rounded-full text-white font-semibold mb-1.5"
                          style={{
                            ...glassStyle,
                            fontSize: '11px',
                            padding: '2px 10px',
                          }}
                        >
                          {blog.category}
                        </span>

                        {/* Author • Date */}
                        <p
                          className="text-white/55 font-medium mb-1"
                          style={{ fontSize: isFeatured ? '12px' : '11px' }}
                        >
                          {blog.author}&nbsp;&bull;&nbsp;{formatDate(blog.publishDate)}
                        </p>

                        {/* Title */}
                        <h3
                          className="text-white font-bold leading-snug line-clamp-2 group-hover:text-white/90 transition-colors duration-300"
                          style={{ fontSize: isFeatured ? '18px' : '13px' }}
                        >
                          {blog.title}
                        </h3>

                        {/* Short excerpt — featured card only */}
                        {isFeatured && blog.shortDescription && (
                          <p className="text-white/48 text-xs leading-relaxed line-clamp-2 mt-1.5">
                            {blog.shortDescription}
                          </p>
                        )}
                      </div>
                    </motion.article>
                  );
                })}
              </div>

              {/* 6th blog — compact full-width banner if API returns it */}
              {extraBlog && (
                <motion.article
                  key={extraBlog._id}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.55 }}
                  onClick={() => handleReadMore(extraBlog)}
                  className="group relative rounded-[20px] overflow-hidden mb-4 cursor-pointer"
                  style={{
                    height: '175px',
                    boxShadow: '0 6px 24px rgba(0,0,0,0.13)',
                    transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 18px 50px rgba(0,0,0,0.24)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px rgba(0,0,0,0.13)';
                  }}
                >
                  <div className="absolute inset-0">
                    <Image
                      src={getImageUrl(extraBlog.featuredImage)}
                      alt={extraBlog.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.08]"
                    />
                    <div className="absolute inset-0" style={{ background: OVERLAY }} />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-10 pointer-events-none">
                    <span
                      className="inline-block rounded-full text-white font-semibold mb-1.5"
                      style={{ ...glassStyle, fontSize: '11px', padding: '2px 10px' }}
                    >
                      {extraBlog.category}
                    </span>
                    <p className="text-white/55 text-xs font-medium mb-1">
                      {extraBlog.author}&nbsp;&bull;&nbsp;{formatDate(extraBlog.publishDate)}
                    </p>
                    <h3 className="text-white font-bold text-sm leading-snug line-clamp-2 group-hover:text-white/90 transition-colors duration-300">
                      {extraBlog.title}
                    </h3>
                  </div>
                </motion.article>
              )}

              {/* View All — unchanged */}
              {data?.pagination && data.pagination.total > 6 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="text-center mt-6"
                >
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5"
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

      {/* Modal — completely unchanged */}
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
              <span>📅 {new Date(selectedBlog.publishDate).toLocaleDateString()}</span>
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
