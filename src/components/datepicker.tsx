import { LegacyRef, MouseEventHandler, forwardRef, useState } from "react";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";

function Datepicker({
  id,
  text,
  onChange,
  required,
  defaultValue = null,
}: {
  id?: string;
  text: string;
  onChange?: (date: Date) => void;
  required?: boolean;
  defaultValue?: Date | null;
}) {
  const [startDate, setStartDate] = useState<Date | null>(defaultValue);

  const CustomInput = forwardRef(
    (
      {
        value,
        onClick,
      }: {
        value?: string | number | readonly string[] | undefined;
        onClick?: MouseEventHandler<HTMLInputElement> | undefined;
      },
      ref: LegacyRef<HTMLInputElement> | undefined
    ) => (
      <input
        id={id}
        required={required}
        value={value}
        placeholder={text}
        // onChange={onChange}
        className={`w-full rounded-lg border-2 border-mono-grey bg-[url('./assets/date_icon.svg')] cursor-pointer bg-right bg-no-repeat bg-origin-content px-[12px] py-[10px] hover:border-orange-primary focus:outline-orange-primary`}
        onClick={onClick}
        ref={ref}
      ></input>
    )
  );
  
  return (
    <>
      <DatePicker
        wrapperClassName="w-full"
        dateFormat={"yyyy-MM-dd"}
        showMonthDropdown
        showYearDropdown
        scrollableYearDropdown
        popperPlacement="bottom"
        showPopperArrow={false}
        selected={startDate == null && defaultValue != null ? defaultValue : startDate}
        onChange={(date: Date) => {
          setStartDate(date);
          if(onChange){
            onChange(date);
          }
        }}
        customInput={<CustomInput />}
        placeholderText={text}
      />
    </>
  );
}

export default Datepicker;
