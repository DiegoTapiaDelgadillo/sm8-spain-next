import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
  pixelBasedPreset,
} from "@react-email/components";
import { Fragment, type FC, type ReactNode } from "react";
import { getCountry } from "@/lib/contact/countries";
import { formatPhoneInternational } from "@/lib/contact/schema";
import { getEmailAssets } from "@/lib/email/assets";
import type { EmailInfoProps } from "@/types/email/email";

// Aviso interno con los datos del contacto (specs 03 y 06). Colores en hex: muchos
// clientes de correo no entienden los `oklch` de la paleta de Tailwind v4.
// Borde, subrayado y fuente van en `style` y los radios en px: Tailwind los
// convierte en `text-decoration-line` y `rem`, que algunos clientes ignoran.

const FONT_FAMILY = "Helvetica, Arial, sans-serif";
const UNDERLINE = { textDecoration: "underline" } as const;

interface FieldProps {
  label: string;
  children: ReactNode;
}

const Field: FC<FieldProps> = ({ label, children }) => (
  <Text className="my-0 text-base text-[#737373]">
    <strong className="text-[#000000]">{label}:</strong> {children}
  </Text>
);

/** Saltos de línea como `<br>`: Outlook ignora `white-space: pre-line`. */
const withLineBreaks = (text: string) =>
  text.split(/\r?\n/).map((line, index) => (
    <Fragment key={index}>
      {index > 0 && <br />}
      {line}
    </Fragment>
  ));

const singleLine = (value: string) => value.replace(/\s+/g, " ").trim();

export const EmailInfo: FC<EmailInfoProps> = ({
  name,
  phone,
  phoneCountry,
  email,
  message,
}) => {
  const { logo } = getEmailAssets();
  const replyHref = `mailto:${email}?subject=${encodeURIComponent(
    "Re: Tu solicitud en SM8 España",
  )}`;
  // `phone` llega en E.164 (`+393123456789`): enlace tal cual, texto legible.
  const phoneHref = `tel:${phone}`;
  const countryName = getCountry(phoneCountry)?.name;
  const phoneLabel = formatPhoneInternational(phone);

  return (
    <Html lang="es">
      <Head />
      <Preview>{singleLine(`Nuevo contacto web de ${name}`)}</Preview>
      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Body
          className="m-0 bg-[#f5f5f5] p-4"
          style={{ fontFamily: FONT_FAMILY }}
        >
          <Container
            className="max-w-[600px] rounded-[12px] bg-[#ffffff] px-4 py-4"
            style={{ border: "1px solid #f5f5f5" }}
          >
            <Img src={logo} width={80} height={49} alt="Andamios SM8" />

            <Heading
              as="h1"
              className="mb-0 mt-4 text-xl font-bold text-[#000000]"
            >
              Nuevo cliente interesado
            </Heading>
            <Text className="my-4 text-base text-[#737373]">
              Alguien ha escrito desde el formulario de la web. Estos son sus
              datos de contacto:
            </Text>

            <Section>
              <Field label="Nombre">{name}</Field>
              <Field label="Teléfono">
                <Link
                  href={phoneHref}
                  className="text-[#a16207]"
                  style={UNDERLINE}
                >
                  {phoneLabel}
                </Link>
                {countryName && ` (${countryName})`}
              </Field>
              <Field label="Email">
                <Link
                  href={`mailto:${email}`}
                  className="text-[#a16207]"
                  style={UNDERLINE}
                >
                  {email}
                </Link>
              </Field>
            </Section>

            <Section className="mt-4">
              <Text className="my-0 text-sm text-[#737373]">Mensaje:</Text>
              <Text className="my-0 text-base text-[#737373]">
                {withLineBreaks(message)}
              </Text>
            </Section>

            <Section className="mt-4">
              <Button
                href={replyHref}
                className="rounded-[16px] bg-[#000000] px-8 py-2 text-sm text-[#ffffff]"
              >
                Contactar cliente
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
