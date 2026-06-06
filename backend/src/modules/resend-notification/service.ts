import { AbstractNotificationProviderService } from "@medusajs/framework/utils"
import type {
  ProviderSendNotificationDTO,
  ProviderSendNotificationResultsDTO,
} from "@medusajs/types"
import { Resend } from "resend"
import { orderPlaced, orderShipped, passwordReset } from "./templates"

type Options = {
  api_key: string
  from: string
}

export class ResendNotificationService extends AbstractNotificationProviderService {
  static identifier = "resend"

  private resend: Resend
  private from: string

  constructor(_container: unknown, options: Options) {
    super()
    this.resend = new Resend(options.api_key)
    this.from = options.from || "hello@nikoolife.co.uk"
  }

  async send(
    notification: ProviderSendNotificationDTO
  ): Promise<ProviderSendNotificationResultsDTO> {
    const { to, template, data, content, from } = notification

    let subject: string
    let html: string

    // Use inline content if provided (e.g. from custom notifications)
    if (content?.subject && content?.html) {
      subject = content.subject
      html = content.html
    } else {
      const rendered = this.renderTemplate(template, data as Record<string, unknown>)
      subject = rendered.subject
      html = rendered.html
    }

    const { data: result, error } = await this.resend.emails.send({
      from: (from as string | undefined) ?? this.from,
      to: [to],
      subject,
      html,
    })

    if (error || !result) {
      throw new Error(`Resend error: ${JSON.stringify(error)}`)
    }

    return { id: result.id }
  }

  private renderTemplate(
    template: string,
    data: Record<string, unknown>
  ): { subject: string; html: string } {
    switch (template) {
      case "order-placed":
      case "order.placed":
        return orderPlaced(data as Parameters<typeof orderPlaced>[0])

      case "order-shipment-created":
      case "order.shipment_created":
        return orderShipped(data as Parameters<typeof orderShipped>[0])

      case "customer-reset-password":
      case "auth.password_reset":
        return passwordReset(data as Parameters<typeof passwordReset>[0])

      default:
        return {
          subject: "A message from Nikoo Life",
          html: `<p>${JSON.stringify(data)}</p>`,
        }
    }
  }
}
