import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  const { collections } = await listCollections({ fields: "*products" })
  const productCategories = await listCategories()

  return (
    <footer className="bg-nikoo-charcoal text-nikoo-cream">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="content-container py-14 flex flex-col small:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-nikoo-gold mb-2">
              Stay Connected
            </p>
            <h3 className="font-display text-3xl font-light tracking-wide">
              Subscribe for exclusive offers
            </h3>
          </div>
          <form className="flex w-full small:w-auto gap-0">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 small:w-72 px-5 py-3 bg-white/10 border border-white/20 text-nikoo-cream placeholder:text-white/40 font-sans text-xs tracking-wide focus:outline-none focus:border-nikoo-gold transition-colors duration-200"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-nikoo-gold text-nikoo-charcoal font-sans text-xs tracking-[0.2em] uppercase hover:bg-white transition-colors duration-200 whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Links */}
      <div className="content-container py-16">
        <div className="grid grid-cols-2 small:grid-cols-4 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 small:col-span-1">
            <LocalizedClientLink href="/">
              <span className="font-display text-3xl font-light tracking-[0.12em] text-nikoo-cream">
                Nikoo Life
              </span>
            </LocalizedClientLink>
            <p className="mt-4 font-sans text-xs text-white/50 leading-relaxed max-w-[200px]">
              Modest fashion for the modern Muslim woman. Crafted with care, delivered to your door.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://instagram.com/nikoolife" target="_blank" rel="noreferrer" aria-label="Instagram"
                className="text-white/50 hover:text-nikoo-gold transition-colors duration-200">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="https://tiktok.com/@nikoolife" target="_blank" rel="noreferrer" aria-label="TikTok"
                className="text-white/50 hover:text-nikoo-gold transition-colors duration-200">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-sans text-[10px] tracking-[0.25em] uppercase text-nikoo-gold mb-5">Shop</h4>
            <ul className="space-y-3">
              {collections?.slice(0, 5).map((c) => (
                <li key={c.id}>
                  <LocalizedClientLink
                    href={`/collections/${c.handle}`}
                    className="font-sans text-xs text-white/60 hover:text-nikoo-gold transition-colors duration-200 tracking-wide"
                  >
                    {c.title}
                  </LocalizedClientLink>
                </li>
              ))}
              <li>
                <LocalizedClientLink
                  href="/store"
                  className="font-sans text-xs text-white/60 hover:text-nikoo-gold transition-colors duration-200 tracking-wide"
                >
                  All Products
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

          {/* Categories */}
          {productCategories?.length > 0 && (
            <div>
              <h4 className="font-sans text-[10px] tracking-[0.25em] uppercase text-nikoo-gold mb-5">Categories</h4>
              <ul className="space-y-3">
                {productCategories.slice(0, 5).map((c) => (
                  <li key={c.id}>
                    <LocalizedClientLink
                      href={`/categories/${c.handle}`}
                      className="font-sans text-xs text-white/60 hover:text-nikoo-gold transition-colors duration-200 tracking-wide"
                    >
                      {c.name}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Help */}
          <div>
            <h4 className="font-sans text-[10px] tracking-[0.25em] uppercase text-nikoo-gold mb-5">Help</h4>
            <ul className="space-y-3">
              {[
                { label: "Shipping & Returns", href: "/shipping" },
                { label: "Size Guide", href: "/size-guide" },
                { label: "Contact Us", href: "/contact" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms & Conditions", href: "/terms" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <LocalizedClientLink
                    href={href}
                    className="font-sans text-xs text-white/60 hover:text-nikoo-gold transition-colors duration-200 tracking-wide"
                  >
                    {label}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col small:flex-row items-center justify-between gap-4">
          <p className="font-sans text-[10px] text-white/30 tracking-widest uppercase">
            © {new Date().getFullYear()} Nikoo Life. All rights reserved.
          </p>
          <p className="font-sans text-[10px] text-white/30 tracking-wide">
            Sole trader · nikoolife.co.uk
          </p>
        </div>
      </div>
    </footer>
  )
}
