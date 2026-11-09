import { TitlesProps } from "@/types/shared/titles/titles";

export const Titles = ({
  title,
  subtitle,
  titleClassName,
  subtitleClassName,
  as: Heading = "h2",
}: TitlesProps) => {
  return (
    <div>
      <Heading
        className={` ${titleClassName} text-white font-bold text-2xl sm:text-3xl`}
      >
        {title}
      </Heading>
      {subtitle && (
        <p className={` ${subtitleClassName} text-neutral-400 mt-2`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};
