import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const COLLAGE = [
  {
    src: "/products/gold-shimmer-abaya/ai-02-lifestyle.jpg",
    alt: "Gold Shimmer Abaya",
    href: "/products/gold-shimmer-abaya",
  },
  {
    src: "/products/grey-tassel-abaya/ai-02-lifestyle.jpg",
    alt: "Grey Tassel Abaya",
    href: "/products/grey-tassel-abaya",
  },
  {
    src: "/products/marble-fur-kimono/ai-02-lifestyle.jpg",
    alt: "Marble Fur-Trim Kimono",
    href: "/products/marble-fur-kimono",
  },
  {
    src: "/products/rose-lace-kimono/ai-02-lifestyle.jpg",
    alt: "Rose Butterfly Lace Kimono",
    href: "/products/rose-lace-kimono",
  },
]

const Hero = () => {
  return (
    <section className="w-full bg-nikoo-ivory">
      {/* ── Desktop: side-by-side ── */}
      <div className="hidden small:flex h-[90vh] min-h-[620px]">

        {/* Left — text panel */}
        <div className="relative flex flex-col justify-center w-[38%] px-16 xl:px-24 gap-y-7 shrink-0">
          {/* Corner accents */}
          <div className="absolute top-8 left-8 w-12 h-12 border-l border-t border-nikoo-gold opacity-40" />
          <div className="absolute bottom-8 left-8 w-12 h-12 border-l border-b border-nikoo-gold opacity-40" />

          <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-nikoo-gold">
            New Collection · Eid 2026
          </p>

          <h1 className="font-display text-6xl xl:text-7xl font-light text-nikoo-charcoal leading-none tracking-wide">
            Dress for
            <br />
            <em className="italic">every moment</em>
          </h1>

          <p className="font-sans text-sm text-nikoo-muted max-w-[260px] tracking-wide leading-relaxed">
            Abayas and modest wear crafted for the modern Muslim woman.
            Free UK shipping on orders over £50.
          </p>

          <div className="flex flex-col xsmall:flex-row gap-3 mt-1">
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

        {/* Right — 2×2 collage */}
        <div className="grid grid-cols-2 grid-rows-2 gap-[3px] flex-1 bg-nikoo-ivory">
          {COLLAGE.map((item) => (
            <LocalizedClientLink
              key={item.src}
              href={item.href}
              className="relative overflow-hidden group"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 1024px) 31vw"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              {/* Hover label */}
              <div className="absolute inset-0 bg-nikoo-charcoal/0 group-hover:bg-nikoo-charcoal/20 transition-colors duration-300" />
              <span className="absolute bottom-4 left-4 font-sans text-[10px] tracking-[0.25em] uppercase text-nikoo-cream opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.alt}
              </span>
            </LocalizedClientLink>
          ))}
        </div>
      </div>

      {/* ── Mobile / tablet: stacked ── */}
      <div className="small:hidden">
        {/* Text block */}
        <div className="flex flex-col items-center text-center gap-y-5 px-6 pt-12 pb-8">
          <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-nikoo-gold">
            New Collection · Eid 2026
          </p>
          <h1 className="font-display text-5xl font-light text-nikoo-charcoal leading-none tracking-wide">
            Dress for
            <br />
            <em className="italic">every moment</em>
          </h1>
          <p className="font-sans text-sm text-nikoo-muted max-w-xs tracking-wide leading-relaxed">
            Abayas and modest wear crafted for the modern Muslim woman.
          </p>
          <div className="flex gap-3 flex-col xsmall:flex-row mt-1">
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

        {/* 2×2 image grid */}
        <div className="grid grid-cols-2 gap-[3px] bg-nikoo-ivory">
          {COLLAGE.map((item) => (
            <LocalizedClientLink
              key={item.src}
              href={item.href}
              className="relative aspect-square overflow-hidden"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="50vw"
                className="object-cover object-top"
              />
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
