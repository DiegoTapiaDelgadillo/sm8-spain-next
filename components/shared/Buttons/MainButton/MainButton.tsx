import { ButtonProps } from "@/types/shared/button/buttonProps";

export const MainButton = (props: ButtonProps) => {
  return (
    <button
      className=" text-center px-4 py-1 border border-blue-500 bg-blue-500/30 text-blue-500 hover:border-blue-400 hover:text-blue-400 hover:bg-blue-500/40 cursor-pointer text-sm rounded-full transition-colors duration-200"
      onClick={props.onClick}
      type={props.type}
    >
      <div className=" flex justify-center gap-2">
        {props.icon}
        <p>{props.text}</p>
      </div>
    </button>
  );
};
