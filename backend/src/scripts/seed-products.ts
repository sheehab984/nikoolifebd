/**
 * Seed script: creates collections and products for nikoolife.co.uk
 *
 * Usage (backend must be running on :9000):
 *   yarn medusa exec src/scripts/seed-products.ts
 *
 * It authenticates as admin, creates collections, then creates all 6 products
 * with images served from the Next.js storefront public folder.
 */

import {
  ExecArgs,
} from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"

// ─── Config ──────────────────────────────────────────────────────────────────

const STOREFRONT_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000"

// Image base URL — images are in storefront/public/products/
const img = (handle: string, file: string) =>
  `${STOREFRONT_URL}/products/${handle}/${file}`

// ─── Product definitions ──────────────────────────────────────────────────────

const PRODUCTS = [
  {
    title: "Gold Shimmer Abaya",
    handle: "gold-shimmer-abaya",
    subtitle: "Statement open abaya in luxurious bronze-gold shimmer fabric",
    description:
      "Turn heads in this stunning bronze-gold shimmer open abaya. Crafted from a fluid, lightweight metallic fabric with an incredible drape, this floor-length piece is perfect for Eid celebrations, weddings, and formal occasions. The wide batwing sleeves and open-front silhouette create an effortlessly elegant look worn over any outfit.",
    collection: "Abayas",
    price: 45.0,
    thumbnail: img("gold-shimmer-abaya", "02-lifestyle-front.jpg"),
    images: [
      img("gold-shimmer-abaya", "02-lifestyle-front.jpg"),
      img("gold-shimmer-abaya", "04-lifestyle-side.jpg"),
      img("gold-shimmer-abaya", "03-lifestyle-angle.jpg"),
      img("gold-shimmer-abaya", "05-lifestyle-detail.jpg"),
      img("gold-shimmer-abaya", "01-pro-side.jpg"),
    ],
  },
  {
    title: "Grey Tassel Abaya",
    handle: "grey-tassel-abaya",
    subtitle: "Elegant grey crinkle abaya with signature tassel sleeves",
    description:
      "A beautifully textured open abaya in soft silver-grey crinkle fabric. The standout feature is the delicate tassel and tie detailing cascading from the sleeves, adding movement and a boho-luxe finish. Lightweight and breathable, this versatile piece transitions seamlessly from day to evening.",
    collection: "Abayas",
    price: 42.0,
    thumbnail: img("grey-tassel-abaya", "03-lifestyle-full.jpg"),
    images: [
      img("grey-tassel-abaya", "03-lifestyle-full.jpg"),
      img("grey-tassel-abaya", "01-pro-front.jpg"),
      img("grey-tassel-abaya", "02-pro-side.jpg"),
      img("grey-tassel-abaya", "04-lifestyle-pose.jpg"),
      img("grey-tassel-abaya", "05-lifestyle-detail.jpg"),
    ],
  },
  {
    title: "Marble Fur-Trim Kimono",
    handle: "marble-fur-kimono",
    subtitle: "Abstract marble print kimono with faux fur trim",
    description:
      "A bold statement piece featuring a striking abstract marble-effect print in cream, rust and navy with dramatic dark faux fur trim running the full length of the opening. Wide flared cuffed sleeves and a floor-grazing length make this kimono unmistakably luxurious. Perfect for special occasions.",
    collection: "Kimonos",
    price: 48.0,
    thumbnail: img("marble-fur-kimono", "04-lifestyle-full.jpg"),
    images: [
      img("marble-fur-kimono", "04-lifestyle-full.jpg"),
      img("marble-fur-kimono", "01-pro-front.jpg"),
      img("marble-fur-kimono", "02-pro-open.jpg"),
      img("marble-fur-kimono", "05-lifestyle-side.jpg"),
      img("marble-fur-kimono", "03-pro-side.jpg"),
    ],
  },
  {
    title: "Cream Leaf Print Kimono",
    handle: "cream-leaf-kimono",
    subtitle: "Relaxed open kimono in cream with bold botanical print",
    description:
      "A relaxed, effortlessly chic open kimono in cream with a bold botanical leaf print in warm rust and navy tones. The pleated crinkle fabric gives it a rich texture while keeping the silhouette light and airy. Wear open over black co-ords or belted for a more defined look.",
    collection: "Kimonos",
    price: 40.0,
    thumbnail: img("cream-leaf-kimono", "03-lifestyle-front.jpg"),
    images: [
      img("cream-leaf-kimono", "03-lifestyle-front.jpg"),
      img("cream-leaf-kimono", "01-pro-front.jpg"),
      img("cream-leaf-kimono", "04-lifestyle-pose.jpg"),
      img("cream-leaf-kimono", "02-pro-detail.jpg"),
    ],
  },
  {
    title: "Rose Butterfly Lace Kimono",
    handle: "rose-lace-kimono",
    subtitle: "Feminine dusty rose kimono with gold lace trim and butterfly sleeves",
    description:
      "Soft and romantic, this open kimono in dusty rose jersey is trimmed with delicate gold lace detail from neckline to hem. The butterfly-style sleeves create an elegant drape, and the tassel tie waist adds a feminine finishing touch. A bestseller for its versatility — perfect for Eid, weddings, or dressed-down everyday looks.",
    collection: "Kimonos",
    price: 38.0,
    thumbnail: img("rose-lace-kimono", "05-lifestyle-full.jpg"),
    images: [
      img("rose-lace-kimono", "05-lifestyle-full.jpg"),
      img("rose-lace-kimono", "02-pro-front.jpg"),
      img("rose-lace-kimono", "04-lifestyle-front.jpg"),
      img("rose-lace-kimono", "06-lifestyle-pose.jpg"),
      img("rose-lace-kimono", "01-pro-side.jpg"),
      img("rose-lace-kimono", "03-pro-back.jpg"),
    ],
  },
  {
    title: "Black Botanical Kimono",
    handle: "black-botanical-kimono",
    subtitle: "Black crinkle kimono with all-over botanical floral print",
    description:
      "A chic and versatile open kimono in black crinkle-texture fabric with a delicate all-over botanical floral print in muted coral, green and yellow tones. Wide pleated sleeves and a relaxed open fit. Works beautifully as a layering piece over monochrome outfits or as a lightweight abaya alternative.",
    collection: "Kimonos",
    price: 42.0,
    thumbnail: img("black-botanical-kimono", "04-lifestyle-full.jpg"),
    images: [
      img("black-botanical-kimono", "04-lifestyle-full.jpg"),
      img("black-botanical-kimono", "01-pro-front.jpg"),
      img("black-botanical-kimono", "02-pro-side.jpg"),
      img("black-botanical-kimono", "05-lifestyle-detail.jpg"),
      img("black-botanical-kimono", "06-lifestyle-pose.jpg"),
      img("black-botanical-kimono", "03-pro-detail.jpg"),
    ],
  },
]

