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
  value?: { value: any; label: string };
  options: any;
  required?: boolean;
}

const Dropdown = ({
  placeholder,
  onChange,
  options,
  value,
  required,
}: DropdownProps) => {
  
  return (
    <Select
      defaultValue={value}
      required={required}
      options={options}
      placeholder={placeholder}
      onChange={onChange}
      isSearchable={true}
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
          height: "44px",
          border: state.isFocused ? "" : "2px solid #6B6B6B",
          "&:hover": {
            borderColor: state.isFocused ? "#ED7D31" : "#ED7D31",
          },
        }),
      }}
    />
  );
};

export default Dropdown;
