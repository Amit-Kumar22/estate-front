'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import appConfig from '@/config/app.config';

interface WhatsAppButtonProps {
  phone?: string;
  message?: string;
}

export default function WhatsAppButton({
  phone   = appConfig.whatsapp.number,
  message = appConfig.whatsapp.defaultMessage,
}: WhatsAppButtonProps) {
  // If no phone number is configured, don't render the button
  if (!phone) return null;

  const whatsappUrl = `${appConfig.whatsapp.apiUrl}/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] text-white font-medium text-sm shadow-xl shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.4 }}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-5 h-5" />
      <span className="hidden sm:inline">WhatsApp Us</span>
    </motion.a>
  );
}

