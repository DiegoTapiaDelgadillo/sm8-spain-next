"use client";
import { CheckSvg } from "../../Icons/CheckSvg";
import { useState } from "react";

export const CheckBox = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className=" w-fit h-fit">
      <button
        className={` w-5 h-5 rounded-md cursor-pointer border transition-all duration-200 ${isChecked ? "bg-blue-500/50 border-blue-500" : "bg-white hover:bg-neutral-200 border-neutral-500"}`}
        onClick={() => setIsChecked(!isChecked)}
      >
        {isChecked && (
          <div className=" flex items-center justify-center">
            <CheckSvg className=" w-3 stroke-white" />
          </div>
        )}
      </button>
    </div>
  );
};
