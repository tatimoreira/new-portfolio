import { DateTime } from "luxon";
import Navbar from "../components/navigation/Navbar";
import { NavLink, Outlet } from "@remix-run/react";
import Toggle from "~/components/themeToggle/toggle";

import Tile from "~/components/Tile";
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
      <div className="absolute top-0 -z-10 h-full w-full  dark:bg-black bg-white">
        <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(173,109,244,0.5)] opacity-50 blur-[80px]">
        </div>
      </div>
      <Toggle />
      <main className="w-full relative min-h-screen   backdrop-blur-sm dark:bg-black  ">
        <section className="w-full grid grid-cols-20 h-screen overflow-y-clip">
          {
            Array.from(Array(20 * 12), i => (
              <Tile key={i} />
            ))}
        </section>
        <div className="pointer-events-none absolute flex flex-col gap-5 items-center justify-center z-10 mb-10 inset-0">
          <div className=" flex  flex-col items-center  pointer-events-auto">
            <div className="relative  m-9">
              <Outlet />
            </div>

            <Navbar links={MenuItems} />
          </div>
        </div>
      </main>
    </div>
  );
}
