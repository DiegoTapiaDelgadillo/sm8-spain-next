import { EnlaceProps } from "@/types/shared/links/links";

export const Enlance = ({ href, text, external, ariaLabel }: EnlaceProps) => {
  return (
    <div className=" mt-1">
      <a
        href={href}
        aria-label={ariaLabel}
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
        className=" link-underline text-sm text-neutral-400 hover:text-white transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400 rounded-sm"
      >
        {text}
      </a>
    </div>
  );
};
