import { FaFilter } from "react-icons/fa6";
import Button from "../../components/button";
import Textfield from "../../components/textfield";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/api";
import { toastError } from "../../components/toast";
import CardRoom from "./components/cardRoom";
import Room from "../../interfaces/room";
import { useNavigate } from "react-router-dom";

function ListRoom() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>(rooms);
  const [search, setSearch] = useState<string | undefined>("");
  const [trigger, setTrigger] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const { data, error } = await supabase.from("rooms").select("*");

        if (error) {
          throw new Error(`Error fetching room data: ${error.message}`);
        }

        if (data && data.length > 0) {
          var dataRoom: Room[] = data.map((e) => {
            return {
              id: e.id,
              name: e.name,
              floor: e.floor,
              description: e.description,
              price: e.price,
              photo_url: e.photo_url,
              occupancy_status: e.occupancy_status,
              condition_status: e.condition_status,
            };
          });
          setRooms(dataRoom);
          setTrigger((prev) => prev + 1);
        } else {
          toastError("Data Room not found");
        }
      } catch (error) {
        toastError(error as string);
      }
    };
    fetchRoom();
  }, []);

  useEffect(() => {
    const fetchCheck = async () => {
      try {
        const { data, error } = await supabase.from("checks").select("*");

        if (error) {
          throw new Error(`Error fetching check data: ${error.message}`);
        }
        if (data && rooms && data.length > 0 && rooms.length > 0) {
          data.forEach((item) => {
            var room_index = rooms.findIndex(
              (room) => item.room_id === room.id
            );
            const updatedRooms = [...rooms];
            updatedRooms[room_index] = {
              ...updatedRooms[room_index],
              condition_status: item.is_maintenance,
            };
            setRooms(updatedRooms);
          });
        }
      } catch (error) {
        toastError(error as string);
      }
    };
    fetchCheck();
  }, [trigger]);

  useEffect(() => {
    if (search != undefined && search != "") {
      const filtered = rooms.filter((item: any) =>
        Object.values(item).some((value: any) =>
          String(value).toLowerCase().includes(search.toLowerCase())
        )
      );
      setFilteredRooms(filtered);
      // setPaginatedData(
      //   filtered.slice((page - 1) * dataLimit, page * dataLimit)
      // );
      // setTotalPages(
      //   filtered.length % dataLimit === 0
      //     ? filtered.length / dataLimit
      //     : Math.floor(filtered.length / dataLimit) + 1
      // );
    } else {
      setFilteredRooms(rooms);
      console.log(filteredRooms);
      // setPaginatedData(dataPm.slice((page - 1) * dataLimit, page * dataLimit));
      // setPaginatedDataTambahan(dataTambahanPm.slice((page - 1) * dataLimit, page * dataLimit));
      // setTotalPages(
      //   dataPm.length % dataLimit === 0
      //     ? dataPm.length / dataLimit
      //     : Math.floor(dataPm.length / dataLimit) + 1
      // );
    }
    // if (totalPages < page) {
    //   setPage(1);
    // }
  }, [search, rooms]);

  return (
    <div className="w-full flex flex-col pb-10 bg-background min-h-screen pt-[120PX] px-4 xl:px-28 gap-12 items-center">
      <h1 className="text-[24px] md:text-[36px] xl:text-[64px] font-bold text-purple-primary text-center">
        DAFTAR KAMAR
        <h2 className="text-[16px] md:text-[24px] xl:text-[36px] text-orange-primary">
          Jumlah Kamar : 685
        </h2>
      </h1>
      <div className="w-full">
        <div className="flex justify-between xl:items-center mb-10 flex-col-reverse md:flex-row items-start gap-2 md:gap-0">
          <div className="flex gap-2">
            <Textfield
              type={"search"}
              placeholder={"Search"}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type={"button"} text="Filter" icon={<FaFilter />} />
          </div>
          <Button type={"button"} text="Add User" />
        </div>
        <div className="w-full grid grid-cols-3 justify-items-center gap-y-10">
          {filteredRooms.map((item: any) => {
            console.log(item.condition_status);
            return (
              <CardRoom
                nama={item.name}
                lantai={item.floor}
                kondisi={item.condition_status}
                link={item.photo_url}
                onClick={() => navigate(`detail/${item.id}`)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ListRoom;
