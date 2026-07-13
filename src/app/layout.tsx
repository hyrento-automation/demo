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

import { headers } from 'next/headers';
import { getBrandConfig } from '@/src/lib/brand';
import { BrandProvider } from '@/src/components/providers/BrandProvider';

export async function generateMetadata(): Promise<Metadata> {
  const host = headers().get('host');
  const brandConfig = getBrandConfig(host);

  return {
    title: {
      default: `${brandConfig.name} | Luxury Car Rental — Island-Wide Delivery`,
      template: `%s | ${brandConfig.name}`,
    },
    description: `${brandConfig.name} is the island's most trusted luxury car rental service. Premium fleet, free island-wide delivery, 24/7 support. Book your dream car today.`,
    keywords: ['car hire mauritius', 'luxury car rental mauritius', 'rent a car mauritius', 'car hire SSR airport', 'sports car rental mauritius'],
    authors: [{ name: brandConfig.name }],
    creator: brandConfig.name,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: process.env.NEXT_PUBLIC_APP_URL || 'https://carehireos.shop',
      siteName: brandConfig.name,
      title: `${brandConfig.name} | Luxury Car Rental`,
      description: `Experience Mauritius in the finest machines. Premium fleet, free delivery, 24/7 concierge support.`,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1506012733851-4043ce625295?q=80&w=1200',
          width: 1200,
          height: 630,
          alt: `${brandConfig.name} — Luxury Island Rentals`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${brandConfig.name} | Luxury Car Rental`,
      description: `Experience Mauritius in the finest machines. Premium fleet, free delivery, 24/7 support.`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const host = headers().get('host');
  const brandConfig = getBrandConfig(host);

  return (
    <html 
      lang="en" 
      className={`${inter.variable}`}
      style={{
        '--navy': brandConfig.theme.primary,
        '--navy-light': brandConfig.theme.primaryLight,
        '--navy-dark': brandConfig.theme.primaryDark,
        '--gold': brandConfig.theme.accent,
        '--gold-light': brandConfig.theme.accentLight,
        '--gold-dark': brandConfig.theme.accentDark,
      } as React.CSSProperties}
    >
      <body className="flex min-h-screen flex-col bg-offWhite antialiased">
        <AuthSessionProvider>
          <BrandProvider initialBrand={brandConfig}>
            <AppChrome>{children}</AppChrome>
            <CookieBanner />
            <a
              href={`https://wa.me/${brandConfig.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%2C%20I'm%20interested%20in%20renting%20a%20car.%20Can%20you%20help%20me%3F`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="whatsapp-btn"
              style={{
                position: 'fixed',
                bottom: '28px',
                right: '28px',
                zIndex: 9999,
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #25D366, #128C7E)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(37,211,102,0.45), 0 2px 8px rgba(0,0,0,0.15)',
                transition: 'transform 0.3s cubic-bezier(0.23,1,0.32,1), box-shadow 0.3s ease',
                textDecoration: 'none',
              }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          </BrandProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
