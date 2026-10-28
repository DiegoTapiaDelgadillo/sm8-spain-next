export interface ButtonProps {
  onClick?: () => void;
  text: string;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
}
