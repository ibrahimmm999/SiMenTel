import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import Logo from "/assets/logo.svg";
import { useEventListener } from "usehooks-ts";
import { supabase } from "../lib/api";
import { toastError } from "./toast";
import User from "../interfaces/user";
import Cookies from "js-cookie";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [navOpen, setNavOpen] = useState(false);
  const [isAccount, setAccount] = useState(false);

  const documentRef = useRef<Document>(document);
  const onClickAccount = (event: Event) => {
    let cekAccount = true;
    const doc = document.getElementsByClassName("account-detail");
    for (let index = 0; index < doc.length; index++) {
      cekAccount = cekAccount && event.target != doc[index];
    }
    if (cekAccount) {
      setAccount(false);
    }
  };
  useEventListener("click", onClickAccount, documentRef);
  const onClickHamburger = (event: Event) => {
    let cekHamburger = true;
    const doc = document.getElementsByClassName("hamburger");
    for (let index = 0; index < doc.length; index++) {
      cekHamburger = cekHamburger && event.target != doc[index];
    }
    if (cekHamburger) {
      setNavOpen(false);
    }
  };
  useEventListener("click", onClickHamburger, documentRef);

  useEffect(() => {
    if (location.pathname == "/") {
      setActive(0);
    } else if (location.pathname == "/room") {
      setActive(1);
    } else if (location.pathname == "/maintenance") {
      setActive(2);
    } else if (location.pathname == "/staff") {
      setActive(3);
    } else {
      setActive(-1);
    }
  }, [location.pathname]);

  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", (await supabase.auth.getUser()).data.user?.id)
          .single();

        if (error) {
          throw new Error(`Error fetching user data: ${error.message}`);
        }

        if (data) {
          setUser(data);
        } else {
          throw new Error("User not found");
        }
      } catch (error) {
        toastError(error as string);
      }
    };

    // Call the fetchUser function when the component mounts
    fetchUser();
  }, []);

  const handleLogOut = async () => {
    let { error } = await supabase.auth.signOut();
    if (error) {
      toastError(error.message as string);
    }
    Cookies.remove("token_simentel");
    navigate("/login");
  };

  return (
    <>
      <div className="fixed z-50 flex h-[80px] w-full items-center justify-between bg-white bg-opacity-50 px-3 shadow-md backdrop-blur-sm xl:px-7">
        <button
          type="button"
          className={`${
            navOpen ? "bg-orange-primary" : "bg-white"
          } hamburger absolute z-10 h-[40px] w-[40px] cursor-pointer xl:hidden`}
          onClick={() => setNavOpen(!navOpen)}
        >
          <span
            className={`${
              navOpen
                ? "top-[1.2em] h-[2px] rotate-[135deg] transition"
                : "top-[0.7em] h-[3px]"
            } hamburger line absolute left-0 right-0 mx-auto h-[3px] w-[20px] rounded-xl ${
              navOpen ? "bg-white" : "bg-orange-primary"
            } duration-300 ease-in-out`}
          ></span>
          <span
            id="span2"
            className={`${
              navOpen ? "h-[2px] scale-0 transition" : "top-[1.2em] h-[3px]"
            } hamburger line absolute left-0 right-0 mx-auto h-[3px] w-[20px] rounded-xl ${
              navOpen ? "bg-white" : "bg-orange-primary"
            } duration-300 ease-in-out`}
          ></span>
          <span
            id="span3"
            className={`${
              navOpen
                ? "top-[1.2em] h-[2px] rotate-45 transition"
                : "top-[1.7em] h-[3px]"
            } hamburger line absolute left-0 right-0 mx-auto h-[3px] w-[20px] rounded-xl ${
              navOpen ? "bg-white" : "bg-orange-primary"
            } duration-300 ease-in-out`}
          ></span>
        </button>
        <NavLink to="/">
          <img
            src={Logo}
            alt="Simentel"
            className="hidden h-[66px] p-2 xl:block"
          />
        </NavLink>
        <h1 className="mx-auto text-[24px] font-bold text-purple-primary xl:hidden">
          {active == 0
            ? "Home"
            : active == 1
            ? "Room"
            : active == 2
            ? "Maintenance"
            : active == 3
            ? "Staff"
            : ""}
        </h1>
        <div
          className={`${
            navOpen
              ? "translate-x-0 shadow-lg"
              : "-translate-x-full xl:translate-x-0 shadow-none"
          } absolute left-0 top-0 h-screen w-[90%] bg-white duration-300 ease-in-out md:w-[70%] xl:static xl:block xl:h-auto xl:w-auto xl:bg-transparent xl:py-0 xl:shadow-none`}
        >
          <NavLink to="/">
            <img
              src={Logo}
              alt="Simentel"
              className="mx-auto mb-7 mt-5 h-[40px] xl:hidden"
            />
          </NavLink>
          <div className="flex flex-col gap-[8px] px-7 xl:mt-0 xl:flex-row xl:items-center xl:gap-[16px] xl:px-0 ">
            <NavLink
              to="/"
              className={`${
                active == 0 ? "text-orange-primary" : "text-purple-primary"
              } rounded-[10px] p-3 text-[16px] font-bold hover:bg-orange-primary hover:text-white`}
            >
              Home
            </NavLink>
            <NavLink
              to="/room"
              className={`${
                active == 1 ? "text-orange-primary" : "text-purple-primary"
              } rounded-[10px] p-3 text-[16px] font-bold hover:bg-orange-primary hover:text-white`}
            >
              Room
            </NavLink>
            <NavLink
              to="/maintenance"
              className={`${
                active == 2 ? "text-orange-primary" : "text-purple-primary"
              } rounded-[10px] p-3 text-[16px] font-bold hover:bg-orange-primary hover:text-white`}
            >
              Maintenance
            </NavLink>
            <NavLink
              to="/staff"
              className={`${
                active == 3 ? "text-orange-primary" : "text-purple-primary"
              } rounded-[10px] p-3 text-[16px] font-bold hover:bg-orange-primary hover:text-white `}
            >
              Staff
            </NavLink>
            <div className="hidden h-12 w-[1px] bg-mono-light_grey xl:block"></div>
            <div className="account-detail group p-3 mt-[60%] xl:mt-0">
              <>
                <div
                  className="account-detail hamburger flex cursor-pointer items-center"
                  onClick={() => setAccount(!isAccount)}
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${user?.name}&color=FD6701&background=FFD7BC`}
                    className="account-detail hamburger h-12 w-12 shrink-0 rounded-full"
                    alt="Profile"
                  />
                  <div className="account-detail hamburger ml-3">
                    <p className="hamburger account-detail w-[160px] overflow-hidden text-ellipsis whitespace-nowrap text-[16px] font-bold text-purple-primary xl:group-hover:text-orange-primary md:w-[350px] xl:w-[180px]">
                      {user?.name}
                    </p>
                    <p className="hamburger account-detail text-[14px] text-purple-primary xl:group-hover:text-orange-primary">
                      {user?.role}
                    </p>
                  </div>
                </div>
                <div
                  className={`block xl:${
                    isAccount ? "block" : "hidden"
                  } relative w-full bg-white xl:p-3 xl:shadow-lg xl:absolute xl:translate-y-4`}
                >
                  <div
                    onClick={handleLogOut}
                    className="mt-4 xl:mt-0 cursor-pointer p-3 text-[16px] font-bold text-red-primary hover:text-orange-secondary"
                  >
                    Keluar
                  </div>
                </div>
              </>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
