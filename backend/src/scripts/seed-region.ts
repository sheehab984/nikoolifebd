/**
 * Seeds the UK/GBP region, 20% VAT tax region, default store currency,
 * and the three product collections (Abayas, Kimonos, New In).
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
  const productModuleService = container.resolve(Modules.PRODUCT)

  // ── 1. Check if GBP region already exists ───────────────────────────────
  const { data: existing } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code"],
  })

  const alreadyExists = existing.some(
    (r: any) => r.currency_code === "gbp"
  )

  if (!alreadyExists) {
    // ── 2. Create UK region ────────────────────────────────────────────────
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

    // ── 3. Create tax region for GB ────────────────────────────────────────
    logger.info("Creating GB tax region...")

    try {
      await createTaxRegionsWorkflow(container).run({
        input: [
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
      })
      logger.info("  ✓ GB tax region created (20% VAT)")
    } catch (e) {
      logger.warn(`  Tax region skipped (can be set in Admin → Tax): ${e.message}`)
    }

    // ── 4. Add GBP as supported store currency ─────────────────────────────
    logger.info("Adding GBP to store supported currencies...")

    const stores = await storeModule.listStores()
    const store  = stores[0]

    const existingCurrencies = (store.supported_currencies ?? []).map(
      (c: any) => ({ currency_code: c.currency_code, is_default: c.is_default })
    )

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
  } else {
    logger.info("GBP region already exists — skipping region/currency setup.")
  }

  // ── 5. Create collections ────────────────────────────────────────────────
  logger.info("Setting up product collections...")

  const existingCollections = await productModuleService.listProductCollections()
  const existingHandles = existingCollections.map((c: any) => c.handle)

  for (const [title, handle] of [
    ["Abayas", "abayas"],
    ["Kimonos", "kimonos"],
    ["New In", "new-in"],
  ] as const) {
    if (existingHandles.includes(handle)) {
      logger.info(`  Collection already exists: ${title}`)
    } else {
      await productModuleService.createProductCollections({ title, handle })
      logger.info(`  ✓ Created collection: ${title}`)
    }
  }

  logger.info("✅ Seed complete! Log in to the Admin UI to add products.")
}
