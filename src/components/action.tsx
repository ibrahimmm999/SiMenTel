import Button from "./button";
import { BiSolidPencil } from "react-icons/bi";
import { FaTrashCan } from "react-icons/fa6";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

function Action({
  id,
  status,
  onChange,
}: {
  id: string;
  status: string;
  onChange: (x: string) => void;
}) {
  console.log(id);
  return (
    <>
      {status == "WAITING" ? (
        <div className="w-full flex justify-center gap-2">
          <Button
            type={"button"}
            icon={<BiSolidPencil />}
            color="primary"
            onClick={() => onChange(id)}
          />
          <Button
            type={"button"}
            icon={<FaTrashCan />}
            color="red"
            onClick={() => onChange(id)}
          />
        </div>
      ) : status == "REVIEW" ? (
        <div className="w-full flex justify-center gap-2">
          <Button
            type={"button"}
            icon={<AiOutlineCheck />}
            color="green"
            onClick={() => onChange(id)}
          />
          <Button
            type={"button"}
            icon={<AiOutlineClose />}
            color="red"
            onClick={() => onChange(id)}
          />
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
