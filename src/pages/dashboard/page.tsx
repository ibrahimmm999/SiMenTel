import { FaLocationDot } from "react-icons/fa6";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";
import StackedbarChart from "./components/StackedBarChart";
import LogCard from "./components/LogCard";
import { useEffect, useRef, useState } from "react";
import Datepicker from "../../components/datepicker";
import Textfield from "../../components/textfield";
import Button from "../../components/button";
import Table from "../../components/table";
import { supabase } from "../../lib/api";
import { useNavigate } from "react-router-dom";
import { toastError } from "../../components/toast";
import Maintenance from "../../interfaces/maintenance";
import User from "../../interfaces/user";
import Status from "../../components/status";

function Dashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  // const [rooms, setRooms] = useState<Room[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [maintenance, setMaintenance] = useState<Maintenance[]>([]);
  // const [filteredRooms, setFilteredRooms] = useState<Room[]>(rooms);
  const [occupancy, setOccupancy] = useState<number[]>([]);
  const [maintenanceStatus, setMaintenanceStatus] = useState<number[]>([]);
  const [maintenanceStatusStaff, setMaintenanceStatusStaff] = useState<
    number[]
  >([]);
  const [maintenanceStatusBox, setMaintenanceStatusBox] = useState<number[]>(
    []
  );
  const [assignmentLog, setAssignmentLog] = useState<any[]>([]);

  const [dataTable, setDataTable] = useState<any[]>([]);
  const [dataTableStaff, setDataTableStaff] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [filteredDataStaff, setFilteredDataStaff] = useState<any[]>([]);
  const [search, setSearch] = useState<string | undefined>("");
  const [trigger, setTrigger] = useState<number>(0);
  const [date, setDate] = useState<Date | null>(null);
  const navigate = useNavigate();

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
      setMaintenance(maintenanceData);
      setUsers(userData);
      var vacant = 0;
      var occupied = 0;
      roomData.map((room) => {
        if (room.occupancy_status == true) {
          return occupied++;
        } else {
          return vacant++;
        }
      });
      setOccupancy([vacant, occupied]);
      let today = new Date();
      const todayDate = today.getDate();
      // console.log(today.getDate());
      setDataTable(
        maintenanceData
          .filter((item: any) => {
            const maintenanceDate = new Date(item.assign_time).getDate();
            return maintenanceDate === todayDate;
          })
          .map((item: any) => {
            const room = roomData.find((room) => room.id === item.room_id);
            const roomName = room ? room.name : "N/A";
            const user = userData.find((user) => user.id === item.user_id);
            const userName = user ? user.name : "N/A";
            const userContact = user ? user.contact : "N/A";

            return {
              id: item.id,
              status: <Status status={item.status} />,
              room_name: roomName,
              detail: item.detail,
              staff: userName,
              contact: userContact,
            };
          })
      );
      setDataTableStaff(
        maintenanceData
          .filter((item: any) => {
            const maintenanceDate = new Date(item.assign_time).getDate();
            return (
              maintenanceDate === todayDate && item.user_id == currentUser?.id
            );
          })
          .map((item: any) => {
            const room = roomData.find((room) => room.id === item.room_id);
            const roomName = room ? room.name : "N/A";
            const user = userData.find((user) => user.id === item.user_id);
            const userName = user ? user.name : "N/A";
            const userContact = user ? user.contact : "N/A";

            return {
              id: item.id,
              status: <Status status={item.status} />,
              room_name: roomName,
              detail: item.detail,
              staff: userName,
              contact: userContact,
            };
          })
      );
      var not_fixed = 0;
      var waiting = 0;
      var fixed = 0;

      maintenanceData.map((maintenance) => {
        if (maintenance.status == "FIXED") {
          return fixed++;
        } else if (maintenance.status == "NOT FIXED") {
          return not_fixed++;
        } else if (maintenance.status == "WAITING") {
          return waiting++;
        }
      });
      setMaintenanceStatus([not_fixed, waiting, fixed]);
      setMaintenanceStatusBox([not_fixed, waiting, fixed]);
      var not_fixed_staff = 0;
      var waiting_staff = 0;
      var fixed_staff = 0;
      maintenanceData
        .filter((item: any) => item.user_id == currentUser?.id)
        .map((maintenance) => {
          if (maintenance.status == "FIXED") {
            return fixed_staff++;
          } else if (maintenance.status == "NOT FIXED") {
            return not_fixed_staff++;
          } else if (maintenance.status == "WAITING") {
            return waiting_staff++;
          }
        });
      setMaintenanceStatusStaff([not_fixed_staff, waiting_staff, fixed_staff]);
      setTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching data:", error);
      toastError("Get data failed!");
    }
  };

  // useEffect(() => {
  //   let today = new Date();
  //   const todayDate = today.getDate();
  //   setDataTableStaff(
  //     maintenance
  //       .filter((item: any) => {
  //         const maintenanceDate = new Date(item.assign_time).getDate();
  //         return (
  //           maintenanceDate === todayDate && item.user_id == currentUser?.id
  //         );
  //       })
  //       .map((item: any) => {
  //         const room = rooms.find((room) => room.id === item.room_id);
  //         const roomName = room ? room.name : "N/A";
  //         const user = users.find((user) => user.id === item.user_id);
  //         const userName = user ? user.name : "N/A";
  //         const userContact = user ? user.contact : "N/A";

  //         return {
  //           id: item.id,
  //           status: <Status status={item.status} />,
  //           room_name: roomName,
  //           detail: item.detail,
  //           staff: userName,
  //           contact: userContact,
  //         };
  //       })
  //   );
  //   var not_fixed_staff = 0;
  //   var waiting_staff = 0;
  //   var fixed_staff = 0;
  //   maintenance
  //     .filter((item: any) => item.user_id == currentUser?.id)
  //     .map((maintenance) => {
  //       if (maintenance.status == "FIXED") {
  //         return fixed_staff++;
  //       } else if (maintenance.status == "NOT FIXED") {
  //         return not_fixed_staff++;
  //       } else if (maintenance.status == "WAITING") {
  //         return waiting_staff++;
  //       }
  //     });
  //   setMaintenanceStatusStaff([not_fixed_staff, waiting_staff, fixed_staff]);
  // }, [currentUser, role]);

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  useEffect(() => {
    if (search != undefined && search != "") {
      setFilteredData(
        dataTable.filter((item: any) =>
          Object.values(item).some((value: any) =>
            String(value).toLowerCase().includes(search.toLowerCase())
          )
        )
      );
      setFilteredDataStaff(
        dataTableStaff.filter((item: any) =>
          Object.values(item).some((value: any) =>
            String(value).toLowerCase().includes(search.toLowerCase())
          )
        )
      );
    } else {
      setFilteredData(dataTable);
      setFilteredDataStaff(dataTableStaff);
    }
  }, [search, trigger, currentUser]);

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

  useEffect(() => {
    if (date) {
      var not_fixed = 0;
      var waiting = 0;
      var fixed = 0;
      const filterDate = date.getDate();
      maintenance
        .filter((item: any) => {
          const maintenanceDate = new Date(item.assign_time).getDate();
          return maintenanceDate === filterDate;
        })
        .map((maintenance) => {
          if (maintenance.status == "FIXED") {
            return fixed++;
          } else if (maintenance.status == "NOT FIXED") {
            return not_fixed++;
          } else if (maintenance.status == "WAITING") {
            return waiting++;
          }
        });
      setMaintenanceStatusBox([not_fixed, waiting, fixed]);
    } else {
      setMaintenanceStatusBox(maintenanceStatus);
    }
  }, [maintenance, date]);

  useEffect(() => {
    let today = new Date();
    const todayDate = today.getDate();
    let equalDate: string;
    setAssignmentLog(
      maintenance
        .filter((item: any) => {
          const assignDate = new Date(item.assign_time).getDate();
          const workDate = new Date(item.work_time).getDate();
          if (workDate === todayDate) {
            equalDate = "work";
          } else if (assignDate == todayDate) {
            equalDate = "assign";
          }
          return workDate === todayDate || assignDate == todayDate;
        })
        .map((maintenance) => ({
          ...maintenance,
          equals: equalDate,
        }))
    );
  }, [maintenance]);

  const DATA_ROOMS = [
    {
      name: "Vacant",
      data: [occupancy[0]],
      color: "#ED7D31",
    },
    {
      name: "Occupied",
      data: [occupancy[1]],
      color: "#F9B572",
    },
  ];
  const DATA_MAINTENANCE = [
    {
      name: "NOT FIXED",
      data: [maintenanceStatus[0]],
      color: "#363062",
    },
    {
      name: "WAITING",
      data: [maintenanceStatus[1]],
      color: "#6586C9",
    },
    {
      name: "FIXED",
      data: [maintenanceStatus[2]],
      color: "#91AFF9",
    },
  ];
  const DATA_MAINTENANCE_STAFF = [
    {
      name: "NOT FIXED",
      data: [maintenanceStatusStaff[0]],
      color: "#363062",
    },
    {
      name: "WAITING",
      data: [maintenanceStatusStaff[1]],
      color: "#6586C9",
    },
    {
      name: "FIXED",
      data: [maintenanceStatusStaff[2]],
      color: "#91AFF9",
    },
  ];

  const dashboardContainerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);

  useEffect(() => {
    const updateContainerSize = () => {
      if (dashboardContainerRef.current) {
        setContainerHeight(dashboardContainerRef.current.offsetHeight);
      }
    };

    // Initial setup
    updateContainerSize();

    // Event listener for window resize
    window.addEventListener("resize", updateContainerSize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateContainerSize);
    };
  }, []);

  const dataHeader = [
    "ID",
    "Status",
    "Nama Ruangan",
    "Detail Maintenance",
    "Staff",
    "Kontak",
  ];

  return (
    <div className="w-full pb-10 bg-background min-h-screen pt-[120PX] px-4 xl:px-24 ">
      <h1 className="text-[24px] md:text-[36px] xl:text-[64px] font-bold text-purple-primary mb-8">
        WELCOME TO SIMENTEL,
      </h1>
      {role == "admin" && (
        <>
          <div className="flex flex-col xl:flex-row gap-5 w-full">
            <div
              className="rounded-[10px] px-8 pt-8 xl:w-[77.5%] h-fit"
              style={{ boxShadow: "0px 4px 50px 0px rgba(32, 0, 149, 0.10)" }}
              ref={dashboardContainerRef}
            >
              <h1 className="text-purple-primary font-semibold text-[36px] flex items-center gap-6">
                Hotel Cemerlang
                <span className="flex gap-1 w-fit text-[24px] text-[#FAB437]">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStarHalfAlt />
                </span>
              </h1>
              <div className="mt-3 flex gap-3 text-[24px] text-red-primary items-center">
                <FaLocationDot />
                <h2 className="text-purple-primary text-[24px] font-semibold">
                  Jl. Kebun Binatang No. 37A
                </h2>
              </div>
              <h2 className="text-purple-primary text-[24px] font-semibold mt-8">
                Facilities
              </h2>
              <div className="flex flex-wrap gap-9 mt-5">
                <div className="text-[32px] flex gap-4 items-center text-green-primary">
                  <FiCheckCircle />
                  <span className="ml-4 text-[16px] text-purple-primary font-medium">
                    Swimming Pool
                  </span>
                </div>
                <div className="text-[32px] flex gap-4 items-center text-green-primary">
                  <FiCheckCircle />
                  <span className="ml-4 text-[16px] text-purple-primary font-medium">
                    Penthouse
                  </span>
                </div>
                <div className="text-[32px] flex gap-4 items-center text-green-primary">
                  <FiCheckCircle />
                  <span className="ml-4 text-[16px] text-purple-primary font-medium">
                    Breakfast
                  </span>
                </div>
              </div>
              <div className="flex justify-between mt-5">
                <h2 className="text-purple-primary text-[24px] font-semibold">
                  Rooms
                </h2>
                <div className="flex gap-[20px] items-center">
                  <div className="flex items-center gap-[10px]">
                    <div className="bg-orange-primary rounded-full w-[20px] h-[20px]"></div>
                    <span className="text-[16px] font-semibold text-purple-primary">
                      Vacant
                    </span>
                  </div>
                  <div className="flex items-center gap-[10px]">
                    <div className="bg-orange-secondary rounded-full w-[20px] h-[20px]"></div>
                    <span className="text-[16px] font-semibold text-purple-primary">
                      Occupied
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative bottom-6 right-6">
                <StackedbarChart data={DATA_ROOMS} category={["Rooms"]} />
              </div>
              <div className="flex justify-between">
                <h2 className="text-purple-primary text-[24px] font-semibold">
                  Maintenance
                </h2>
                <div className="flex gap-[20px] items-center">
                  <div className="flex items-center gap-[10px]">
                    <div className="bg-purple-primary rounded-full w-[20px] h-[20px]"></div>
                    <span className="text-[16px] font-semibold text-purple-primary">
                      NOT FIXED
                    </span>
                  </div>
                  <div className="flex items-center gap-[10px]">
                    <div className="bg-blue-secondary rounded-full w-[20px] h-[20px]"></div>
                    <span className="text-[16px] font-semibold text-purple-primary">
                      WAITING
                    </span>
                  </div>
                  <div className="flex items-center gap-[10px]">
                    <div className="bg-blue-ternary rounded-full w-[20px] h-[20px]"></div>
                    <span className="text-[16px] font-semibold text-purple-primary">
                      FIXED
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative bottom-5 right-6">
                <StackedbarChart
                  data={DATA_MAINTENANCE}
                  category={["Maintenance"]}
                />
              </div>
            </div>
            <div
              className="rounded-[10px] p-4 xl:w-[27.5%] overflow-hidden"
              style={{ boxShadow: "0px 4px 50px 0px rgba(32, 0, 149, 0.10)" }}
            >
              <h3 className="text-[24px] text-purple-primary font-semibold mb-5">
                Assignment Log
              </h3>
              <div
                className="min-h-full overflow-auto flex-col flex gap-2"
                style={{ height: containerHeight - 88 }}
              >
                {assignmentLog.map((item: any) => {
                  let displayTime;
                  let displayDate;
                  let userName =
                    users.find((user: any) => user.id === item.user_id)?.name ||
                    "N/A";

                  if (item.equals === "work") {
                    const workTime = new Date(item.work_time);
                    const hours = workTime
                      .getHours()
                      .toString()
                      .padStart(2, "0");
                    const minutes = workTime
                      .getMinutes()
                      .toString()
                      .padStart(2, "0");

                    displayTime = `${hours}:${minutes}`;
                    displayDate = `${workTime.getDate()}-${
                      workTime.getMonth() + 1
                    }-${workTime.getFullYear()}`;
                  } else if (item.equals === "assign") {
                    const assignTime = new Date(item.assign_time);
                    const hours = assignTime
                      .getHours()
                      .toString()
                      .padStart(2, "0");
                    const minutes = assignTime
                      .getMinutes()
                      .toString()
                      .padStart(2, "0");

                    displayTime = `${hours}:${minutes}`;
                    displayDate = `${assignTime.getDate()}-${
                      assignTime.getMonth() + 1
                    }-${assignTime.getFullYear()}`;
                  }
                  return (
                    <LogCard
                      status={item.status}
                      time={displayTime}
                      date={displayDate}
                      name={userName}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <h1 className="text-[24px] md:text-[36px] xl:text-[64px] font-bold text-purple-primary mb-6 mt-16">
            DATA MAINTENANCE
          </h1>
          <div
            className="w-full md:w-[80%] p-6 bg-white shadow-lg rounded-xl mx-auto"
            style={{ boxShadow: "0px 4px 50px 0px rgba(32, 0, 149, 0.10)" }}
          >
            <div className="flex mb-6 gap-2">
              <div className="max-w-[376px] ">
                <label
                  htmlFor="date"
                  className="text-[24px] text-purple-primary font-bold"
                >
                  Search by Date
                </label>
                <Datepicker
                  text={"Cari jadwal maintenance!"}
                  id="date"
                  onChange={(date) => setDate(date)}
                />
              </div>
              {date && (
                <div className="self-end h-[47.2px] w-[47.2px]">
                  <button
                    type={"button"}
                    className="bg-orange-primary active:bg-orange-primary hover:bg-orange-secondary w-full h-full rounded-[12px] text-white font-bold"
                    onClick={() => setDate(null)}
                  >
                    X
                  </button>
                </div>
              )}
            </div>
            <div className="flex gap-4 flex-col md:flex-row ">
              <div className="w-full h-40 xl:w-1/3 xl:h-60 bg-red-primary rounded-xl flex flex-col items-center justify-center font-bold text-white">
                <h1 className="text-[24px] md:text-[36px] xl:text-[64px]">
                  {maintenanceStatusBox[0]}
                </h1>
                <h2 className="text-[16px] md:text-[24px] xl:text-[36px]">
                  NOT FIXED
                </h2>
              </div>
              <div className="w-full h-40 xl:w-1/3 xl:h-60 bg-orange-primary rounded-xl flex flex-col items-center justify-center font-bold text-white">
                <h1 className="text-[24px] md:text-[36px] xl:text-[64px]">
                  {maintenanceStatusBox[1]}
                </h1>
                <h2 className="text-[16px] md:text-[24px] xl:text-[36px]">
                  WAITING
                </h2>
              </div>
              <div className="w-full h-40 xl:w-1/3 xl:h-60 bg-green-primary rounded-xl flex flex-col items-center justify-center font-bold text-white">
                <h1 className="text-[24px] md:text-[36px] xl:text-[64px]">
                  {maintenanceStatusBox[2]}
                </h1>
                <h2 className="text-[16px] md:text-[24px] xl:text-[36px]">
                  FIXED
                </h2>
              </div>
            </div>
          </div>
        </>
      )}
      {role == "staff" && (
        <div
          className="rounded-[10px] px-8 pt-8 w-full h-fit"
          style={{ boxShadow: "0px 4px 50px 0px rgba(32, 0, 149, 0.10)" }}
          ref={dashboardContainerRef}
        >
          <h1 className="text-purple-primary font-semibold text-[36px] flex items-center gap-6">
            Halo, {currentUser?.name}
          </h1>
          <div className="flex justify-between">
            <h2 className="text-purple-primary text-[24px] font-semibold">
              Maintenance
            </h2>
            <div className="flex gap-[20px] items-center">
              <div className="flex items-center gap-[10px]">
                <div className="bg-purple-primary rounded-full w-[20px] h-[20px]"></div>
                <span className="text-[16px] font-semibold text-purple-primary">
                  NOT FIXED
                </span>
              </div>
              <div className="flex items-center gap-[10px]">
                <div className="bg-blue-secondary rounded-full w-[20px] h-[20px]"></div>
                <span className="text-[16px] font-semibold text-purple-primary">
                  WAITING
                </span>
              </div>
              <div className="flex items-center gap-[10px]">
                <div className="bg-blue-ternary rounded-full w-[20px] h-[20px]"></div>
                <span className="text-[16px] font-semibold text-purple-primary">
                  FIXED
                </span>
              </div>
            </div>
          </div>
          <div className="relative bottom-5 right-6">
            <StackedbarChart
              data={DATA_MAINTENANCE_STAFF}
              category={["Maintenance"]}
            />
          </div>
        </div>
      )}
      <h1 className="text-[24px] md:text-[36px] xl:text-[64px] font-bold text-purple-primary mb-6 mt-16">
        MAINTENANCE HARI INI
      </h1>
      <div className="flex justify-between mb-5">
        <div className="w-[300px]">
          <Textfield
            type={"search"}
            placeholder={"Cari di jadwal maintenance"}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          type={"button"}
          text="Lihat Semua"
          onClick={() => navigate("/maintenance")}
        />
      </div>
      {currentUser?.role == "admin" ? (
        <Table data={filteredData} header={dataHeader} isLoading={false} />
      ) : (
        <Table data={filteredDataStaff} header={dataHeader} isLoading={false} />
      )}
    </div>
  );
}

export default Dashboard;
