import { IsoBuildFigure } from "@/components/Scaffolds/IsoBuildFigure/IsoBuildFigure";
import { FACHADA_FIGURE } from "./scaffoldFigureData";

type ScaffoldFigureProps = {
  showCaption?: boolean;
  className?: string;
};

/** Fig 2 · Andamio de fachada a medida, montado nivel a nivel. */
export const ScaffoldFigure = (props: ScaffoldFigureProps) => (
  <IsoBuildFigure data={FACHADA_FIGURE} {...props} />
);
