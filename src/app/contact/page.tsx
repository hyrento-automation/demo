"use client"

import React, { useState } from 'react';
import { Mail, MapPin, Phone, MessageSquare, Clock, ArrowRight, CheckCircle, Send } from 'lucide-react';
import type { Metadata } from 'next';

const CONTACT_ITEMS = [
  {
    icon: Phone,
    title: 'Call Us',
    detail: process.env.NEXT_PUBLIC_BRAND_PHONE || '+230 211 0000',
    sub: '24/7 Support Line',
    href: `tel:${process.env.NEXT_PUBLIC_BRAND_PHONE || '+2302110000'}`,
    color: 'text-blue-500', bg: 'bg-blue-50',
  },
  {
    icon: MessageSquare,
    title: 'WhatsApp',
    detail: process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '+230 5702 0000',
    sub: 'Instant messaging — we reply in minutes',
    href: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE?.replace(/[^0-9]/g, '') || '2305702000'}`,
    color: 'text-emerald-500', bg: 'bg-emerald-50',
  },
  {
    icon: Mail,
    title: 'Email Us',
    detail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@carhiremauritius.com',
    sub: 'General enquiries & booking questions',
    href: `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@carhiremauritius.com'}`,
    color: 'text-purple-500', bg: 'bg-purple-50',
  },
  {
    icon: Clock,
    title: 'Office Hours',
    detail: '08:00 – 18:00',
    sub: 'Mon – Sun · Airport branch 24/7',
    href: '/locations',
    color: 'text-gold', bg: 'bg-gold/10',
  },
];

