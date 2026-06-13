import React from 'react';

export const metadata = {
  title: 'Accessibility Statement',
  description: 'Our commitment to digital accessibility for all users.',
};

export default function AccessibilityPage() {
  return (
    <div className="py-24 bg-offWhite min-h-screen">
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-navy">Accessibility Statement</h1>
          <p className="text-mid-gray">Last updated: April 25, 2026</p>
        </div>

        <div className="prose prose-lg prose-navy max-w-none">
          <p>
            <strong>{process.env.NEXT_PUBLIC_BRAND_NAME || 'Car Hire Mauritius'}</strong> is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to guarantee we provide equal access to our premium car rental services.
          </p>

          <h2 className="text-2xl font-display font-bold text-navy mt-12 mb-6">Conformance Status</h2>
          <p>
            The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA.
          </p>
          <p>
            {process.env.NEXT_PUBLIC_BRAND_NAME || 'Car Hire Mauritius'} is partially conformant with <strong>WCAG 2.1 level AA</strong>. Partially conformant means that some parts of the content do not fully conform to the accessibility standard. We are actively working to resolve these limitations.
          </p>

          <h2 className="text-2xl font-display font-bold text-navy mt-12 mb-6">Feedback & Contact</h2>
          <p>
            We welcome your feedback on the accessibility of {process.env.NEXT_PUBLIC_BRAND_NAME || 'Car Hire Mauritius'}. Please let us know if you encounter accessibility barriers on our platform:
          </p>
          <ul className="list-disc pl-6 space-y-2 my-6">
            <li>Phone: <a href={`tel:${process.env.NEXT_PUBLIC_BRAND_PHONE || '+23052528340'}`} className="text-gold hover:underline">{process.env.NEXT_PUBLIC_BRAND_PHONE || '+230 5252 8340'}</a></li>
            <li>E-mail: <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'support@carhiremauritius.com'}`} className="text-gold hover:underline">{process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'support@carhiremauritius.com'}</a></li>
            <li>Postal Address: SSR International Airport, Plaine Magnien, Mauritius</li>
          </ul>
          <p>
            We try to respond to feedback within 2 business days.
          </p>

          <h2 className="text-2xl font-display font-bold text-navy mt-12 mb-6">Technical Specifications</h2>
          <p>
            Accessibility of {process.env.NEXT_PUBLIC_BRAND_NAME || 'Car Hire Mauritius'} relies on the following technologies to work with the particular combination of web browser and any assistive technologies or plugins installed on your computer:
          </p>
          <ul className="list-disc pl-6 space-y-2 my-6">
            <li>HTML</li>
            <li>WAI-ARIA</li>
            <li>CSS</li>
            <li>JavaScript</li>
          </ul>
          <p>These technologies are relied upon for conformance with the accessibility standards used.</p>

        </div>
      </div>
    </div>
  );
}
