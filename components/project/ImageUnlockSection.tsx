'use client';

import React, { useState } from 'react';
import { Lock, FileText, Image, Play } from 'lucide-react';
import Modal from '@/components/common/Modal';
import LeadForm from '@/components/common/LeadForm';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { getImageUrl } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ImageUnlockSectionProps {
  projectId: string;
  projectName: string;
  floorPlans?: string[];
  interiorPhotos?: string[];
  virtualTourUrl?: string;
}

type ContentType = 'floor_plans' | 'interior' | 'virtual_tour' | null;

export default function ImageUnlockSection({
  projectId,
  projectName,
  floorPlans = [],
  interiorPhotos = [],
  virtualTourUrl,
}: ImageUnlockSectionProps) {
  const [unlockModal, setUnlockModal] = useState(false);
  const [pendingContent, setPendingContent] = useState<ContentType>(null);
  const [unlockedContent, setUnlockedContent] = useState<Set<ContentType>>(new Set());
  const [lightbox, setLightbox] = useState<{ open: boolean; slides: { src: string }[]; index: number }>({
    open: false,
    slides: [],
    index: 0,
  });

  const contentLabels: Record<string, string> = {
    floor_plans: 'Floor Plans',
    interior: 'Interior Photos',
    virtual_tour: 'Virtual Tour',
  };

  const handleUnlockClick = (type: ContentType) => {
    if (unlockedContent.has(type)) {
      openContent(type);
    } else {
      setPendingContent(type);
      setUnlockModal(true);
    }
  };

  const openContent = (type: ContentType) => {
    if (type === 'floor_plans') {
      setLightbox({
        open: true,
        slides: floorPlans.map((img) => ({ src: getImageUrl(img) })),
        index: 0,
      });
    } else if (type === 'interior') {
      setLightbox({
        open: true,
        slides: interiorPhotos.map((img) => ({ src: getImageUrl(img) })),
        index: 0,
      });
    } else if (type === 'virtual_tour' && virtualTourUrl) {
      window.open(virtualTourUrl, '_blank');
    }
  };

  const handleLeadSuccess = () => {
    setUnlockModal(false);
    if (pendingContent) {
      setUnlockedContent((prev) => new Set(Array.from(prev).concat([pendingContent])));
      toast.success(`${contentLabels[pendingContent]} unlocked!`);
      setTimeout(() => openContent(pendingContent), 300);
    }
  };

  const contentBlocks = [
    { type: 'floor_plans' as ContentType, label: 'Floor Plans', icon: FileText, count: floorPlans.length, show: floorPlans.length > 0 },
    { type: 'interior' as ContentType, label: 'Interior Photos', icon: Image, count: interiorPhotos.length, show: interiorPhotos.length > 0 },
    { type: 'virtual_tour' as ContentType, label: 'Virtual Tour', icon: Play, count: 1, show: !!virtualTourUrl },
  ].filter((b) => b.show);

  if (contentBlocks.length === 0) return null;

  return (
    <div>
      <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-4">
        Premium Content
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {contentBlocks.map(({ type, label, icon: Icon, count }) => {
          const isUnlocked = unlockedContent.has(type);
          return (
            <button
              key={type}
              onClick={() => handleUnlockClick(type)}
              className={`relative group rounded-xl p-4 border text-center transition-all duration-300 ${
                isUnlocked
                  ? 'border-green-500/30 bg-green-500/5 hover:bg-green-500/10'
                  : 'border-gray-100 dark:border-[#1f1f1f] bg-white dark:bg-[#111] hover:border-green-500/20'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center ${
                  isUnlocked ? 'bg-green-500/15' : 'bg-gray-100 dark:bg-[#1a1a1a]'
                }`}
              >
                {isUnlocked ? (
                  <Icon className="w-5 h-5 text-green-500" />
                ) : (
                  <Lock className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">{label}</p>
              <p className="text-[10px] text-gray-400">
                {isUnlocked ? `View ${count} item${count > 1 ? 's' : ''}` : 'Tap to unlock'}
              </p>
            </button>
          );
        })}
      </div>

      {/* Unlock Modal */}
      <Modal
        isOpen={unlockModal}
        onClose={() => setUnlockModal(false)}
        title={`Unlock ${pendingContent ? contentLabels[pendingContent] : 'Content'}`}
      >
        <LeadForm
          source="unlock_content"
          projectId={projectId}
          projectName={projectName}
          unlockedContent={pendingContent || undefined}
          onSuccess={handleLeadSuccess}
          title=""
          subtitle={`Please share your details to access the ${pendingContent ? contentLabels[pendingContent] : 'content'}.`}
          submitLabel="Unlock Now"
        />
      </Modal>

      {/* Lightbox */}
      <Lightbox
        open={lightbox.open}
        close={() => setLightbox((p) => ({ ...p, open: false }))}
        slides={lightbox.slides}
        index={lightbox.index}
      />
    </div>
  );
}
