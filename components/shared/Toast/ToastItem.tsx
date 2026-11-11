"use client";
import { useEffect, useRef, useState } from "react";
import { ToastItemProps } from "@/types/shared/toast/toast";
import { CheckCircleSvg } from "../Icons/CheckCircleSvg";
import { ExclamationCircleSvg } from "../Icons/ExclamationCircleSvg";
import { CloseSvg } from "../Icons/CloseSvg";

/**
 * Cierre automático solo del aviso de éxito; se pausa con el ratón encima o el
 * foco dentro. Los de error se quedan hasta cerrarlos (WCAG 2.2.1).
 */
const DURATION_MS = 6000;

export const ToastItem = ({ toast, onDismiss }: ToastItemProps) => {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const remaining = useRef(DURATION_MS);
  // Elemento que tenía el foco antes de entrar en el aviso, para devolvérselo.
  const returnFocus = useRef<HTMLElement | null>(null);
  const paused = hovered || focused;
  const { id } = toast;
  const autoClose = toast.type === "success";

  useEffect(() => {
    if (paused || !autoClose) return;
    const start = Date.now();
    const timer = setTimeout(() => onDismiss(id), remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current -= Date.now() - start;
    };
  }, [paused, autoClose, onDismiss, id]);

  // Cierre manual (X o Escape): el foco vuelve a donde estaba.
  const closeByUser = () => {
    const target = returnFocus.current;
    onDismiss(id);
    if (target?.isConnected) target.focus();
  };

  const isSuccess = toast.type === "success";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          returnFocus.current =
            event.relatedTarget instanceof HTMLElement
              ? event.relatedTarget
              : null;
        }
        setFocused(true);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocused(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") closeByUser();
      }}
      className=" pointer-events-auto flex w-full items-start gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm text-white shadow-lg shadow-black/50 transition duration-300 ease-out starting:translate-y-2 starting:opacity-0 motion-reduce:transition-none"
    >
      <span aria-hidden="true" className=" shrink-0 pt-px">
        {isSuccess ? (
          <CheckCircleSvg className=" size-5 text-green-400" />
        ) : (
          <ExclamationCircleSvg className=" size-5 text-red-400" />
        )}
      </span>
      <p className=" flex-1 pt-0.5">{toast.message}</p>
      <button
        type="button"
        aria-label="Cerrar aviso"
        onClick={closeByUser}
        className=" -m-1.5 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-neutral-400 transition-colors duration-200 hover:bg-neutral-800 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
      >
        <CloseSvg className=" size-4" />
      </button>
    </div>
  );
};
