import {
  IsoBuildFigure,
  type IsoBuildFigureProps,
} from "@/components/Scaffolds/IsoBuildFigure/IsoBuildFigure";
import { INDUSTRIA_FIGURE } from "./industryFigureData";

/** Mismas props que `IsoBuildFigure` (incluidos `mode`, `eager` y `ref`), salvo los datos. */
type IndustryFigureProps = Omit<IsoBuildFigureProps, "data">;

/** Fig 4 · Andamio SM8 en industria: anillo circular alrededor de un tanque, torre de acceso y puente. */
export const IndustryFigure = (props: IndustryFigureProps) => (
  <IsoBuildFigure data={INDUSTRIA_FIGURE} {...props} />
);
