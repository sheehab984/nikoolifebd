import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <div className="relative w-full h-[88vh] min-h-[560px] overflow-hidden bg-nikoo-ivory">
      {/* Background image */}
      <Image
        src="/banners/hero-gold-shimmer.jpg"
        alt="Gold Shimmer Abaya — Eid Edit 2026"
        fill
        priority
        className="object-cover object-top"
        sizes="100vw"
      />

      {/* Soft gradient overlay — left side for text legibility */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(250,247,242,0.82) 0%, rgba(250,247,242,0.5) 45%, rgba(250,247,242,0.1) 100%)",
        }}
      />

      {/* Decorative corner lines */}
      <div className="absolute top-10 left-10 w-16 h-16 border-l border-t border-nikoo-gold opacity-50" />
      <div className="absolute bottom-10 right-10 w-16 h-16 border-r border-b border-nikoo-gold opacity-50" />

      {/* Content — left-aligned on desktop, centred on mobile */}
      <div className="absolute inset-0 flex flex-col justify-center px-8 small:px-20 gap-y-6 items-center small:items-start text-center small:text-left">
        <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-nikoo-gold">
          New Collection · Eid 2026
        </p>

        <h1 className="font-display text-5xl small:text-7xl font-light text-nikoo-charcoal leading-none tracking-wide max-w-md">
          Dress for
          <br />
          <em className="italic">every moment</em>
        </h1>

        <p className="font-sans text-sm text-nikoo-muted max-w-xs tracking-wide leading-relaxed">
          Abayas and modest wear crafted for the modern Muslim woman.
          Free UK shipping on orders over £50.
        </p>

        <div className="flex gap-4 mt-2 flex-col xsmall:flex-row">
          <LocalizedClientLink
            href="/store"
            className="inline-block font-sans text-xs tracking-[0.25em] uppercase text-nikoo-cream bg-nikoo-charcoal px-10 py-4 hover:bg-nikoo-gold transition-colors duration-300"
          >
            Shop Now
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/collections/new-in"
            className="inline-block font-sans text-xs tracking-[0.25em] uppercase text-nikoo-charcoal border border-nikoo-charcoal px-10 py-4 hover:bg-nikoo-charcoal hover:text-nikoo-cream transition-colors duration-300"
          >
            New In
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}

export default Hero
