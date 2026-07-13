import Link from 'next/link'
import { ArrowUpRight, Crown, Gem, Sparkles } from 'lucide-react'
import { SharedMarketSections } from './SharedMarketSections'

export function UaeHomepage() {
  return (
    <div className="bg-[#080a0d] text-white">
      <section className="relative min-h-[820px] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=90&w=2200&auto=format&fit=crop" alt="Dubai skyline at night" className="absolute inset-0 h-full w-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,transparent_0%,#080a0d_72%)]" />
        <div className="relative mx-auto flex min-h-[820px] max-w-7xl items-center px-6 py-24">
          <div className="max-w-3xl">
            <div className="mb-7 inline-flex items-center gap-3 border border-[#d7b568]/40 bg-black/25 px-5 py-2 text-xs font-black uppercase tracking-[.28em] text-[#e8ca83] backdrop-blur"><Crown size={16} /> Dubai signature fleet</div>
            <h1 className="font-display text-6xl leading-[.95] tracking-[-.045em] text-white md:text-8xl">Arrive beyond<br /><span className="italic text-[#d7b568]">expectation.</span></h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-white/65">A private collection of exceptional vehicles, delivered wherever your Dubai story begins.</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/booking" className="inline-flex h-16 items-center gap-4 bg-[#d7b568] px-9 text-sm font-black uppercase tracking-[.18em] text-black">Reserve now <ArrowUpRight size={19} /></Link>
              <Link href="/fleet" className="inline-flex h-16 items-center border border-white/25 bg-white/5 px-9 text-sm font-black uppercase tracking-[.18em] text-white backdrop-blur">View collection</Link>
            </div>
            <div className="mt-14 flex flex-wrap gap-8 border-t border-white/15 pt-7 text-sm text-white/65">
              <span className="flex items-center gap-2"><Gem size={17} className="text-[#d7b568]" /> Five-star delivery</span>
              <span className="flex items-center gap-2"><Sparkles size={17} className="text-[#d7b568]" /> Immaculate vehicles</span>
            </div>
          </div>
        </div>
      </section>
      <SharedMarketSections market="uae" />
    </div>
  )
}
