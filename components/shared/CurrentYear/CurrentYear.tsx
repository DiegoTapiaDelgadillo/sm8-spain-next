import { cacheLife } from "next/cache";

/**
 * Año actual para el copyright. Con `cacheComponents`, `new Date()` en el render
 * rompe el prerender: se cachea (`use cache` + `cacheLife("days")`) para que la
 * página siga siendo estática y el año se renueve al revalidar.
 */
export const CurrentYear = async () => {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
};
