"use client";
import { Form } from "@/components/shared/Forms/Form/Form";
import { InputText } from "@/components/shared/Forms/Inputs/InputText/InputText";
import { TextArea } from "@/components/shared/Forms/TextArea/TextArea";
import { useToast } from "@/components/shared/Toast/useToast";
import { BUSINESS } from "@/lib/business";
import {
  contactSchema,
  filterNameInput,
  filterPhoneInput,
  MAX_LENGTHS,
  type ContactFieldErrors,
  type ContactFormValues,
  type ContactResponse,
} from "@/lib/contact/schema";
import { api } from "@/lib/http/api";
import axios from "axios";
import * as z from "zod";
import { useRef, useState } from "react";

type FieldName = keyof ContactFormValues;
type TextFieldName = Exclude<FieldName, "privacy" | "message">;
type FormErrors = Partial<Record<FieldName, string>>;

const INITIAL_VALUES: ContactFormValues = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  company: "",
  city: "",
  message: "",
  privacy: false,
};

/** Orden visual de los campos: el foco va al primero con error. */
const FIELD_ORDER: FieldName[] = [
  "name",
  "email",
  "phone",
  "subject",
  "company",
  "city",
  "message",
  "privacy",
];

interface TextFieldConfig {
  name: TextFieldName;
  label: string;
  placeholder: string;
  type: string;
  autoComplete: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  filter?: (value: string) => string;
}

const TEXT_FIELDS: TextFieldConfig[] = [
  {
    name: "name",
    label: "Nombre",
    placeholder: "Ej: Juan Pérez",
    type: "text",
    autoComplete: "name",
    filter: filterNameInput,
  },
  {
    name: "email",
    label: "Correo electrónico",
    placeholder: "Ej: juan.perez@ejemplo.com",
    type: "email",
    autoComplete: "email",
  },
  {
    name: "phone",
    label: "Teléfono",
    placeholder: "Ej: 612 345 678",
    type: "tel",
    autoComplete: "tel",
    inputMode: "tel",
    filter: filterPhoneInput,
  },
  {
    name: "subject",
    label: "Asunto",
    placeholder: "Ej: Consulta sobre servicios",
    type: "text",
    autoComplete: "off",
  },
  {
    name: "company",
    label: "Empresa",
    placeholder: "Ej: Construcciones Ejemplo S.L.",
    type: "text",
    autoComplete: "organization",
  },
  {
    name: "city",
    label: "Ciudad",
    placeholder: "Ej: Madrid",
    type: "text",
    autoComplete: "address-level2",
    filter: filterNameInput,
  },
];

/** Primer mensaje de cada campo (sirve para zod y para los `fieldErrors` del servidor). */
const toFormErrors = (fieldErrors: ContactFieldErrors): FormErrors => {
  const errors: FormErrors = {};
  for (const field of FIELD_ORDER) {
    const message = fieldErrors[field]?.[0];
    if (message) errors[field] = message;
  }
  return errors;
};

const validate = (values: ContactFormValues) => {
  const result = contactSchema.safeParse(values);
  if (result.success) return { data: result.data, errors: {} as FormErrors };
  return {
    data: null,
    errors: toFormErrors(z.flattenError(result.error).fieldErrors),
  };
};

const focusFirstError = (errors: FormErrors) => {
  const first = FIELD_ORDER.find((field) => errors[field]);
  if (first) document.getElementById(first)?.focus();
};

const SUCCESS_MESSAGE =
  "¡Gracias! Hemos recibido tu mensaje y te responderemos en breve.";
const FIELDS_MESSAGE = "Revisa los campos marcados.";
const FORBIDDEN_MESSAGE =
  "No hemos podido verificar el envío. Recarga la página e inténtalo de nuevo.";
const GENERIC_MESSAGE = `No hemos podido enviar tu mensaje. Inténtalo de nuevo o escríbenos a ${BUSINESS.email}.`;

