import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible, AiOutlineSearch } from "react-icons/ai";

function Textfield({
  type,
  placeholder,
  value,
  required,
  useLabel,
  labelText,
  labelStyle,
  onChange,
  onChangeArea,
}: {
  type: "field" | "password" | "search" | "email" | "area";
  placeholder: string;
  value?: string | number | readonly string[] | undefined;
  required?: boolean;
  useLabel?: boolean;
  labelText?: string;
  labelStyle?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onChangeArea?: React.ChangeEventHandler<HTMLTextAreaElement> | undefined;
}) {
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
          {useLabel && (
            <label htmlFor="field" className={labelStyle}>
              {labelText}
            </label>
          )}
          <div className="w-full flex items-center px-[10px] py-[12px] text-[16px] text-black bg-white border-2 border-mono-grey hover:border-orange-primary focus-within:border-orange-primary rounded-[10px]">
            <input
              id="field"
              type="text"
              required={required}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              className="grow focus:outline-none w-full"
            />
          </div>
        </div>
      )}
      {type == "password" && (
        <div className="w-full">
          {useLabel && (
            <label htmlFor="password" className={labelStyle}>
              {labelText}
            </label>
          )}
          <div className="w-full flex gap-[12px] items-center px-[10px] py-[12px] text-[16px] text-black bg-white border-2 border-mono-grey hover:border-orange-primary focus-within:border-orange-primary rounded-[10px] group">
            <input
              id="password"
              type={showPassword}
              required={required}
              placeholder={placeholder}
              onChange={onChange}
              value={value}
              className="grow focus:outline-none w-full"
            />
            <div
              className="text-[22px] w-fit text-mono-grey group-focus-within:text-orange-primary group-hover:text-orange-primary"
              onClick={handleToggle}
            >
              {icon}
            </div>
          </div>
        </div>
      )}
      {type == "search" && (
        <div className="w-full">
          {useLabel && (
            <label htmlFor="search" className={labelStyle}>
              {labelText}
            </label>
          )}
          <div className="w-full flex gap-[12px] items-center px-[10px] py-[12px] text-[16px] text-black bg-white border-2 border-mono-grey hover:border-orange-primary focus-within:border-orange-primary rounded-[10px] group">
            <div className="text-[22px] w-fit text-mono-grey group-focus-within:text-orange-primary group-hover:text-orange-primary">
              <AiOutlineSearch />
            </div>
            <input
              id="search"
              type="text"
              required={required}
              placeholder={placeholder}
              onChange={onChange}
              value={value}
              className="grow focus:outline-none w-full"
            />
          </div>
        </div>
      )}
      {type == "email" && (
        <div className={"w-full"}>
          {useLabel && (
            <label htmlFor="email" className={labelStyle}>
              {labelText}
            </label>
          )}
          <input
            id="email"
            required={required}
            type="email"
            placeholder={placeholder}
            className={`w-full flex items-center px-[10px] py-[12px] text-[16px] text-black bg-white border-2 border-mono-grey hover:border-orange-primary focus:border-orange-primary focus:outline-orange-primary rounded-[10px] ${
              value &&
              "invalid:border-red-primary invalid:focus:outline-red-primary peer"
            }`}
            onChange={onChange}
            value={value}
          />
          <p className={`text-red-primary hidden peer-invalid:block`}>
            Masukkan Email yang valid!
          </p>
        </div>
      )}
      {type == "area" && (
        <div className="w-full">
          {useLabel}{" "}
          <label htmlFor="description" className={labelStyle}>
            {labelText}
          </label>
          <div
            className={`w-full flex items-center px-[10px] py-[12px] text-[16px] text-black bg-white border-2 border-mono-grey hover:border-orange-primary focus:border-orange-primary focus:outline-orange-primary rounded-[10px] ${
              value &&
              "invalid:border-red-primary invalid:focus:outline-red-primary peer"
            }`}
          >
            <textarea
              id="description"
              required={required}
              placeholder={placeholder}
              onInput={(e) => {
                e.currentTarget.style.height = "auto";
                e.currentTarget.style.height =
                  e.currentTarget.scrollHeight + "px";
              }}
              style={{ height: "auto", minHeight: "100px" }}
              value={value}
              onChange={onChangeArea}
              className="grow resize-none focus:outline-none"
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Textfield;
