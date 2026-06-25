'use client';

import React, { useState } from 'react';
import { FileDown } from 'lucide-react';
import { motion } from 'framer-motion';
import Modal from '@/components/common/Modal';
import LeadForm from '@/components/common/LeadForm';
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

  const handleSuccess = (data: { brochureUrl?: string }) => {
    setModalOpen(false);

    const url = data.brochureUrl
      ? data.brochureUrl.startsWith('http')
        ? data.brochureUrl
        : `${appConfig.api.storageBase}${data.brochureUrl}`
      : '/sample-brochure.pdf';

    const slug = (projectName ?? 'project').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
    const filename = `${slug}-brochure.pdf`;

    toast.success('Brochure ready! Downloading...');
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const subtitle = projectName
    ? `Share your details to receive the ${projectName} brochure.`
    : 'Share your details to download our project brochure.';

  return (
    <>
      <motion.button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-20 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-amber-500 text-white font-medium text-sm shadow-xl shadow-amber-500/30 hover:bg-amber-400 hover:shadow-amber-500/50 hover:scale-105 transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.4 }}
        aria-label="Download Brochure"
      >
        <FileDown className="w-5 h-5 shrink-0" />
        <span className="hidden sm:inline">Download Brochure</span>
      </motion.button>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Download Brochure"
        size="sm"
      >
        <LeadForm
          source="brochure"
          projectId={projectId}
          projectName={projectName}
          onSuccess={handleSuccess}
          title=""
          subtitle={subtitle}
          submitLabel="Download Brochure"
        />
      </Modal>
    </>
  );
}
