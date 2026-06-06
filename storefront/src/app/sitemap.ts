import { MetadataRoute } from "next"
import { listProducts } from "@lib/data/products"
import { listCollections } from "@lib/data/collections"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://nikoolife.co.uk"
const COUNTRY = "gb"

const staticRoutes: MetadataRoute.Sitemap = [
  { url: `${BASE_URL}/${COUNTRY}`, priority: 1.0, changeFrequency: "weekly" },
  { url: `${BASE_URL}/${COUNTRY}/store`, priority: 0.9, changeFrequency: "weekly" },
  { url: `${BASE_URL}/${COUNTRY}/contact`, priority: 0.5, changeFrequency: "monthly" },
  { url: `${BASE_URL}/${COUNTRY}/shipping`, priority: 0.5, changeFrequency: "monthly" },
  { url: `${BASE_URL}/${COUNTRY}/size-guide`, priority: 0.4, changeFrequency: "monthly" },
  { url: `${BASE_URL}/${COUNTRY}/privacy`, priority: 0.3, changeFrequency: "yearly" },
  { url: `${BASE_URL}/${COUNTRY}/terms`, priority: 0.3, changeFrequency: "yearly" },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const [{ response }, { collections }] = await Promise.all([
      listProducts({ countryCode: COUNTRY, queryParams: { limit: 200, fields: "handle,updated_at" } }),
      listCollections({ fields: "handle" }),
    ])

    const productUrls: MetadataRoute.Sitemap = response.products.map((p) => ({
      url: `${BASE_URL}/${COUNTRY}/products/${p.handle}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      priority: 0.8,
      changeFrequency: "weekly",
    }))

    const collectionUrls: MetadataRoute.Sitemap = (collections ?? []).map((c) => ({
      url: `${BASE_URL}/${COUNTRY}/collections/${c.handle}`,
      priority: 0.7,
      changeFrequency: "weekly",
    }))

    return [...staticRoutes, ...productUrls, ...collectionUrls]
  } catch {
    return staticRoutes
  }
}
