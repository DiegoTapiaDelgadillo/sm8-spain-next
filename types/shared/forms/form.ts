export interface FormProps {
  children: React.ReactNode;
  onSubmit: (event: React.SubmitEvent<HTMLFormElement>) => void;
}
