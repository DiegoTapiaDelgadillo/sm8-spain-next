import { CertItemProps } from "@/components/shared/Certifications/certItems";

export const CertItem = (props: CertItemProps) => {
  return (
    <div className=" flex gap-4 items-center py-4 border-b border-b-neutral-800">
      <div className=" w-fit">{props.icon}</div>
      <div>
        <h3 className=" text-white">{props.title}</h3>
        {props.href ? (
          <a
            href={props.href}
            className=" text-neutral-400 underline-offset-4 hover:text-white hover:underline transition-colors duration-200 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
          >
            {props.description}
          </a>
        ) : (
          <p className=" text-neutral-400">{props.description}</p>
        )}
      </div>
    </div>
  );
};
