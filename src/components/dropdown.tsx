import Select, { ActionMeta, SingleValue } from "react-select";

interface DropdownProps {
  placeholder: string;
  onChange?:
    | ((
        newValue: SingleValue<{
          value: string;
          label: string;
        }>,
        actionMeta: ActionMeta<{
          value: string;
          label: string;
        }>
      ) => void)
    | undefined;
  value?: { value: string; label: string };
  options: any;
  required?: boolean;
  label?: string;
  useLabel?: boolean;
  height?: string;
}

const Dropdown = ({
  placeholder,
  onChange,
  options,
  value,
  required,
  label,
  useLabel,
  height,
}: DropdownProps) => {
  return (
    <>
      {useLabel && <label>{label}</label>}
      <Select
        required={required}
        options={options}
        placeholder={placeholder}
        onChange={onChange}
        isSearchable={true}
        value={value}
        theme={(theme) => ({
          ...theme,
          borderRadius: 10,
          border: "2px",

          colors: {
            ...theme.colors,
            primary: "#ED7D31",
          },
        })}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            height: "100%",
            border: state.isFocused ? "" : "2px solid #6B6B6B",
            "&:hover": {
              borderColor: state.isFocused ? "#ED7D31" : "#ED7D31",
            },
          }),
          container: (baseStyles) => ({
            ...baseStyles,
            height: height,
          }),
        }}
      />
    </>
  );
};

export default Dropdown;
