import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/shared/Navbar/Navbar";
import { Montserrat, Mona_Sans } from "next/font/google";
import { Footer } from "@/components/shared/Footer/Footer";
import { BUSINESS } from "@/lib/business";
import { SEO } from "@/lib/seo/seo";

export const metadata: Metadata = {
  metadataBase: new URL(BUSINESS.url),
  title: SEO.title,
  description: SEO.description,
  applicationName: BUSINESS.name,
  category: "construcción",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: BUSINESS.name,
    url: "/",
    title: SEO.title,
    description: SEO.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.title,
    description: SEO.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
});

const dm_sans = Mona_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const links = [
  { href: "#inicio", text: "Inicio" },
  { href: "#andamios", text: "Andamios" },
  { href: "#proyectos", text: "Proyectos" },
  { href: "#certificaciones", text: "Certificaciones" },
  { href: "#contacto", text: "Contacto" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${montserrat.variable} ${dm_sans.variable}`}
    >
      <body className=" bg-black">
        <Navbar links={links} />
        <main>{children}</main>
        <Footer links={links} />
      </body>
    </html>
  );
}
