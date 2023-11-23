import { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import Upload from "./component/upload";
import toast from "react-hot-toast";
import { FileRejection } from "react-dropzone";
import Textfield from "../../components/textfield";
import Button from "../../components/button";
import EditFacility from "./component/editfacility";
import Room from "../../interfaces/room";
import { supabase } from "../../lib/api";
import { toastError, toastSuccess } from "../../components/toast";
import Facility from "../../interfaces/facility";
import Dropdown from "../../components/dropdown";

function EditRoom({ idx }: { idx: number }) {
  const [file, setFile] = useState<File>();
  const [fileName, setFileName] = useState("");
  const [data, setData] = useState<Room | null>(null);
  const [facility, setFacility] = useState<Facility[]>([]);
  const [newFacility, setNewFacility] = useState<Facility | null>(null);
  const option = [
    { label: "Normal", value: true },
    { label: "Broken", value: false },
  ];
  const [trigger, setTrigger] = useState<number>(0);

  const handleFileRejected = (fileRejections: FileRejection[]) => {
    const rejectedFiles = fileRejections.map(
      (rejectedFile) => rejectedFile.file
    );

    const pdfFiles = rejectedFiles.filter(
      (file) => file.type === "application/pdf"
    );

    if (pdfFiles.length > 0) {
      toast.error("PDF files are not allowed. Please upload image files only.");
    }
  };

  const handleOnUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("rooms")
        .update({
          name: data && data.name,
          floor: data && data.floor,
          description: data && data.description,
          price: data && data.price,
        })
        .eq("id", idx);

      if (error) {
        throw new Error(`Error update room data: ${error.message}`);
      } else {
        toastSuccess("Update Success");
      }
    } catch (error) {
      toastError(error as string);
    }
  };

  const handleAddFacility = async () => {
    try {
      const { error } = await supabase.from("facilities").insert({
        name: newFacility && newFacility.name,
        status: newFacility && newFacility.status,
        room_id: idx,
      });
      if (error) {
        throw new Error(`Error add facility data: ${error.message}`);
      } else {
        toastSuccess("Add Facility Success");
        setTrigger(trigger + 1);
      }
    } catch (error) {
      toastError(error as string);
    }
  };

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const { data, error } = await supabase
          .from("rooms")
          .select()
          .eq("id", idx)
          .single();

        if (error) {
          throw new Error(`Error fetching room data: ${error.message}`);
        }

        if (data) {
          setData(data);
        } else {
          throw new Error("Room not found");
        }
      } catch (error) {
        toastError(error as string);
      }
    };

    fetchRoom();
  }, []);

  useEffect(() => {
    const fetchFacility = async () => {
      try {
        const { data, error } = await supabase
          .from("facilities")
          .select()
          .eq("room_id", idx);

        if (error) {
          throw new Error(`Error fetching facility data: ${error.message}`);
        }

        if (data) {
          setFacility(data);
        } else {
          throw new Error("Facilities not found");
        }
      } catch (error) {
        toastError(error as string);
      }
    };

    fetchFacility();
  }, [trigger]);

  return (
    <div className="w-full flex flex-col pb-10">
      <Navbar />
      <div className="w-full mt-[120px] flex px-28 gap-24">
        <Upload
          onFileSelected={(e: File) => {
            setFile(e);
            setFileName(e.name);
          }}
          onFileRejected={handleFileRejected}
          onFileDeleted={() => setFile(undefined)}
          name={fileName}
        />
        {data && (
          <form
            action=""
            className="flex flex-col gap-4 grow"
            onSubmit={handleOnUpdate}
          >
            <Textfield
              type={"field"}
              placeholder={"Nama ruangan"}
              value={data.name}
              onChange={(e) =>
                setData((prevData: any) => ({
                  ...prevData,
                  name: e.target.value,
                }))
              }
            />
            <Textfield
              type={"field"}
              placeholder={"Lantai"}
              value={data.floor}
              onChange={(e) =>
                setData((prevData: any) => ({
                  ...prevData,
                  floor: e.target.value,
                }))
              }
            />
            <Textfield
              type={"area"}
              placeholder={"Description"}
              value={data.description}
              onChangeArea={(e) =>
                setData((prevData: any) => ({
                  ...prevData,
                  description: e.target.value,
                }))
              }
            />
            <div className="flex items-center justify-between gap-4">
              <Textfield
                type={"field"}
                placeholder={"Price"}
                value={data.price}
                onChange={(e) =>
                  setData((prevData: any) => ({
                    ...prevData,
                    price: e.target.value,
                  }))
                }
              />
              <Button type={"submit"} text="Save" />
            </div>
            <hr className="h-1 bg-black" />
          </form>
        )}
      </div>
      <p className="text-[32px] font-medium mt-8 px-28">Facilities</p>
      <div className="mt-7 grid grid-cols-2 gap-x-24 gap-y-4 px-28">
        {facility &&
          facility.map((row: Facility) => <EditFacility data={row} />)}
        <div className="w-full flex items-center gap-4">
          <div className="w-[270px] py-[10px] rounded-lg text-[#6B6B6B]">
            <Textfield
              type={"field"}
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
              options={option}
              onChange={(e) =>
                setNewFacility((prevData: any) => ({
                  ...prevData,
                  status: e?.value,
                }))
              }
            />
          </div>
          <Button type={"button"} text="Add" onClick={handleAddFacility} />
        </div>
      </div>
    </div>
  );
}

export default EditRoom;
