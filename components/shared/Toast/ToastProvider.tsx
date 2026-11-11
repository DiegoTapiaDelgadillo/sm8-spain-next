"use client";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  ShowToastOptions,
  ToastContextValue,
  ToastData,
  ToastProviderProps,
} from "@/types/shared/toast/toast";
import { ToastContext } from "./ToastContext";
import { ToastItem } from "./ToastItem";

/** Máximo de avisos visibles a la vez; el más antiguo sale primero. */
const MAX_TOASTS = 3;

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(({ type, message }: ShowToastOptions) => {
    nextId.current += 1;
    const id = nextId.current;
    setToasts((current) => [
      ...current.slice(-(MAX_TOASTS - 1)),
      { id, type, message },
    ]);
    return id;
  }, []);

  const value = useMemo<ToastContextValue>(
    () => ({
      showToast,
      success: (message) => showToast({ type: "success", message }),
      error: (message) => showToast({ type: "error", message }),
      dismiss,
    }),
    [showToast, dismiss],
  );

  const successes = toasts.filter((toast) => toast.type === "success");
  const errors = toasts.filter((toast) => toast.type === "error");

  return (
    <ToastContext value={value}>
      {children}
      {/* Las dos regiones viven en el DOM desde el inicio para que los lectores
          de pantalla anuncien lo que se añada. z-60: por encima de la navbar (z-50). */}
      <div className=" pointer-events-none fixed inset-x-4 bottom-4 z-60 flex flex-col md:inset-x-auto md:right-6 md:bottom-6 md:w-96">
        <div role="status" aria-live="polite" className=" flex flex-col gap-2">
          {successes.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
          ))}
        </div>
        <div
          role="alert"
          aria-live="assertive"
          className=" flex flex-col gap-2 not-empty:mt-2"
        >
          {errors.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
          ))}
        </div>
      </div>
    </ToastContext>
  );
};
