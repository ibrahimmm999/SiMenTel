import { MouseEventHandler } from "react";
import { FaExclamation } from "react-icons/fa6";

function CardRoom({
  nama,
  lantai,
  kondisi,
  link,
  onClick,
}: {
  nama: string;
  lantai: string;
  kondisi: boolean | null;
  link: string;
  onClick?: MouseEventHandler<HTMLDivElement> | undefined;
}) {
  return (
    <>
      <div
        className="w-full max-w-[360px] h-fit bg-white hover:bg-mono-light_grey rounded-[20px] shadow-lg px-2 pt-2 pb-5 cursor-pointer relative"
        onClick={onClick}
      >
        <div className="w-full h-fit flex flex-col items-center justify-between gap-5">
          <img
            src={link != null ? link : "/assets/image_not_found.png"}
            alt="Kamar"
            className="w-full h-[200px] object-cover rounded-[20px]"
          />
          <p className="font-bold text-center w-full">
            {nama}
            <br />
            <span className="font-normal text-center w-full">
              {lantai}
            </span>
          </p>
        </div>
        {kondisi == false && (
          <div className="bg-red-primary w-9 h-9 rounded-full absolute top-0 right-0 animate-bounce text-white flex justify-center items-center text-xl">
            <FaExclamation/>
          </div>
        )}
      </div>
    </>
  );
}

export default CardRoom;
