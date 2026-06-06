import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Nikoo Life",
  description: "How Nikoo Life collects, uses and protects your personal data.",
}

export default function PrivacyPage() {
  return (
    <div className="bg-nikoo-cream min-h-screen">
      {/* Header */}
      <div className="bg-nikoo-ivory border-b border-nikoo-border">
        <div className="content-container py-16 text-center">
          <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-nikoo-gold mb-3">
            Legal
          </p>
          <h1 className="font-display text-5xl font-light text-nikoo-charcoal tracking-wide">
            Privacy Policy
          </h1>
          <p className="font-sans text-xs text-nikoo-muted mt-4 tracking-wide">
            Last updated: April 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="content-container py-16 max-w-3xl mx-auto">
        <div className="prose prose-sm space-y-10 font-sans text-nikoo-charcoal">

          <section>
            <h2 className="font-display text-2xl font-light text-nikoo-charcoal mb-4 tracking-wide">1. Who We Are</h2>
            <p className="text-sm text-nikoo-muted leading-relaxed">
              Nikoo Life ("we", "our", "us") is a sole trader business operating nikoolife.co.uk, a UK-based online retailer specialising in modest fashion including abayas and kimonos.
            </p>
            <p className="text-sm text-nikoo-muted leading-relaxed mt-3">
              For any privacy-related enquiries, please contact us at{" "}
              <a href="mailto:privacy@nikoolife.co.uk" className="text-nikoo-charcoal underline hover:text-nikoo-gold transition-colors">
                privacy@nikoolife.co.uk
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-nikoo-charcoal mb-4 tracking-wide">2. What Data We Collect</h2>
            <p className="text-sm text-nikoo-muted leading-relaxed mb-3">
              We collect and process the following categories of personal data:
            </p>
            <ul className="space-y-2 text-sm text-nikoo-muted">
              {[
                "Identity data: name, username or similar identifier",
                "Contact data: billing address, delivery address, email address and telephone number",
                "Financial data: payment card details (processed securely via Stripe — we do not store card data)",
                "Transaction data: details of purchases and order history",
                "Technical data: IP address, browser type, time zone, operating system",
                "Profile data: purchase history, preferences, feedback and survey responses",
                "Marketing data: preferences for receiving marketing communications from us",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-nikoo-gold mt-0.5">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-nikoo-charcoal mb-4 tracking-wide">3. How We Use Your Data</h2>
            <p className="text-sm text-nikoo-muted leading-relaxed mb-3">
              We use your personal data for the following purposes:
            </p>
            <ul className="space-y-2 text-sm text-nikoo-muted">
              {[
                "To process and fulfil your orders",
                "To manage your account and provide customer support",
                "To send order confirmations, shipping updates and receipts",
                "To send marketing emails (only with your consent — you may unsubscribe at any time)",
                "To improve our website and product range",
                "To comply with legal and regulatory obligations",
                "To detect and prevent fraud",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-nikoo-gold mt-0.5">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-nikoo-charcoal mb-4 tracking-wide">4. Legal Basis for Processing</h2>
            <p className="text-sm text-nikoo-muted leading-relaxed">
              We process your personal data under the following lawful bases as defined by UK GDPR:
            </p>
            <ul className="space-y-2 text-sm text-nikoo-muted mt-3">
              {[
                "Contract: processing is necessary to fulfil your order",
                "Legal obligation: we must retain certain transaction records",
                "Legitimate interests: fraud prevention, website improvement",
                "Consent: for marketing emails (you can withdraw consent at any time)",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-nikoo-gold mt-0.5">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-nikoo-charcoal mb-4 tracking-wide">5. Data Sharing</h2>
            <p className="text-sm text-nikoo-muted leading-relaxed mb-3">
              We share your data only where necessary:
            </p>
            <ul className="space-y-2 text-sm text-nikoo-muted">
              {[
                "Stripe (payment processing) — subject to Stripe's own privacy policy",
                "Courier and logistics partners for order fulfilment",
                "Email service providers for transactional and marketing emails",
                "Analytics providers to help us improve our website",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-nikoo-gold mt-0.5">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-nikoo-muted leading-relaxed mt-3">
              We do not sell your personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-nikoo-charcoal mb-4 tracking-wide">6. Data Retention</h2>
            <p className="text-sm text-nikoo-muted leading-relaxed">
              We retain your personal data for as long as necessary to fulfil the purposes for which it was collected, including for the purposes of satisfying any legal, accounting or reporting requirements. Order data is retained for 7 years in line with UK tax law. Marketing preferences are retained until you withdraw consent.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-nikoo-charcoal mb-4 tracking-wide">7. Your Rights</h2>
            <p className="text-sm text-nikoo-muted leading-relaxed mb-3">
              Under UK GDPR you have the right to:
            </p>
            <ul className="space-y-2 text-sm text-nikoo-muted">
              {[
                "Access the personal data we hold about you",
                "Correct inaccurate or incomplete data",
                "Request erasure of your data (the 'right to be forgotten')",
                "Object to processing based on legitimate interests",
                "Withdraw consent for marketing at any time",
                "Data portability — receive your data in a machine-readable format",
                "Lodge a complaint with the ICO (Information Commissioner's Office)",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-nikoo-gold mt-0.5">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-nikoo-muted leading-relaxed mt-3">
              To exercise any of these rights, please email{" "}
              <a href="mailto:privacy@nikoolife.co.uk" className="text-nikoo-charcoal underline hover:text-nikoo-gold transition-colors">
                privacy@nikoolife.co.uk
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-nikoo-charcoal mb-4 tracking-wide">8. Cookies</h2>
            <p className="text-sm text-nikoo-muted leading-relaxed mb-3">
              We use essential cookies to operate our store (e.g., cart and session management). These cannot be disabled as the site will not function without them.
            </p>
            <p className="text-sm text-nikoo-muted leading-relaxed">
              With your consent (given via our cookie banner), we also set analytics cookies to understand how visitors use our site, and marketing cookies to personalise advertising on platforms such as Meta (Instagram/Facebook) and TikTok. You can withdraw or change your consent at any time by clearing your browser's local storage or contacting us.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-nikoo-charcoal mb-4 tracking-wide">9. Changes to This Policy</h2>
            <p className="text-sm text-nikoo-muted leading-relaxed">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated date. If changes are significant, we will notify you by email.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
