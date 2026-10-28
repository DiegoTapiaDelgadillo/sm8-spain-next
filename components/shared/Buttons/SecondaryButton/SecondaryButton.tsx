import { ButtonProps } from "@/types/shared/button/buttonProps";

export const SecondaryButton = (props: ButtonProps) => {
  return (
    <button
      onClick={props.onClick}
      className=" border border-neutral-500 rounded-full text-neutral-500 cursor-pointer text-sm px-4 py-2 hover:bg-neutral-900 hover:border-neutral-400 hover:text-neutral-400 transition-colors duration-200"
    >
      {props.text}
    </button>
  );
};
