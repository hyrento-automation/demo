'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
    // Here you would typically initialize analytics
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 transform transition-transform duration-500">
      <div className="max-w-4xl mx-auto bg-navy text-white p-6 rounded-2xl shadow-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        
        <div className="flex-1 space-y-2">
          <h3 className="font-display font-bold text-lg text-gold">We Value Your Privacy</h3>
          <p className="text-sm text-white/70 leading-relaxed">
            We use essential cookies to make our site work. With your consent, we may also use non-essential cookies to improve user experience and analyze website traffic. By clicking &quot;Accept&quot;, you agree to our website&apos;s cookie use as described in our{' '}
            <Link href="/privacy" className="underline hover:text-gold transition-colors">
              Privacy Policy
            </Link>.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleDecline}
            className="flex-1 sm:flex-none px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors text-sm font-bold"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gold hover:bg-[#b09038] transition-colors text-white text-sm font-bold shadow-[0_4px_12px_rgba(201,168,76,0.3)]"
          >
            Accept
          </button>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-colors hidden sm:block"
            aria-label="Close banner"
          >
            <X size={20} />
          </button>
        </div>

      </div>
    </div>
  );
}
