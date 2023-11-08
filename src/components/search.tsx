// import as from 'Union.svg'
import { useState } from "react";

function Search({
  style,
  placeholder,
  onChange,
  value,
  required,
}: {
  style?: string;
  label?: string;
  placeholder: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  value?: string | number | readonly string[] | undefined;
  required?: boolean;
}) {
  const [inputValue, setInputValue] = useState(value || "");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <>
      <div className={style + " w-full"}>
        <div className="pointer-events-none flex w-full justify-between rounded-lg border-2 border-[#A8A8A8] px-2 focus-within:border-kOrange-400 hover:border-kOrange-200 hover:focus-within:border-kOrange-400 disabled:border-[#6B6B6B]">
          <input
            required={required}
            tabIndex={0}
            type="text"
            placeholder={placeholder}
            className="pointer-events-auto w-full border-none px-3 py-2 caret-kOrange-400 outline-none placeholder:text-[#6B6B6B] disabled:opacity-30"
            value={inputValue}
            onChange={handleChange}
          />
          <img src="assets/search.svg" alt="" />
        </div>
      </div>
    </>
  );
}

export default Search;
