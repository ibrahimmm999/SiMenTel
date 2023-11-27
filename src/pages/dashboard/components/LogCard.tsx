import { MdHistoryToggleOff, MdOutlineSmsFailed } from "react-icons/md";
import { FiCheckCircle } from "react-icons/fi";

function LogCard({
  status,
  name,
  time,
  date,
}: {
  status: "FIXED" | "WAITING" | "NOT FIXED";
  name: string;
  time: string | undefined;
  date: string | undefined;
}) {
  return (
    <div className="p-4 bg-orange-ternary rounded-[10px] flex gap-3 w-full h-fit items-center">
      <div className="w-10 h-10 rounded-full bg-slate-600"></div>
      <div>
        <p className="text-[16px] font-bold">{name}</p>
        <div
          className={`flex items-center gap-2 text-[14px] ${
            status == "FIXED"
              ? "text-green-primary"
              : status == "NOT FIXED"
              ? "text-red-primary"
              : "text-[#FAB437]"
          }`}
        >
          {status == "FIXED" ? (
            <FiCheckCircle />
          ) : status == "NOT FIXED" ? (
            <MdOutlineSmsFailed />
          ) : (
            <MdHistoryToggleOff />
          )}
          <p className="text-purple-primary font-bold">
            {time}
            <span className="text-purple-primary font-normal ml-1">{date}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LogCard;
