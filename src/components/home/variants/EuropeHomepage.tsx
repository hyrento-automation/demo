import Link from 'next/link'
import { ArrowUpRight, BadgeCheck, Mountain, Route } from 'lucide-react'
import { SharedMarketSections } from './SharedMarketSections'

export function EuropeHomepage() {
  return (
    <div className="bg-[#f2f3ef]">
      <section className="px-5 py-5 md:px-8 md:py-8">
        <div className="relative mx-auto min-h-[760px] max-w-[1500px] overflow-hidden rounded-[2rem] bg-[#18211d] text-white">
          <img src="https://images.unsplash.com/photo-1464278533981-50106e6176b1?q=85&w=2000&auto=format&fit=crop" alt="European alpine road" className="absolute inset-0 h-full w-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#101713]/95 via-[#101713]/55 to-transparent" />
          <div className="relative z-10 flex min-h-[760px] flex-col justify-between p-8 md:p-14 lg:p-20">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-[.25em]">
              <span className="flex items-center gap-2"><Mountain size={18} /> Grand Tour Europe</span>
              <span className="hidden text-white/60 md:block">One car · endless borders</span>
            </div>
            <div className="max-w-4xl">
              <p className="mb-5 text-sm font-black uppercase tracking-[.3em] text-[#c9ff74]">Continental freedom</p>
              <h1 className="text-6xl font-black leading-[.88] tracking-[-.06em] text-white md:text-8xl lg:text-[7.5rem]">EUROPE<br /><span className="font-light italic text-white">UNFOLDS</span><br />AHEAD.</h1>
              <div className="mt-10 flex flex-wrap items-center gap-5">
                <Link href="/booking" className="inline-flex h-16 items-center gap-4 rounded-full bg-[#c9ff74] px-9 text-sm font-black uppercase tracking-wider text-[#101713]">Plan the drive <ArrowUpRight size={20} /></Link>
                <div className="flex gap-5 text-sm text-white/75"><span className="flex items-center gap-2"><Route size={17} /> Multi-city ready</span><span className="flex items-center gap-2"><BadgeCheck size={17} /> Fully protected</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <SharedMarketSections market="europe" />
    </div>
  )
}
