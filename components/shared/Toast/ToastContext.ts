"use client";
import { createContext } from "react";
import { ToastContextValue } from "@/types/shared/toast/toast";

export const ToastContext = createContext<ToastContextValue | null>(null);
