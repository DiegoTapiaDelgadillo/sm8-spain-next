import { FormProps } from "@/types/shared/forms/form";
import { MainButton } from "../../Buttons/MainButton/MainButton";
import { PaperAirplane } from "../../Icons/PaperAirplane";
import { CheckBox } from "../CheckBox/CheckBox";
import { FieldError } from "../FieldError/FieldError";

/** `id` de la casilla = nombre del campo en el esquema (`privacy`), para el foco al error. */
const PRIVACY_ID = "privacy";
const PRIVACY_LABEL_ID = "privacy-label";
const PRIVACY_ERROR_ID = "privacy-error";

export const Form = (props: FormProps) => {
  const privacyInvalid = Boolean(props.privacyError);

  return (
    // `data-reveal-group`: los campos (hijos directos) entran escalonados una sola vez. Es un
    // atributo fijo (igual en servidor y cliente); los `FieldError` van dentro de cada campo,
    // así que no se animan al aparecer.
    <form
      onSubmit={props.onSubmit}
      noValidate
      data-reveal-group
      className=" grid gap-4 mt-4"
    >
      {props.children}
      <div>
        <div className=" flex gap-2 items-center">
          <CheckBox
            id={PRIVACY_ID}
            checked={props.privacyChecked}
            onChange={props.onPrivacyChange}
            labelledBy={PRIVACY_LABEL_ID}
            describedBy={privacyInvalid ? PRIVACY_ERROR_ID : undefined}
            invalid={privacyInvalid}
            required
          />
          {/* `<label htmlFor>` sobre el botón: pulsar el texto también alterna la casilla. */}
          <label
            id={PRIVACY_LABEL_ID}
            htmlFor={PRIVACY_ID}
            className=" pt-0.5 text-xs text-white"
          >
            He leído y acepto la{" "}
            {/* Sin enlace hasta que exista la página de la política (spec 03). */}
            <span className=" text-yellow-500">
              Política de Privacidad de SM8 España
            </span>{" "}
            para el tratamiento de mis datos con el fin de responder a mi
            solicitud.
          </label>
        </div>
        <FieldError id={PRIVACY_ERROR_ID} message={props.privacyError} />
      </div>

      <MainButton
        text={props.isSubmitting ? "Enviando…" : "Enviar"}
        type="submit"
        busy={props.isSubmitting}
        icon={<PaperAirplane className=" w-4" />}
      />
    </form>
  );
};
