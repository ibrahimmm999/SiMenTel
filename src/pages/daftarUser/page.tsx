import { FaFilter } from "react-icons/fa6";
import Button from "../../components/button";
import Paginate from "../../components/paginate";
import Table from "../../components/table";
import Textfield from "../../components/textfield";

function DaftarUser() {
  const column = ["ID", "Nama", "Email", "Role", "Kontak", "Action"];
  const users = [
    {
      id: 1,
      nama: "Komeng",
      email: "komengsutrisna@gmail.com",
      role: "Admin",
      kontak: "089878374932",
      action: "",
    },
    {
      id: 1,
      nama: "Komeng",
      email: "komengsutrisna@gmail.com",
      role: "Admin",
      kontak: "089878374932",
      action: "",
    },
    {
      id: 1,
      nama: "Komeng",
      email: "komengsutrisna@gmail.com",
      role: "Admin",
      kontak: "089878374932",
      action: "",
    },
    {
      id: 1,
      nama: "Komeng",
      email: "komengsutrisna@gmail.com",
      role: "Admin",
      kontak: "089878374932",
      action: "",
    },
    {
      id: 1,
      nama: "Komeng",
      email: "komengsutrisna@gmail.com",
      role: "Admin",
      kontak: "089878374932",
      action: "",
    },
  ];

  return (
    <div className="w-full flex flex-col pb-10 bg-background min-h-screen pt-[120PX] px-4 xl:px-28 gap-12 items-center">
      <h1 className="text-[24px] md:text-[36px] xl:text-[64px] font-bold text-purple-primary text-center">
        DAFTAR USER
        <h2 className="text-[16px] md:text-[24px] xl:text-[36px] text-orange-primary">
          Jumlah Staff : 45
        </h2>
      </h1>
      <div className="w-full md:w-[80%] xl:w-[50%] p-4 bg-white shadow-lg rounded-xl flex gap-4 flex-col md:flex-row">
        <div className="w-full h-36 md:w-1/2 md:h-52 bg-red-primary rounded-xl flex flex-col items-center justify-center font-bold text-white">
          <h1 className="text-[24px] md:text-[36px] xl:text-[64px]">3</h1>
          <h2 className="text-[16px] md:text-[24px] xl:text-[36px]">Admin</h2>
        </div>
        <div className="w-full h-36 md:w-1/2 md:h-52 bg-orange-primary rounded-xl flex flex-col items-center justify-center font-bold text-white">
          <h1 className="text-[24px] md:text-[36px] xl:text-[64px]">42</h1>
          <h2 className="text-[16px] md:text-[24px] xl:text-[36px]">Staff</h2>
        </div>
      </div>
      <div className="xl:px-[10%] w-full">
        <div className="flex justify-between xl:items-center mb-4 flex-col-reverse md:flex-row items-start gap-2 md:gap-0">
          <div className="flex gap-2">
            <Textfield type={"search"} placeholder={"Search"} />
            <Button type={"button"} text="Filter" icon={<FaFilter />} />
          </div>
          <Button type={"button"} text="Add User" />
        </div>
        <Table data={users} header={column} isLoading={false} />
        <Paginate
          totalPages={12}
          current={(curr: number) => console.log(curr)}
        />
      </div>
    </div>
  );
}

export default DaftarUser;
