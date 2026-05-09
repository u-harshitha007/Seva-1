import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RASTA Cortex — Bangalore Traffic Intelligence',
  description: 'Real-time AI-powered traffic monitoring for Bangalore. Live road conditions, hazard alerts, CCTV feeds, and adaptive signal intelligence across the city.',
  keywords: 'Bangalore traffic, live traffic, road conditions, CCTV, smart city, traffic alerts',
  authors: [{ name: 'RASTA Cortex Team' }],
  openGraph: {
    title: 'RASTA Cortex — Bangalore Traffic Intelligence',
    description: 'Real-time AI traffic monitoring for Bangalore — live map, CCTV feeds, hazard alerts.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#07090f',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
