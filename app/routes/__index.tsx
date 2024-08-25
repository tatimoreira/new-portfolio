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
    <div>

      <main className="min-h-screen bg-white backdrop-blur-sm dark:bg-black  ">
        <div
          className="w-screen h-screen pattern-dots pattern-pink-500 dark:pattern-pink-500 pattern-bg-transparent  "
        >
          <Toggle />
          <div className="flex w-full flex-col items-center sm:p-40">
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
