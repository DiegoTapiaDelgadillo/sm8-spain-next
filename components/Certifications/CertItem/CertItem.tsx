import { CertItemProps } from "@/components/shared/Certifications/certItems";

export const CertItem = (props: CertItemProps) => {
  return (
    <div className=" flex gap-4 items-center py-6 border-b border-b-neutral-800">
      <div className=" w-fit">{props.icon}</div>
      <div>
        <p className=" text-xl text-white">{props.title}</p>
        <p className=" text-neutral-500">{props.description}</p>
      </div>
    </div>
  );
};
