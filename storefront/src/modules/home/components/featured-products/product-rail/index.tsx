import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts) {
    return null
  }

  return (
    <section className="py-14 small:py-20 border-b border-nikoo-border last:border-b-0">
      <div className="content-container">
        {/* Section header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-nikoo-gold mb-2">
              Collection
            </p>
            <h2 className="font-display text-4xl small:text-5xl font-light text-nikoo-charcoal tracking-wide">
              '{collection.title}'
            </h2>
          </div>
          <LocalizedClientLink
            href={`/collections/${collection.handle}`}
            className="font-sans text-xs tracking-[0.2em] uppercase text-nikoo-muted border-b border-nikoo-muted pb-0.5 hover:text-nikoo-gold hover:border-nikoo-gold transition-colors duration-200"
          >
            View all
          </LocalizedClientLink>
        </div>

        {/* Product grid */}
        <ul className="grid grid-cols-2 small:grid-cols-4 gap-x-5 gap-y-12">
          {pricedProducts.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
