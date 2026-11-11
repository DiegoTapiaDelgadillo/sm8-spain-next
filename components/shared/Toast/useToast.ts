"use client";
import { useContext } from "react";
import { ToastContext } from "./ToastContext";

/**
 * `const toast = useToast();` → `toast.success("…")`, `toast.error("…")`,
 * `toast.showToast({ type, message })`, `toast.dismiss(id)`.
 * Debe usarse dentro de `<ToastProvider>`.
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast debe usarse dentro de <ToastProvider>.");
  }
  return context;
};
