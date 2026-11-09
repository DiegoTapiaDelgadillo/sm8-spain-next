export interface CertItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  /** Si se pasa, la descripción se pinta como enlace (`tel:`, `mailto:`…). */
  href?: string;
}
