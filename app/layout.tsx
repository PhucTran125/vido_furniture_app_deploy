import type { Metadata } from 'next';
import { Open_Sans, Montserrat } from 'next/font/google';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingContactButton } from '@/components/FloatingContactButton';
import './globals.css';

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'VIDO Furniture | Premier Manufacturing in Vietnam',
  description: 'Export-quality furniture manufacturer specializing in compact furniture, creative seating, storage benches, and home decor for European, US, and Japanese markets.',
  keywords: 'furniture manufacturer Vietnam, export furniture, B2B furniture wholesale, compact furniture, creative seating',
  openGraph: {
    title: 'VIDO Furniture - Vietnam Premier Manufacturer',
    description: 'Export-quality furniture for international markets',
    url: 'https://vidofurniture.com',
    siteName: 'VIDO Furniture',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${openSans.variable} ${montserrat.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-background text-primary">
        <LanguageProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <FloatingContactButton />
        </LanguageProvider>
      </body>
    </html>
  );
}
