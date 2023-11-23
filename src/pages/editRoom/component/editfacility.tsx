import { BiSolidPencil } from "react-icons/bi";
import Button from "../../../components/button";
import { FaTrashCan } from "react-icons/fa6";

function EditFacility() {
  return (
    <>
      <div className="w-full flex items-center gap-4">
        <div className="w-[270px] py-[10px] px-3 bg-[#EFEFEF] rounded-lg text-[#6B6B6B]">
          Air Conditioner
        </div>
        <div className="w-[150px] py-[10px] px-3 bg-[#EFEFEF] rounded-lg text-[#6B6B6B]">
          Normal
        </div>
        <div className="flex gap-3">
          <Button type={"button"} icon={<BiSolidPencil />} color="primary" />
          <Button type={"button"} icon={<FaTrashCan />} color="red" />
        </div>
      </div>
    </>
  );
}

export default EditFacility;
