import Link from 'next/link'
import { ArrowRight, Check, MapPin, Sun } from 'lucide-react'
import { SharedMarketSections } from './SharedMarketSections'

export function SpainHomepage() {
  return (
    <div className="bg-[#fff8ed]">
      <section className="relative overflow-hidden px-6 py-16 md:py-24">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#ff6b35]/15 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#d74b26]/20 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#b53b1d]">
              <Sun size={15} /> Spain, your way
            </div>
            <h1 className="max-w-3xl font-display text-6xl font-black leading-[.92] tracking-[-0.055em] text-[#2f211b] md:text-8xl">
              Follow the sun. <span className="text-[#d84e27]">Drive España.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[#705d52]">
              From Barcelona boulevards to the coves of Costa Brava, collect your car and make the Mediterranean yours.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/booking" className="inline-flex h-14 items-center gap-3 rounded-full bg-[#d84e27] px-8 text-sm font-black uppercase tracking-wider text-white shadow-xl shadow-[#d84e27]/20">
                Find your car <ArrowRight size={18} />
              </Link>
              <Link href="/fleet" className="inline-flex h-14 items-center rounded-full border border-[#2f211b]/15 bg-white px-8 text-sm font-black uppercase tracking-wider text-[#2f211b]">
                Explore fleet
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm font-bold text-[#705d52]">
              {['Airport collection', 'No hidden fees', '24/7 road support'].map(item => <span key={item} className="flex items-center gap-2"><Check size={16} className="text-[#d84e27]" />{item}</span>)}
            </div>
          </div>
          <div className="relative min-h-[540px] overflow-hidden rounded-[2.5rem] shadow-2xl">
            <img src="https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=85&w=1400&auto=format&fit=crop" alt="Mediterranean Spain road trip" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2f211b]/75 via-transparent to-transparent" />
            <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between rounded-3xl border border-white/20 bg-white/15 p-5 text-white backdrop-blur-xl">
              <div><p className="text-xs font-black uppercase tracking-[.2em] text-white/70">Featured route</p><p className="mt-1 text-2xl font-black">Barcelona → Costa Brava</p></div>
              <MapPin className="text-[#ffbf69]" />
            </div>
          </div>
        </div>
      </section>
      <SharedMarketSections label="Spanish road collection" heading="Cars selected for coast, city and countryside" description="The same dependable booking platform, presented for travellers exploring Spain and the Mediterranean." />
    </div>
  )
}
