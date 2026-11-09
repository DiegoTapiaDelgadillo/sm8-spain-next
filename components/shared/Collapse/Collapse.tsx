import { CollapseProps } from "@/types/shared/collapse/collapse";
import { PlusCircleSvg } from "../Icons/PlusCircleSvg";

export const Collapse = ({
  title,
  children,
  className,
  name,
  headingLevel = "h3",
}: CollapseProps) => {
  const Heading = headingLevel === "none" ? "span" : headingLevel;

  return (
    <details
      name={name}
      className={`collapse-details group rounded-xl border border-neutral-800 bg-linear-to-b from-neutral-900/60 to-black ${className ?? ""}`}
    >
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-4 py-3 text-white transition-colors duration-200 hover:bg-neutral-900/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400 sm:px-6 sm:py-4 [&::-webkit-details-marker]:hidden">
        <Heading className="text-base font-semibold sm:text-lg">{title}</Heading>
        <PlusCircleSvg className="size-6 shrink-0 text-yellow-400 transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none" />
      </summary>
      <div className="px-4 pb-4 text-sm text-neutral-400 sm:px-6 sm:pb-5 sm:text-base">
        {children}
      </div>
    </details>
  );
};
