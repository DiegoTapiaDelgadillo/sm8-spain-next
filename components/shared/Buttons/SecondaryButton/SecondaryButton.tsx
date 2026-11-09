import { ButtonProps } from "@/types/shared/button/buttonProps";

const secondaryButtonClasses =
  " border border-neutral-400 rounded-full text-neutral-400 cursor-pointer text-sm px-4 py-2 hover:bg-neutral-900 hover:border-neutral-200 hover:text-neutral-200 transition-colors duration-200";

export const SecondaryButton = (props: ButtonProps) => {
  if (props.href) {
    return (
      <a
        href={props.href}
        className={`inline-block text-center ${secondaryButtonClasses}`}
        onClick={props.onClick}
      >
        {props.text}
      </a>
    );
  }

  return (
    <button onClick={props.onClick} className={secondaryButtonClasses}>
      {props.text}
    </button>
  );
};
