import { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import Room from "../../interfaces/room";
import { FileRejection } from "react-dropzone";
import { toast } from "react-toastify";
import { supabase } from "../../lib/api";
import { toastError, toastSuccess } from "../../components/toast";
import { HiOutlinePhotograph } from "react-icons/hi";
import Upload from "../editRoom/component/upload";
import Textfield from "../../components/textfield";
import Button from "../../components/button";
import User from "../../interfaces/user";
import { useNavigate } from "react-router-dom";

function AddRoom() {
  const [file, setFile] = useState<File>();
  const [fileDataURL, setFileDataURL] = useState<string>("");
  const [roomData, setRoomData] = useState<Room | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  const handleAddRoom = async (e: React.FormEvent<HTMLFormElement>) => {
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
        const { error } = await supabase.from("rooms").upsert({
          name: roomData && roomData.name,
          floor: roomData && roomData.floor,
          description: roomData && roomData.description,
          price: roomData && roomData.price,
          photo_url: data.publicUrl,
        });

        if (error) {
          throw new Error(`Error update room data: ${error.message}`);
        } else {
          toastSuccess("Add Room Success");
          const { data } = await supabase
            .from("rooms")
            .select()
            .eq("name", roomData && roomData.name)
            .single();
          handleAddCheck(data.id);
        }
      }
    } catch (error) {
      toastError(error as string);
      console.log(error);
    }finally {
      setIsLoading(false);
    }
  };

  const handleAddCheck = async (id: number) => {
    try {
      const { error } = await supabase.from("checks").insert({ room_id: id });
      if (error) {
        throw new Error(`Error update room data: ${error.message}`);
      }else{
        navigate("/room");
      }
    } catch (error) {}
  };

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
              className="w-[560px] h-[390px] max-h-[390px] cover rounded-lg"
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
        <form
          action=""
          className="flex flex-col gap-4 grow"
          onSubmit={handleAddRoom}
        >
          <Textfield
            type={"field"}
            placeholder={"Nama ruangan"}
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
              onChange={(e) =>
                setRoomData((prevData: any) => ({
                  ...prevData,
                  price: e.target.value,
                }))
              }
            />
            <Button type={"submit"} text="Add" isLoading={isLoading}/>
          </div>
          <hr className="h-1 bg-black" />
        </form>
      </div>
    </div>
  );
}

export default AddRoom;
