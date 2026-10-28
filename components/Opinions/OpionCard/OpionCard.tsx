import { OpinionCardProps } from "@/types/Opinion/opinion";

export const OpionCard = (props: OpinionCardProps) => {
  return (
    <div className=" border border-neutral-800 rounded-2xl p-8">
      <p className=" text-white text-sm">{props.opinion}</p>
      <div className=" flex gap-12 items-center mt-4">
        <div className=" relative">
          <div className=" h-12 w-12 rounded-full bg-neutral-100"></div>
          <div className=" h-12 w-12 rounded-full bg-neutral-500 absolute top-0 left-8"></div>
        </div>
        <div>
          <p className=" text-white text-sm">{props.name}</p>
          <p className=" text-neutral-500 text-xs">{props.position}</p>
        </div>
      </div>
    </div>
  );
};
