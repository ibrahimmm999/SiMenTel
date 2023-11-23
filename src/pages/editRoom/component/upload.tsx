import { useCallback, useEffect, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { BiUpload } from "react-icons/bi";
import { HiOutlinePhotograph } from "react-icons/hi";

interface DropzoneProps {
  onFileSelected: (files: File) => void;
  onFileRejected?: (fileRejections: FileRejection[]) => void;
  onFileDeleted: () => void;
  name: string;
}

function Upload({
  onFileSelected,
  onFileRejected,
  onFileDeleted,
  name,
}: DropzoneProps) {
  const [file, setFile] = useState<File>();
  const handleDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        const imageFiles = acceptedFiles.filter((file) =>
          file.type.startsWith("image/")
        );
        if (imageFiles.length > 0) {
          setFile(imageFiles[0]);
          onFileDeleted();
        } else {
          if (onFileRejected) {
            onFileRejected(fileRejections);
          }
        }
      } else if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        onFileDeleted();
      }
    },
    [onFileRejected, onFileDeleted]
  );

  useEffect(() => {
    if (file) {
      onFileSelected(file);
    }
  }, [file, onFileSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    maxFiles: 1, // Maximum number of files allowed
  });

  return (
    <div className="flex flex-col gap-4">
      <div
        className={`${
          isDragActive ? "border-black" : "border-[#696969]"
        } border-2 border-dashed rounded-lg bg-orange-ternary w-[560px]`}
      >
        <div
          {...getRootProps()}
          className={`dropzone flex flex-col justify-center items-center gap-[2px] cursor-pointer text-[#4D4C7D] px-32 py-32`}
        >
          <input {...getInputProps()} />
          <BiUpload size={36} />
          <p className="text-[20px] font-normal">
            Pilih file yang ingin diunggah
          </p>
          <p className="text-[14px] font-light">Atau letakkan file disini</p>
        </div>
      </div>
      <div
        className={`flex items-center gap-3 text-orange-primary ${
          name ? "block" : "hidden"
        }`}
      >
        <HiOutlinePhotograph size={42} />
        <p className="text-[20px] text-[#4D4C7D] font-normal">{name}</p>
      </div>
    </div>
  );
}
export default Upload;
