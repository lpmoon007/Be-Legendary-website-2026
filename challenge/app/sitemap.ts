import type { MetadataRoute } from "next";

// Served at /sitemap.xml. The public, indexable pages of the challenge app.
// Submit https://challenge.belegendary.org/sitemap.xml in Google Search Console.
const BASE = "https://challenge.belegendary.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${BASE}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
