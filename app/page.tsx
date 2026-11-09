import { CertificationsSection } from "@/components/Certifications/CertificationsSection/CertificationSection";
import { ClientsSection } from "@/components/Clients/ClientsSection/ClientsSection";
import { ContactSection } from "@/components/Contact/ContactSection/ContactSection";
import { FaqSection } from "@/components/Faq/FaqSection/FaqSection";
import { HomeSection } from "@/components/Home/HomeSection/HomeSection";
import { ManualSection } from "@/components/Manual/ManualSection/ManualSection";
import { OpionsSection } from "@/components/Opinions/OpionsSection/OpionsSection";
import { ProjectsSection } from "@/components/Projects/ProjectsSection/ProjectsSection";
import { ScaffoldsSection } from "@/components/Scaffolds/ScaffoldsSection/ScaffoldsSection";
import { homeJsonLd, serializeJsonLd } from "@/lib/seo/jsonLd";

export default function Home() {
  return (
    <>
      {/* Datos estructurados (LocalBusiness, WebSite, FAQPage): `<` escapado según la guía de Next. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(homeJsonLd) }}
      />
      <HomeSection id="inicio" />
      <ClientsSection />
      <ScaffoldsSection id="andamios" />
      <ProjectsSection id="proyectos" />
      <CertificationsSection id="certificaciones" />
      <ManualSection />
      <OpionsSection />
      <FaqSection id="preguntas-frecuentes" />
      <ContactSection id="contacto" />
    </>
  );
}
