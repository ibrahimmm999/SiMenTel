import Button from "../../components/button";
import Table from "../../components/table";
import Paginate from "../../components/paginate";
import Status from "../../components/status";
import { useState, useEffect, useRef } from "react";
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
import Facility from "../../interfaces/facility";
import React from "react";

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

  const [listDetail, setListDetail] = useState<
    { value: string; label: string }[]
  >([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [staffOptions, setStaffOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [roomOptions, setRoomOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [facilities] = useState<Facility[]>([]);
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
  const handleRuanganChange = async (selectedRuangan: string) => {
    try {
      const room_id = roomData.find(
        (room) => room.name === selectedRuangan
      )?.id;
      const { data: facilitiesData, error } = await supabase
        .from("facilities")
        .select("name")
        .eq("room_id", room_id);
      if (error) {
        console.error("Error fetching facilities data:", error);
        return;
      }
      const newListDetail = facilitiesData.map((facility) => ({
        value: facility.name,
        label: facility.name,
      }));
      setListDetail(newListDetail);
    } catch (error) {
      console.error("Error handling room change:", error);
    }
  };

  useEffect(() => {
    const newListDetail = facilities.map((facility) => ({
      value: facility.name,
      label: facility.name,
    }));
    setListDetail(newListDetail);
  }, [facilities]);

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
      if (!tanggal || !ruangan || !staff) {
        toastError("Tanggal, Ruangan, dan Staff harus diisi.");
        setLoading(false);
        return;
      }
      const maintenanceToAdd = {
        assign_time: tanggal?.toISOString() || "",
        work_time: null,
        status: "WAITING",
        evidence_url: null,
        room_id: roomData.find((room) => room.name === ruangan)?.id,
        detail: listDetail
          .filter((detail) => checkboxValues[detail.value])
          .map((selectedDetail) => selectedDetail.value)
          .join(", "),
        user_id: userData.find((user) => user.name === staff)?.id,
      };
      const { data, error } = await supabase
        .from("maintenances")
        .upsert([maintenanceToAdd]);

      const roomToUpdate = roomData.find((room) => room.name === ruangan);
      if (roomToUpdate) {
        await supabase
          .from("rooms")
          .update({ condition_status: true })
          .eq("id", roomToUpdate.id);
      }

      setListDetail([]);
      setCheckboxValues(
        listDetail.reduce(
          (acc, detail) => ({ ...acc, [detail.value]: false }),
          {}
        )
      );
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
    } finally {
    }
  };

  const handleAcceptMaintenance = async (maintenanceId: number) => {
    try {
      setLoading(true);
      const maintenanceData = await supabase
        .from("maintenances")
        .select("detail, room_id")
        .eq("id", maintenanceId)
        .single();

      if (!maintenanceData.data) {
        console.error("Maintenance data not found");
        setLoading(false);
        return;
      }

      const { detail, room_id } = maintenanceData.data;

      // Update condition_status in rooms table
      const roomToUpdate = roomData.find((room) => room.id === room_id);
      if (roomToUpdate) {
        await supabase
          .from("rooms")
          .update({ condition_status: false })
          .eq("id", room_id);
      }

      await supabase
        .from("checks")
        .update({ detail: null })
        .eq("room_id", room_id);

      const detailArray = detail.split(", ");
      for (const facilityName of detailArray) {
        await supabase
          .from("facilities")
          .update({ status: true })
          .eq("room_id", room_id)
          .eq("name", facilityName);
      }

      // Update status in maintenances table
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
          status: "NOT FIXED",
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
          if (existingMaintenance?.evidence_url) {
            const oldFileName = existingMaintenance.evidence_url
              .split("/")
              .pop();
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

  const handleEditMaintenance = async (maintenanceId: number) => {
    try {
      const maintenanceToEdit = maintenanceData.find(
        (maintenance) => maintenance.id === maintenanceId
      );

      if (maintenanceToEdit) {
        const { assign_time, user, room, detail } = maintenanceToEdit;
        const room_id = room?.id;
        const { data: facilitiesData, error: facilitiesError } = await supabase
          .from("facilities")
          .select("name")
          .eq("room_id", room_id);
        if (facilitiesError) {
          console.error("Error fetching facilities data:", facilitiesError);
          toastError("Error fetching facilities data");
          return;
        }

        const newListDetail = facilitiesData.map((facility) => ({
          value: facility.name,
          label: facility.name,
        }));
        setListDetail(newListDetail);
        setTanggal(assign_time ? new Date(assign_time) : null);
        setStaff(user?.name || "");
        setRuangan(room?.name || "");
        const newCheckboxValues: Record<string, boolean> = {};
        newListDetail.forEach((detailOption) => {
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
    } catch (error) {
      console.error("Error handling edit maintenance:", error);
      toastError(error as string);
    }
  };

  const handleSaveEditMaintenance = async () => {
    try {
      setLoading(true);
      if (!tanggal || !ruangan || !staff) {
        toastError("Tanggal, Ruangan, dan Staff harus diisi.");
        setLoading(false);
        return;
      } else {
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
      }
    } catch (error) {
      toastError(error as string);
      fetchData();
      setLoading(false);
      setShowEditPopUp(false);
    }
  };

  const handleCancelModal = (isAdd: boolean) => {
    setListDetail([]);
    setCheckboxValues(
      listDetail.reduce(
        (acc, detail) => ({ ...acc, [detail.value]: false }),
        {}
      )
    );
    isAdd ? setShowAssignMaintenance(false) : setShowEditPopUp(false);
  };

  const modalContentRef = useRef<HTMLDivElement | null>(null);
  const modalContentEditRef = useRef<HTMLDivElement | null>(null);
  const handleModalClose = (event: React.MouseEvent<HTMLDivElement>) => {
    if (
      modalContentRef.current &&
      !modalContentRef.current.contains(event.target as Node)
    ) {
      setShowAssignMaintenance(false);
    }
  };
  const handleModalEditClose = (event: React.MouseEvent<HTMLDivElement>) => {
    if (
      modalContentEditRef.current &&
      !modalContentEditRef.current.contains(event.target as Node)
    ) {
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
        onClose={() => handleModalClose}
        children={
          <div ref={modalContentRef}>
            <h1 className=" text-[40px] text-[#4D4C7D] font-bold mb-5">
              Assign Maintenance
            </h1>
            <p className="mb-[8px] text-[16px] text-[#4D4C7D] font-semibold">
              Tanggal
            </p>
            <Datepicker
              text="Masukkan Tanggal"
              required
              onChange={(val: Date) => setTanggal(val)}
            />
            <div className="flex mb-7 w-full gap-10 mt-4">
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
              <div className="w-[50%]">
                <p className="mb-[8px] text-[16px] text-[#4D4C7D] font-semibold">
                  Ruangan
                </p>
                <Dropdown
                  placeholder="Nama Ruangan"
                  options={roomOptions}
                  onChange={(e) => {
                    setRuangan(e?.value!);
                    handleRuanganChange(e?.value!);
                  }}
                />
              </div>
            </div>
            <p className="text-[16px] text-[#4D4C7D] font-semibold">
              Detail Maintenance
            </p>
            <div className="flex flex-wrap">
              {listDetail.map((detail) => (
                <div key={detail.value} className={" mr-9 mt-4"}>
                  <Checkbox
                    label={detail.label}
                    id={detail.value}
                    checked={checkboxValues[detail.value]}
                    onChange={() => handleCheckboxChange(detail.value)}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-16 gap-4">
              <Button
                type="button"
                color="red"
                text="Batalkan"
                isLoading={loading}
                onClick={() => handleCancelModal(true)}
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
        onClose={() => handleModalEditClose}
        children={
          <div ref={modalContentEditRef}>
            <h1 className=" text-[40px] text-[#4D4C7D] font-bold mb-5">
              Edit Maintenance
            </h1>
            <p className="mb-[8px] text-[16px] text-[#4D4C7D] font-semibold">
              Tanggal
            </p>
            <Datepicker
              defaultValue={tanggal || null}
              text="Masukkan Tanggal"
              required
              onChange={(val: Date) => setTanggal(val)}
            />
            <div className="flex mb-7 w-full gap-10 mt-4">
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
              <div className="w-[50%]">
                <p className="mb-[8px] text-[16px] text-[#4D4C7D] font-semibold">
                  Ruangan
                </p>
                <Dropdown
                  value={roomOptions.find((option) => option.value === ruangan)}
                  placeholder="Nama Ruangan"
                  options={roomOptions}
                  onChange={(e) => {
                    setRuangan(e?.value!);
                    handleRuanganChange(e?.value!);
                  }}
                />
              </div>
            </div>

            <p className="text-[16px] text-[#4D4C7D] font-semibold">
              Detail Maintenance
            </p>
            <div className="flex flex-wrap">
              {listDetail.map((detail) => (
                <div key={detail.value} className={" mr-9 mt-4"}>
                  <Checkbox
                    label={detail.label}
                    id={detail.value}
                    checked={checkboxValues[detail.value]}
                    onChange={() => handleCheckboxChange(detail.value)}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-16 gap-4">
              <Button
                type="button"
                color="red"
                text="Batalkan"
                isLoading={loading}
                onClick={() => {
                  handleCancelModal(false);
                }}
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
        <h1 className="text-center text-[#4D4C7D] font-bold lg:text-[64px] md:text-[36px] text-[28px]">
          MAINTENANCE
        </h1>
        <h2 className="text-center text-[#ED7D31] font-bold lg:text-[36px] md:text-[24px] text-[20px]">
          Jumlah Maintenance:{" "}
          {role === "admin"
            ? maintenanceData.length
            : maintenanceData.filter(
                (item) => item.user?.name === currentUser?.name
              ).length}
        </h2>
        <div className="lg:flex flex-1 justify-between mt-[75px] mb-4">
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
          <div
            className={
              role == "admin" ? "flex items-center mt-4 lg:mt-0" : "hidden"
            }
          >
            <Button
              type="button"
              text="Assign Maintenance"
              onClick={() => setShowAssignMaintenance(true)}
            />
          </div>
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
              totalPages={
                (filteredData.length == 10 ? 0 : 1) +
                Math.floor(filteredData.length / 10)
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default MaintenancePage;
