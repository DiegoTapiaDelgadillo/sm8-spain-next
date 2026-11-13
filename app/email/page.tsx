import { render } from "@react-email/components";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EmailContact } from "@/components/Email/EmailContact/EmailContact";
import { EmailInfo } from "@/components/Email/EmailInfo/EmailInfo";
import type { EmailInfoProps } from "@/types/email/email";

// Vista previa de las plantillas de correo (spec 03). Solo en desarrollo.
// Cada plantilla es un documento `<html>` completo, así que se renderiza a HTML
// con react-email y se muestra en un `<iframe srcDoc>` aislado de la web.

export const metadata: Metadata = {
  title: "Vista previa de correos",
  robots: { index: false, follow: false },
};

const SAMPLE: EmailInfoProps = {
  name: "Giulia Rossi Bianchi",
  // Como sale del esquema: E.164 y país real del número (spec 06).
  phone: "+393123456789",
  phoneCountry: "IT",
  email: "giulia.rossi@example.com",
  message:
    "Hola:\nNecesitamos un andamio para una fachada de cuatro plantas.\n\n¿Podéis pasarnos presupuesto?",
};

export default async function EmailPreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  const [contactHtml, infoHtml] = await Promise.all([
    render(<EmailContact name={SAMPLE.name} />),
    render(<EmailInfo {...SAMPLE} />),
  ]);

  const previews = [
    { title: "Acuse de recibo al cliente (EmailContact)", html: contactHtml },
    { title: "Aviso interno (EmailInfo)", html: infoHtml },
  ];

  return (
    <div className="grid gap-8 px-4 pb-16 pt-28 md:px-12 lg:grid-cols-2 lg:px-24">
      {previews.map(({ title, html }) => (
        <section key={title} className="grid gap-3">
          <h2 className="font-text text-lg text-neutral-400">{title}</h2>
          <iframe
            title={title}
            srcDoc={html}
            className="h-[52rem] w-full rounded-xl border border-neutral-800 bg-white"
          />
        </section>
      ))}
    </div>
  );
}
