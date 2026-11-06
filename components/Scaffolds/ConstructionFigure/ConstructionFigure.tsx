import {
  IsoBuildFigure,
  type IsoBuildFigureProps,
} from "@/components/Scaffolds/IsoBuildFigure/IsoBuildFigure";
import { OBRA_FIGURE } from "./constructionFigureData";

/** Mismas props que `IsoBuildFigure` (incluidos `mode`, `eager` y `ref`), salvo los datos. */
type ConstructionFigureProps = Omit<IsoBuildFigureProps, "data">;

/** Fig 3 · Andamio SM8 en obra: excavación, escalera de obra, apuntalamiento y torre de servicio. */
export const ConstructionFigure = (props: ConstructionFigureProps) => (
  <IsoBuildFigure data={OBRA_FIGURE} {...props} />
);
