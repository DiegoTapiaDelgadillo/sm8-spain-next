export interface InputProps {
  label: string;
  name: string;
  placeholder?: string;
  value: string;
  type: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
