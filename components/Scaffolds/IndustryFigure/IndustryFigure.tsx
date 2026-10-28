import { IsoBuildFigure } from "@/components/Scaffolds/IsoBuildFigure/IsoBuildFigure";
import { INDUSTRIA_FIGURE } from "./industryFigureData";

type IndustryFigureProps = {
  showCaption?: boolean;
  className?: string;
};

/** Fig 4 · Andamio SM8 en industria: anillo circular alrededor de un tanque, torre de acceso y puente. */
export const IndustryFigure = (props: IndustryFigureProps) => (
  <IsoBuildFigure data={INDUSTRIA_FIGURE} {...props} />
);
