import { useCallback, useEffect, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { BiUpload } from "react-icons/bi";
import { HiOutlinePencil } from "react-icons/hi";

interface DropzoneProps {
  onFileSelected: (files: File) => void;
  onFileRejected?: (fileRejections: FileRejection[]) => void;
  onFileDeleted: () => void;
  tipe: string;
}

function Upload({
  onFileSelected,
  onFileRejected,
  onFileDeleted,
  tipe,
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
    maxFiles: 1,
  });

  return (
    <>
      {tipe == "1" ? (
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
              <p className="text-[14px] font-light">
                Atau letakkan file disini
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`dropzone cursor-pointer text-orange-primary`}
        >
          <input {...getInputProps()} />
          <HiOutlinePencil size={32} />
        </div>
      )}
    </>
  );
}
export default Upload;
