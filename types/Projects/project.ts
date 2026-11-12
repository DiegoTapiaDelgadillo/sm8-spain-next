import type { StaticImageData } from "next/image";

export interface ProjectProps {
  title: string;
  description: string;
  /** Importación estática (`import foto from "@/public/img/…"`): da el `blurDataURL`. */
  imageUrl: StaticImageData;
}
