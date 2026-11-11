import "server-only";

/**
 * URLs absolutas de las imágenes de los correos (PNG: Outlook no muestra WebP).
 * El cliente de correo las descarga al abrir el mensaje, así que deben estar
 * publicadas en `EMAIL_ASSETS_URL` (por defecto la web de producción).
 */
export const getEmailAssets = () => {
  const baseUrl = (
    process.env.EMAIL_ASSETS_URL || "https://www.sm8.es"
  ).replace(/\/+$/, "");
  return {
    baseUrl,
    logo: `${baseUrl}/img/email/logo-azul.png`,
    banner: `${baseUrl}/img/email/lona.jpg`,
  };
};
