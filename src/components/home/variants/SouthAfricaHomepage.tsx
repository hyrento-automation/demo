import Link from 'next/link'
import { ArrowRight, Compass, Eye, Mountain } from 'lucide-react'
import { SharedMarketSections } from './SharedMarketSections'

export function SouthAfricaHomepage() {
  return (
    <div className="bg-[#f4ead8]">
      <section className="px-5 py-8 md:px-8">
        <div className="mx-auto grid max-w-[1500px] overflow-hidden rounded-[2.5rem] bg-[#173d32] text-white lg:grid-cols-[.9fr_1.1fr]">
          <div className="flex flex-col justify-between p-8 md:p-14 lg:p-16">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[.25em] text-[#f2b85b]"><Compass size={18} /> Cape Town and beyond</div>
            <div className="py-20">
              <h1 className="text-6xl font-black leading-[.9] tracking-[-.055em] text-white md:text-8xl">GO<br /><span className="text-[#f2b85b]">WILD.</span></h1>
              <p className="mt-7 max-w-md text-lg leading-8 text-white/70">From Table Mountain to the Garden Route—choose a car built for the next unforgettable turn.</p>
              <Link href="/booking" className="mt-9 inline-flex h-16 items-center gap-4 rounded-full bg-[#f2b85b] px-9 text-sm font-black uppercase tracking-wider text-[#173d32]">Choose your ride <ArrowRight size={19} /></Link>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm font-bold text-white/70"><span className="flex items-center gap-2"><Mountain size={18} className="text-[#f2b85b]" /> All-terrain options</span><span className="flex items-center gap-2"><Eye size={18} className="text-[#f2b85b]" /> Local route advice</span></div>
          </div>
          <div className="relative min-h-[620px] lg:min-h-[780px]">
            <img src="https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=90&w=1800&auto=format&fit=crop" alt="Cape Town South Africa landscape" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#173d32]/65 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 rounded-2xl bg-[#f4ead8] p-5 text-[#173d32] shadow-xl"><p className="text-xs font-black uppercase tracking-[.2em] text-[#9f5f2d]">Recommended drive</p><p className="mt-1 text-2xl font-black">Chapman’s Peak</p></div>
          </div>
        </div>
      </section>
      <SharedMarketSections label="Adventure-ready fleet" heading="City polish. Open-country confidence." description="A destination-led South African homepage using the same vehicles, booking flow and business operations." />
    </div>
  )
}
