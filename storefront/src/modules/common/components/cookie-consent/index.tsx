"use client"

import { useEffect, useState } from "react"

const CONSENT_KEY = "nikoo_cookie_consent"

export type ConsentLevel = "all" | "essential"

export function getCookieConsent(): ConsentLevel | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(CONSENT_KEY) as ConsentLevel | null
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) {
      setVisible(true)
    }
  }, [])

  function accept(level: ConsentLevel) {
    localStorage.setItem(CONSENT_KEY, level)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-nikoo-charcoal border-t border-white/10 shadow-2xl">
      <div className="content-container py-5 flex flex-col small:flex-row items-start small:items-center justify-between gap-4">
        <div className="flex-1">
          <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-nikoo-gold mb-1">
            Cookie Preferences
          </p>
          <p className="font-sans text-xs text-white/70 leading-relaxed max-w-xl">
            We use essential cookies to keep your cart and session working. With your consent, we also use
            analytics and marketing cookies to improve your experience and show relevant ads.{" "}
            <a href="/gb/privacy" className="underline text-white/90 hover:text-nikoo-gold transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={() => accept("essential")}
            className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/60 border border-white/20 px-6 py-2.5 hover:border-white/50 hover:text-white transition-colors duration-200"
          >
            Essential Only
          </button>
          <button
            onClick={() => accept("all")}
            className="font-sans text-[10px] tracking-[0.2em] uppercase bg-nikoo-gold text-nikoo-charcoal px-6 py-2.5 hover:bg-white transition-colors duration-200"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  )
}
