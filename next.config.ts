import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Rutas del sitio anterior (SPA en Vercel). Permanentes (308) y sin comodines
  // para no capturar /sitemap.xml, /robots.txt ni /_next.
  async redirects() {
    return [
      {
        source: "/andamio-multidireccional",
        destination: "/#andamios",
        permanent: true,
      },
      { source: "/nosotros", destination: "/", permanent: true },
      { source: "/contacto", destination: "/#contacto", permanent: true },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
