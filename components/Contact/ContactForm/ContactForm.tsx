"use client";
import { Form } from "@/components/shared/Forms/Form/Form";
import { InputText } from "@/components/shared/Forms/Inputs/InputText/InputText";
import { TextArea } from "@/components/shared/Forms/TextArea/TextArea";
import { useState } from "react";

export const ContactForm = () => {
  const [payload, setPayload] = useState({
    name: "",
    email: "",
    asunto: "",
    empresa: "",
    ciudad: "",
    mensaje: "",
  });

  const inputData = [
    {
      name: "name",
      label: "Nombre",
      placeholder: "Ej: Juan Pérez",
      type: "text",
      value: payload.name,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setPayload({ ...payload, name: e.target.value });
      },
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Ej: juan.perez@example.com",
      type: "email",
      value: payload.email,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setPayload({ ...payload, email: e.target.value });
      },
    },
    {
      name: "asunto",
      label: "Asunto",
      placeholder: "Ej: Consulta sobre servicios",
      type: "text",
      value: payload.asunto,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setPayload({ ...payload, asunto: e.target.value });
      },
    },
    {
      name: "empresa",
      label: "Empresa",
      placeholder: "Ej: Mi Empresa S.A.",
      type: "text",
      value: payload.empresa,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setPayload({ ...payload, empresa: e.target.value });
      },
    },
    {
      name: "ciudad",
      label: "Ciudad",
      placeholder: "Ej: Madrid",
      type: "text",
      value: payload.ciudad,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setPayload({ ...payload, ciudad: e.target.value });
      },
    },
  ];

  return (
    <div className=" border border-neutral-800 w-full rounded-xl bg-linear-to-b from-neutral-900/60 to-black p-8">
      <div>
        <p className=" text-white">Empieza la conversación</p>
        <p className=" text-neutral-500 text-xs">
          Escribenos como podemos ayudarte
        </p>
      </div>
      <Form onSubmit={(e) => e.preventDefault()}>
        {inputData.map((input, index) => (
          <InputText
            key={index}
            label={input.label}
            name={input.name}
            placeholder={input.placeholder}
            value={input.value}
            onChange={input.onChange}
            type={input.type}
          />
        ))}
        <TextArea
          label="Mensaje"
          name="mensaje"
          placeholder="Escribe tu mensaje aquí..."
          value={payload.mensaje}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setPayload({ ...payload, mensaje: e.target.value });
          }}
        />
      </Form>
    </div>
  );
};
