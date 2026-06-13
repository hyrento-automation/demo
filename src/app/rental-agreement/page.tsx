import React from 'react';
import { FileText } from 'lucide-react';

export const metadata = {
  title: 'Rental Agreement',
  description: `Standard Rental Agreement for ${process.env.NEXT_PUBLIC_BRAND_NAME || 'Car Hire Mauritius'}`,
};

export default function RentalAgreementPage() {
  return (
    <div className="pt-32 pb-24 bg-offWhite min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-12 w-12 rounded-xl bg-gold/10 flex items-center justify-center">
            <FileText className="text-gold" size={24} />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-navy">
            Rental <span className="italic text-gold">Agreement</span>
          </h1>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-navy/5 prose prose-navy max-w-none">
          <p className="lead text-lg text-mid-gray mb-8">
            This Rental Agreement constitutes a legal contract between {process.env.NEXT_PUBLIC_BRAND_NAME || 'Car Hire Mauritius'} (the "Company") and the Renter. Please ensure you fully understand these conditions before signing at the time of vehicle pickup.
          </p>

          <h2 className="text-2xl font-display font-bold text-navy mt-8 mb-4">1. Vehicle Condition and Return</h2>
          <p className="text-mid-gray mb-4">
            The Company will provide the vehicle in good working order and clean condition. The Renter agrees to return the vehicle, including all accessories and equipment, in the same condition as received, barring normal wear and tear. The return must occur on the agreed date, time, and location. Late returns will incur additional charges.
          </p>

          <h2 className="text-2xl font-display font-bold text-navy mt-8 mb-4">2. Prohibited Uses</h2>
          <p className="text-mid-gray mb-4">The vehicle must NOT be used:</p>
          <ul className="space-y-2 text-mid-gray list-disc pl-6">
            <li>For any illegal purposes or in a manner that breaches Mauritian law.</li>
            <li>To carry passengers or property for hire.</li>
            <li>To tow or push anything.</li>
            <li>By any person under the influence of alcohol, drugs, or any other intoxicating substance.</li>
            <li>In off-road conditions or beaches (unless a specific 4x4 category has been rented and approved for such use).</li>
            <li>By any driver not explicitly authorized on the rental agreement.</li>
          </ul>

          <h2 className="text-2xl font-display font-bold text-navy mt-8 mb-4">3. Fuel Policy</h2>
          <p className="text-mid-gray mb-4">
            Vehicles are supplied with a "Like-for-Like" fuel policy. The Renter must return the vehicle with the same amount of fuel as recorded at the time of pickup. Missing fuel will be charged at a premium rate along with a refueling service fee.
          </p>

          <h2 className="text-2xl font-display font-bold text-navy mt-8 mb-4">4. Accidents and Damage</h2>
          <p className="text-mid-gray mb-4">
            In the event of an accident, damage, or theft, the Renter must immediately notify the Company and the local police. The Renter must not admit liability without the Company's consent. A police report is mandatory for any insurance claim to be processed.
          </p>

          <p className="mt-12 text-sm text-mid-gray italic">
            This agreement is governed by the laws of the Republic of Mauritius.
          </p>
        </div>
      </div>
    </div>
  );
}
