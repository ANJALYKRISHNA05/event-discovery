import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'EventPulse | Global Business & Tech Event Discovery Platform',
  description:
    'Discover world-class exhibitions, trade shows, technology summits, and business conferences across global tech hubs.',
  keywords: [
    'business events',
    'trade shows',
    'tech conferences',
    'exhibitions',
    'summits',
    'networking',
  ],
  authors: [{ name: 'EventPulse Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased flex flex-col mesh-bg">
        {children}
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: '#0f172a',
              border: '1px solid #1e293b',
              color: '#f8fafc',
            },
          }}
        />
      </body>
    </html>
  );
}
