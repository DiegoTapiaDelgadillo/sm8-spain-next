import { CertificationsSection } from "@/components/Certifications/CertificationsSection/CertificationSection";
import { ClientsSection } from "@/components/Clients/ClientsSection/ClientsSection";
import { ContactSection } from "@/components/Contact/ContactSection/ContactSection";
import { HomeSection } from "@/components/Home/HomeSection/HomeSection";
import { ManualSection } from "@/components/Manual/ManualSection/ManualSection";
import { OpionsSection } from "@/components/Opinions/OpionsSection/OpionsSection";
import { ProjectsSection } from "@/components/Projects/ProjectsSection/ProjectsSection";
import { ScaffoldsSection } from "@/components/Scaffolds/ScaffoldsSection/ScaffoldsSection";

export default function Home() {
  return (
    <>
      <HomeSection />
      <ClientsSection />
      <ScaffoldsSection />
      <ProjectsSection />
      <CertificationsSection />
      <ManualSection />
      <OpionsSection />
      <ContactSection />
    </>
  );
}
