import React from 'react';
import { Shield } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy',
  description: `Privacy Policy for ${process.env.NEXT_PUBLIC_BRAND_NAME || 'Car Hire Mauritius'}`,
};

export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-24 bg-offWhite min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-12 w-12 rounded-xl bg-gold/10 flex items-center justify-center">
            <Shield className="text-gold" size={24} />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-navy">
            Privacy <span className="italic text-gold">Policy</span>
          </h1>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-navy/5 prose prose-navy max-w-none">
          <p className="lead text-lg text-mid-gray mb-8">
            At {process.env.NEXT_PUBLIC_BRAND_NAME || 'Car Hire Mauritius'}, we are committed to protecting your personal information and respecting your privacy. This policy outlines how we collect, use, and protect your data.
          </p>

          <h2 className="text-2xl font-display font-bold text-navy mt-8 mb-4">1. Information We Collect</h2>
          <p className="text-mid-gray mb-4">We may collect the following information when you use our website or services:</p>
          <ul className="space-y-2 text-mid-gray list-disc pl-6">
            <li>Personal details (Name, Date of Birth, Email Address, Phone Number).</li>
            <li>Identity verification documents (Driver's License, Passport details).</li>
            <li>Payment information (processed securely through our payment provider, Stripe).</li>
            <li>Rental history and preferences.</li>
          </ul>

          <h2 className="text-2xl font-display font-bold text-navy mt-8 mb-4">2. How We Use Your Information</h2>
          <ul className="space-y-2 text-mid-gray list-disc pl-6">
            <li>To process your bookings and provide rental services.</li>
            <li>To verify your identity and age for insurance purposes.</li>
            <li>To communicate with you regarding your booking or customer support inquiries.</li>
            <li>To comply with legal obligations in Mauritius.</li>
          </ul>

          <h2 className="text-2xl font-display font-bold text-navy mt-8 mb-4" id="cookies">3. Cookies & Tracking</h2>
          <p className="text-mid-gray mb-4">
            We use cookies to enhance your browsing experience, analyze site traffic, and serve targeted advertisements. You can control cookie preferences through your browser settings. Essential cookies are required for the website's booking functionality.
          </p>

          <h2 className="text-2xl font-display font-bold text-navy mt-8 mb-4">4. Data Security</h2>
          <p className="text-mid-gray mb-4">
            We employ industry-standard security measures, including SSL encryption, to protect your personal data from unauthorized access, alteration, or disclosure. We do not sell your personal data to third parties.
          </p>

          <p className="mt-12 text-sm text-mid-gray italic">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
}
