import { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://nikoolife.co.uk"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/account/", "/checkout/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
