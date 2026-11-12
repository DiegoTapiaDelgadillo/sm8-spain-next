"use client";

import Image, { getImageProps, type ImageProps } from "next/image";
import type { CSSProperties, SyntheticEvent } from "react";
import { BlurImageProps } from "@/types/shared/blurImage/blurImage";

/** Duración del fundido (coincide con `blur-image-in` en globals.css). */
const FADE_MS = 400;

const hasStaticBlur = (src: ImageProps["src"]) => {
  if (typeof src === "string") return false;
  const data = "default" in src ? src.default : src;
  return Boolean(data.blurDataURL);
};

/**
 * Placeholder de Next (SVG borroso) como fondo del envoltorio. Se pinta fuera del
 * <img> para que el fundido de la foto no lo oculte también.
 */
const getPlaceholderStyle = (props: ImageProps): CSSProperties | undefined => {
  const { placeholder, blurDataURL, src } = props;
  if (placeholder === "empty") return undefined;
  const isDataUrl =
    typeof placeholder === "string" && placeholder.startsWith("data:");
  if (!isDataUrl && !blurDataURL && !hasStaticBlur(src)) return undefined;

  // Solo lo que afecta al placeholder (sin preload, loading ni eventos).
  const { style } = getImageProps({
    src,
    alt: props.alt,
    width: props.width,
    height: props.height,
    fill: props.fill,
    sizes: props.sizes,
    quality: props.quality,
    unoptimized: props.unoptimized,
    style: props.style,
    blurDataURL,
    placeholder: isDataUrl ? placeholder : "blur",
  }).props;
  if (!style?.backgroundImage) return undefined;
  return {
    "--blur-image": style.backgroundImage,
    backgroundSize: style.backgroundSize,
    backgroundPosition: style.backgroundPosition,
    backgroundRepeat: style.backgroundRepeat,
  } as CSSProperties;
};

/**
 * `next/image` con placeholder borroso y fundido de 400 ms al cargar. El estado
 * (`data-blur-state` en el envoltorio) se escribe en el DOM, sin `setState`:
 * - al montar, si la foto no está completa → "loading" (el CSS la oculta);
 * - al cargar → "loaded" (fundido) y, tras el fundido, "done" (sin placeholder).
 * Si ya estaba en caché no se oculta nunca. Sin JS o con movimiento reducido no
 * hay fundido (ver `.blur-image` en globals.css).
 */
export const BlurImage = ({
  wrapperClassName = "",
  alt,
  ...rest
}: BlurImageProps) => {
  const props = { ...rest, alt };
  const { fill, onLoad, onError } = props;
  const placeholderStyle = getPlaceholderStyle(props);

  const markLoading = (img: HTMLImageElement | null) => {
    const wrapper = img?.parentElement;
    if (!img || !wrapper || img.complete) return;
    wrapper.dataset.blurState = "loading";
  };

  const finish = (img: HTMLImageElement) => {
    const wrapper = img.parentElement;
    if (!wrapper) return;
    const fades =
      wrapper.dataset.blurState === "loading" &&
      window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    if (!fades) {
      wrapper.dataset.blurState = "done";
      return;
    }
    wrapper.dataset.blurState = "loaded";
    setTimeout(() => {
      wrapper.dataset.blurState = "done";
    }, FADE_MS);
  };

  const handleLoad = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    finish(event.currentTarget);
    onLoad?.(event);
  };

  const handleError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    finish(event.currentTarget);
    onError?.(event);
  };

  return (
    <span
      className={`blur-image block overflow-hidden ${
        fill ? "absolute inset-0" : "relative"
      } ${wrapperClassName}`}
      style={placeholderStyle}
    >
      <Image
        {...props}
        alt={alt}
        placeholder="empty"
        ref={markLoading}
        onLoad={handleLoad}
        onError={handleError}
      />
    </span>
  );
};
