import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthSessionProvider } from '@/src/components/providers/SessionProvider';
import AppChrome from '@/src/components/layout/AppChrome';
import CookieBanner from '@/src/components/layout/CookieBanner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: `${process.env.NEXT_PUBLIC_BRAND_NAME || 'Car Hire Mauritius'} | Luxury Car Rental — Island-Wide Delivery`,
    template: `%s | ${process.env.NEXT_PUBLIC_BRAND_NAME || 'Car Hire Mauritius'}`,
  },
  description: 'Mauritius\'s most trusted luxury car rental service since 2010. 20+ premium vehicles, free island-wide delivery, 24/7 support. Book your dream car today.',
  keywords: ['car hire mauritius', 'luxury car rental mauritius', 'rent a car mauritius', 'car hire SSR airport', 'sports car rental mauritius'],
  authors: [{ name: process.env.NEXT_PUBLIC_BRAND_NAME || 'Car Hire Mauritius' }],
  creator: process.env.NEXT_PUBLIC_BRAND_NAME || 'Car Hire Mauritius',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://carehireos.shop',
    siteName: process.env.NEXT_PUBLIC_BRAND_NAME || 'Car Hire Mauritius',
    title: `${process.env.NEXT_PUBLIC_BRAND_NAME || 'Car Hire Mauritius'} | Luxury Car Rental`,
    description: 'Experience Mauritius in the finest machines. Premium fleet, free delivery, 24/7 concierge support.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1506012733851-4043ce625295?q=80&w=1200',
        width: 1200,
        height: 630,
        alt: `${process.env.NEXT_PUBLIC_BRAND_NAME || 'Car Hire Mauritius'} — Luxury Island Rentals`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${process.env.NEXT_PUBLIC_BRAND_NAME || 'Car Hire Mauritius'} | Luxury Car Rental`,
    description: 'Experience Mauritius in the finest machines. Premium fleet, free delivery, 24/7 support.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="flex min-h-screen flex-col bg-offWhite antialiased">
        <AuthSessionProvider>
          <AppChrome>{children}</AppChrome>
          <CookieBanner />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
