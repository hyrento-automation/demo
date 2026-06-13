'use client';

import { Inter } from 'next/font/google';
import '../app/globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="flex min-h-screen items-center justify-center bg-offWhite p-6">
        <div className="bg-white p-10 rounded-[2rem] max-w-lg w-full text-center space-y-6 shadow-xl border border-gray-100">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto border border-red-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <path d="M12 9v4"/>
              <path d="M12 17h.01"/>
            </svg>
          </div>
          
          <div className="space-y-3">
            <h1 className="text-3xl font-display font-black text-navy">Fatal System Error</h1>
            <p className="text-mid-gray">
              A critical error crashed the application at the root level. Our team has been notified.
            </p>
          </div>

          <div className="pt-4 flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 h-14 rounded-xl bg-gray-100 hover:bg-gray-200 text-navy font-bold transition-colors"
            >
              Hard Reload
            </button>
            <button
              onClick={() => reset()}
              className="flex-1 h-14 rounded-xl bg-navy hover:bg-gold text-white font-bold transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
