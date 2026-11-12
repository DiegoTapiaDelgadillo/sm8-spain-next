import { Fragment, type CSSProperties } from "react";
import { TitlesProps } from "@/types/shared/titles/titles";

/**
 * Divide el título en palabras enmascaradas para el revelado `words`. Los espacios
 * quedan como texto real entre palabras, así que el nombre accesible no cambia.
 */
const splitWords = (title: string) => {
  const words = title.trim().split(/\s+/);
  return words.map((word, index) => (
    <Fragment key={index}>
      <span className="reveal-word">
        <span style={{ "--w": index } as CSSProperties}>{word}</span>
      </span>
      {index < words.length - 1 ? " " : null}
    </Fragment>
  ));
};

export const Titles = ({
  title,
  subtitle,
  titleClassName,
  subtitleClassName,
  as: Heading = "h2",
  reveal = true,
}: TitlesProps) => {
  return (
    <div>
      <Heading
        data-reveal={reveal ? "words" : undefined}
        className={` ${titleClassName} text-white font-bold text-2xl sm:text-3xl`}
      >
        {reveal ? splitWords(title) : title}
      </Heading>
      {subtitle && (
        <p
          data-reveal={reveal ? "" : undefined}
          style={reveal ? ({ "--i": 2 } as CSSProperties) : undefined}
          className={` ${subtitleClassName} text-neutral-400 mt-2`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
