import { checkBotId } from "botid/server";
import { render } from "@react-email/components";
import { Resend } from "resend";
import * as z from "zod";
import { EmailContact } from "@/components/Email/EmailContact/EmailContact";
import { EmailInfo } from "@/components/Email/EmailInfo/EmailInfo";
import {
  contactSchema,
  type ContactFieldErrors,
  type ContactPayload,
  type ContactResponse,
} from "@/lib/contact/schema";

// POST /api/contact (spec 03): origen → BotID → validación → Resend.

const DEFAULT_ORIGINS = ["https://sm8.es", "https://www.sm8.es"];
const DEFAULT_FROM = "SM8 España <ventas@sm8.es>";
// El formulario completo ocupa unos pocos KB; se corta antes de leer el body.
const MAX_BODY_BYTES = 16 * 1024;

const GENERIC_ERROR =
  "No hemos podido enviar tu mensaje. Inténtalo de nuevo más tarde.";

const json = (body: ContactResponse, status = 200) =>
  Response.json(body, { status });

/** Orígenes permitidos: `ALLOWED_ORIGINS` (separados por comas) + localhost en desarrollo. */
const getAllowedOrigins = () => {
  const fromEnv = process.env.ALLOWED_ORIGINS?.split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean);
  const origins = new Set(fromEnv?.length ? fromEnv : DEFAULT_ORIGINS);
  if (process.env.NODE_ENV === "development") {
    origins.add("http://localhost:3000");
  }
  return origins;
};

/** Origen de la petición: `Origin` o, si falta, el origen de `Referer`. */
const getRequestOrigin = (request: Request) => {
  const origin = request.headers.get("origin");
  if (origin && origin !== "null") return origin;
  const referer = request.headers.get("referer");
  if (!referer) return null;
  try {
    return new URL(referer).origin;
  } catch {
    return null;
  }
};

/**
 * Lee el body cortando en `MAX_BODY_BYTES`, aunque no llegue `Content-Length`
 * (p. ej. `Transfer-Encoding: chunked`). Devuelve `null` si se pasa del límite.
 */
const readBodyLimited = async (request: Request) => {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
};

/** Quita saltos de línea y espacios de más (para la línea de asunto). */
const singleLine = (value: string) => value.replace(/\s+/g, " ").trim();

export async function POST(request: Request) {
  // 1. Origen
  const origin = getRequestOrigin(request);
  if (!origin || !getAllowedOrigins().has(origin)) {
    return json({ ok: false, message: "Origen no permitido." }, 403);
  }

  // 2. Bots (Vercel BotID, nivel Basic)
  const verification = await checkBotId();
  if (verification.isBot) {
    return json({ ok: false, message: "Acceso denegado." }, 403);
  }

  // 3. Body y validación. Solo JSON: evita las peticiones "simples" sin preflight.
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return json({ ok: false, message: "Petición no válida." }, 415);
  }

  const TOO_LONG = { ok: false, message: "El mensaje es demasiado largo." } as const;
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) return json(TOO_LONG, 413);

  const raw = await readBodyLimited(request);
  if (raw === null) return json(TOO_LONG, 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, message: "Petición no válida." }, 400);
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    return json(
      {
        ok: false,
        message: "Revisa los campos marcados.",
        fieldErrors: fieldErrors as ContactFieldErrors,
      },
      400,
    );
  }

  // 4. Envío
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM;
  if (!apiKey || !to) {
    console.error(
      "[api/contact] Faltan variables de entorno: RESEND_API_KEY o CONTACT_TO_EMAIL.",
    );
    return json({ ok: false, message: GENERIC_ERROR }, 500);
  }

  // `privacy` solo se valida; no va en los correos.
  const { name, phone, phoneCountry, email, message } = parsed.data;
  const contact: ContactPayload = {
    name,
    phone,
    phoneCountry,
    email,
    message,
  };

  // Las plantillas se montan fuera del try (regla react-hooks/error-boundaries).
  const clientEmail = <EmailContact name={contact.name} />;
  const internalEmail = <EmailInfo {...contact} />;

  try {
    // Se renderizan aquí (HTML + texto plano) en vez de pasar `react:` a Resend:
    // Resend importa `@react-email/render` por su cuenta y no lo encuentra.
    const [clientHtml, clientText, internalHtml, internalText] =
      await Promise.all([
        render(clientEmail),
        render(clientEmail, { plainText: true }),
        render(internalEmail),
        render(internalEmail, { plainText: true }),
      ]);

    const resend = new Resend(apiKey);
    // Un solo envío por lotes: o salen los dos correos o ninguno.
    const { error } = await resend.batch.send([
      {
        from,
        to: [contact.email],
        subject: "Hemos recibido tu mensaje · SM8 España",
        html: clientHtml,
        text: clientText,
      },
      {
        from,
        to: [to],
        replyTo: contact.email,
        subject: singleLine(`Nuevo contacto web: ${contact.name}`),
        html: internalHtml,
        text: internalText,
      },
    ]);

    if (error) {
      console.error("[api/contact] Resend devolvió un error:", error);
      return json({ ok: false, message: GENERIC_ERROR }, 502);
    }
  } catch (error) {
    console.error("[api/contact] Fallo al enviar con Resend:", error);
    return json({ ok: false, message: GENERIC_ERROR }, 502);
  }

  return json({ ok: true });
}
