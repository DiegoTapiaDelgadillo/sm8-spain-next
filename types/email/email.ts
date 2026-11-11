import type { ContactPayload } from "@/lib/contact/schema";

/** Acuse de recibo al cliente. */
export interface EmailContactProps {
  name: string;
}

/** Aviso interno con los datos del contacto. */
export type EmailInfoProps = ContactPayload;
