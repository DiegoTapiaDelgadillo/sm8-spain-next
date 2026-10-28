import { FormProps } from "@/types/shared/forms/form";
import { MainButton } from "../../Buttons/MainButton/MainButton";
import { PaperAirplane } from "../../Icons/PaperAirplane";
import { CheckBox } from "../CheckBox/CheckBox";
export const Form = (props: FormProps) => {
  return (
    <form onSubmit={props.onSubmit} className=" grid gap-4 mt-4">
      {props.children}
      <div className=" flex gap-2 items-start">
        <CheckBox />
        <p className=" text-xs text-white">
          He leído y acepto{" "}
          <span className=" text-yellow-500 hover:text-yellow-600 cursor-pointer transition-all duration-200 hover:underline hover:decoration-solid">
            la Política de Privacidad de SM8 Andamios{" "}
          </span>
          para el tratamiento de mis datos con el fin de responder a mi
          solicitud.
        </p>
      </div>

      <MainButton
        text="Enviar"
        type="submit"
        icon={<PaperAirplane className=" w-4" />}
      />
    </form>
  );
};
