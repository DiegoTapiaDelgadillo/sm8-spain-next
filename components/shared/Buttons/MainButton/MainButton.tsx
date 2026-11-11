import { ButtonProps } from "@/types/shared/button/buttonProps";

const mainButtonClasses =
  "  text-center px-4 py-1  border border-blue-500 bg-blue-500/30 text-blue-400 hover:border-blue-400 hover:text-blue-300 hover:bg-blue-500/40 cursor-pointer text-sm rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400";

// Solo aplica a <button>. `disabled` lo deshabilita del todo; `busy` usa
// `aria-disabled` para que el botón conserve el foco mientras se envía.
const disabledClasses =
  " disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-blue-500 disabled:hover:text-blue-400 disabled:hover:bg-blue-500/30 aria-disabled:cursor-not-allowed aria-disabled:opacity-60 aria-disabled:hover:border-blue-500 aria-disabled:hover:text-blue-400 aria-disabled:hover:bg-blue-500/30";

export const MainButton = (props: ButtonProps) => {
  const content = (
    <div className=" h-full flex justify-center gap-1 items-center">
      {props.icon}
      <p>{props.text}</p>
    </div>
  );

  if (props.href) {
    return (
      <a
        href={props.href}
        className={`inline-block ${mainButtonClasses}`}
        onClick={props.onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={mainButtonClasses + disabledClasses}
      onClick={props.onClick}
      type={props.type}
      disabled={props.disabled}
      aria-busy={props.busy || undefined}
      aria-disabled={props.busy || undefined}
    >
      {content}
    </button>
  );
};
