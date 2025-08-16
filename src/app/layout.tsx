import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ClientLayout } from '@/components/layout/client-layout';

export const metadata: Metadata = {
  title: {
    default: 'K6 Commander',
    template: `%s | K6 Commander`,
  },
  description:
    'Configure, run, and analyze load tests, Lighthouse audits, and SEO checks with a sleek web UI powered by k6, InfluxDB, and Grafana.',
  keywords: [
    'k6',
    'Lighthouse',
    'SEO',
    'load testing',
    'performance',
    'Next.js',
    'Docker',
    'Grafana',
  ],
  themeColor: '#7DF9FF',
  openGraph: {
    title: 'K6 Commander',
    description: 'Local-first, authorized load-testing platform.',
    url: 'https://github.com/your-username/k6-commander',
    siteName: 'K6 Commander',
    images: [
      {
        url: 'https://placehold.co/1200x630.png',
        width: 1200,
        height: 630,
        'data-ai-hint': 'technology abstract',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The lang attribute will be managed by the client-layout component
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.variable)}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
