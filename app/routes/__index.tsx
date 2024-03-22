import { DateTime } from "luxon";
import Navbar from "../components/navigation/Navbar";
import { FaHome } from "react-icons/fa";
import { FaLightbulb } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { NavLink, Outlet } from "@remix-run/react";
import { FaEnvelope } from "react-icons/fa";
import Toggle from "~/components/themeToggle/toggle";

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

export const MenuItems = [
  { to: "/", label: "HOME", icon: FaHome, active: true, external: false },
  {
    to: "https://github.com/tatimoreira",
    label: "POSTS",
    icon: FaGithub,
    active: false,
    external: true,
  },
  {
    to: "https://www.linkedin.com/in/tmoreirab/",
    label: "POSTS",
    icon: FaLinkedin,
    active: false,
    external: true,
  },
  {
    to: "mailto:tatimb14@gmail.com",
    label: "POSTS",
    icon: FaEnvelope,
    active: false,
    external: true,
  },
];

export default function Index() {
  return (
    <div>

      <main className="min-h-screen bg-white backdrop-blur-sm dark:bg-black sm:items-center sm:justify-center ">
        <div
          className="w-screen h-screen pattern-dots pattern-black dark:pattern-white pattern-bg-transparent pattern-opacity-90 pattern-size-4"
        >
          <Toggle />
          <div className="flex w-full flex-col items-center p-32 sm:p-40">
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
