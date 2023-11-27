import { BiSolidPencil } from "react-icons/bi";
import Button from "../../../components/button";
import { FaTrashCan } from "react-icons/fa6";
import Facility from "../../../interfaces/facility";
import Textfield from "../../../components/textfield";
import Dropdown from "../../../components/dropdown";
import { useState } from "react";
import { supabase } from "../../../lib/api";
import { toastError, toastSuccess } from "../../../components/toast";
import Modal from "../../../components/modal";

function EditFacility({
  data,
  fetch,
}: {
  data: Facility;
  fetch: () => Promise<void>;
}) {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const option = [
    { label: "Normal", value: true },
    { label: "Broken", value: false },
  ];
  const [newFacility, setNewFacility] = useState<Facility>(data);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleEditFacility = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("facilities")
        .update({
          name: newFacility && newFacility.name,
          status: newFacility && newFacility.status,
          room_id: data.room_id,
        })
        .eq("id", data.id);
      if (error) {
        throw new Error(`Error edit facility data: ${error.message}`);
      } else {
        toastSuccess("Edit Facility Success");
        fetch();
        setIsEdit(false);
      }
    } catch (error) {
      toastError(error as string);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnDelete = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("facilities")
        .delete()
        .eq("id", data.id);
      if (error) {
        throw new Error(`Error delete facility data: ${error.message}`);
      } else {
        toastSuccess("Delete Facility Success");
        fetch();
        setIsDeleteModal(false);
      }
    } catch (error) {
      toastError(error as string);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Modal visible={isDeleteModal} onClose={() => setIsDeleteModal(false)}>
        <div className="w-full flex flex-col justify-center items-center gap-4">
          <p className="text-[48px] font-bold">Delete</p>
          <p className="text-[20px] font-normal">
            Apakah anda yakin ingin menghapus fasilitas?
          </p>
          <div className="w-full flex justify-center items-center gap-4">
            <Button
              type="button"
              color="secondary"
              text="Batal"
              onClick={() => setIsDeleteModal(false)}
            />
            <Button
              isLoading={isLoading}
              type="submit"
              color="red"
              text="Hapus"
              onClick={handleOnDelete}
            />
          </div>
        </div>
      </Modal>
      {isEdit ? (
        <div className="w-full flex items-center gap-4">
          <div className="w-[270px] py-[10px] rounded-lg text-[#6B6B6B]">
            <Textfield
              type={"field"}
              value={newFacility.name}
              placeholder={"Nama Fasilitas"}
              onChange={(e) =>
                setNewFacility((prevData: any) => ({
                  ...prevData,
                  name: e.target.value,
                }))
              }
            />
          </div>
          <div className="w-[150px] py-[10px] rounded-lg text-[#6B6B6B] mr-8">
            <Dropdown
              placeholder={"Status"}
              value={
                data && data.status
                  ? { label: "Normal", value: true }
                  : { label: "Broken", value: false }
              }
              options={option}
              onChange={(e) =>
                setNewFacility((prevData: any) => ({
                  ...prevData,
                  status: e?.value,
                }))
              }
            />
          </div>
          <Button
            type={"button"}
            text="Save"
            onClick={handleEditFacility}
            isLoading={isLoading}
          />
        </div>
      ) : (
        <div className="w-full flex items-center gap-4">
          <div className="w-[270px] py-[10px] px-3 bg-[#EFEFEF] rounded-lg text-[#6B6B6B]">
            {data.name}
          </div>
          <div className="w-[150px] py-[10px] px-3 bg-[#EFEFEF] rounded-lg text-[#6B6B6B]">
            {data.status ? "Normal" : "Broken"}
          </div>
          <div className="flex gap-3 ml-10">
            <Button
              type={"button"}
              icon={<BiSolidPencil />}
              color="primary"
              onClick={() => setIsEdit(true)}
            />
            <Button
              type={"button"}
              icon={<FaTrashCan />}
              color="red"
              onClick={() => setIsDeleteModal(true)}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default EditFacility;
