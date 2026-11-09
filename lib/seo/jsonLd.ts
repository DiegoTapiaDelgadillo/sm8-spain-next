import { BUSINESS } from "@/lib/business";
import { FAQ_ITEMS } from "@/components/Faq/FaqSection/faqItems";
import { SEO } from "./seo";

/** Nodo JSON-LD tipado a mano (sin dependencias): objeto con `@type`. */
type JsonLdNode = { "@type": string; [key: string]: unknown };

const BUSINESS_ID = `${BUSINESS.url}/#negocio`;
const WEBSITE_ID = `${BUSINESS.url}/#web`;

/** `+34 616 74 02 90` → `+34616740290`. */
const telephone = BUSINESS.phone.href.replace(/^tel:/, "");

const localBusiness: JsonLdNode = {
  "@type": "LocalBusiness",
  "@id": BUSINESS_ID,
  name: BUSINESS.name,
  description: SEO.description,
  url: BUSINESS.url,
  logo: `${BUSINESS.url}/img/logo.webp`,
  image: `${BUSINESS.url}/opengraph-image`,
  email: BUSINESS.email,
  telephone,
  address: {
    "@type": "PostalAddress",
    streetAddress: BUSINESS.address.street,
    addressLocality: BUSINESS.address.city,
    addressRegion: BUSINESS.address.region,
    postalCode: BUSINESS.address.postalCode,
    addressCountry: BUSINESS.address.country,
  },
  areaServed: {
    "@type": "AdministrativeArea",
    name: BUSINESS.areaServed,
  },
  sameAs: [BUSINESS.social.instagram, BUSINESS.social.facebook],
  makesOffer: BUSINESS.services.map((service) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: service,
      areaServed: { "@type": "AdministrativeArea", name: BUSINESS.areaServed },
      provider: { "@id": BUSINESS_ID },
    },
  })),
  parentOrganization: {
    "@type": "Organization",
    name: "SM8",
    url: "https://sm8.com.mx",
  },
};

const webSite: JsonLdNode = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: BUSINESS.url,
  name: BUSINESS.name,
  inLanguage: "es-ES",
  publisher: { "@id": BUSINESS_ID },
};

const faqPage: JsonLdNode = {
  "@type": "FAQPage",
  "@id": `${BUSINESS.url}/#preguntas-frecuentes`,
  inLanguage: "es-ES",
  isPartOf: { "@id": WEBSITE_ID },
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

/**
 * Datos estructurados de la home (spec 02, §3.4). Sin `geo`, horario ni reseñas:
 * no están confirmados por Diego.
 */
export const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [localBusiness, webSite, faqPage],
};

/** JSON listo para `<script type="application/ld+json">`, con `<` escapado (guía de Next). */
export const serializeJsonLd = (data: unknown) =>
  JSON.stringify(data).replace(/</g, "\\u003c");
