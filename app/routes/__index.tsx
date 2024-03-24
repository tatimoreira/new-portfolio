import { DateTime } from "luxon";
import Navbar from "../components/navigation/Navbar";
import { NavLink, Outlet } from "@remix-run/react";
import Toggle from "~/components/themeToggle/toggle";
import { MenuItems } from "~/components/navigation/MenuItems";

export const menu = [
  <NavLink
    key="messages"
    to="/messages"
    style={({ isActive, isPending }) => {
      return {
        fontWeight: isActive ? "bold" : "",
        color: isPending ? "red" : "black",
      };
    }}
  >
    Messages
  </NavLink>,
  <NavLink
    key="messages"
    to="/messages"
    style={({ isActive, isPending }) => {
      return {
        fontWeight: isActive ? "bold" : "",
        color: isPending ? "red" : "black",
      };
    }}
  >
    Messages
  </NavLink>,
];



export default function Index() {
  return (
    <div>

      <main className="min-h-screen bg-white backdrop-blur-sm dark:bg-black sm:items-center sm:justify-center ">
        <div
          className="w-screen h-screen pattern-dots pattern-black dark:pattern-white pattern-bg-transparent pattern-opacity-90 pattern-size-4"
        >
          <Toggle />
          <div className="flex w-full flex-col items-center  sm:p-40">
            <div className="relative  m-9">
              <Outlet />
            </div>
            <div className=" flex items-center p-3 ">
              <Navbar links={MenuItems} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
