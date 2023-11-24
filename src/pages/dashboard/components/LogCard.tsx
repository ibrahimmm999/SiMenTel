import { BiLogIn, BiLogOut } from "react-icons/bi";
import Login from "../../login/page";

function LogCard({status}:{status: "Login" | "Logout"}) {
  return (
    <div className="p-4 bg-orange-ternary rounded-[10px] flex gap-3 w-full h-fit items-center">
      <div className="w-10 h-10 rounded-full bg-slate-600"></div>
      <div>
        <p className="text-[16px] font-bold">
          SIKOPENG
        </p>
        <div className={`flex items-center gap-2 text-[14px] ${status == "Login" ? "text-green-primary" : "text-red-primary"}`}>
          {status == "Login" ? <BiLogIn /> : <BiLogOut/>}
          <p className="text-purple-primary font-bold">
            12:30<span className="text-purple-primary font-normal ml-1">12-02-2023</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LogCard;