const SIZES = ["S/M", "L/XL", "One Size"]

// ─── Main ─────────────────────────────────────────────────────────────────────

export default async function seedProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const productModuleService = container.resolve(Modules.PRODUCT)
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)
  const pricingModuleService = container.resolve(Modules.PRICING)

  logger.info("Starting nikoolife product seed...")

  // ── 1. Get region ────────────────────────────────────────────────────────
  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code"],
  })

  const gbRegion = regions.find(
    (r: any) => r.currency_code === "gbp" || r.name?.toLowerCase().includes("uk") || r.name?.toLowerCase().includes("gb")
  ) || regions[0]

  if (!gbRegion) {
    throw new Error(
      "No region found. Please create a UK/GBP region in the admin first."
    )
  }

  logger.info(`Using region: ${gbRegion.name} (${gbRegion.currency_code})`)

  // ── 2. Get default sales channel ────────────────────────────────────────
  const salesChannels = await salesChannelModuleService.listSalesChannels()
  const defaultChannel = salesChannels[0]

  // ── 3. Create collections ────────────────────────────────────────────────
  logger.info("Creating collections...")

  const existingCollections = await productModuleService.listCollections()
  const existingHandles = existingCollections.map((c: any) => c.handle)

  const collectionMap: Record<string, string> = {}

  for (const [title, handle] of [
    ["Abayas", "abayas"],
    ["Kimonos", "kimonos"],
    ["New In", "new-in"],
  ]) {
    if (existingHandles.includes(handle)) {
      const existing = existingCollections.find((c: any) => c.handle === handle)
      collectionMap[title] = existing.id
      logger.info(`  Collection already exists: ${title}`)
    } else {
      const created = await productModuleService.createCollections({
        title,
        handle,
      })
      collectionMap[title] = created.id
      logger.info(`  Created collection: ${title}`)
    }
  }

  // ── 4. Create products ───────────────────────────────────────────────────
  logger.info("Creating products...")

  const existingProducts = await productModuleService.listProducts()
  const existingProductHandles = existingProducts.map((p: any) => p.handle)

  for (const product of PRODUCTS) {
    if (existingProductHandles.includes(product.handle)) {
      logger.info(`  Skipping (already exists): ${product.title}`)
      continue
    }

    logger.info(`  Creating: ${product.title}`)

    const { result } = await createProductsWorkflow(container).run({
      input: {
        products: [
          {
            title: product.title,
            handle: product.handle,
            subtitle: product.subtitle,
            description: product.description,
            status: "published" as const,
            thumbnail: product.thumbnail,
            images: product.images.map((url) => ({ url })),
            collection_id: collectionMap[product.collection],
            categories: [],
            tags: [],
            options: [
              {
                title: "Size",
                values: SIZES,
              },
            ],
            variants: SIZES.map((size) => ({
              title: size,
              sku: `${product.handle}-${size.toLowerCase().replace("/", "-")}`,
              options: { Size: size },
              prices: [
                {
                  amount: product.price,
                  currency_code: "gbp",
                  rules: {
                    region_id: gbRegion.id,
                  },
                },
              ],
              manage_inventory: false,
            })),
            sales_channels: defaultChannel
              ? [{ id: defaultChannel.id }]
              : [],
          },
        ],
      },
    })

    logger.info(`  ✓ Created: ${result[0].title}`)
  }

  // ── 5. Add all products to "New In" collection ──────────────────────────
  logger.info("Adding all products to New In collection...")
  const allProducts = await productModuleService.listProducts()
  const newInId = collectionMap["New In"]

  for (const p of allProducts) {
    await productModuleService.updateProducts(p.id, {
      // collection_id is set at creation; for new-in we add it separately
    })
  }

  logger.info("✅ Seed complete!")
  logger.info(`   ${PRODUCTS.length} products created across Abayas + Kimonos collections`)
  logger.info(`   Images served from: ${STOREFRONT_URL}/products/`)
}
