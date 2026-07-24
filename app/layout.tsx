import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import QueryProvider from '@/context/QueryProvider';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: {
    default: 'Real Estate Platform - Premium Properties',
    template: '%s | Real Estate Platform',
  },
  description: 'Explore premium residential projects crafted for discerning homebuyers.',
  keywords: ['real estate', 'luxury apartments', 'premium homes', 'residential projects'],
  authors: [{ name: 'Real Estate Platform' }],
  creator: 'Real Estate Platform',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Real Estate Platform',
    title: 'Real Estate Platform - Premium Properties',
    description: 'Explore premium residential projects crafted for discerning homebuyers.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Real Estate Platform - Premium Properties',
    description: 'Explore premium residential projects crafted for discerning homebuyers.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  document.documentElement.classList.toggle('dark', theme === 'dark');
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 antialiased">
        <QueryProvider>
          <ThemeProvider>
            <AuthProvider>
              {children}
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
                    iconTheme: { primary: '#008c3d', secondary: '#fff' },
                  },
                  error: {
                    iconTheme: { primary: '#ef4444', secondary: '#fff' },
                  },
                }}
              />
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
