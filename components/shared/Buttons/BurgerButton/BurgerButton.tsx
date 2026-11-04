import { BurgerButtonProps } from "@/types/shared/button/burgerButtonProps";

const lineClasses =
  " absolute left-0 h-0.5 w-full rounded-full bg-white transition-[translate,rotate,scale,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none";

export const BurgerButton = ({
  isOpen,
  setIsOpen,
  controlsId,
  ref,
}: BurgerButtonProps) => {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      aria-expanded={isOpen}
      aria-controls={controlsId}
      onClick={() => setIsOpen(!isOpen)}
      className=" flex size-11 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
    >
      <span aria-hidden="true" className=" relative block h-4 w-6">
        <span
          className={`${lineClasses} top-0 ${isOpen ? "translate-y-[7px] rotate-45" : ""}`}
        />
        <span
          className={`${lineClasses} top-[7px] ${isOpen ? "scale-x-0 opacity-0" : ""}`}
        />
        <span
          className={`${lineClasses} bottom-0 ${isOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
        />
      </span>
    </button>
  );
};
