import { BsCheck2Circle } from "react-icons/bs";
import { LuAlertOctagon } from "react-icons/lu";

function FacilityCard({ status, name }: { status: boolean; name: string }) {
  return (
    <div
      className={`flex items-center gap-2 ${
        status ? "text-green-primary" : "text-red-primary"
      } `}
    >
      {status ? <BsCheck2Circle size={28}/> : <LuAlertOctagon size={28}/>}
      <p className="text-[20px] font-medium text-black">{name}</p>
    </div>
  );
}

export default FacilityCard;
