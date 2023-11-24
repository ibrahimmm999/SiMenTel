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
import Dropdown from "../../components/dropdown";
import Action from "../../components/action";
import Textfield from "../../components/textfield";
import { useNavigate } from "react-router-dom";
import { FaFile } from "react-icons/fa6";
import { toastError, toastSuccess } from "../../components/toast";

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
    [key: string]: any;
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

  const listDetail = [
    { label: "AC", value: "AC" },
    { label: "Kasur", value: "Kasur" },
    { label: "Lemari", value: "Lemari" },
  ];

  const supabase = createClient(
    "https://iyxelirhnqarhzqluhmw.supabase.co/",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5eGVsaXJobnFhcmh6cWx1aG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA2NjUwNjcsImV4cCI6MjAxNjI0MTA2N30.htNhQMeg7ZyRygze0_1bRKUtsjoy0BKCXjpuCgmxUQw"
  );
  const role: string = "admin"; // DUMMY DATA ROLE

  // Loading
  const [loading, setLoading] = useState(false);

  // Dropdown Staff
  const [staffOptions, setStaffOptions] = useState<
    { value: string; label: string }[]
  >([]);

  // Dropdown Nama Ruangan
  const [roomOptions, setRoomOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [maintenanceData, setMaintenanceData] = useState<Maintenance[]>([]);
  const [roomData, setRoomData] = useState<Room[]>([]);
  const [userData, setUserData] = useState<User[]>([]);
  const [pageMaintenance, setPageMaintenance] = useState(1);
  const [tanggal, setTanggal] = useState<Date | null>();
  const [lokasi, setLokasi] = useState("");
  const [staff, setStaff] = useState("");
  const [ruangan, setRuangan] = useState("");
  const [showAssignMaintenance, setShowAssignMaintenance] = useState(false);
  const [checkboxValues, setCheckboxValues] = useState<Record<string, boolean>>(
    listDetail.reduce((acc, detail) => ({ ...acc, [detail.value]: false }), {})
  );
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async () => {
    try {
      const { data: maintenanceData, error: maintenanceError } = await supabase
        .from("maintenances")
        .select("*");

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
      const combinedData = maintenanceData.map((maintenance) => ({
        ...maintenance,
        room: roomData.find((room) => room.id === maintenance.room_id),
        user: userData.find((user) => user.id === maintenance.user_id),
      }));
      setMaintenanceData(combinedData);
      setRoomData(roomData);
      setUserData(userData);
      setStaffOptions(
        userData.map((user) => ({ value: user.name, label: user.name }))
      );
      setRoomOptions(
        roomData.map((room) => ({ value: room.name, label: room.name }))
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddMaintenance = async () => {
    try {
      setLoading(true);
      const maintenanceToAdd = {
        assign_time: tanggal?.toISOString() || "",
        work_time: null,
        status: "WAITING",
        evidence_url: "-",
        room_id: roomData.find((room) => room.name === ruangan)?.id || 1,
        detail: listDetail
          .filter((detail) => checkboxValues[detail.value])
          .map((selectedDetail) => selectedDetail.value)
          .join(", "),
        user_id: userData.find((user) => user.name === staff)?.id || "",
      };

      const { data, error } = await supabase
        .from("maintenances")
        .upsert([maintenanceToAdd]);

      if (error) {
        toastError("Error adding maintenance data");
        console.error("Error adding maintenance data:", error);
      } else {
        toastSuccess("Data added successfully");
        console.log(data);
      }
      fetchData();
      setLoading(false);
      setShowAssignMaintenance(false);
    } catch (error) {
      toastError(error as string);
      fetchData();
      setLoading(false);
    }
  };

  // const handleDeleteMaintenance = async (maintenanceId: number) => {
  //   try {
  //     setLoading(true);

  //     const { data, error } = await supabase
  //       .from("maintenances")
  //       .delete()
  //       .eq("id", maintenanceId);

  //     if (error) {
  //       console.error("Error deleting maintenance data:", error);
  //     } else {
  //       console.log("Maintenance data deleted successfully:", data);
  //     }

  //     setLoading(false);

  //     fetchData();
  //   } catch (error) {
  //     console.error("Error deleting maintenance data:", error);
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    fetchData();
  }, [pageMaintenance]);

  // isi tabel admin
  const tableDataAdmin = maintenanceData.map((item, index) => [
    index + 1,
    item.assign_time,
    <Status status={item.status} />,
    item.room?.name || "",
    item.room?.floor || "",
    item.detail,
    item.user?.name,
    item.user?.contact,
    <Button
      disable={item.status == "WAITING"}
      type={"button"}
      onClick={() => handleOnClickLaporan(item.evidence_url)}
      icon={<FaFile />}
    />,
    <Action id={item.id} status={item.status} />,
  ]);
  // isi tabel staf
  const tableDataStaf = maintenanceData.map((item, index) => [
    index + 1,
    item.assign_time,
    <Status status={item.status} />,
    item.room?.name || "",
    item.room?.floor || "",
    item.detail,
    <Button
      disable={item.status == "WAITING"}
      type={"button"}
      onClick={() => handleOnClickLaporan(item.evidence_url)}
      icon={<FaFile />}
    />,
  ]);

  const handleCheckboxChange = (id: string) => {
    setCheckboxValues((prevValues) => ({
      ...prevValues,
      [id]: !prevValues[id],
    }));
  };

  const handleOnClickLaporan = (url: string) => {
    navigate(url);
  };

  // paginate
  const indexOfLastItem = currentPage * 10;
  const indexOfFirstItem = indexOfLastItem - 10;
  const currentItems = (
    role === "admin" ? tableDataAdmin : tableDataStaf
  ).slice(indexOfFirstItem, indexOfLastItem);

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
            <div className="flex mb-7 w-full gap-10">
              <div className="w-1/2">
                <p className="mb-[8px] text-[16px] text-[#4D4C7D] font-semibold">
                  Tanggal
                </p>
                <Datepicker
                  text="Masukkan Tanggal"
                  required
                  onChange={(val: Date) => setTanggal(val)}
                />
              </div>
              <div className="w-1/2">
                <p className="mb-[8px] text-[16px] text-[#4D4C7D] font-semibold">
                  Staff
                </p>
                <Dropdown
                  required
                  placeholder="Nama Staff"
                  options={staffOptions}
                  onChange={(e) => setStaff(e?.value!)}
                />
              </div>
            </div>
            <div className="flex w-full gap-10 mb-7">
              <div className="w-[50%]">
                <p className="mb-[8px] text-[16px] text-[#4D4C7D] font-semibold">
                  Ruangan
                </p>
                <Dropdown
                  placeholder="Nama Ruangan"
                  options={roomOptions}
                  onChange={(e) => setRuangan(e?.value!)}
                />
              </div>
              <div className="w-1/2">
                <p className="mb-[8px] text-[16px] text-[#4D4C7D] font-semibold">
                  Detail Maintenance
                </p>
                <div className="flex mt-6">
                  {listDetail.map((detail) => (
                    <Checkbox
                      key={detail.value}
                      label={detail.label}
                      id={detail.value}
                      checked={checkboxValues[detail.value]}
                      onChange={() => handleCheckboxChange(detail.value)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-16 gap-4">
              <Button
                type="button"
                color="red"
                text="Batalkan"
                isLoading={loading}
                onClick={() => setShowAssignMaintenance(false)}
              />
              <Button
                isLoading={loading}
                type="submit"
                color="green"
                text="Tambah Data"
                onClick={handleAddMaintenance}
              />
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
          <div className="flex relative">
            <Search style="mr-[24px]" placeholder="Cari Jadwal Maintenance" />
            <Button type="button" text="Filter" />
          </div>
          <Button
            type="button"
            text="Assign Maintenance"
            onClick={() => setShowAssignMaintenance(true)}
          />
        </div>
        <Table
          data={currentItems}
          header={role === "admin" ? kolomAdmin : kolomStaff}
          isLoading={false}
        />
        <div className="flex w-full justify-center">
          <div className="flex justify-center">
            <Paginate
              current={(currentPage) => setCurrentPage(currentPage)}
              totalPages={2}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Maintenance;
