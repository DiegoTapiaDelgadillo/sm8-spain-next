import type { ImageProps } from "next/image";

/**
 * Mismas props que `next/image`. El placeholder borroso sale solo con una
 * importación estática (`import foto from "@/public/img/…"`) o con `blurDataURL`.
 */
export interface BlurImageProps extends ImageProps {
  /**
   * Clases del envoltorio que lleva el placeholder. Con `fill` es `absolute inset-0`
   * (ocupa el padre `relative`); sin `fill`, `relative block`. Pon aquí el radio
   * (`rounded-xl`) si la imagen lo lleva, para que el placeholder también lo tenga.
   */
  wrapperClassName?: string;
}
