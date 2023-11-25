import { useEffect, useState } from "react";
import Button from "../../components/button";
import Navbar from "../../components/navbar";
import { supabase } from "../../lib/api";
import FacilityCard from "./component/facility";
import Room from "../../interfaces/room";
import { toastError } from "../../components/toast";
import Facility from "../../interfaces/facility";
import { FormatRupiah } from "@arismun/format-rupiah";

function DetailRoom({ idx }: { idx: number }) {
  const [room, setRoom] = useState<Room | null>(null);
  const [facility, setFacility] = useState<Facility[]>([]);

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
          setRoom(data);
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

        console.log(data);

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
  }, []);

  return (
    <div className="w-full flex flex-col pb-10">
      <Navbar />
      <div className="w-full mt-[120PX] flex px-28 gap-24">
        <img
          src="./assets/bedroom.svg"
          alt=""
          className="w-[560px] h-[390px] rounded-lg"
        />
        <div className="w-full flex flex-col justify-between">
          <div className="flex flex-col gap-0">
            <p className="text-[48px] font-semibold">{room && room.name}</p>
            <p className="text-[24px] font-semibold">{room && room.floor}</p>
            <p className="text-[16px] font-normal mt-4">
              {room && room.description}
            </p>
          </div>
          <div className="flex flex-col gap-5">
            <div className="w-full flex justify-between items-center">
              <p className="text-[24px] font-bold">
                Price: {room && <FormatRupiah value={room.price}/>}
              </p>
              <Button type={"button"} text="Edit Detail" />
            </div>
            <hr className=" h-1 bg-black" />
          </div>
        </div>
      </div>
      <p className="text-[32px] font-medium mt-12 px-28">Facilities</p>
      <div className="flex gap-14 mt-8 flex-wrap px-28">
        {facility &&
          facility.map((row: any) => (
            <FacilityCard status={row.status} name={row.name} />
          ))}
      </div>
    </div>
  );
}

export default DetailRoom;
