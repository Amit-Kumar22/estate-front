'use client';

import { Toaster, ToastBar, toast } from 'react-hot-toast';
import { X } from 'lucide-react';

export default function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#111',
          color: '#f1f5f9',
          border: '1px solid #1f1f1f',
          borderRadius: '10px',
          fontSize: '14px',
        },
        success: {
          iconTheme: { primary: '#f0b400', secondary: '#fff' },
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: '#fff' },
        },
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <>
              {icon}
              {message}
              {t.type !== 'loading' && (
                <button
                  onClick={() => toast.dismiss(t.id)}
                  aria-label="Dismiss notification"
                  className="ml-1 flex-shrink-0 rounded-md p-1 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
}
