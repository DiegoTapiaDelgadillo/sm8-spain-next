import { InputProps } from "@/types/shared/forms/input/input";
import { FieldError } from "../../FieldError/FieldError";
import { fieldClasses } from "../fieldClasses";

export const InputText = (props: InputProps) => {
  const errorId = `${props.name}-error`;
  const invalid = Boolean(props.error);

  return (
    <div>
      <label htmlFor={props.name} className=" text-sm text-neutral-400">
        {props.label}
      </label>
      <input
        id={props.name}
        name={props.name}
        type={props.type}
        className={fieldClasses(invalid)}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        required={props.required}
        aria-required={props.required || undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId : undefined}
        inputMode={props.inputMode}
        autoComplete={props.autoComplete}
        maxLength={props.maxLength}
      />
      <FieldError id={errorId} message={props.error} />
    </div>
  );
};
