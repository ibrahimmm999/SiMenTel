import Button from "./button";
import { BiSolidPencil } from "react-icons/bi";
import { FaTrashCan } from "react-icons/fa6";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

function Action({
  id,
  status,
  onChangeEdit,
  onChangeDelete,
  onChangeAccept,
  onChangeReject,
  loading,
}: {
  id: string;
  status: string;
  loading?: boolean;
  onChangeEdit?: (x: string) => void;
  onChangeDelete?: (x: string) => void;
  onChangeAccept?: (x: string) => void;
  onChangeReject?: (x: string) => void;
}) {
  console.log(id);
  return (
    <>
      {status == "WAITING" ? (
        <div className="w-full flex justify-center gap-2">
          <Button
            isLoading={loading}
            type={"button"}
            icon={<BiSolidPencil />}
            color="primary"
            onClick={() => {
              if (onChangeEdit) {
                onChangeEdit(id);
              }
            }}
          />
          <Button
            isLoading={loading}
            type={"button"}
            icon={<FaTrashCan />}
            color="red"
            onClick={() => {
              if (onChangeDelete) {
                onChangeDelete(id);
              }
            }}
          />
        </div>
      ) : status == "REVIEW" ? (
        <div className="w-full flex justify-center gap-2">
          <Button
            isLoading={loading}
            type={"button"}
            icon={<AiOutlineCheck />}
            color="green"
            onClick={() => {
              if (onChangeAccept) {
                onChangeAccept(id);
              }
            }}
          />
          <Button
            isLoading={loading}
            type={"button"}
            icon={<AiOutlineClose />}
            color="red"
            onClick={() => {
              if (onChangeReject) {
                onChangeReject(id);
              }
            }}
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
