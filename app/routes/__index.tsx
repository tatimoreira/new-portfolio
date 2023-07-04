import { DateTime } from "luxon";
import Navbar from "../components/navigation/Navbar";
import { FaHome } from "react-icons/fa";
import { FaLightbulb } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { Outlet } from "@remix-run/react";
import { Theme, useTheme } from "~/utils/theme-provider";

export const MenuItems = [
  { to: "/", label: "HOME", icon: FaHome, active: true },
  { to: "/posts", label: "POSTS", icon: FaLightbulb, active: false },
  { to: "/posts", label: "POSTS", icon: FaGithub, active: false },
];

export default function Index() {
  var time = DateTime.local().setZone("America/Costa_Rica");
  console.log(time);
  const [, setTheme] = useTheme();

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
    );
  };
  return (
    <main className="min-h-screen   bg-white backdrop-blur-sm dark:bg-black sm:items-center sm:justify-center ">
      <button onClick={toggleTheme} className=" bg-slate-400 dark:bg-white ">
        Toggle
      </button>
      <div className="relative sm:pb-16 sm:pt-8">
        <Outlet />
      </div>

      <div className=" max-w-7xl p-3 ">
        <Navbar links={MenuItems} />
      </div>
    </main>
  );
}
