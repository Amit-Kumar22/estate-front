'use client';

import React, { useState } from 'react';
import { MessageSquare, Download } from 'lucide-react';
import LeadForm from '@/components/common/LeadForm';
import OtpVerifyModal from '@/components/common/OtpVerifyModal';
import appConfig from '@/config/app.config';
import toast from 'react-hot-toast';

interface ProjectContactFormProps {
  projectId: string;
  projectName: string;
  brochureUrl?: string;
}

export default function ProjectContactForm({ projectId, projectName, brochureUrl }: ProjectContactFormProps) {
  const [brochureModal, setBrochureModal] = useState(false);

  const whatsappMessage = `Hello, I am interested in ${projectName}. Please get in touch.`;
  const whatsappUrl = `${appConfig.whatsapp.apiUrl}/${appConfig.whatsapp.number}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleBrochureSuccess = (data: { brochureUrl?: string }) => {
    setBrochureModal(false);
    const raw = data.brochureUrl || brochureUrl;
    if (!raw) {
      toast.success('Thank you! Our team will share the brochure with you shortly.');
      return;
    }
    const url = raw.startsWith('http') ? raw : `${appConfig.api.storageBase}${raw}`;
    const slug = projectName.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
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
    <div className="bg-white dark:bg-[#111] rounded-xl border border-gray-100 dark:border-[#1f1f1f] overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 p-4">
        <h3 className="text-sm font-bold text-white mb-0.5">Get More Details</h3>
        <p className="text-green-100 text-xs">Our team will contact you within 24 hours</p>
      </div>

      {/* Lead Form */}
      <div className="p-4">
        <LeadForm
          source="contact"
          projectId={projectId}
          projectName={projectName}
          showMessage={true}
          title=""
          subtitle=""
          submitLabel="Request Callback"
        />

        {/* WhatsApp + Brochure CTAs */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#1f1f1f] space-y-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-semibold bg-[#25D366] text-white hover:bg-[#1fb359] transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Chat on WhatsApp
          </a>

          {brochureUrl && (
            <button
              onClick={() => setBrochureModal(true)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-semibold border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Download Brochure
            </button>
          )}
        </div>
      </div>

      {/* OTP Brochure Modal */}
      {brochureModal && (
        <OtpVerifyModal
          projectId={projectId}
          projectName={projectName}
          source="brochure"
          title="Download Brochure"
          subtitle="Enter your details to receive the project brochure — we'll verify your email first."
          submitLabel="Verify & Download"
          onClose={() => setBrochureModal(false)}
          onSuccess={handleBrochureSuccess}
        />
      )}
    </div>
  );
}
