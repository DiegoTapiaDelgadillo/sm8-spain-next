import {
  IsoBuildFigure,
  type IsoBuildFigureProps,
} from "@/components/Scaffolds/IsoBuildFigure/IsoBuildFigure";
import { FACHADA_FIGURE } from "./scaffoldFigureData";

/** Mismas props que `IsoBuildFigure` (incluidos `mode`, `eager` y `ref`), salvo los datos. */
type ScaffoldFigureProps = Omit<IsoBuildFigureProps, "data">;

/** Fig 2 · Andamio de fachada a medida, montado nivel a nivel. */
export const ScaffoldFigure = (props: ScaffoldFigureProps) => (
  <IsoBuildFigure data={FACHADA_FIGURE} {...props} />
);
