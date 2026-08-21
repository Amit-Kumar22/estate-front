'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageSquareWarning } from 'lucide-react';
import { motion } from 'framer-motion';
import Modal from '@/components/common/Modal';
import ComplaintForm from '@/components/common/ComplaintForm';

export default function ComplaintBoxButton() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Complaint box is a public-facing widget; keep it out of the admin panel.
  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-red-600 text-white font-medium text-sm shadow-xl shadow-red-500/30 hover:bg-red-500 hover:shadow-red-500/50 hover:scale-105 transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.4 }}
        aria-label="Raise a Complaint"
      >
        <MessageSquareWarning className="w-5 h-5 shrink-0" />
        <span className="hidden sm:inline">Complaint Box</span>
      </motion.button>

      <Modal isOpen={open} onClose={() => setOpen(false)} size="sm">
        <ComplaintForm onSuccess={() => setTimeout(() => setOpen(false), 1800)} />
      </Modal>
    </>
  );
}
