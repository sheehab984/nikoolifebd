import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="bg-nikoo-cream min-h-screen">
      {/* Page header */}
      <div className="bg-nikoo-ivory border-b border-nikoo-border">
        <div className="content-container py-12 text-center">
          <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-nikoo-gold mb-3">
            Shop
          </p>
          <h1
            className="font-display text-5xl font-light text-nikoo-charcoal tracking-wide"
            data-testid="store-page-title"
          >
            All Products
          </h1>
        </div>
      </div>

      {/* Refinement + Grid */}
      <div className="content-container py-10">
        <div className="flex flex-col small:flex-row small:items-start gap-8">
          <RefinementList sortBy={sort} />
          <div className="w-full">
            <Suspense fallback={<SkeletonProductGrid />}>
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                countryCode={countryCode}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StoreTemplate
