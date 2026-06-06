/**
 * Creates a publishable API key linked to the Default Sales Channel
 * and prints the token to copy into storefront/.env.local.
 *
 * Usage:
 *   yarn medusa exec src/scripts/fix-api-key.ts
 */

import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function fixApiKey({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const apiKeyModule = container.resolve(Modules.API_KEY)
  const salesChannelModule = container.resolve(Modules.SALES_CHANNEL)

  // Get the default sales channel
  const salesChannels = await salesChannelModule.listSalesChannels()
  const defaultChannel = salesChannels[0]

  if (!defaultChannel) {
    throw new Error("No sales channel found.")
  }

  logger.info(`Using sales channel: ${defaultChannel.name} (${defaultChannel.id})`)

  // Create a new publishable API key
  const apiKey = await apiKeyModule.createApiKeys({
    title: "Nikoo Storefront",
    type: "publishable",
    created_by: "system",
  })

  // Link it to the sales channel
  await apiKeyModule.upsertApiKeySalesChannels([
    {
      api_key_id: apiKey.id,
      sales_channel_id: defaultChannel.id,
    },
  ])

  logger.info("=".repeat(60))
  logger.info("✅ New publishable API key created!")
  logger.info("")
  logger.info(`   Token: ${apiKey.token}`)
  logger.info("")
  logger.info("   Copy the token above and update:")
  logger.info("   storefront/.env.local → NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY")
  logger.info("=".repeat(60))
}