const FAQ = [
  { q: 'Do you offer free cancellation?', a: 'Yes. Cancel any booking up to 24 hours before your pickup time for a full refund, no questions asked.' },
  { q: 'Can you deliver the car to my hotel?', a: 'Absolutely. We offer complimentary delivery to any hotel, villa, or address island-wide. Just let us know when booking.' },
  { q: 'What documents do I need?', a: 'A valid driver\'s license (international or from your home country), your passport, and a credit card for the security deposit.' },
  { q: 'Is comprehensive insurance included?', a: 'All our vehicles include basic insurance. We also offer Super CDW and full glass/tyre protection as optional upgrades.' },
];

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '', email: '', phone: '', subject: 'booking', message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-20 pb-24">

      {/* HERO */}
      <section className="relative overflow-hidden bg-navy py-28">
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="relative max-w-7xl mx-auto px-6 text-center space-y-6">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gold">Get in Touch</p>
          <h1 className="text-6xl md:text-8xl font-display text-white">
            Let's <span className="italic text-gold">Connect</span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Whether you have a question about our fleet, need a custom quote, or want to plan your island adventure — we're here.
          </p>
        </div>
      </section>

      {/* CONTACT CARDS */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CONTACT_ITEMS.map((item, i) => (
            <a
              key={i}
              href={item.href}
              className="group p-8 rounded-[2rem] bg-white border border-gray-100 hover:border-gold/30 hover:shadow-[0_20px_60px_rgba(27,45,79,0.1)] transition-all duration-500 hover:-translate-y-2 block"
            >
              <div className={`h-14 w-14 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <item.icon size={26} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-navy/40 mb-2">{item.title}</p>
              <p className="text-lg font-bold text-navy mb-1 break-all">{item.detail}</p>
              <p className="text-sm text-mid-gray">{item.sub}</p>
            </a>
          ))}
        </div>
      </section>

      {/* FORM + SIDE INFO */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Left — Form */}
          <div className="lg:col-span-3">
            <div className="bg-white p-10 md:p-14 rounded-[2.5rem] border border-gray-100 shadow-card">
              {submitted ? (
                <div className="text-center space-y-6 py-12">
                  <div className="h-24 w-24 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
                    <CheckCircle size={48} className="text-emerald-500" />
                  </div>
                  <h3 className="text-4xl font-display text-navy">Message Sent!</h3>
                  <p className="text-mid-gray max-w-sm mx-auto leading-relaxed">
                    Thank you! Our team will reply within 30 minutes during office hours. For urgent requests, call us directly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="h-12 px-8 rounded-xl bg-navy text-white font-black uppercase tracking-widest text-[11px] hover:bg-gold transition-colors"
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-10">
                    <h2 className="text-4xl font-display mb-2">Send a <span className="text-gold italic">Message</span></h2>
                    <p className="text-mid-gray text-sm">We respond within 30 minutes during business hours.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-navy/40">Full Name *</label>
                        <input
                          required
                          value={formState.name}
                          onChange={e => setFormState(s => ({ ...s, name: e.target.value }))}
                          className="w-full h-14 px-5 bg-offWhite rounded-2xl font-bold text-navy text-sm border-2 border-transparent focus:border-gold/30 transition-all"
                          placeholder="Jane Cooper"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-navy/40">Email Address *</label>
                        <input
                          required
                          type="email"
                          value={formState.email}
                          onChange={e => setFormState(s => ({ ...s, email: e.target.value }))}
                          className="w-full h-14 px-5 bg-offWhite rounded-2xl font-bold text-navy text-sm border-2 border-transparent focus:border-gold/30 transition-all"
                          placeholder="jane@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-navy/40">Phone / WhatsApp</label>
                        <input
                          value={formState.phone}
                          onChange={e => setFormState(s => ({ ...s, phone: e.target.value }))}
                          className="w-full h-14 px-5 bg-offWhite rounded-2xl font-bold text-navy text-sm border-2 border-transparent focus:border-gold/30 transition-all"
                          placeholder="+44 7700 000000"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-navy/40">Subject</label>
                        <select
                          value={formState.subject}
                          onChange={e => setFormState(s => ({ ...s, subject: e.target.value }))}
                          className="w-full h-14 px-5 bg-offWhite rounded-2xl font-bold text-navy text-sm border-2 border-transparent focus:border-gold/30 appearance-none cursor-pointer transition-all"
                        >
                          <option value="booking">Booking Enquiry</option>
                          <option value="fleet">Fleet Question</option>
                          <option value="longterm">Long-Term Rental</option>
                          <option value="corporate">Corporate Account</option>
                          <option value="feedback">Feedback</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-navy/40">Your Message *</label>
                      <textarea
                        required
                        value={formState.message}
                        onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
                        rows={5}
                        className="w-full p-5 bg-offWhite rounded-2xl font-bold text-navy text-sm border-2 border-transparent focus:border-gold/30 resize-none transition-all"
                        placeholder="Tell us about your requirements, desired car, travel dates..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="group w-full h-16 rounded-2xl bg-navy hover:bg-gold text-white font-black uppercase tracking-widest text-[13px] flex items-center justify-center gap-3 transition-all duration-400 hover:shadow-[0_16px_48px_rgba(201,168,76,0.4)] hover:-translate-y-0.5"
                    >
                      Send Message
                      <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Right — Info + FAQ */}
          <div className="lg:col-span-2 space-y-8">
            {/* Emergency Card */}
            <div className="relative rounded-[2rem] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=800&auto=format&fit=crop"
                alt="Emergency support"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy/80 to-transparent" />
              <div className="absolute bottom-0 p-8">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gold mb-2">Emergency Line</p>
                <p className="text-white font-bold text-lg mb-1">"Breakdown support — active island-wide, 24/7."</p>
                <a href={`tel:${process.env.NEXT_PUBLIC_EMERGENCY_PHONE || '+2305911000'}`} className="text-gold font-black text-xl tracking-wider hover:underline">
                  {process.env.NEXT_PUBLIC_EMERGENCY_PHONE || '+230 5911 0000'}
                </a>
              </div>
            </div>

            {/* HQ Location */}
            <div className="p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                  <MapPin size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-navy/40">Headquarters</p>
                  <p className="font-bold text-navy">Port Louis, Mauritius</p>
                </div>
              </div>
              <p className="text-sm text-mid-gray leading-relaxed">
                Our main office is in the capital city, with branches at SSR Airport, Grand Baie, and Flic en Flac.
              </p>
              <a
                href="/locations"
                className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gold hover:underline"
              >
                View All Locations <ArrowRight size={12} />
              </a>
            </div>

            {/* FAQ */}
            <div className="p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-lg font-display font-bold text-navy">Quick Answers</h3>
              <div className="space-y-3">
                {FAQ.map((item, i) => (
                  <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full text-left p-4 text-sm font-bold text-navy flex items-center justify-between hover:bg-offWhite transition-colors"
                    >
                      <span>{item.q}</span>
                      <span className={`text-gold font-black transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}>▼</span>
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4 text-sm text-mid-gray leading-relaxed border-t border-gray-50 pt-3">
                        {item.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
