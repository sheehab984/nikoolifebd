/**
 * Creates a UK / GBP region and sets GBP as the default store currency.
 *
 * Usage (backend must be running):
 *   yarn medusa exec src/scripts/seed-region.ts
 */

import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import {
  createRegionsWorkflow,
  createTaxRegionsWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"

export default async function seedRegion({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query  = container.resolve(ContainerRegistrationKeys.QUERY)
  const storeModule = container.resolve(Modules.STORE)

  // ── 1. Check if GBP region already exists ───────────────────────────────
  const { data: existing } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code"],
  })

  const alreadyExists = existing.some(
    (r: any) => r.currency_code === "gbp"
  )

  if (alreadyExists) {
    logger.info("GBP region already exists — skipping.")
    return
  }

  // ── 2. Create UK region ──────────────────────────────────────────────────
  logger.info("Creating United Kingdom / GBP region...")

  const { result: regions } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "United Kingdom",
          currency_code: "gbp",
          countries: ["gb"],
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  })

  const region = regions[0]
  logger.info(`  ✓ Created region: ${region.name} (${region.id})`)

  // ── 3. Create tax region for GB ──────────────────────────────────────────
  logger.info("Creating GB tax region...")

  try {
    await createTaxRegionsWorkflow(container).run({
      input: {
        tax_regions: [
          {
            country_code: "GB",
            province_code: null,
            default_tax_rate: {
              name: "Standard UK VAT",
              rate: 20,
              code: "standard",
            },
          },
        ],
      },
    })
    logger.info("  ✓ GB tax region created (20% VAT)")
  } catch (e) {
    logger.warn(`  Tax region skipped (can be set in Admin → Tax): ${e.message}`)
  }

  // ── 4. Add GBP as supported store currency ───────────────────────────────
  logger.info("Adding GBP to store supported currencies...")

  const stores = await storeModule.listStores()
  const store  = stores[0]

  const existingCurrencies = (store.supported_currencies ?? []).map(
    (c: any) => ({ currency_code: c.currency_code, is_default: c.is_default })
  )

  // Add GBP as default, keep others
  const updatedCurrencies = [
    { currency_code: "gbp", is_default: true },
    ...existingCurrencies
      .filter((c: any) => c.currency_code !== "gbp")
      .map((c: any) => ({ ...c, is_default: false })),
  ]

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: { supported_currencies: updatedCurrencies },
    },
  })

  logger.info("  ✓ GBP set as default store currency")

  logger.info("✅ UK region setup complete!")
  logger.info("   Now go to Admin → Regions to confirm, then run the product seed.")
}
