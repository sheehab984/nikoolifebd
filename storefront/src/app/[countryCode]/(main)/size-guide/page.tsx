import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Size Guide | Nikoo Life",
  description: "Find your perfect fit with the Nikoo Life size guide for abayas and kimonos.",
}

const abayas = [
  { size: "S/M", uk: "8–12", bust: "86–96 cm", waist: "68–78 cm", hips: "90–100 cm", length: "140–145 cm" },
  { size: "L/XL", uk: "14–18", bust: "98–110 cm", waist: "80–92 cm", hips: "102–114 cm", length: "143–148 cm" },
  { size: "One Size", uk: "6–18", bust: "—", waist: "—", hips: "—", length: "142–148 cm" },
]

const kimonos = [
  { size: "S/M", uk: "8–12", bust: "Open front — fits generously", shoulder: "38–42 cm", length: "130–135 cm", sleeve: "58–62 cm" },
  { size: "L/XL", uk: "14–18", bust: "Open front — fits generously", shoulder: "43–47 cm", length: "133–138 cm", sleeve: "60–64 cm" },
  { size: "One Size", uk: "6–18", bust: "Open front — one size fits most", shoulder: "40–46 cm", length: "132–138 cm", sleeve: "59–63 cm" },
]

export default function SizeGuidePage() {
  return (
    <div className="bg-nikoo-cream min-h-screen">
      {/* Header */}
      <div className="bg-nikoo-ivory border-b border-nikoo-border">
        <div className="content-container py-16 text-center">
          <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-nikoo-gold mb-3">
            Fit &amp; Sizing
          </p>
          <h1 className="font-display text-5xl font-light text-nikoo-charcoal tracking-wide">
            Size Guide
          </h1>
          <p className="font-sans text-xs text-nikoo-muted mt-4 tracking-wide max-w-md mx-auto">
            All measurements are given in centimetres unless stated. If you are between sizes, we recommend sizing up for a more relaxed, modest fit.
          </p>
        </div>
      </div>

      <div className="content-container py-16 max-w-4xl mx-auto space-y-16">

        {/* How to measure */}
        <section>
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-nikoo-gold mb-3">Getting Started</p>
          <h2 className="font-display text-3xl font-light text-nikoo-charcoal mb-8 tracking-wide">How to Measure Yourself</h2>

          <div className="grid grid-cols-1 small:grid-cols-2 gap-6">
            {[
              { label: "Bust", desc: "Measure around the fullest part of your chest, keeping the tape parallel to the floor." },
              { label: "Waist", desc: "Measure around your natural waistline — the narrowest part of your torso." },
              { label: "Hips", desc: "Measure around the fullest part of your hips and bottom, approximately 20cm below your waistline." },
              { label: "Length", desc: "Measured from the highest point of the shoulder to the hem of the garment." },
              { label: "Shoulder", desc: "Measured across the back from one shoulder seam to the other." },
              { label: "Sleeve", desc: "Measured from the shoulder seam to the end of the sleeve." },
            ].map(({ label, desc }) => (
              <div key={label} className="border border-nikoo-border bg-nikoo-ivory p-5">
                <p className="font-sans text-xs tracking-[0.2em] uppercase text-nikoo-charcoal mb-2">{label}</p>
                <p className="font-sans text-sm text-nikoo-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="border-t border-nikoo-border" />

        {/* Abayas */}
        <section>
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-nikoo-gold mb-3">Garment Type</p>
          <h2 className="font-display text-3xl font-light text-nikoo-charcoal mb-2 tracking-wide">Abayas</h2>
          <p className="font-sans text-sm text-nikoo-muted mb-8">
            Our abayas are designed with a generous, modest silhouette. Measurements below are the garment measurements — not body measurements.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-nikoo-charcoal">
                  <th className="text-left font-sans text-[10px] tracking-[0.2em] uppercase text-nikoo-charcoal pb-3 pr-6">Size</th>
                  <th className="text-left font-sans text-[10px] tracking-[0.2em] uppercase text-nikoo-charcoal pb-3 pr-6">UK Size</th>
                  <th className="text-left font-sans text-[10px] tracking-[0.2em] uppercase text-nikoo-charcoal pb-3 pr-6">Bust</th>
                  <th className="text-left font-sans text-[10px] tracking-[0.2em] uppercase text-nikoo-charcoal pb-3 pr-6">Waist</th>
                  <th className="text-left font-sans text-[10px] tracking-[0.2em] uppercase text-nikoo-charcoal pb-3 pr-6">Hips</th>
                  <th className="text-left font-sans text-[10px] tracking-[0.2em] uppercase text-nikoo-charcoal pb-3">Length</th>
                </tr>
              </thead>
              <tbody>
                {abayas.map((row, i) => (
                  <tr key={row.size} className={i < abayas.length - 1 ? "border-b border-nikoo-border" : ""}>
                    <td className="py-4 pr-6 font-sans text-xs font-medium text-nikoo-charcoal tracking-wide">{row.size}</td>
                    <td className="py-4 pr-6 font-sans text-xs text-nikoo-muted">{row.uk}</td>
                    <td className="py-4 pr-6 font-sans text-xs text-nikoo-muted">{row.bust}</td>
                    <td className="py-4 pr-6 font-sans text-xs text-nikoo-muted">{row.waist}</td>
                    <td className="py-4 pr-6 font-sans text-xs text-nikoo-muted">{row.hips}</td>
                    <td className="py-4 font-sans text-xs text-nikoo-muted">{row.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="border-t border-nikoo-border" />

        {/* Kimonos */}
        <section>
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-nikoo-gold mb-3">Garment Type</p>
          <h2 className="font-display text-3xl font-light text-nikoo-charcoal mb-2 tracking-wide">Kimonos &amp; Open Layers</h2>
          <p className="font-sans text-sm text-nikoo-muted mb-8">
            Our kimonos and open-front layers are designed to fit generously. They are meant to be worn open over an outfit, so sizing is relaxed by design.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-nikoo-charcoal">
                  <th className="text-left font-sans text-[10px] tracking-[0.2em] uppercase text-nikoo-charcoal pb-3 pr-6">Size</th>
                  <th className="text-left font-sans text-[10px] tracking-[0.2em] uppercase text-nikoo-charcoal pb-3 pr-6">UK Size</th>
                  <th className="text-left font-sans text-[10px] tracking-[0.2em] uppercase text-nikoo-charcoal pb-3 pr-6">Fit</th>
                  <th className="text-left font-sans text-[10px] tracking-[0.2em] uppercase text-nikoo-charcoal pb-3 pr-6">Shoulder</th>
                  <th className="text-left font-sans text-[10px] tracking-[0.2em] uppercase text-nikoo-charcoal pb-3 pr-6">Length</th>
                  <th className="text-left font-sans text-[10px] tracking-[0.2em] uppercase text-nikoo-charcoal pb-3">Sleeve</th>
                </tr>
              </thead>
              <tbody>
                {kimonos.map((row, i) => (
                  <tr key={row.size} className={i < kimonos.length - 1 ? "border-b border-nikoo-border" : ""}>
                    <td className="py-4 pr-6 font-sans text-xs font-medium text-nikoo-charcoal tracking-wide">{row.size}</td>
                    <td className="py-4 pr-6 font-sans text-xs text-nikoo-muted">{row.uk}</td>
                    <td className="py-4 pr-6 font-sans text-xs text-nikoo-muted">{row.bust}</td>
                    <td className="py-4 pr-6 font-sans text-xs text-nikoo-muted">{row.shoulder}</td>
                    <td className="py-4 pr-6 font-sans text-xs text-nikoo-muted">{row.length}</td>
                    <td className="py-4 font-sans text-xs text-nikoo-muted">{row.sleeve}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="border-t border-nikoo-border" />

        {/* Tips */}
        <section>
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-nikoo-gold mb-3">Tips</p>
          <h2 className="font-display text-3xl font-light text-nikoo-charcoal mb-6 tracking-wide">Styling Notes</h2>
          <ul className="space-y-3 text-sm text-nikoo-muted">
            {[
              "All garments are floor-length on a 5'5\" (165cm) model. For petite frames, our One Size and S/M styles may benefit from a small hem adjustment.",
              "Our fabrics are designed to drape beautifully — a slightly relaxed fit enhances the flow and coverage.",
              "If you are between sizes and prefer extra coverage, always size up.",
              "Care instructions are on the inner label of each garment. Most styles are hand-wash or gentle machine wash at 30°C.",
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
          <p className="font-sans text-sm text-nikoo-muted mb-6">Not sure about your size? We're happy to help.</p>
          <a
            href="mailto:hello@nikoolife.co.uk"
            className="inline-block font-sans text-xs tracking-[0.25em] uppercase text-nikoo-charcoal border border-nikoo-charcoal px-10 py-4 hover:bg-nikoo-charcoal hover:text-nikoo-cream transition-colors duration-300"
          >
            Email Us
          </a>
        </section>

      </div>
    </div>
  )
}
