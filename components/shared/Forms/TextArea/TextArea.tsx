import { TextAreaProps } from "@/types/shared/forms/textarea/textarea";
import { FieldError } from "../FieldError/FieldError";
import { fieldClasses } from "../Inputs/fieldClasses";

export const TextArea = (props: TextAreaProps) => {
  const errorId = `${props.name}-error`;
  const invalid = Boolean(props.error);

  return (
    <div>
      <label htmlFor={props.name} className=" text-sm text-neutral-400">
        {props.label}
      </label>
      <textarea
        id={props.name}
        name={props.name}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        rows={props.rows}
        required={props.required}
        aria-required={props.required || undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId : undefined}
        autoComplete={props.autoComplete}
        maxLength={props.maxLength}
        className={fieldClasses(invalid)}
      />
      <FieldError id={errorId} message={props.error} />
    </div>
  );
};
