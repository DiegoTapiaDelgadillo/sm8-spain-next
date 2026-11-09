import { ButtonProps } from "@/types/shared/button/buttonProps";

const mainButtonClasses =
  "  text-center px-4 py-1  border border-blue-500 bg-blue-500/30 text-blue-400 hover:border-blue-400 hover:text-blue-300 hover:bg-blue-500/40 cursor-pointer text-sm rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400";

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
      className={mainButtonClasses}
      onClick={props.onClick}
      type={props.type}
    >
      {content}
    </button>
  );
};
