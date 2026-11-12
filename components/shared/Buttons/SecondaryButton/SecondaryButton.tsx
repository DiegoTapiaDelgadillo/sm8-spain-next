import { ButtonProps } from "@/types/shared/button/buttonProps";
import { RollText } from "../RollText/RollText";

const secondaryButtonClasses =
  " roll-trigger border border-neutral-400 rounded-full text-neutral-400 cursor-pointer text-sm px-4 py-2 hover:bg-neutral-900 hover:border-neutral-200 hover:text-neutral-200 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-200";

export const SecondaryButton = (props: ButtonProps) => {
  if (props.href) {
    return (
      <a
        href={props.href}
        className={`inline-block text-center ${secondaryButtonClasses}`}
        onClick={props.onClick}
      >
        <RollText text={props.text} />
      </a>
    );
  }

  return (
    <button
      onClick={props.onClick}
      type={props.type}
      className={secondaryButtonClasses}
    >
      <RollText text={props.text} />
    </button>
  );
};
