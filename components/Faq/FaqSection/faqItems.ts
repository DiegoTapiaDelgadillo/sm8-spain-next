import type { FaqItem } from "@/types/Faq/faq";
import { BUSINESS } from "@/lib/business";

/**
 * Preguntas frecuentes (spec 02, §6). Única fuente para la sección y para el JSON-LD
 * `FAQPage`: si cambia un texto, se cambia aquí.
 */
export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    id: "precio",
    question: "¿Cuánto cuesta alquilar un andamio?",
    answer:
      "Depende de los metros de fachada, la altura, el tiempo de alquiler y el acceso a la obra. Hacemos una visita técnica y te enviamos un presupuesto sin compromiso en menos de 24 horas.",
  },
  {
    id: "montaje",
    question: "¿El alquiler incluye el montaje y el desmontaje?",
    answer:
      "Sí. Nuestro personal propio y cualificado se encarga del montaje y el desmontaje con el Sistema Multidireccional SM8.",
  },
  {
    id: "tiempo",
    question: "¿Hay un tiempo mínimo de alquiler?",
    answer:
      "Pactamos contigo un periodo inicial, por días o por meses. Si la obra se alarga, ampliamos el alquiler sin problema.",
  },
  {
    id: "multidireccional",
    question: "¿Qué tipo de andamio usáis?",
    answer:
      "Trabajamos con andamio multidireccional. A diferencia del andamio europeo de marcos, sus piezas se unen en una roseta en varias direcciones, así que se adapta a esquinas, curvas, desniveles e instalaciones industriales.",
  },
  {
    id: "zonas",
    question: "¿En qué zonas trabajáis?",
    answer: " En toda la Comunidad de Madrid y en las provincias limítrofes.",
  },
  {
    id: "comunidades",
    question: "¿Trabajáis con comunidades de vecinos?",
    answer: `Sí. Montamos andamios para rehabilitación de fachadas, cubiertas y patios de luces, y coordinamos los accesos para molestar lo menos posible a los vecinos.`,
  },
  {
    id: "permisos",
    question: "¿Os encargáis de los permisos del ayuntamiento?",
    answer: `No. La tramitación de licencias y permisos corre a cargo del cliente o de su empresa constructora. Si los necesitas, te facilitamos la información técnica del andamio.`,
  },
  {
    id: "ventas",
    question: "¿Vendéis andamios o solo los alquiláis?",
    answer: `Las dos cosas. Además del alquiler con montaje, vendemos los componentes del Sistema Multidireccional SM8. Solicita la ficha técnica o pídenos presupuesto.`,
  },
];
