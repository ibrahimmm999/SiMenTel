import { useState } from "react";
import Navbar from "../../components/navbar";
import Upload from "./component/upload";
import toast from "react-hot-toast";
import { FileRejection } from "react-dropzone";
import Textfield from "../../components/textfield";
import Button from "../../components/button";
import EditFacility from "./component/editfacility";

function EditRoom() {
  const [file, setFile] = useState<File>();
  const [fileName, setFileName] = useState("");

  const data = {
    nama: "Ruang Mawar",
    lantai: 3,
    description:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point  of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now",
    price: "Price: Rp4.000.000,00",
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
        <form action="" className="flex flex-col gap-4 grow">
          <Textfield
            type={"field"}
            placeholder={"Nama ruangan"}
            value={data.nama}
          />
          <Textfield
            type={"field"}
            placeholder={"Lantai"}
            value={data.lantai}
          />
          <Textfield
            type={"area"}
            placeholder={"Description"}
            value={data.description}
          />
          <div className="flex items-center justify-between gap-4">
            <Textfield
              type={"field"}
              placeholder={"Price"}
              value={data.price}
            />
            <Button type={"button"} text="Save" />
          </div>
          <hr className="h-1 bg-black" />
        </form>
      </div>
      <p className="text-[32px] font-medium mt-8 px-28">Facilities</p>
      <div className="mt-7 grid grid-cols-2 gap-x-24 gap-y-4 px-28">
        <EditFacility />
        <EditFacility />
      </div>
    </div>
  );
}

export default EditRoom;
