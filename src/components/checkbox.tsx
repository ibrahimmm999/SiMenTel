import { ChangeEventHandler } from "react";
import "./checkbox.css";

function Checkbox({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label?: string;
  description?: string;
  checked?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
}) {
  return (
    <>
      <div className="flex h-auto w-full justify-center gap-3">
        <input
          className={`${"checkmark before:right-[3px]"} checkmark relative h-[20px] w-[20px] cursor-pointer appearance-none rounded border-2 border-mono-grey outline-none before:absolute before:-bottom-[2.5px] before:text-center before:font-bold before:text-white checked:border-blue-primary checked:bg-blue-primary hover:border-blue-primary checked:hover:border-blue-primary checked:hover:bg-blue-primary checked:focus:border-blue-primary focus:hover:border-blue-primary disabled:opacity-30 disabled:hover:border-mono-grey`}
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
        />
        <label htmlFor={id} className="flex flex-col gap-[6px]">
          <p className="text-16 leading-none text-black">{label}</p>
          <p className="text-14 leading-none text-kGrey-300">{description}</p>
        </label>
      </div>
    </>
  );
}

export default Checkbox;
