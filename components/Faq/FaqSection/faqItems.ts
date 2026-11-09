import type { FaqItem } from "@/types/Faq/faq";
import { BUSINESS } from "@/lib/business";

/**
 * Preguntas frecuentes (spec 02, §6). Única fuente para la sección y para el JSON-LD
 * `FAQPage`: si cambia un texto, se cambia aquí.
 */
export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    id: "montaje-desmontaje",
    question: "¿Montáis y desmontáis el andamio?",
    answer:
      "Sí. Nuestro servicio de alquiler incluye el montaje y el desmontaje, que realiza personal propio cualificado con el Sistema Multidireccional SM8.",
  },
  {
    id: "que-es-pmud",
    question: "¿Qué es el PMUD?",
    answer:
      "El Plan de Montaje, Utilización y Desmontaje (PMUD) es el documento que define cómo se monta, se usa y se desmonta un andamio con seguridad. Nosotros lo redactamos por ti.",
  },
  {
    id: "licencias",
    question: "¿Os encargáis de las licencias del andamio?",
    answer:
      "Sí. Gestionamos las licencias necesarias para montar el andamio, además del PMUD.",
  },
  {
    id: "multidireccional-vs-europeo",
    question:
      "¿Qué ventajas tiene el andamio multidireccional frente al europeo?",
    answer:
      "El andamio europeo (de marco) se monta en módulos fijos sobre planos rectos. El multidireccional une sus piezas en una roseta octogonal en varias direcciones, así que se adapta a esquinas, curvas, desniveles e instalaciones industriales.",
  },
  {
    id: "venta",
    question: "¿Vendéis el andamio o solo lo alquiláis?",
    answer:
      "Las dos cosas. Además del alquiler con montaje, vendemos los componentes del Sistema Multidireccional SM8. Descarga la ficha técnica o pídenos presupuesto.",
  },
  {
    id: "zonas",
    question: "¿En qué zonas trabajáis?",
    answer: `En toda la ${BUSINESS.areaServed}. Nuestra oficina está en la ${BUSINESS.address.street}, ${BUSINESS.address.district} (${BUSINESS.address.city}).`,
  },
];
