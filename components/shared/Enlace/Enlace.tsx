import { LinkPropsCustom } from "@/types/shared/links/links";

export const Enlance = ({ href, text }: LinkPropsCustom) => {
  return (
    <div className=" mt-1">
      <a
        href={href}
        className=" text-sm text-neutral-400 hover:text-white transition-colors duration-200 "
      >
        {text}
      </a>
    </div>
  );
};
