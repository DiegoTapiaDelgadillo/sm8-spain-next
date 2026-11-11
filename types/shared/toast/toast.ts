export type ToastType = "success" | "error";

export interface ToastData {
  id: number;
  type: ToastType;
  message: string;
}

export interface ShowToastOptions {
  type: ToastType;
  message: string;
}

export interface ToastContextValue {
  /** Devuelve el `id` del aviso, por si se quiere cerrar a mano. */
  showToast: (options: ShowToastOptions) => number;
  success: (message: string) => number;
  error: (message: string) => number;
  dismiss: (id: number) => void;
}

export interface ToastProviderProps {
  children: React.ReactNode;
}

export interface ToastItemProps {
  toast: ToastData;
  onDismiss: (id: number) => void;
}
