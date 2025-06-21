
interface HeroSectionProps {
  title: string
  subtitle?: string
}

export function HeroSection({ title, subtitle }: HeroSectionProps) {
  return (
    <section className="hero overflow-hidden relative max-lg:pt-150 pt-[240px] pb-[60px] z-40">
      <div className="container">
        <div className="max-w-[948px] mx-auto text-center">
          {subtitle && <p className="mb-4 font-medium uppercase">{subtitle}</p>}
          <h1 className="max-lg:mb-10 mb-10" dangerouslySetInnerHTML={{ __html: title }} />
        </div>
      </div>
    </section>
  )
}
