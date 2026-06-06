import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms & Conditions | Nikoo Life",
  description: "Terms and conditions governing use of nikoolife.co.uk and purchases made from our store.",
}

export default function TermsPage() {
  return (
    <div className="bg-nikoo-cream min-h-screen">
      {/* Header */}
      <div className="bg-nikoo-ivory border-b border-nikoo-border">
        <div className="content-container py-16 text-center">
          <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-nikoo-gold mb-3">
            Legal
          </p>
          <h1 className="font-display text-5xl font-light text-nikoo-charcoal tracking-wide">
            Terms &amp; Conditions
          </h1>
          <p className="font-sans text-xs text-nikoo-muted mt-4 tracking-wide">
            Last updated: April 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="content-container py-16 max-w-3xl mx-auto">
        <div className="space-y-10 font-sans text-nikoo-charcoal">

          <section>
            <h2 className="font-display text-2xl font-light text-nikoo-charcoal mb-4 tracking-wide">1. Introduction</h2>
            <p className="text-sm text-nikoo-muted leading-relaxed">
              These Terms and Conditions ("Terms") govern your use of nikoolife.co.uk (the "Website") and any purchase you make from Nikoo Life ("we", "us", "our"), a sole trader business based in the United Kingdom. By using the Website or placing an order, you agree to be bound by these Terms. Please read them carefully.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-nikoo-charcoal mb-4 tracking-wide">2. About Us</h2>
            <p className="text-sm text-nikoo-muted leading-relaxed">
              Nikoo Life is a sole trader business based in the United Kingdom. Our primary business is the online retail of women's modest fashion, including abayas and kimonos. For any enquiries, contact us at{" "}
              <a href="mailto:hello@nikoolife.co.uk" className="text-nikoo-charcoal underline hover:text-nikoo-gold transition-colors">
                hello@nikoolife.co.uk
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-nikoo-charcoal mb-4 tracking-wide">3. Placing an Order</h2>
            <ul className="space-y-2 text-sm text-nikoo-muted">
              {[
                "You must be at least 18 years old to place an order.",
                "All orders are subject to acceptance and product availability.",
                "When you place an order, you will receive an email confirmation. This is acknowledgement of your order, not acceptance. Acceptance occurs when your order is dispatched.",
                "We reserve the right to refuse or cancel any order at our discretion.",
                "Prices are displayed in GBP (£) and include VAT where applicable.",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-nikoo-gold mt-0.5">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-nikoo-charcoal mb-4 tracking-wide">4. Pricing and Payment</h2>
            <ul className="space-y-2 text-sm text-nikoo-muted">
              {[
                "All prices are shown in GBP and include UK VAT at the applicable rate.",
                "We accept payment via credit and debit card through Stripe.",
                "Payment is taken at the time of placing your order.",
                "We use SSL encryption to protect all payment transactions.",
                "If a pricing error occurs, we will contact you before processing your order.",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-nikoo-gold mt-0.5">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-nikoo-charcoal mb-4 tracking-wide">5. Shipping and Delivery</h2>
            <ul className="space-y-2 text-sm text-nikoo-muted">
              {[
                "We dispatch orders to UK addresses within 1–3 working days.",
                "Standard UK delivery is FREE on orders over £50. Orders under £50 are charged at £3.99.",
                "Estimated delivery times are 2–5 working days from dispatch.",
                "We are not responsible for delays caused by the postal service or customs.",
                "Risk of loss passes to you upon delivery.",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-nikoo-gold mt-0.5">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-nikoo-charcoal mb-4 tracking-wide">6. Returns and Refunds</h2>
            <p className="text-sm text-nikoo-muted leading-relaxed mb-3">
              Please see our full{" "}
              <a href="/shipping" className="text-nikoo-charcoal underline hover:text-nikoo-gold transition-colors">
                Shipping &amp; Returns policy
              </a>{" "}
              for detailed information. In summary:
            </p>
            <ul className="space-y-2 text-sm text-nikoo-muted">
              {[
                "You have 14 days from receipt to return an unworn, unwashed item in its original condition.",
                "Sale items and personalised items are non-refundable.",
                "Return postage costs are the responsibility of the customer.",
                "Refunds are processed within 5–7 working days of receiving the return.",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-nikoo-gold mt-0.5">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-nikoo-charcoal mb-4 tracking-wide">7. Product Descriptions</h2>
            <p className="text-sm text-nikoo-muted leading-relaxed">
              We make every effort to display our products accurately, including colours and dimensions. However, actual colours may vary slightly due to monitor calibration. Product images are for illustrative purposes only. All measurements are approximate.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-nikoo-charcoal mb-4 tracking-wide">8. Intellectual Property</h2>
            <p className="text-sm text-nikoo-muted leading-relaxed">
              All content on this Website — including text, images, logos and designs — is owned by or licensed to Nikoo Life Ltd and protected by copyright. You may not reproduce, redistribute or use any content without our prior written consent.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-nikoo-charcoal mb-4 tracking-wide">9. Limitation of Liability</h2>
            <p className="text-sm text-nikoo-muted leading-relaxed">
              To the fullest extent permitted by law, Nikoo Life shall not be liable for any indirect, incidental or consequential losses arising from your use of this Website or from any products purchased. Our total liability shall not exceed the value of the order in question. Nothing in these Terms excludes liability for death or personal injury caused by our negligence.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-nikoo-charcoal mb-4 tracking-wide">10. Governing Law</h2>
            <p className="text-sm text-nikoo-muted leading-relaxed">
              These Terms are governed by and construed in accordance with the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-nikoo-charcoal mb-4 tracking-wide">11. Changes to Terms</h2>
            <p className="text-sm text-nikoo-muted leading-relaxed">
              We reserve the right to update these Terms at any time. Changes will be posted on this page with an updated date. Continued use of the Website following any changes constitutes your acceptance of the revised Terms.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
