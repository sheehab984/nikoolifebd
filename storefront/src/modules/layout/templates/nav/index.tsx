import { Suspense } from "react"
import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Abayas", href: "/collections/abayas" },
  { label: "Hijabs", href: "/collections/hijabs" },
  { label: "New In", href: "/collections/new-in" },
  { label: "Sale", href: "/collections/sale" },
  { label: "Store", href: "/store" },
]

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <header className="bg-nikoo-cream border-b border-nikoo-border">
        {/* Main header row */}
        <div className="content-container flex items-center justify-between h-20">
          {/* Left — hamburger/search */}
          <div className="flex items-center gap-x-4 flex-1 basis-0">
            <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
            <LocalizedClientLink
              href="/store"
              aria-label="Search"
              className="text-nikoo-charcoal hover:text-nikoo-gold transition-colors duration-200"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </LocalizedClientLink>
          </div>

          {/* Centre — logo */}
          <LocalizedClientLink
            href="/"
            className="font-display text-3xl font-light tracking-[0.12em] text-nikoo-charcoal hover:text-nikoo-gold transition-colors duration-200 whitespace-nowrap"
            data-testid="nav-store-link"
          >
            Nikoo Life
          </LocalizedClientLink>

          {/* Right — account + cart */}
          <div className="flex items-center gap-x-5 flex-1 basis-0 justify-end">
            <LocalizedClientLink
              href="/account"
              aria-label="Account"
              className="text-nikoo-charcoal hover:text-nikoo-gold transition-colors duration-200 hidden small:flex"
              data-testid="nav-account-link"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </LocalizedClientLink>
            <Suspense
              fallback={
                <LocalizedClientLink
                  href="/cart"
                  aria-label="Cart"
                  className="text-nikoo-charcoal hover:text-nikoo-gold transition-colors duration-200"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </div>

        {/* Navigation links row */}
        <nav className="hidden small:block border-t border-nikoo-border">
          <ul className="content-container flex items-center justify-center gap-x-10 h-11">
            {navLinks.map(({ label, href }) => (
              <li key={label}>
                <LocalizedClientLink
                  href={href}
                  className="font-sans text-xs tracking-widest uppercase text-nikoo-charcoal hover:text-nikoo-gold transition-colors duration-200 py-3 border-b-2 border-transparent hover:border-nikoo-gold"
                >
                  {label}
                </LocalizedClientLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </div>
  )
}
