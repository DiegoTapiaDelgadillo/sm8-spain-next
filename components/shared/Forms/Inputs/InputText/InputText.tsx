import { InputProps } from "@/types/shared/forms/input/input";

export const InputText = (props: InputProps) => {
  return (
    <div>
      <label htmlFor={props.name} className=" text-sm text-neutral-400">
        {props.label}
      </label>
      <input
        type={props.type}
        className=" mt-1 text-white border border-neutral-800 w-full text-sm rounded-xl px-3 py-1 placeholder:text-neutral-500 focus:outline-none focus:border-blue-500  focus:ring-blue-500 transition-colors duration-200"
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  );
};
