import { FaLocationDot } from "react-icons/fa6";
import { FiCheckCircle } from "react-icons/fi";
import StackedbarChart from "./components/StackedBarChart";
import LogCard from "./components/LogCard";
import { useEffect, useRef, useState } from "react";
import Datepicker from "../../components/datepicker";
import Textfield from "../../components/textfield";
import Button from "../../components/button";
import Table from "../../components/table";

function Dashboard() {
  const DATA_ROOMS = [
    {
      name: "Vacant",
      data: [10],
      color: "#ED7D31",
    },
    {
      name: "Occupied",
      data: [12],
      color: "#F9B572",
    },
  ];
  const DATA_MAINTENANCE = [
    {
      name: "NOT FIXED",
      data: [10],
      color: "#363062",
    },
    {
      name: "WAITING",
      data: [10],
      color: "#6586C9",
    },
    {
      name: "FIXED",
      data: [12],
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

  const DATA_TABLE = [
    {
      orderNo: 26230000007,
      deliveryNo: 26230000048,
      cabang: "JK2",
      customerNo: 108443,
      deliveryStatus: "ONGOING",
      conditionStatus: "SAFE",
    },
    {
      orderNo: 26230000008,
      deliveryNo: 26230000048,
      cabang: "JK2",
      customerNo: 108443,
      deliveryStatus: "WAITING",
      conditionStatus: "WARNING",
    },
    {
      orderNo: 26230000009,
      deliveryNo: null,
      cabang: "JK2",
      customerNo: 108443,
      deliveryStatus: "UNASSIGNED",
      conditionStatus: "",
    },
    {
      orderNo: 26230000010,
      deliveryNo: null,
      cabang: "JK2",
      customerNo: 108443,
      deliveryStatus: "UNASSIGNED",
      conditionStatus: "",
    },
    {
      orderNo: 26230000011,
      deliveryNo: null,
      cabang: "JK2",
      customerNo: 108443,
      deliveryStatus: "UNASSIGNED",
      conditionStatus: "",
    },
  ];

  const DATA_HEADER = [
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
      <div className="flex flex-col xl:flex-row gap-5 w-full">
        <div
          className="rounded-[10px] px-8 pt-8 xl:w-[77.5%] h-fit"
          style={{ boxShadow: "0px 4px 50px 0px rgba(32, 0, 149, 0.10)" }}
          ref={dashboardContainerRef}
        >
          <h1 className="text-purple-primary font-semibold text-[36px]">
            Dexa Medica Tangerang
          </h1>
          <div className="mt-3 flex gap-3 text-[24px] text-red-primary items-center">
            <FaLocationDot />
            <h2 className="text-purple-primary text-[24px] font-semibold">
              Jl. Pinang Kunciran no. 31, Kel Pinang, Tangerang
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
            className="max-h-full overflow-auto flex-col flex gap-2"
            style={{ height: containerHeight - 88 }}
          >
            <LogCard status="Login" />
            <LogCard status="Logout" />
            <LogCard status="Logout" />
            <LogCard status="Logout" />
            <LogCard status="Logout" />
            <LogCard status="Login" />
            <LogCard status="Login" />
            <LogCard status="Login" />
            <LogCard status="Login" />
            <LogCard status="Login" />
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
        <div className="max-w-[376px] mb-6">
          <label
            htmlFor="date"
            className="text-[24px] text-purple-primary font-bold"
          >
            Search by Date
          </label>
          <Datepicker text={"Cari jadwal maintenance!"} id="date" />
          {/* <div className="max-w-[300px]">
            <Textfield type={"search"} placeholder={"Cari di jadwal hari ini"}/>
          </div>
          <Button type={"button"} text="Lihat Semua"/> */}
        </div>
        <div className="flex gap-4 flex-col md:flex-row ">
          <div className="w-full h-40 xl:w-1/3 xl:h-60 bg-red-primary rounded-xl flex flex-col items-center justify-center font-bold text-white">
            <h1 className="text-[24px] md:text-[36px] xl:text-[64px]">3</h1>
            <h2 className="text-[16px] md:text-[24px] xl:text-[36px]">
              NOT FIXED
            </h2>
          </div>
          <div className="w-full h-40 xl:w-1/3 xl:h-60 bg-orange-primary rounded-xl flex flex-col items-center justify-center font-bold text-white">
            <h1 className="text-[24px] md:text-[36px] xl:text-[64px]">42</h1>
            <h2 className="text-[16px] md:text-[24px] xl:text-[36px]">
              WAITING
            </h2>
          </div>
          <div className="w-full h-40 xl:w-1/3 xl:h-60 bg-green-primary rounded-xl flex flex-col items-center justify-center font-bold text-white">
            <h1 className="text-[24px] md:text-[36px] xl:text-[64px]">42</h1>
            <h2 className="text-[16px] md:text-[24px] xl:text-[36px]">FIXED</h2>
          </div>
        </div>
      </div>
      <h1 className="text-[24px] md:text-[36px] xl:text-[64px] font-bold text-purple-primary mb-6 mt-16">
        MAINTENANCE HARI INI
      </h1>
      <div className="flex justify-between mb-5">
        <div className="w-[300px]">
          <Textfield
            type={"search"}
            placeholder={"Cari di jadwal maintenance"}
          />
        </div>
        <Button type={"button"} text="Lihat Semua" />
      </div>
      <Table data={DATA_TABLE} header={DATA_HEADER} isLoading={false} />
      {/* <div
        className="w-full md:w-[80%] mx-auto"
        style={{ boxShadow: "0px 4px 50px 0px rgba(32, 0, 149, 0.10)" }}
      >
      </div> */}
    </div>
  );
}

export default Dashboard;
