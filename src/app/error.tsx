'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6">
      <div className="bg-white p-8 rounded-[2rem] max-w-md w-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 text-center space-y-6">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
          <AlertTriangle size={32} />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-display font-bold text-navy">Something went wrong</h2>
          <p className="text-mid-gray text-sm">
            We apologize for the inconvenience. A critical error occurred while rendering this page.
          </p>
        </div>

        <button
          onClick={() => reset()}
          className="w-full h-12 rounded-xl bg-navy hover:bg-gold text-white font-bold transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCcw size={18} />
          Try Again
        </button>
      </div>
    </div>
  );
}
