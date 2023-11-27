import { useState } from "react";
import Button from "./button";
import { FaFilter } from "react-icons/fa6";
import Checkbox from "./checkbox";

function Filter({
  onSelected,
  selected,
  data,
}: {
  onSelected: (x: Array<string>) => void | undefined;
  selected: Array<string>;
  data: Array<{ value: string; label: string }>;
}) {
  const [showFilter, setShowFilter] = useState(false);
  return (
    <div className="relative">
      <Button
        onClick={() => setShowFilter(!showFilter)}
        text={"Filter"}
        type={"button"}
        icon={<FaFilter />}
      />
      {showFilter && (
        <ul className="absolute z-10 max-h-[600%] w-[250%] overflow-auto rounded-lg bg-white bg-opacity-50 px-4 shadow-card backdrop-blur-md">
          {data.map(
            (kategori: { value: string; label: string }, idx: number) => {
              var isChecked = selected.includes(kategori.value);
              const handleCheck = () =>
                isChecked
                  ? onSelected(
                      selected.filter((item) => item !== kategori.value)
                    )
                  : onSelected([...selected, kategori.value]);
              return (
                <li
                  key={idx}
                  onClick={handleCheck}
                  className="my-4 flex cursor-pointer items-center gap-2 hover:text-kOrange-300"
                >
                  <div>
                    <Checkbox
                      onChange={handleCheck}
                      checked={isChecked}
                      id={kategori.label}
                    />
                  </div>
                  <p className="overflow-hidden text-ellipsis text-12 lg:text-14">
                    {kategori.label}
                  </p>
                </li>
              );
            }
          )}
        </ul>
      )}
    </div>
  );
}

export default Filter;
