import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Shipping & Returns | Nikoo Life",
  description: "Delivery information, returns policy and refund process for nikoolife.co.uk.",
}

const shippingOptions = [
  {
    name: "Standard Delivery",
    time: "2–5 working days",
    cost: "FREE on orders over £50 · £3.99 otherwise",
  },
  {
    name: "Express Delivery",
    time: "1–2 working days",
    cost: "£6.99",
  },
]

export default function ShippingPage() {
  return (
    <div className="bg-nikoo-cream min-h-screen">
      {/* Header */}
      <div className="bg-nikoo-ivory border-b border-nikoo-border">
        <div className="content-container py-16 text-center">
          <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-nikoo-gold mb-3">
            Customer Care
          </p>
          <h1 className="font-display text-5xl font-light text-nikoo-charcoal tracking-wide">
            Shipping &amp; Returns
          </h1>
          <p className="font-sans text-xs text-nikoo-muted mt-4 tracking-wide max-w-md mx-auto">
            We want you to love every piece. Here's everything you need to know about delivery and returns.
          </p>
        </div>
      </div>

      <div className="content-container py-16 max-w-3xl mx-auto space-y-16">

        {/* Shipping */}
        <section>
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-nikoo-gold mb-3">Delivery</p>
          <h2 className="font-display text-3xl font-light text-nikoo-charcoal mb-8 tracking-wide">Shipping Information</h2>

          <div className="grid grid-cols-1 small:grid-cols-2 gap-4 mb-8">
            {shippingOptions.map((opt) => (
              <div key={opt.name} className="border border-nikoo-border bg-nikoo-ivory p-6">
                <h3 className="font-sans text-xs tracking-[0.2em] uppercase text-nikoo-charcoal mb-2">{opt.name}</h3>
                <p className="font-display text-2xl font-light text-nikoo-charcoal mb-1">{opt.time}</p>
                <p className="font-sans text-xs text-nikoo-muted">{opt.cost}</p>
              </div>
            ))}
          </div>

          <ul className="space-y-3 text-sm text-nikoo-muted">
            {[
              "Orders are dispatched Monday to Friday, excluding UK bank holidays.",
              "Orders placed before 12pm are processed the same day.",
              "You will receive a shipping confirmation email with a tracking number once your order is dispatched.",
              "We currently ship to UK addresses only. International shipping coming soon.",
              "We are not responsible for delays caused by Royal Mail, courier services, or circumstances outside our control.",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-nikoo-gold mt-0.5">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="border-t border-nikoo-border" />

        {/* Returns */}
        <section>
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-nikoo-gold mb-3">Returns</p>
          <h2 className="font-display text-3xl font-light text-nikoo-charcoal mb-8 tracking-wide">Our Returns Policy</h2>

          <div className="bg-nikoo-ivory border border-nikoo-border p-6 mb-8">
            <p className="font-display text-4xl font-light text-nikoo-charcoal mb-1">14 days</p>
            <p className="font-sans text-xs text-nikoo-muted tracking-wide">to return your item from the date of delivery</p>
          </div>

          <ul className="space-y-3 text-sm text-nikoo-muted mb-8">
            {[
              "Items must be returned unworn, unwashed and in their original condition with all tags attached.",
              "Items must be in their original packaging.",
              "Return postage costs are the responsibility of the customer. We recommend using a tracked service.",
              "We cannot accept returns on sale items, swimwear, or personalised products.",
              "Faulty or incorrect items will be collected at our cost — please contact us within 48 hours of receiving your order.",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-nikoo-gold mt-0.5">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h3 className="font-sans text-xs tracking-[0.2em] uppercase text-nikoo-charcoal mb-4">How to Return</h3>
          <ol className="space-y-4 text-sm text-nikoo-muted">
            {[
              { step: "01", text: "Email us at returns@nikoolife.co.uk with your order number and reason for return." },
              { step: "02", text: "We'll reply within 1 working day with your returns authorisation and address." },
              { step: "03", text: "Package the item securely and ship it back to us using a tracked service." },
              { step: "04", text: "Once received and inspected, we'll process your refund within 5–7 working days." },
            ].map(({ step, text }) => (
              <li key={step} className="flex gap-4">
                <span className="font-display text-2xl font-light text-nikoo-gold flex-shrink-0">{step}</span>
                <span className="mt-1">{text}</span>
              </li>
            ))}
          </ol>
        </section>

        <div className="border-t border-nikoo-border" />

        {/* Refunds */}
        <section>
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-nikoo-gold mb-3">Refunds</p>
          <h2 className="font-display text-3xl font-light text-nikoo-charcoal mb-6 tracking-wide">Refund Process</h2>

          <ul className="space-y-3 text-sm text-nikoo-muted">
            {[
              "Refunds are issued to your original payment method once we have received and inspected the return.",
              "Refunds are typically processed within 5–7 working days of us receiving the item.",
              "Your bank may take a further 3–5 working days to credit the refund.",
              "Original delivery charges are non-refundable (except for faulty or incorrectly dispatched items).",
              "We will send you an email confirmation once your refund has been processed.",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-nikoo-gold mt-0.5">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="border-t border-nikoo-border" />

        {/* CTA */}
        <section className="text-center py-6">
          <p className="font-sans text-sm text-nikoo-muted mb-6">Still have questions? We're here to help.</p>
          <LocalizedClientLink
            href="/contact"
            className="inline-block font-sans text-xs tracking-[0.25em] uppercase text-nikoo-charcoal border border-nikoo-charcoal px-10 py-4 hover:bg-nikoo-charcoal hover:text-nikoo-cream transition-colors duration-300"
          >
            Contact Us
          </LocalizedClientLink>
        </section>

      </div>
    </div>
  )
}
