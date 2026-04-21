import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <div className="relative w-full h-[80vh] min-h-[520px] overflow-hidden bg-nikoo-ivory">
      {/* Background texture / gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #F2EDE4 0%, #EDE4D6 40%, #E5D9C5 100%)",
        }}
      />

      {/* Decorative corner line */}
      <div className="absolute top-10 left-10 w-20 h-20 border-l border-t border-nikoo-gold opacity-40" />
      <div className="absolute bottom-10 right-10 w-20 h-20 border-r border-b border-nikoo-gold opacity-40" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 gap-y-8">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-nikoo-gold">
          New Collection
        </p>

        <h1 className="font-display text-6xl small:text-8xl font-light text-nikoo-charcoal leading-none tracking-wide">
          Eid Edit
          <br />
          <em className="font-light italic">2026</em>
        </h1>

        <p className="font-sans text-sm text-nikoo-muted max-w-xs tracking-wide leading-relaxed">
          Timeless abayas and modest wear crafted for the modern Muslim woman.
        </p>

        <LocalizedClientLink
          href="/store"
          className="mt-2 inline-block font-sans text-xs tracking-[0.25em] uppercase text-nikoo-cream bg-nikoo-charcoal px-10 py-4 hover:bg-nikoo-gold transition-colors duration-300"
        >
          Shop Now
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default Hero
