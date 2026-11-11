import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
  pixelBasedPreset,
} from "@react-email/components";
import type { FC } from "react";
import { BUSINESS } from "@/lib/business";
import { getEmailAssets } from "@/lib/email/assets";
import type { EmailContactProps } from "@/types/email/email";

// Acuse de recibo al cliente (spec 03). Colores en hex: muchos clientes de
// correo no entienden los `oklch` de la paleta de Tailwind v4. Bordes, subrayado
// y fuente van en `style`: Tailwind los convierte en propiedades lógicas
// (`border-inline`, `text-decoration-line`) que Outlook no entiende.

const FONT_FAMILY = "Helvetica, Arial, sans-serif";
const UNDERLINE = { textDecoration: "underline" } as const;

export const EmailContact: FC<EmailContactProps> = ({ name }) => {
  const { logo, banner } = getEmailAssets();

  return (
    <Html lang="es">
      <Head />
      <Preview>Hemos recibido tu mensaje. Te contestaremos en breve.</Preview>
      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Body
          className="m-0 bg-[#f5f5f5] p-4"
          style={{ fontFamily: FONT_FAMILY }}
        >
          <Container
            className="max-w-[600px] bg-[#ffffff]"
            style={{
              borderLeft: "1px solid #e5e5e5",
              borderRight: "1px solid #e5e5e5",
              borderTop: "4px solid #eab308",
              borderBottom: "4px solid #eab308",
            }}
          >
            <Img
              src={banner}
              width={600}
              height={300}
              alt="Montadores de SM8 colocando una lona en un andamio"
              className="block h-auto w-full"
            />

            <Section className="px-4 pt-4">
              <Img src={logo} width={80} height={49} alt="Andamios SM8" />
            </Section>

            <Section className="px-4 pb-2">
              <Text className="my-4 text-base text-[#737373]">
                Hola, <strong className="text-[#000000]">{name}.</strong>
              </Text>
              <Text className="my-4 text-base text-[#737373]">
                Gracias por escribirnos. En breve un técnico se pondrá en
                contacto contigo.
              </Text>
              <Text className="my-4 text-base text-[#737373]">
                Si tienes alguna pregunta, escríbenos a{" "}
                <Link
                  href={`mailto:${BUSINESS.email}`}
                  className="text-[#a16207]"
                  style={UNDERLINE}
                >
                  {BUSINESS.email}
                </Link>
                .
              </Text>
              <Text className="mb-0 mt-4 text-base font-bold text-[#000000]">
                Un saludo,
              </Text>
              <Text className="mb-4 mt-0 text-sm text-[#737373]">
                Equipo de {BUSINESS.name}
              </Text>
            </Section>

            <Section
              className="bg-[#f5f5f5] px-4 py-3"
              style={{ borderTop: "1px solid #e5e5e5" }}
            >
              <Text className="my-0 text-xs text-[#666666]">
                <Link
                  href={BUSINESS.phone.href}
                  className="text-[#666666]"
                  style={{ textDecoration: "none" }}
                >
                  {BUSINESS.phone.display}
                </Link>
              </Text>
              <Text className="my-0 text-xs text-[#666666]">
                {BUSINESS.address.display}
              </Text>
            </Section>

            <Section className="bg-[#000000] px-4 py-4 text-right">
              <Link
                href={BUSINESS.social.facebook}
                className="text-xs text-[#ffffff]"
                style={UNDERLINE}
              >
                Facebook
              </Link>
              <Link
                href={BUSINESS.social.instagram}
                className="ml-4 text-xs text-[#ffffff]"
                style={UNDERLINE}
              >
                Instagram
              </Link>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
