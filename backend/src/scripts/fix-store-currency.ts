/**
 * Adds GBP as the default store currency (run once after seed-region.ts).
 *
 * Usage:
 *   yarn medusa exec src/scripts/fix-store-currency.ts
 */

import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { updateStoresWorkflow } from "@medusajs/medusa/core-flows"

export default async function fixStoreCurrency({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const storeModule = container.resolve(Modules.STORE)

  const stores = await storeModule.listStores()
  const store = stores[0]

  logger.info(`Store: ${store.id}`)
  logger.info(`Current currencies: ${JSON.stringify(store.supported_currencies)}`)

  const existingCurrencies = (store.supported_currencies ?? []).map(
    (c: any) => ({ currency_code: c.currency_code, is_default: false })
  )

  const alreadyHasGbp = existingCurrencies.some(
    (c: any) => c.currency_code === "gbp"
  )

  const updatedCurrencies = [
    { currency_code: "gbp", is_default: true },
    ...existingCurrencies.filter((c: any) => c.currency_code !== "gbp"),
  ]

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: { supported_currencies: updatedCurrencies },
    },
  })

  logger.info(`✅ Store currencies updated: ${updatedCurrencies.map((c) => `${c.currency_code}${c.is_default ? " (default)" : ""}`).join(", ")}`)
}
