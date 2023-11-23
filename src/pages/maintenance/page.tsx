import Button from "../../components/button";
import Search from "../../components/search";
import Table from "../../components/table";
import Paginate from "../../components/paginate";
import Status from "../../components/status";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Modal from "../../components/modal";
import Datepicker from "../../components/datepicker";
import Checkbox from "../../components/checkbox";

function Maintenance() {
  interface Maintenance {
    id: number;
    description: string;
    room_id: number;
    user_id: number;
    assign_time: string;
    work_time: string;
    status: string;
    evidence_url: string;
    room?: Room;
    detail: string;
    user?: User;
  }

  interface Room {
    id: number;
    name: string;
    floor: string;
    description: string;
    price: number;
  }

  interface User {
    id: string;
    name: string;
    contact: string;
    role: string;
  }
  const supabase = createClient(
    "https://iyxelirhnqarhzqluhmw.supabase.co/",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5eGVsaXJobnFhcmh6cWx1aG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA2NjUwNjcsImV4cCI6MjAxNjI0MTA2N30.htNhQMeg7ZyRygze0_1bRKUtsjoy0BKCXjpuCgmxUQw"
  );
  const [maintenanceData, setMaintenanceData] = useState<Maintenance[]>([]);
  const [roomData, setRoomData] = useState<Room[]>([]);
  const [userData, setUserData] = useState<User[]>([]);
  const [pageMaintenance, setPageMaintenance] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAssignMaintenance, setShowAssignMaintenance] = useState(false);
  const kolomAdmin = [
    "ID",
    "Tanggal",
    "Status",
    "Nama Ruangan",
    "Lokasi",
    "Detail Maintenance",
    "Staff",
    "Kontak",
    "Laporan",
    "Action",
  ];
  const kolomStaff = [
    "ID",
    "Tanggal",
    "Status",
    "Nama Ruangan",
    "Lokasi",
    "Detail Maintenance",
    "Laporan",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: maintenanceData,
          error: maintenanceError,
          count,
        } = await supabase
          .from("maintenances")
          .select("*")
          .range((pageMaintenance - 1) * 10, pageMaintenance * 10 - 1); // Menggunakan 10 sebagai limit, sesuaikan sesuai kebutuhan

        const { data: roomData, error: roomError } = await supabase
          .from("rooms")
          .select("*");

        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*");

        if (maintenanceError || roomError || userError) {
          console.error(
            "Error fetching data:",
            maintenanceError || roomError || userError
          );
          return;
        }

        // Menghitung total halaman berdasarkan total data dan limit
        setTotalPages(Math.ceil(count ?? 1));

        // Gabungkan data berdasarkan room_id
        const combinedData = maintenanceData.map((maintenance) => ({
          ...maintenance,
          room: roomData.find((room) => room.id === maintenance.room_id),
          user: userData.find((user) => user.id === maintenance.user_id),
        }));

        setMaintenanceData(combinedData);
        setRoomData(roomData);
        setUserData(userData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [pageMaintenance]); // Pastikan untuk menyertakan dependencies yang diperlukan jika ada

  const tableData = maintenanceData.map((item) => [
    item.id.toString(),
    item.assign_time,
    <Status status={item.status} />,
    item.room?.name || "",
    item.room?.floor || "",
    item.detail,
    // item.user?.name || "",
    // item.user?.contact || "",
    "KONTOL", // Dummy data, gantilah dengan data yang sesuai
    // <Action id={item.id} status={item.status} />,
  ]);

  return (
    <>
      <Modal
        visible={showAssignMaintenance}
        onClose={() => setShowAssignMaintenance(false)}
        children={
          <div>
            <h1 className=" text-[40px] text-[#4D4C7D] font-bold mb-5">
              Assign Maintenance
            </h1>
            <div className="flex justify-between mb-7">
              <div>
                <p className="mb-[8px] text-[16px] text-[#4D4C7D] font-semibold">
                  Tanggal
                </p>
                <Datepicker text="Masukkan Tanggal" />
              </div>
              <div>
                <p className="mb-[8px] text-[16px] text-[#4D4C7D] font-semibold">
                  Staff
                </p>
              </div>
            </div>
            <div className="flex justify-between mb-7">
              <div>
                <p className="mb-[8px] text-[16px] text-[#4D4C7D] font-semibold">
                  Tanggal
                </p>
                <Datepicker text="Masukkan Tanggal" />
              </div>
              <div>
                <p className="mb-[8px] text-[16px] text-[#4D4C7D] font-semibold">
                  Staff
                </p>
              </div>
            </div>
            <p className="mb-[8px] text-[16px] text-[#4D4C7D] font-semibold">
              Detail Maintenance
            </p>
            <div className="flex justify-between mb-7">
              {/* <Checkbox description="AC" label="AC" id="1" /> */}
            </div>
          </div>
        }
      ></Modal>
      <div className=" pt-[136px] px-[100px] font-montserrat">
        <h1 className="text-center text-[#4D4C7D] font-bold text-[64px]">
          MAINTENANCE
        </h1>
        <h2 className="text-center text-[#ED7D31] font-bold text-[36px]">
          Jumlah Maintenance: {maintenanceData.length}
        </h2>
        <div className="flex flex-1 justify-between mt-[75px] mb-4">
          <div className="flex">
            <Search style=" mr-[24px]" placeholder="Cari Jadwal Maintenance" />
            <Button type="button" text="Filter" />
          </div>
          <Button
            type="button"
            text="Assign Maintenance"
            onClick={() => setShowAssignMaintenance(true)}
          />
        </div>
        <Table data={tableData} header={kolomStaff} isLoading={false} />
        <div className="flex w-full justify-center">
          <div className="flex justify-center">
            <Paginate
              current={(page) => setPageMaintenance(page)}
              totalPages={totalPages}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Maintenance;
