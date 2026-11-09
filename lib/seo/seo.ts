import { BUSINESS } from "@/lib/business";

/**
 * Textos SEO de la home (spec 02, §6). Única fuente para `metadata`, la imagen
 * Open Graph y el JSON-LD.
 */
export const SEO = {
  title: `Alquiler y montaje de andamios en Madrid | ${BUSINESS.name}`,
  description:
    "Alquiler, montaje y venta de andamio multidireccional en la Comunidad de Madrid para fachadas, obra e industria. Gestionamos el PMUD y las licencias.",
  ogImageAlt: `${BUSINESS.name}: alquiler y montaje de andamios en Madrid`,
} as const;
