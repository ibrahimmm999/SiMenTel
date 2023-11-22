import Button from "./button";
import { BiSolidPencil } from "react-icons/bi";
import { FaTrashCan } from "react-icons/fa6";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

function Action({ id, status }: { id: number; status: string }) {
  console.log(id);
  return (
    <>
      {status == "WAITING" ? (
        <div className="w-full flex justify-center gap-2">
          <Button type={"button"} icon={<BiSolidPencil />} color="primary" />
          <Button type={"button"} icon={<FaTrashCan />} color="red" />
        </div>
      ) : status == "REVIEW" ? (
        <div className="w-full flex justify-center gap-2">
          <Button type={"button"} icon={<AiOutlineCheck />} color="green" />
          <Button type={"button"} icon={<AiOutlineClose />} color="red" />
        </div>
      ) : status == "FIXED" ? (
        <div className="w-full flex justify-center text-green-primary text-xl">
          <AiOutlineCheck />
        </div>
      ) : (
        <div className="w-full flex justify-center text-red-primary text-xl">
          <AiOutlineClose />
        </div>
      )}
    </>
  );
}

export default Action;
