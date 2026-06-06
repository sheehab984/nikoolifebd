"use client"

import { useState } from "react"

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    // Simulate submission — replace with real endpoint (e.g. EmailJS, Resend, etc.)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 800)
  }

  return (
    <div className="bg-nikoo-cream min-h-screen">
      {/* Header */}
      <div className="bg-nikoo-ivory border-b border-nikoo-border">
        <div className="content-container py-16 text-center">
          <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-nikoo-gold mb-3">
            Get in Touch
          </p>
          <h1 className="font-display text-5xl font-light text-nikoo-charcoal tracking-wide">
            Contact Us
          </h1>
          <p className="font-sans text-xs text-nikoo-muted mt-4 tracking-wide max-w-md mx-auto">
            We typically respond within one working day. For urgent enquiries please email us directly.
          </p>
        </div>
      </div>

      <div className="content-container py-16">
        <div className="grid grid-cols-1 small:grid-cols-2 gap-16 max-w-4xl mx-auto">

          {/* Contact info */}
          <div className="space-y-10">
            <div>
              <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-nikoo-gold mb-4">Customer Care</p>
              <ul className="space-y-5 text-sm text-nikoo-muted">
                {[
                  { label: "General Enquiries", value: "hello@nikoolife.co.uk", href: "mailto:hello@nikoolife.co.uk" },
                  { label: "Returns", value: "returns@nikoolife.co.uk", href: "mailto:returns@nikoolife.co.uk" },
                  { label: "Wholesale", value: "wholesale@nikoolife.co.uk", href: "mailto:wholesale@nikoolife.co.uk" },
                ].map(({ label, value, href }) => (
                  <li key={label}>
                    <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-nikoo-charcoal block mb-0.5">{label}</span>
                    <a href={href} className="text-nikoo-muted hover:text-nikoo-gold transition-colors duration-200">{value}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-nikoo-gold mb-4">Response Times</p>
              <ul className="space-y-2 text-sm text-nikoo-muted">
                {[
                  "Monday–Friday: within 1 working day",
                  "Weekends & Bank Holidays: next working day",
                  "During sale periods, responses may take up to 2 days",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-nikoo-gold mt-0.5">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-nikoo-gold mb-4">Follow Us</p>
              <div className="flex gap-4">
                <a href="https://instagram.com/nikoolife" target="_blank" rel="noreferrer"
                  className="font-sans text-xs tracking-[0.2em] uppercase text-nikoo-muted hover:text-nikoo-gold transition-colors border-b border-nikoo-border pb-0.5 hover:border-nikoo-gold">
                  Instagram
                </a>
                <a href="https://tiktok.com/@nikoolife" target="_blank" rel="noreferrer"
                  className="font-sans text-xs tracking-[0.2em] uppercase text-nikoo-muted hover:text-nikoo-gold transition-colors border-b border-nikoo-border pb-0.5 hover:border-nikoo-gold">
                  TikTok
                </a>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div>
            {submitted ? (
              <div className="border border-nikoo-border bg-nikoo-ivory p-10 text-center">
                <p className="font-display text-3xl font-light text-nikoo-charcoal mb-3">Thank you</p>
                <p className="font-sans text-sm text-nikoo-muted">
                  Your message has been received. We'll be in touch within one working day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-nikoo-charcoal block mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-nikoo-border bg-nikoo-ivory px-4 py-3 font-sans text-sm text-nikoo-charcoal placeholder:text-nikoo-muted focus:outline-none focus:border-nikoo-charcoal transition-colors duration-200"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-nikoo-charcoal block mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full border border-nikoo-border bg-nikoo-ivory px-4 py-3 font-sans text-sm text-nikoo-charcoal placeholder:text-nikoo-muted focus:outline-none focus:border-nikoo-charcoal transition-colors duration-200"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-nikoo-charcoal block mb-2">
                    Order Number <span className="text-nikoo-muted normal-case tracking-normal">(if applicable)</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border border-nikoo-border bg-nikoo-ivory px-4 py-3 font-sans text-sm text-nikoo-charcoal placeholder:text-nikoo-muted focus:outline-none focus:border-nikoo-charcoal transition-colors duration-200"
                    placeholder="#12345"
                  />
                </div>

                <div>
                  <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-nikoo-charcoal block mb-2">
                    Subject
                  </label>
                  <select
                    required
                    className="w-full border border-nikoo-border bg-nikoo-ivory px-4 py-3 font-sans text-sm text-nikoo-charcoal focus:outline-none focus:border-nikoo-charcoal transition-colors duration-200"
                  >
                    <option value="">Select a topic</option>
                    <option>Order enquiry</option>
                    <option>Return or refund</option>
                    <option>Sizing question</option>
                    <option>Product availability</option>
                    <option>Wholesale enquiry</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-nikoo-charcoal block mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    className="w-full border border-nikoo-border bg-nikoo-ivory px-4 py-3 font-sans text-sm text-nikoo-charcoal placeholder:text-nikoo-muted focus:outline-none focus:border-nikoo-charcoal transition-colors duration-200 resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full font-sans text-xs tracking-[0.25em] uppercase text-nikoo-cream bg-nikoo-charcoal px-10 py-4 hover:bg-nikoo-gold transition-colors duration-300 disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
