import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({ product })

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group block">
      <div data-testid="product-wrapper">
        {/* Image */}
        <div className="overflow-hidden bg-nikoo-ivory mb-4">
          <div className="transform group-hover:scale-[1.03] transition-transform duration-500 ease-out">
            <Thumbnail
              thumbnail={product.thumbnail}
              images={product.images}
              size="full"
              isFeatured={isFeatured}
            />
          </div>
        </div>

        {/* Info */}
        <div className="text-center px-1">
          <p className="font-sans text-xs text-nikoo-charcoal tracking-wide leading-snug mb-1.5 group-hover:text-nikoo-gold transition-colors duration-200 uppercase">
            {product.title}
          </p>
          {cheapestPrice && (
            <div className="font-sans text-xs text-nikoo-muted">
              <PreviewPrice price={cheapestPrice} />
            </div>
          )}
        </div>
      </div>
    </LocalizedClientLink>
  )
}
