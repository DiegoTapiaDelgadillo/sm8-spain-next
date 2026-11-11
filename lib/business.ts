/**
 * Datos del negocio confirmados por Diego (spec 02). Única fuente para metadata,
 * JSON-LD, Footer y Contacto: si cambia algo, se cambia aquí.
 */
export const BUSINESS = {
  name: "SM8 España",
  url: "https://www.sm8.es",
  email: "info@sm8.es",
  phone: {
    display: "+34 616 74 02 90",
    href: "tel:+34616740290",
  },
  whatsapp: {
    display: "+34 682 41 12 45",
    href: "https://wa.me/34682411245",
  },
  businessHours: {
    hours: "Lunes a viernes, de 8:00 hrs a 18:00 hrs. ",
  },
  address: {
    street: "Av. de Manoteras 38",
    district: "Chamartín",
    postalCode: "28050",
    city: "Madrid",
    region: "Comunidad de Madrid",
    country: "ES",
    /** Formato para mostrar en la web. */
    display: "Av. de Manoteras 38, Chamartín, 28050 Madrid",
  },
  areaServed: "Comunidad de Madrid",
  social: {
    instagram: "https://www.instagram.com/sm8espana",
    facebook: "https://www.facebook.com/sm8espana",
  },
  group: [
    { name: "SM8 México", url: "https://sm8.com.mx" },
    { name: "SM8 Desarrollos", url: "https://www.sm8desarrollos.com.mx/" },
    { name: "Timbrela", url: "https://timbrela.com" },
  ],
  /** Servicios confirmados. No añadir otros sin confirmación. */
  services: [
    "Alquiler de andamios con montaje y desmontaje",
    "Venta del Sistema Multidireccional SM8",
    "Gestión del PMUD y de licencias",
  ],
} as const;
