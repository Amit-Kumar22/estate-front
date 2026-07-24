'use client';

import React, { useState } from 'react';
import { FileDown } from 'lucide-react';
import { motion } from 'framer-motion';
import OtpVerifyModal from '@/components/common/OtpVerifyModal';
import appConfig from '@/config/app.config';
import toast from 'react-hot-toast';

interface BrochureDownloadButtonProps {
  projectId?: string;
  projectName?: string;
  brochureUrl?: string;
}

export default function BrochureDownloadButton({
  projectId,
  projectName,
  brochureUrl,
}: BrochureDownloadButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);

  if (!projectId) return null;

  const handleSuccess = (data: { brochureUrl?: string }) => {
    setModalOpen(false);

    const raw = data.brochureUrl || brochureUrl;
    if (!raw) {
      toast.success('Thank you! Our team will share the brochure with you shortly.');
      return;
    }

    const url = raw.startsWith('http') ? raw : `${appConfig.api.storageBase}${raw}`;
    const slug = (projectName ?? 'project').replace(/[^a-z0-9]+/gi, '-').toLowerCase();

    toast.success('Brochure ready! Downloading…');
    const link = document.createElement('a');
    link.href = url;
    link.download = `${slug}-brochure.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <motion.button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-20 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gold-500 text-white font-medium text-sm shadow-xl shadow-gold-500/30 hover:bg-gold-400 hover:shadow-gold-500/50 hover:scale-105 transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.4 }}
        aria-label="Download Brochure"
      >
        <FileDown className="w-5 h-5 shrink-0" />
        <span className="hidden sm:inline">Download Brochure</span>
      </motion.button>

      {modalOpen && (
        <OtpVerifyModal
          projectId={projectId}
          projectName={projectName ?? ''}
          source="brochure"
          title="Download Brochure"
          subtitle="Enter your details to receive the project brochure — we'll verify your email first."
          submitLabel="Verify & Download"
          onClose={() => setModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
