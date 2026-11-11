"use client";
import { CheckBoxProps } from "@/types/shared/forms/checkbox/checkbox";
import { CheckSvg } from "../../Icons/CheckSvg";

/**
 * Casilla controlada y accesible: `<button role="checkbox">`.
 * Área táctil de 24×24 px con la caja visual de 20 px dentro.
 */
export const CheckBox = (props: CheckBoxProps) => {
  const { checked, invalid } = props;

  const boxClasses = checked
    ? "bg-blue-500/50 border-blue-500"
    : invalid
      ? "bg-white border-red-500 group-hover:bg-neutral-200"
      : "bg-white border-neutral-500 group-hover:bg-neutral-200";

  return (
    <button
      id={props.id}
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-labelledby={props.labelledBy}
      aria-describedby={props.describedBy}
      aria-invalid={invalid || undefined}
      aria-required={props.required || undefined}
      disabled={props.disabled}
      onClick={() => props.onChange(!checked)}
      onKeyDown={(event) => {
        // Patrón ARIA de checkbox: solo Espacio alterna; Enter no.
        if (event.key === "Enter") event.preventDefault();
      }}
      className=" group flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span
        aria-hidden="true"
        className={` flex size-5 items-center justify-center rounded-md border-2 transition-colors duration-200 ${boxClasses}`}
      >
        {checked && <CheckSvg className=" w-3 stroke-white" />}
      </span>
    </button>
  );
};