export const ContactForm = () => {
  const toast = useToast();
  const [values, setValues] = useState<ContactFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  // Tras el primer intento de envío, los errores se recalculan al escribir.
  const [submitAttempted, setSubmitAttempted] = useState(false);
  // Campos que el usuario ya ha visitado (se validan al cambiar y al salir).
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>(
    {},
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Evita dobles envíos aunque el estado aún no se haya repintado.
  const submittingRef = useRef(false);

  /** Recalcula el error de un campo con los valores nuevos. */
  const refreshFieldError = (field: FieldName, next: ContactFormValues) => {
    const fieldError = validate(next).errors[field];
    setErrors((prev) => ({ ...prev, [field]: fieldError }));
  };

  const updateField = <K extends FieldName>(
    field: K,
    value: ContactFormValues[K],
  ) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (submitAttempted || touched[field]) refreshFieldError(field, next);
  };

  const handleBlur = (field: FieldName) => {
    // Pasar por un campo vacío con el tabulador no muestra error hasta enviar.
    const value = values[field];
    if (!submitAttempted && typeof value === "string" && value.trim() === "") {
      return;
    }
    setTouched((prev) => ({ ...prev, [field]: true }));
    refreshFieldError(field, values);
  };

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current) return;

    setSubmitAttempted(true);
    const { data, errors: nextErrors } = validate(values);
    setErrors(nextErrors);
    if (!data) {
      focusFirstError(nextErrors);
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    try {
      await api.post<ContactResponse>("/contact", values);
      toast.success(SUCCESS_MESSAGE);
      setValues(INITIAL_VALUES);
      setErrors({});
      setTouched({});
      setSubmitAttempted(false);
    } catch (error) {
      if (!axios.isAxiosError<ContactResponse>(error) || !error.response) {
        toast.error(GENERIC_MESSAGE);
        return;
      }
      const { status, data: body } = error.response;
      const serverFieldErrors = body && !body.ok ? body.fieldErrors : undefined;

      if (status === 400 && serverFieldErrors) {
        const mapped = toFormErrors(serverFieldErrors);
        setErrors(mapped);
        focusFirstError(mapped);
        toast.error(FIELDS_MESSAGE);
      } else if (status === 403) {
        toast.error(FORBIDDEN_MESSAGE);
      } else if (status === 413 && body && !body.ok && body.message) {
        toast.error(body.message);
      } else {
        toast.error(GENERIC_MESSAGE);
      }
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" border border-neutral-800 w-full rounded-xl bg-linear-to-b from-neutral-900/60 to-black p-4 md:p-8">
      <div>
        <p className=" text-white">Empieza la conversación</p>
        <p className=" text-neutral-400 text-xs">
          Cuéntanos en qué podemos ayudarte
        </p>
      </div>
      <Form
        onSubmit={handleSubmit}
        privacyChecked={values.privacy}
        onPrivacyChange={(checked) => updateField("privacy", checked)}
        privacyError={errors.privacy}
        isSubmitting={isSubmitting}
      >
        {TEXT_FIELDS.map((field) => (
          <InputText
            key={field.name}
            label={field.label}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            value={values[field.name]}
            onChange={(e) =>
              updateField(
                field.name,
                field.filter ? field.filter(e.target.value) : e.target.value,
              )
            }
            onBlur={() => handleBlur(field.name)}
            error={errors[field.name]}
            required
            inputMode={field.inputMode}
            autoComplete={field.autoComplete}
            maxLength={MAX_LENGTHS[field.name]}
          />
        ))}
        <TextArea
          label="Mensaje"
          name="message"
          placeholder="Escribe tu mensaje aquí…"
          value={values.message}
          onChange={(e) => updateField("message", e.target.value)}
          onBlur={() => handleBlur("message")}
          error={errors.message}
          required
          autoComplete="off"
          maxLength={MAX_LENGTHS.message}
        />
      </Form>
    </div>
  );
};
