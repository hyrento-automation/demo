import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions',
  description: `Terms and Conditions for ${process.env.NEXT_PUBLIC_BRAND_NAME || 'Pleasure Drive Ltd'}`,
};

export default function TermsPage() {
  return (
    <div className="pt-32 pb-24 bg-offWhite min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-12 w-12 rounded-xl bg-gold/10 flex items-center justify-center">
            <ShieldAlert className="text-gold" size={24} />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-navy">
            Terms & <span className="italic text-gold">Conditions</span>
          </h1>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-navy/5 prose prose-navy max-w-none">
          <p className="lead text-lg text-mid-gray mb-8">
            Please read these terms and conditions carefully before booking a vehicle with {process.env.NEXT_PUBLIC_BRAND_NAME || 'Pleasure Drive Ltd'}. By using our services, you agree to be bound by these terms.
          </p>

          <h2 className="text-2xl font-display font-bold text-navy mt-8 mb-4">1. General Requirements</h2>
          <ul className="space-y-2 text-mid-gray list-disc pl-6">
            <li>The minimum age to rent a vehicle is 21 years old (25 for luxury/sports categories).</li>
            <li>A valid, unendorsed driving license held for at least 1 year is required.</li>
            <li>International renters must provide a valid passport and an international driving permit if the license is not in English or French.</li>
          </ul>

          <h2 className="text-2xl font-display font-bold text-navy mt-8 mb-4">2. Bookings and Payments</h2>
          <ul className="space-y-2 text-mid-gray list-disc pl-6">
            <li>All rentals require a valid credit card in the primary driver's name for the security deposit.</li>
            <li>A 25% deposit is required to confirm the booking. The remaining balance is due 48 hours prior to pickup or at the counter.</li>
            <li>Rates include standard insurance, unlimited mileage, and 24/7 roadside assistance.</li>
          </ul>

          <h2 className="text-2xl font-display font-bold text-navy mt-8 mb-4">3. Insurance and Excess</h2>
          <ul className="space-y-2 text-mid-gray list-disc pl-6">
            <li>Standard Collision Damage Waiver (CDW) and Theft Protection are included in the rate.</li>
            <li>An excess amount applies in the event of damage or theft. The excess amount varies by vehicle category.</li>
            <li>Tires, glass, and undercarriage damage are not covered by standard insurance unless a premium protection package is purchased.</li>
          </ul>

          <h2 className="text-2xl font-display font-bold text-navy mt-8 mb-4">4. Cancellations and Modifications</h2>
          <ul className="space-y-2 text-mid-gray list-disc pl-6">
            <li>Cancellations made more than 24 hours before the rental start date will receive a full refund — no questions asked.</li>
            <li>Cancellations made within 24 hours of pickup are subject to a cancellation fee equivalent to 1 day's rental charge.</li>
            <li>No-shows will be charged the full amount of the reservation.</li>
          </ul>

          <p className="mt-12 text-sm text-mid-gray italic">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
}
