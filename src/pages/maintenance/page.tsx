import Button from "../../components/button";
import Table from "../../components/table";
import Paginate from "../../components/paginate";
import Status from "../../components/status";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/api";
import Modal from "../../components/modal";
import Datepicker from "../../components/datepicker";
import Checkbox from "../../components/checkbox";
import Dropdown from "../../components/dropdown";
import Action from "../../components/action";
import { MdOutlineFileUpload } from "react-icons/md";
import { FaFile } from "react-icons/fa6";
import { toastError, toastSuccess } from "../../components/toast";
import Textfield from "../../components/textfield";
import Room from "../../interfaces/room";
import User from "../../interfaces/user";
import Maintenance from "../../interfaces/maintenance";

function MaintenancePage() {
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

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);

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

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [roomData, setRoomData] = useState<Room[]>([]);
  const [userData, setUserData] = useState<User[]>([]);
  const [tanggal, setTanggal] = useState<Date | null>();
  const [staff, setStaff] = useState("");
  const [ruangan, setRuangan] = useState("");
  const [showAssignMaintenance, setShowAssignMaintenance] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showEditPopUp, setShowEditPopUp] = useState<boolean>(false);
  const [maintenanceData, setMaintenanceData] = useState<Maintenance[]>([]);

  const [editMaintenanceData, setEditMaintenanceData] =
    useState<Maintenance | null>(null);
  const [checkboxValues, setCheckboxValues] = useState<Record<string, boolean>>(
    listDetail.reduce((acc, detail) => ({ ...acc, [detail.value]: false }), {})
  );
  const [checkedColumns, setCheckedColumns] = useState<Record<string, boolean>>(
    kolomAdmin.reduce((acc, column) => ({ ...acc, [column]: true }), {})
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
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
        setRole(data?.role || null);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

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

  const handleAcceptMaintenance = async (maintenanceId: number) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("maintenances")
        .update({
          status: "FIXED",
        })
        .eq("id", maintenanceId);
      if (error) {
        toastError("Error Accepting Maintenance");
        console.error("Error accepting maintenance:", error);
      } else {
        toastSuccess("Maintenance accepted");
        console.log("Maintenance accepted successfully:", data);
      }
      setLoading(false);
      fetchData();
    } catch (error) {
      console.error("Error accepting maintenance:", error);
      setLoading(false);
    }
  };

  const handleRejecttMaintenance = async (
    maintenanceId: number,
    evidenceUrl: string
  ) => {
    try {
      setLoading(true);
      const fileName = evidenceUrl.split("/").pop();
      const { data: dataFile, error: errorDelete } = await supabase.storage
        .from("evidence")
        .remove([`public/${fileName}`]);
      if (errorDelete) {
        console.error("Error deleting file from storage:", errorDelete);
      } else {
        console.log("File deleted successfully:", dataFile);
      }
      const { data, error } = await supabase
        .from("maintenances")
        .update({
          status: "WAITING",
          evidence_url: null,
        })
        .eq("id", maintenanceId);
      if (error) {
        console.error("Error rejecting maintenance:", error);
      } else {
        toastError("Maintenance rejected");
        console.log("Maintenance rejected successfully:", data);
      }
      setLoading(false);
      fetchData();
    } catch (error) {
      console.error("Error rejecting maintenance:", error);
      setLoading(false);
    }
  };

  const handleDeleteMaintenance = async (maintenanceId: number) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("maintenances")
        .delete()
        .eq("id", maintenanceId);
      if (error) {
        console.error("Error deleting maintenance data:", error);
      } else {
        toastSuccess("Maintenance data deleted");
        console.log("Maintenance data deleted successfully:", data);
      }
      setLoading(false);
      fetchData();
    } catch (error) {
      console.error("Error deleting maintenance data:", error);
      setLoading(false);
    }
  };

  const handleFileUpload = async (maintenanceId: number) => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".pdf";
      input.click();

      input.addEventListener("change", async (e) => {
        const selectedFile = (e.target as HTMLInputElement).files?.[0];

        if (selectedFile) {
          setLoading(true);
          toastSuccess(selectedFile?.name);
          // Fetch existing maintenance data
          const { data: existingMaintenance, error: existingMaintenanceError } =
            await supabase
              .from("maintenances")
              .select("evidence_url")
              .eq("id", maintenanceId)
              .single();

          if (existingMaintenanceError) {
            console.error(
              "Error fetching existing maintenance data:",
              existingMaintenanceError
            );
            toastError("Error fetching existing maintenance data");
            setLoading(false);
            return;
          }

          // Check if evidence_url in existing maintenance data is not null
          if (existingMaintenance?.evidence_url) {
            const oldFileName = existingMaintenance.evidence_url
              .split("/")
              .pop();
            // Remove the old file from Supabase storage
            const { data: deleteData, error: deleteError } =
              await supabase.storage
                .from("evidence")
                .remove([`public/${oldFileName}`]);

            if (deleteError) {
              console.error(
                "Error deleting old file from storage:",
                deleteError
              );
              toastError("Error deleting old file from storage");
              setLoading(false);
              return;
            } else {
              console.log("Old file deleted successfully:", deleteData);
            }
          }

          const { data: fileData, error: fileError } = await supabase.storage
            .from("evidence")
            .upload(`public/${selectedFile.name}`, selectedFile, {
              cacheControl: "3600",
              upsert: false,
            });

          if (fileError) {
            console.error("Error uploading file:", fileError);
            toastError(fileError.message);
          } else {
            console.log("File uploaded successfully:", fileData);
            toastSuccess("File uploaded successfully");

            const { data } = supabase.storage
              .from("evidence")
              .getPublicUrl(`public/${selectedFile.name}`);

            const { data: updateData, error: updateError } = await supabase
              .from("maintenances")
              .update({
                evidence_url: data.publicUrl,
                status: "REVIEW",
                work_time: new Date().toISOString(),
              })
              .eq("id", maintenanceId);

            if (updateError) {
              console.error("Error updating maintenance data:", updateError);
              toastError("Error updating maintenance data");
            } else {
              console.log("Maintenance data updated successfully:", updateData);
              fetchData();
            }
          }
        }

        setLoading(false);
      });
    } catch (error) {
      console.error("Error handling file upload:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // isi tabel admin
  const tableDataAdmin = maintenanceData.map((item, index) => {
    const filteredColumns = kolomAdmin.filter(
      (column) => checkedColumns[column]
    );
    return [
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
        isLoading={loading}
        onClick={() => handleOnClickLaporan(item.evidence_url)}
        icon={<FaFile />}
      />,
      <Action
        loading={loading}
        id={item.id.toString()}
        status={item.status}
        onChangeEdit={(id) => {
          handleEditMaintenance(parseInt(id));
        }}
        onChangeDelete={(id) => handleDeleteMaintenance(parseInt(id))}
        onChangeAccept={(id) => handleAcceptMaintenance(parseInt(id))}
        onChangeReject={(id) =>
          handleRejecttMaintenance(parseInt(id), item.evidence_url)
        }
      />,
    ].filter((_, i) => filteredColumns.includes(kolomAdmin[i]));
  });

  // isi tabel staf
  const tableDataStaf = maintenanceData
    .filter((item) => item.user?.name === currentUser?.name)
    .map((item, index) => {
      const filteredColumns = kolomStaff.filter(
        (column) => checkedColumns[column]
      );
      return [
        index + 1,
        item.assign_time,
        <Status status={item.status} />,
        item.room?.name || "",
        item.room?.floor || "",
        item.detail,
        <Button
          isLoading={loading}
          disable={item.status === "FIXED"}
          type="button"
          onClick={() => handleFileUpload(item.id)}
          icon={<MdOutlineFileUpload />}
        />,
      ].filter((_, i) => filteredColumns.includes(kolomStaff[i]));
    });

  const filteredData = (
    role === "admin" ? tableDataAdmin : tableDataStaf
  ).filter((item) => {
    const values = Object.values(item).join(" ").toLowerCase();
    return values.includes(searchTerm.toLowerCase());
  });
  const handleColumnCheckboxChange = (column: string) => {
    setCheckedColumns((prevCheckedColumns) => ({
      ...prevCheckedColumns,
      [column]: !prevCheckedColumns[column],
    }));
  };
  const handleCheckboxChange = (id: string) => {
    setCheckboxValues((prevValues) => ({
      ...prevValues,
      [id]: !prevValues[id],
    }));
  };

  const handleOnClickLaporan = (url: string) => {
    window.open(url, "_blank");
  };

  const handleEditMaintenance = (maintenanceId: number) => {
    const maintenanceToEdit = maintenanceData.find(
      (maintenance) => maintenance.id === maintenanceId
    );
    if (maintenanceToEdit) {
      const { assign_time, user, room, detail } = maintenanceToEdit;
      setTanggal(assign_time ? new Date(assign_time) : null);
      setStaff(user?.name || "");
      setRuangan(room?.name || "");
      const newCheckboxValues: Record<string, boolean> = {};
      listDetail.forEach((detailOption) => {
        newCheckboxValues[detailOption.value] = detail.includes(
          detailOption.value
        );
      });
      setCheckboxValues(newCheckboxValues);
      setEditMaintenanceData(maintenanceToEdit);
      setShowEditPopUp(true);
    } else {
      console.error(`Maintenance with ID ${maintenanceId} not found.`);
    }
  };

  const handleSaveEditMaintenance = async () => {
    try {
      setLoading(true);
      if (editMaintenanceData) {
        const existingMaintenance = await supabase
          .from("maintenances")
          .select("*")
          .eq("id", editMaintenanceData.id)
          .single();
        if (existingMaintenance.data) {
          const updatedMaintenance = {
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

          const { data: updateData, error: updateError } = await supabase
            .from("maintenances")
            .update(updatedMaintenance)
            .eq("id", editMaintenanceData.id);
          if (updateError) {
            toastError("Error updating maintenance data");
            console.error("Error updating maintenance data:", updateError);
          } else {
            toastSuccess("Data updated successfully");
            console.log(updateData);
          }
        } else {
          console.log("data not found");
        }

        fetchData();
        setLoading(false);
        setShowEditPopUp(false);
      } else {
        console.error("No maintenance data to edit.");
        setLoading(false);
      }
    } catch (error) {
      toastError(error as string);
      fetchData();
      setLoading(false);
      setShowEditPopUp(false);
    }
  };

  // paginate
  const indexOfLastItem = currentPage * 10;
  const indexOfFirstItem = indexOfLastItem - 10;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

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
      <Modal
        visible={showEditPopUp}
        onClose={() => setShowEditPopUp(!showEditPopUp)}
        children={
          <div>
            <h1 className=" text-[40px] text-[#4D4C7D] font-bold mb-5">
              Edit Maintenance
            </h1>
            <div className="flex mb-7 w-full gap-10">
              <div className="w-1/2">
                <p className="mb-[8px] text-[16px] text-[#4D4C7D] font-semibold">
                  Tanggal
                </p>
                <Datepicker
                  defaultValue={tanggal || null}
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
                  value={staffOptions.find((option) => option.value === staff)}
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
                  value={roomOptions.find((option) => option.value === ruangan)}
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
                onClick={() => setShowEditPopUp(false)}
              />
              <Button
                isLoading={loading}
                type="submit"
                color="green"
                text="Edit Data"
                onClick={handleSaveEditMaintenance}
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
          Jumlah Maintenance:{" "}
          {role === "admin"
            ? maintenanceData.length
            : maintenanceData.filter(
                (item) => item.user?.name === currentUser?.name
              ).length}
        </h2>
        <div className="flex flex-1 justify-between mt-[75px] mb-4">
          <div className="flex gap-3 items-center">
            <Textfield
              type={"search"}
              placeholder={"Search"}
              onChange={handleSearchChange}
              value={searchTerm}
            />
            <div className="relative">
              <Button
                type="button"
                text="Filter"
                onClick={() => setShowFilter(!showFilter)}
              />
              {showFilter && (
                <ul className="absolute z-10 max-h-[600%] w-[250%] overflow-auto rounded-lg bg-white bg-opacity-50 px-4 shadow-card backdrop-blur-md">
                  {(role == "admin" ? kolomAdmin : kolomStaff).map((item) => (
                    <li className="my-4 flex cursor-pointer items-center gap-2 hover:text-kOrange-300">
                      <div>
                        <Checkbox
                          key={item}
                          label={item}
                          id={item}
                          checked={checkedColumns[item]}
                          onChange={() => handleColumnCheckboxChange(item)}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <Button
            type="button"
            text="Assign Maintenance"
            onClick={() => setShowAssignMaintenance(true)}
          />
        </div>
        <Table
          data={currentItems}
          header={(role == "admin" ? kolomAdmin : kolomStaff).filter(
            (column) => checkedColumns[column]
          )}
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

export default MaintenancePage;
