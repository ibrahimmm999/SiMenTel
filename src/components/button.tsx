import { FormEventHandler, MouseEventHandler } from "react";

function Button({
  text,
  type,
  onClick,
  onSubmit,
  isLoading = false,
  color = "primary",
  icon,
  disable = false,
}: {
  text?: string;
  type: "button" | "submit" | "reset" | undefined;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  onSubmit?: FormEventHandler<HTMLButtonElement> | undefined;
  isLoading?: boolean;
  color?: "primary" | "red" | "green" | "secondary";
  icon?: React.ReactNode;
  disable?: boolean;
}) {
  return (
    <button
      disabled={disable || isLoading}
      type={type}
      onClick={onClick}
      onSubmit={onSubmit}
      className={`${
        icon ? "rounded-[6px] px-2" : "rounded-[12px] px-8"
      } text-[12px] md:text-[16px] font-semibold py-2 ${
        disable
          ? "bg-mono-grey"
          : color == "primary"
          ? "bg-orange-primary active:bg-orange-primary hover:bg-orange-secondary"
          : color == "green"
          ? "bg-green-primary active:bg-green-primary hover:bg-green-secondary"
          : color == "red"
          ? "bg-red-primary active:bg-red-primary hover:bg-red-400"
          : "bg-white border-2 border-orange-primary group hover:bg-orange-primary active:bg-orange-600"
      }`}
    >
      {isLoading ? (
        <div
          className={`${
            color == "secondary"
              ? "text-orange-primary hover:text-white"
              : "text-white"
          }  flex items-center justify-center`}
        >
          <svg
            className="mr-3 h-5 w-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </div>
      ) : (
        <div
          className={`${
            color == "secondary"
              ? "text-orange-primary group-hover:text-white"
              : "text-white"
          }  flex items-center justify-center gap-2`}
        >
          {icon}
          {text}
        </div>
      )}
    </button>
  );
}

export default Button;
