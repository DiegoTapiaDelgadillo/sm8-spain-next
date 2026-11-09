import { ImageResponse } from "next/og";
import { BUSINESS } from "@/lib/business";
import { SEO } from "@/lib/seo/seo";

export const alt = SEO.ogImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagen Open Graph de la home, generada en el build (solo texto: el logo es webp). */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: "#000000",
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: 4,
            background: "#facc15",
          }}
        />
        <div style={{ fontSize: 40, fontWeight: 700 }}>{BUSINESS.name}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.1 }}>
          Alquiler y montaje de andamios en Madrid
        </div>
        <div
          style={{
            fontSize: 44,
            fontWeight: 700,
            color: "#fde047",
            marginTop: 16,
          }}
        >
          para fachadas, obra e industria
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 28,
          color: "#a3a3a3",
          borderTop: "2px solid #262626",
          paddingTop: 28,
        }}
      >
        <div>Andamio multidireccional · Comunidad de Madrid</div>
        <div>{BUSINESS.phone.display}</div>
      </div>
    </div>,
    size,
  );
}
