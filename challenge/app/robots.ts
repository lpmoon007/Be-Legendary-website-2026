import type { MetadataRoute } from "next";

// Served at /robots.txt. Public pages open to all crawlers; /admin (auth-gated)
// stays out. Points crawlers at the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin",
    },
    sitemap: "https://challenge.belegendary.org/sitemap.xml",
    host: "https://challenge.belegendary.org",
  };
}
