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
import { HiOutlinePhotograph } from "react-icons/hi";
import User from "../../interfaces/user";
import { useNavigate, useParams } from "react-router-dom";

function EditRoom() {
  const [file, setFile] = useState<File>();
  const [fileDataURL, setFileDataURL] = useState<string>("");
  const [roomData, setRoomData] = useState<Room | null>(null);
  const [facility, setFacility] = useState<Facility[]>([]);
  const [newFacility, setNewFacility] = useState<Facility | null>(null);
  const option = [
    { label: "Normal", value: true },
    { label: "Broken", value: false },
  ];
  const [trigger, setTrigger] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const params = useParams();
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", (await supabase.auth.getUser()).data.user?.id)
        .single();
      if (error) {
        console.error("Error fetching user data:", error);
        return;
      }
      setCurrentUser(data);
      console.log(currentUser);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const splitString = (url: string) => {
    return url.split("/")[9];
  };

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
    setIsLoading(true);
    try {
      if (file) {
        const {} = await supabase.storage
        .from("photo_room")
        .upload(`public/${file.name}`, file, {
            cacheControl: "3600",
            upsert: false,
          });
        const { data } = supabase.storage
          .from("photo_room")
          .getPublicUrl(`public/${file.name}`);
        const { error } = await supabase
          .from("rooms")
          .update({
            name: roomData && roomData.name,
            floor: roomData && roomData.floor,
            description: roomData && roomData.description,
            price: roomData && roomData.price,
            photo_url: data.publicUrl,
          })
          .eq("id", params.idx);

        if (error) {
          throw new Error(`Error update room data: ${error.message}`);
        } else {
          toastSuccess("Update Success");
          navigate(`/room/detail/${params.idx}`);
        }
      } else {
        const { error } = await supabase
          .from("rooms")
          .update({
            name: roomData && roomData.name,
            floor: roomData && roomData.floor,
            description: roomData && roomData.description,
            price: roomData && roomData.price,
          })
          .eq("id", params.idx);
          
          if (error) {
            throw new Error(`Error update room data: ${error.message}`);
          } else {
            toastSuccess("Update Success");
            navigate(`/room/detail/${params.idx}`);
          }
        }
      } catch (error) {
        toastError(error as string);
      }finally{
        setIsLoading(false);
      }
    };
    
  const handleAddFacility = async () => {
    try {
      const { error } = await supabase.from("facilities").insert({
        name: newFacility && newFacility.name,
        status: newFacility && newFacility.status,
        room_id: params.idx,
      });
      if (error) {
        throw new Error(`Error add facility data: ${error.message}`);
      } else {
        toastSuccess("Add Facility Success");
        window.location.reload();
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
          .eq("id", params.idx)
          .single();

        if (error) {
          throw new Error(`Error fetching room data: ${error.message}`);
        }

        if (data) {
          setRoomData(data);
          setFileDataURL(data.photo_url);
        } else {
          throw new Error("Room not found");
        }
      } catch (error) {
        toastError(error as string);
      }
    };

    fetchRoom();
  }, []);

  const fetchFacility = async () => {
    try {
      const { data, error } = await supabase
        .from("facilities")
        .select()
        .eq("room_id", params.idx);

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

  useEffect(() => {
    fetchFacility();
  }, [trigger]);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    let isCancel = false;
    if (file) {
      let fileReader = new FileReader();
      fileReader.onload = (e: any) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setFileDataURL(result);
        }
      };
      fileReader.readAsDataURL(file);
    }
  }, [file]);

  return (
    <div className="w-full flex flex-col pb-10">
      <Navbar />
      <div className="w-full mt-[120px] flex px-28 gap-24">
        {file ? (
          <div className="flex flex-col gap-4">
            <img
              src={fileDataURL}
              alt=""
              className="w-[560px] h-[36x0px] cover rounded-lg"
            />
            <div
              className={`flex items-center gap-3 text-orange-primary ${
                file.name ? "block" : "hidden"
              }`}
            >
              <HiOutlinePhotograph size={42} />
              <p className="text-[20px] text-[#4D4C7D] font-normal">
                {file.name}
              </p>
              <Upload
                onFileSelected={(e: File) => {
                  setFile(e);
                }}
                onFileRejected={handleFileRejected}
                onFileDeleted={() => setFile(undefined)}
                tipe={"2"}
              />
            </div>
          </div>
        ) : fileDataURL ? (
          <div className="flex flex-col gap-4">
            <img
              src={fileDataURL}
              alt=""
              className="w-[560px] max-h-[360px] cover rounded-lg"
            />
            <div className={`flex items-center gap-3 text-orange-primary`}>
              <HiOutlinePhotograph size={42} />
              <p className="text-[20px] text-[#4D4C7D] font-normal">
                {splitString(fileDataURL)}
              </p>
              <Upload
                onFileSelected={(e: File) => {
                  setFile(e);
                }}
                onFileRejected={handleFileRejected}
                onFileDeleted={() => setFile(undefined)}
                tipe={"2"}
              />
            </div>
          </div>
        ) : (
          <Upload
            onFileSelected={(e: File) => {
              setFile(e);
            }}
            onFileRejected={handleFileRejected}
            onFileDeleted={() => setFile(undefined)}
            tipe={"1"}
          />
        )}
        {roomData && (
          <form
            action=""
            className="flex flex-col gap-4 grow"
            onSubmit={handleOnUpdate}
          >
            <Textfield
              type={"field"}
              placeholder={"Nama ruangan"}
              value={roomData.name}
              onChange={(e) =>
                setRoomData((prevData: any) => ({
                  ...prevData,
                  name: e.target.value,
                }))
              }
            />
            <Textfield
              type={"field"}
              placeholder={"Lantai"}
              value={roomData.floor}
              onChange={(e) =>
                setRoomData((prevData: any) => ({
                  ...prevData,
                  floor: e.target.value,
                }))
              }
            />
            <Textfield
              type={"area"}
              placeholder={"Description"}
              value={roomData.description}
              onChangeArea={(e) =>
                setRoomData((prevData: any) => ({
                  ...prevData,
                  description: e.target.value,
                }))
              }
            />
            <div className="flex items-center justify-between gap-4">
              <Textfield
                type={"field"}
                placeholder={"Price"}
                value={roomData.price}
                onChange={(e) =>
                  setRoomData((prevData: any) => ({
                    ...prevData,
                    price: e.target.value,
                  }))
                }
              />
              <Button
                type={"submit"}
                text="Save"
                isLoading={isLoading}
              />
            </div>
            <hr className="h-1 bg-black" />
          </form>
        )}
      </div>
      <p className="text-[32px] font-medium mt-8 px-28">Facilities</p>
      <div className="mt-7 grid grid-cols-2 gap-x-24 gap-y-4 px-28">
        {facility &&
          facility.map((row: Facility) => (
            <EditFacility data={row} fetch={fetchFacility} />
          ))}
        <div className="w-full flex items-center gap-4">
          <div className="w-[270px] rounded-lg text-[#6B6B6B]">
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
          <div className="w-[150px] rounded-lg text-[#6B6B6B] mr-8">
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
