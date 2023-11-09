import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible, AiOutlineSearch } from "react-icons/ai";

function Textfield({
  type,
  placeholder,
  value,
  required,
  useLabel,
  labelText,
  labelStyle
}: {
  type: "field" | "password" | "search" | "email";
  placeholder: string;
  value?: string | number | readonly string[] | undefined;
  required?: boolean;
  useLabel?: boolean;
  labelText?: string;
  labelStyle?: string
}) {
  const [inputValue, setInputValue] = useState(value || "");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  
  //password attribute
  const [showPassword, setShowPassword] = useState("password");
  const [icon, setIcon] = useState(<AiFillEyeInvisible></AiFillEyeInvisible>);
  const handleToggle = () => {
    if (showPassword === "password") {
      setIcon(<AiFillEye></AiFillEye>);
      setShowPassword("text");
    } else {
        setIcon(<AiFillEyeInvisible></AiFillEyeInvisible>);
        setShowPassword("password");
    }
  };

  return (
    <>
        
      {type == "field" && (
        <div className="w-full">
            ({useLabel} && <label htmlFor="field" className={labelStyle}>{labelText}</label>)
            <div className="w-full flex items-center px-[10px] py-[12px] text-[16px] text-black bg-white border-2 border-mono-grey hover:border-orange-primary focus-within:border-orange-primary rounded-[10px]">
            <input
                id="field"
                type="text"
                required={required}
                placeholder={placeholder}
                value={inputValue}
                onChange={handleChange}
                className="grow"
            />
            </div>
        </div>
      )}
      {type == "password" && (
        <div className="w-full">
            {useLabel} <label htmlFor="password" className={labelStyle}>{labelText}</label>
            <div className="w-full flex gap-[12px] items-center px-[10px] py-[12px] text-[16px] text-black bg-white border-2 border-mono-grey hover:border-orange-primary focus-within:border-orange-primary rounded-[10px] group">
            <input
                id="password"
                type={showPassword}
                required={required}
                placeholder={placeholder}
                onChange={handleChange}
                className="grow focus:outline-none"
            />
            <div className="text-[22px] w-fit text-mono-grey group-focus-within:text-orange-primary group-hover:text-orange-primary" onClick={handleToggle}>
                {icon}
            </div>
            </div>
        </div>
      )}
      {type == "search" && (
        <div className="w-full">
            {useLabel} <label htmlFor="search" className={labelStyle}>{labelText}</label>
            <div className="w-full flex gap-[12px] items-center px-[10px] py-[12px] text-[16px] text-black bg-white border-2 border-mono-grey hover:border-orange-primary focus-within:border-orange-primary rounded-[10px] group">
            <div className="text-[22px] w-fit text-mono-grey group-focus-within:text-orange-primary group-hover:text-orange-primary">
                <AiOutlineSearch/>
            </div>
            <input
                id="search"
                type="text"
                required={required}
                placeholder={placeholder}
                onChange={handleChange}
                className="grow focus:outline-none"
            />
            </div>
        </div>
      )}
      {type == "email" && (
        <div className={"w-full"}>
          {useLabel} <label htmlFor="email" className={labelStyle}>{labelText}</label>
          <input
            id="email"
            required={required}
            type="email"
            placeholder={placeholder}
            className={`w-full flex items-center px-[10px] py-[12px] text-[16px] text-black bg-white border-2 border-mono-grey hover:border-orange-primary focus:border-orange-primary focus:outline-orange-primary rounded-[10px] ${inputValue && "invalid:border-red-primary invalid:focus:outline-red-primary peer"}`}
            onChange={handleChange}
            />
          <p className={`text-red-primary hidden peer-invalid:block`}>Masukkan Email yang valid!</p>
        </div>
      )}
    </>
  );
}

export default Textfield;
