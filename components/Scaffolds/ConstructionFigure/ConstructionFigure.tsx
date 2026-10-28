import { IsoBuildFigure } from "@/components/Scaffolds/IsoBuildFigure/IsoBuildFigure";
import { OBRA_FIGURE } from "./constructionFigureData";

type ConstructionFigureProps = {
  showCaption?: boolean;
  className?: string;
};

/** Fig 3 · Andamio SM8 en obra: excavación, escalera de obra, apuntalamiento y torre de servicio. */
export const ConstructionFigure = (props: ConstructionFigureProps) => (
  <IsoBuildFigure data={OBRA_FIGURE} {...props} />
);
