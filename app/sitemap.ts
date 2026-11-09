import type { MetadataRoute } from "next";
import { BUSINESS } from "@/lib/business";

/**
 * Fecha fija de la última revisión del contenido (dd/mm/aaaa: 06/11/2026).
 * No se usa `new Date()` para que el sitemap sea estático con `cacheComponents`;
 * actualízala cuando cambie el contenido de la landing.
 */
const LAST_MODIFIED = "2026-11-06";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BUSINESS.url,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
