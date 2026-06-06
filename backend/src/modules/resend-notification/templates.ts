const brand = {
  gold: "#C9A96E",
  charcoal: "#1C1C1C",
  cream: "#FAF7F2",
  muted: "#7A7A72",
}

function layout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nikoo Life</title>
</head>
<body style="margin:0;padding:0;background-color:${brand.cream};font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${brand.cream};padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background-color:${brand.charcoal};padding:32px 40px;text-align:center;">
              <p style="margin:0;font-family:Georgia,serif;font-size:28px;font-weight:300;letter-spacing:0.12em;color:${brand.cream};">
                Nikoo Life
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background-color:#ffffff;padding:40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;text-align:center;border-top:1px solid #e8e0d8;">
              <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:${brand.muted};">
                Nikoo Life Ltd · nikoolife.co.uk
              </p>
              <p style="margin:0;font-size:10px;color:${brand.muted};">
                <a href="https://nikoolife.co.uk/gb/privacy" style="color:${brand.muted};">Privacy Policy</a>
                &nbsp;·&nbsp;
                <a href="https://nikoolife.co.uk/gb/shipping" style="color:${brand.muted};">Returns</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function heading(text: string): string {
  return `<h1 style="margin:0 0 8px;font-family:Georgia,serif;font-size:28px;font-weight:300;letter-spacing:0.06em;color:${brand.charcoal};">${text}</h1>`
}

function subheading(text: string): string {
  return `<p style="margin:0 0 24px;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:${brand.gold};">${text}</p>`
}

function body(text: string): string {
  return `<p style="margin:0 0 16px;font-size:13px;line-height:1.7;color:${brand.muted};">${text}</p>`
}

function divider(): string {
  return `<hr style="border:none;border-top:1px solid #e8e0d8;margin:28px 0;" />`
}

function button(label: string, href: string): string {
  return `<div style="margin:28px 0;">
    <a href="${href}" style="display:inline-block;background-color:${brand.charcoal};color:${brand.cream};font-size:10px;letter-spacing:0.25em;text-transform:uppercase;text-decoration:none;padding:14px 32px;">
      ${label}
    </a>
  </div>`
}

function lineItem(title: string, variant: string, qty: number, price: string): string {
  return `<tr>
    <td style="padding:12px 0;border-bottom:1px solid #f0ebe4;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <p style="margin:0;font-size:13px;color:${brand.charcoal};">${title}</p>
            <p style="margin:2px 0 0;font-size:11px;color:${brand.muted};">${variant}</p>
          </td>
          <td align="right" style="white-space:nowrap;">
            <p style="margin:0;font-size:12px;color:${brand.muted};">×${qty}</p>
            <p style="margin:2px 0 0;font-size:13px;color:${brand.charcoal};">${price}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>`
}

export type OrderData = {
  id: string
  display_id: number
  email: string
  customer?: { first_name?: string }
  items?: Array<{
    title: string
    variant?: { title?: string }
    quantity: number
    unit_price: number
  }>
  total: number
  currency_code: string
  shipping_address?: {
    first_name?: string
    last_name?: string
    address_1?: string
    city?: string
    postal_code?: string
  }
}

function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100)
}

export function orderPlaced(data: OrderData): { subject: string; html: string } {
  const firstName = data.customer?.first_name || data.shipping_address?.first_name || "there"
  const total = formatMoney(data.total, data.currency_code)

  const itemRows = (data.items ?? [])
    .map((item) =>
      lineItem(
        item.title,
        item.variant?.title ?? "",
        item.quantity,
        formatMoney(item.unit_price * item.quantity, data.currency_code)
      )
    )
    .join("")

  const addr = data.shipping_address
  const addressLines = addr
    ? [addr.first_name, addr.last_name, addr.address_1, addr.city, addr.postal_code]
        .filter(Boolean)
        .join(", ")
    : ""

  const content = `
    ${subheading("Order Confirmation")}
    ${heading(`Thank you, ${firstName}.`)}
    ${body(`We've received your order <strong style="color:${brand.charcoal};">#${data.display_id}</strong> and we're getting it ready for you.`)}
    ${divider()}
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      ${itemRows}
      <tr>
        <td style="padding-top:16px;" colspan="2">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:13px;font-weight:600;color:${brand.charcoal};">Total</td>
              <td align="right" style="font-size:13px;font-weight:600;color:${brand.charcoal};">${total}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    ${addressLines ? `${body(`<strong>Shipping to:</strong> ${addressLines}`)}` : ""}
    ${button("View Order", `https://nikoolife.co.uk/gb/order/${data.id}/confirmed`)}
    ${divider()}
    ${body("We'll send you a shipping confirmation with tracking information once your order is on its way. Orders are dispatched Monday–Friday.")}
    ${body(`Questions? Reply to this email or contact us at <a href="mailto:hello@nikoolife.co.uk" style="color:${brand.charcoal};">hello@nikoolife.co.uk</a>.`)}
  `

  return {
    subject: `Order confirmed #${data.display_id} — Nikoo Life`,
    html: layout(content),
  }
}

export function passwordReset(data: { token: string; email: string }): { subject: string; html: string } {
  const resetUrl = `https://nikoolife.co.uk/gb/account?token=${data.token}`

  const content = `
    ${subheading("Account Security")}
    ${heading("Reset your password")}
    ${body("We received a request to reset the password for your Nikoo Life account.")}
    ${body("Click the button below to set a new password. This link expires in 30 minutes.")}
    ${button("Reset Password", resetUrl)}
    ${divider()}
    ${body("If you didn't request this, you can safely ignore this email — your password won't change.")}
  `

  return {
    subject: "Reset your Nikoo Life password",
    html: layout(content),
  }
}

export function orderShipped(data: {
  display_id: number
  tracking_number?: string
  tracking_url?: string
  customer?: { first_name?: string }
  shipping_address?: { first_name?: string }
}): { subject: string; html: string } {
  const firstName = data.customer?.first_name || data.shipping_address?.first_name || "there"

  const content = `
    ${subheading("Your Order Is On Its Way")}
    ${heading(`It's shipped, ${firstName}.`)}
    ${body(`Your order <strong style="color:${brand.charcoal};">#${data.display_id}</strong> has been dispatched and is on its way to you.`)}
    ${data.tracking_number ? body(`<strong>Tracking reference:</strong> ${data.tracking_number}`) : ""}
    ${data.tracking_url ? button("Track Your Order", data.tracking_url) : ""}
    ${divider()}
    ${body("Standard delivery typically takes 2–5 working days. If you have any questions, reply to this email or contact us at <a href=\"mailto:hello@nikoolife.co.uk\" style=\"color:#1C1C1C;\">hello@nikoolife.co.uk</a>.")}
  `

  return {
    subject: `Your Nikoo Life order #${data.display_id} is on its way`,
    html: layout(content),
  }
}
