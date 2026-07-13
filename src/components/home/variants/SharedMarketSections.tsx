import FleetSection from '@/src/components/home/FleetSection'
import TestimonialsSection from '@/src/components/home/TestimonialsSection'
import WhyChooseUs from '@/src/components/home/WhyChooseUs'

interface SharedMarketSectionsProps {
  label: string
  heading: string
  description: string
}

export function SharedMarketSections({ label, heading, description }: SharedMarketSectionsProps) {
  return (
    <>
      <FleetSection />
      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 max-w-2xl">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-gold">{label}</p>
            <h2 className="text-4xl font-black tracking-tight text-navy md:text-6xl">{heading}</h2>
            <p className="mt-5 text-lg leading-8 text-mid-gray">{description}</p>
          </div>
          <WhyChooseUs />
        </div>
      </section>
      <TestimonialsSection />
    </>
  )
}
