interface EnlaceProps {
  href: string;
  text: string;
}

export const Enlance = ({ href, text }: EnlaceProps) => {
  return (
    <div className=" mt-1">
      <a
        href={href}
        className=" text-sm text-neutral-500 hover:text-white transition-colors duration-200 "
      >
        {text}
      </a>
    </div>
  );
};
