import { Module } from "@medusajs/framework/utils"
import { ResendNotificationService } from "./service"

export const RESEND_MODULE = "resend-notification"

export default Module(RESEND_MODULE, {
  service: ResendNotificationService,
})
