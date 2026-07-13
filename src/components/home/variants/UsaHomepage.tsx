import Link from 'next/link'
import { ArrowRight, Flag, Gauge, ShieldCheck } from 'lucide-react'
import { SharedMarketSections } from './SharedMarketSections'

export function UsaHomepage() {
  return (
    <div className="bg-[#f4f0e8]">
      <section className="overflow-hidden border-b-[12px] border-[#d7392f]">
        <div className="mx-auto grid min-h-[720px] max-w-[1500px] lg:grid-cols-2">
          <div className="flex flex-col justify-center px-7 py-20 md:px-16 lg:px-20">
            <div className="mb-8 flex items-center gap-3 text-xs font-black uppercase tracking-[.25em] text-[#154b8b]"><Flag size={18} /> California car hire</div>
            <h1 className="text-6xl font-black uppercase leading-[.88] tracking-[-.055em] text-[#132d4f] md:text-8xl">Your road.<br /><span className="text-[#d7392f]">Your rules.</span></h1>
            <p className="mt-7 max-w-lg text-lg leading-8 text-[#526174]">Cruise the Pacific Coast, cross the desert, or take downtown in stride. Pick the keys and go big.</p>
            <Link href="/booking" className="mt-9 inline-flex h-16 w-fit items-center gap-4 rounded-md bg-[#154b8b] px-9 text-sm font-black uppercase tracking-[.16em] text-white shadow-[8px_8px_0_#d7392f]">Start your trip <ArrowRight size={20} /></Link>
            <div className="mt-12 grid max-w-xl grid-cols-3 border-y border-[#132d4f]/15 py-5 text-[#132d4f]">
              <div><Gauge className="mb-2 text-[#d7392f]" /><strong className="block text-2xl">50+</strong><span className="text-xs font-bold uppercase">Cars ready</span></div>
              <div><ShieldCheck className="mb-2 text-[#d7392f]" /><strong className="block text-2xl">24/7</strong><span className="text-xs font-bold uppercase">Road support</span></div>
              <div><Flag className="mb-2 text-[#d7392f]" /><strong className="block text-2xl">5★</strong><span className="text-xs font-bold uppercase">Trip rating</span></div>
            </div>
          </div>
          <div className="relative min-h-[560px]">
            <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=85&w=1600&auto=format&fit=crop" alt="California open road" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#132d4f]/80 to-transparent p-10 pt-36 text-white"><p className="text-xs font-black uppercase tracking-[.25em] text-white/70">Route of the month</p><p className="mt-2 text-3xl font-black">Pacific Coast Highway</p></div>
          </div>
        </div>
      </section>
      <SharedMarketSections label="Made for the open road" heading="From compact city cars to full-size adventures" description="A bold American storefront backed by the same live fleet, checkout, customer and operations system." />
    </div>
  )
}
