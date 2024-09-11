import { DateTime } from "luxon";
import Navbar from "../components/navigation/Navbar";
import { NavLink, Outlet } from "@remix-run/react";
import Toggle from "~/components/themeToggle/toggle";
import { MenuItems } from "~/components/navigation/MenuItems";

export const menu = [
  <NavLink
    key="messages"
    to="/messages"
    style={({ isActive }) => {
      return {
        fontWeight: isActive ? "bold" : "",
      };
    }}
  >
    Messages
  </NavLink>,
  <NavLink
    key="messages"
    to="/messages"
    style={({ isActive }) => {
      return {
        fontWeight: isActive ? "bold" : "",
      };
    }}
  >
    Messages
  </NavLink>,
];



export default function Index() {
  return (
    <div >
      <div className="absolute top-0 -z-10 h-full w-full bg-white">
        <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(173,109,244,0.5)] opacity-50 blur-[80px]">

        </div>
      </div>
      <main className="min-h-screen   backdrop-blur-sm dark:bg-black  ">

        <Toggle />
        <div className=" flex  flex-col items-center sm:p-40">
          <div className="relative  m-9">
            <Outlet />
          </div>
          <Navbar links={MenuItems} />
        </div>
      </main>


    </div>
  );
}
