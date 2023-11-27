import { useEffect, useState } from "react";
import Button from "../../components/button";
import Navbar from "../../components/navbar";
import { supabase } from "../../lib/api";
import FacilityCard from "./component/facility";
import Room from "../../interfaces/room";
import { toastError, toastSuccess } from "../../components/toast";
import Facility from "../../interfaces/facility";
import { FormatRupiah } from "@arismun/format-rupiah";
import User from "../../interfaces/user";
import { useNavigate, useParams } from "react-router-dom";
import Checkbox from "../../components/checkbox";
import Datepicker from "../../components/datepicker";
import Dropdown from "../../components/dropdown";
import Modal from "../../components/modal";

function DetailRoom() {
  const [room, setRoom] = useState<Room | null>(null);
  const [facility, setFacility] = useState<Facility[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<User[]>([]);
  const [staffOptions, setStaffOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [fileDataURL, setFileDataURL] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [check, setCheck] = useState<boolean>(false);
  const [staff, setStaff] = useState("");
  const [showAssignMaintenance, setShowAssignMaintenance] = useState(false);
  const [checkboxValues, setCheckboxValues] = useState<Record<string, boolean>>(
    facility.reduce((acc, detail) => ({ ...acc, [detail.name]: false }), {})
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tanggal, setTanggal] = useState<Date | null>();
  const params = useParams();
  const navigate = useNavigate();

  const handleCheckboxChange = (id: string) => {
    setCheckboxValues((prevValues) => ({
      ...prevValues,
      [id]: !prevValues[id],
    }));
  };

  const handleAddMaintenance = async () => {
    setIsLoading(true);
    try {
      const maintenanceToAdd = {
        assign_time: tanggal?.toISOString() || "",
        work_time: null,
        status: "WAITING",
        evidence_url: "-",
        room_id: params.idx,
        detail: facility
          .filter((detail) => checkboxValues[detail.name])
          .map((selectedDetail) => selectedDetail.name)
          .join(", "),
        user_id: userData.find((user) => user.name === staff)?.id || "",
      };

      const { error } = await supabase
        .from("maintenances")
        .upsert([maintenanceToAdd]);

      if (error) {
        toastError("Error adding maintenance data");
      } else {
        toastSuccess("Data added successfully");
        updateConditionRoom();
      }
      setShowAssignMaintenance(false);
    } catch (error) {
      toastError(error as string);
    } finally {
      setIsLoading(false);
    }
  };

  const updateConditionRoom = async () => {
    try {
      const { error } = await supabase
        .from("rooms")
        .update({ condition_status: true })
        .eq("id", params.idx);
      if (error) {
        throw new Error(`Error add checks data: ${error.message}`);
      }
    } catch (error) {}
  };

  const handleAddCheck = async () => {
    setIsLoading(true);
    try {
      if (checkboxValues) {
        const { error } = await supabase
          .from("checks")
          .update({
            detail: facility
              .filter((detail) => checkboxValues[detail.name])
              .map((selectedDetail) => selectedDetail.name)
              .join(", "),
            room_id: params.idx,
          })
          .eq("room_id", params.idx);
        if (error) {
          throw new Error(`Error add checks data: ${error.message}`);
        } else {
          toastSuccess("Add Checks Success");
          facility
            .filter((detail) => checkboxValues[detail.name])
            .map((selectedDetail) => {
              updateFacilityCheck(selectedDetail.id);
            });
          setCheck(false);
        }
      }
    } catch (error) {
      toastError(error as string);
    } finally {
      setIsLoading(false);
      window.location.reload();
    }
  };

  const updateFacilityCheck = async (id: number) => {
    try {
      const { error } = await supabase
        .from("facilities")
        .update({ status: false })
        .eq("id", id);

      if (error) {
        throw new Error(`Error update facility data: ${error.message}`);
      }
    } catch (error) {}
  };

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
      console.log(currentUser);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const { data, error } = await supabase
          .from("rooms")
          .select()
          .eq("id", params.idx)
          .single();

        if (error) {
          throw new Error(`Error fetching room data: ${error.message}`);
        }

        if (data) {
          setRoom(data);
          setFileDataURL(data.photo_url);
        } else {
          throw new Error("Room not found");
        }
      } catch (error) {
        toastError(error as string);
      }
    };

    fetchRoom();
  }, []);

  const fetchAllUser = async () => {
    try {
      const { data, error } = await supabase.from("users").select("*");
      if (error) {
        throw new Error(`Error fetching room data: ${error.message}`);
      } else {
        console.log(data);
        setUserData(data);
        setStaffOptions(
          userData.map((data) => ({ value: data.name, label: data.name }))
        );
      }
    } catch (error) {
      toastError(error as string);
    }
  };

  const fetchFacility = async () => {
    try {
      const { data, error } = await supabase
        .from("facilities")
        .select()
        .eq("room_id", params.idx);

      if (error) {
        throw new Error(`Error fetching facility data: ${error.message}`);
      }

      console.log(data);

      if (data) {
        setFacility(data);
        setCheckboxValues(
          data.reduce(
            (acc, detail) => ({ ...acc, [detail.name]: !detail.status }),
            {}
          )
        );
      } else {
        throw new Error("Facilities not found");
      }
    } catch (error) {
      toastError(error as string);
    }
  };

  useEffect(() => {
    fetchFacility();
  }, [check]);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchAllUser();
  }, []);

  return (
    <>
      <Modal
        visible={showAssignMaintenance}
        onClose={() => setShowAssignMaintenance(false)}
        children={
          <div>
            <h1 className=" text-[40px] text-[#4D4C7D] font-bold mb-5">
              Assign Maintenance {room && room.name}
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
            <div className="w-full mb-7">
              <p className="mb-[8px] text-[16px] text-[#4D4C7D] font-semibold">
                Detail Maintenance
              </p>
              <div className="flex mt-6 gap-4">
                {facility.map((detail) => (
                  <Checkbox
                    label={detail.name}
                    id={detail.name}
                    checked={checkboxValues[detail.name]}
                    onChange={() => handleCheckboxChange(detail.name)}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end mt-16 gap-4">
              <Button
                type="button"
                color="red"
                text="Batalkan"
                isLoading={isLoading}
                onClick={() => setShowAssignMaintenance(false)}
              />
              <Button
                isLoading={isLoading}
                type="submit"
                color="green"
                text="Tambah Data"
                onClick={handleAddMaintenance}
              />
            </div>
          </div>
        }
      ></Modal>
      <div className="w-full flex flex-col pb-10">
        <Navbar />
        <div className="w-full mt-[120PX] flex px-28 gap-24">
          <img
            src={fileDataURL}
            alt=""
            className="w-[560px] h-[390px] max-h-[390px] rounded-lg"
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
                  Price: {room && <FormatRupiah value={room.price} />}
                </p>
                {role == "admin" ? (
                  <Button
                    type={"button"}
                    text="Edit Detail"
                    onClick={() => navigate(`edit`)}
                  />
                ) : (
                  ""
                )}
              </div>
              <hr className=" h-1 bg-black" />
            </div>
          </div>
        </div>
        <div className="w-full flex justify-between items-center px-28 mt-12">
          <p className="text-[32px] font-medium">Facilities</p>
          <div className="flex gap-4">
            <div className={`${check ? "block" : "hidden"}`}>
              <Button
                type={"button"}
                text="Cancel"
                color="red"
                onClick={() => setCheck(false)}
              />
            </div>
            <div className={`${room?.condition_status ? "hidden" : "block"}`}>
              <Button
                type={"button"}
                text={
                  role == "admin"
                    ? "Add Maintenance"
                    : check
                    ? "Submit Check"
                    : "Add Check"
                }
                onClick={
                  role == "admin"
                    ? () => setShowAssignMaintenance(true)
                    : check
                    ? handleAddCheck
                    : () => setCheck(true)
                }
                isLoading={isLoading}
              />
            </div>
            <div className={`${room?.condition_status ? "block" : "hidden"}`}>
              <Button
                type={"button"}
                color="secondary"
                text="Under Maintenance"
                onClick={() => navigate("/maintenance")}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-14 mt-8 flex-wrap px-28">
          {facility &&
            facility.map((row: any) =>
              check ? (
                <Checkbox
                  label={row.name}
                  id={row.name}
                  checked={checkboxValues[row.name]}
                  onChange={() => handleCheckboxChange(row.name)}
                />
              ) : (
                <FacilityCard status={row.status} name={row.name} />
              )
            )}
        </div>
      </div>
    </>
  );
}

export default DetailRoom;
