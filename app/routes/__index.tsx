import { DateTime } from "luxon";
import Navbar from "../components/navigation/Navbar";
import { FaHome } from "react-icons/fa";
import { FaLightbulb } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { Outlet } from "@remix-run/react";
import { Theme, useTheme } from "~/utils/theme-provider";
import { FaEnvelope } from "react-icons/fa";
import { BsSun } from "react-icons/bs";

export const MenuItems = [
  { to: "/", label: "HOME", icon: FaHome, active: true, external: false },
  {
    to: "/posts",
    label: "POSTS",
    icon: FaLightbulb,
    active: false,
    external: false,
  },
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
  var time = DateTime.local().setZone("America/Costa_Rica");
  console.log(time);
  const [, setTheme] = useTheme();

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
    );
  };
  return (
    <main className=" min-h-screen   bg-neutral-200 backdrop-blur-sm dark:bg-neutral-500 sm:items-center sm:justify-center ">
      <button
        onClick={toggleTheme}
        className="m-4 rounded-full border-2  border-neutral-500 p-4 dark:border-white"
      >
        <BsSun className="h-6 w-6 text-neutral-500 dark:text-white"></BsSun>
      </button>

      <div className="flex w-full flex-col items-center p-40 ">
        <div className="relative  w-full sm:pb-16 sm:pt-8">
          <Outlet />
        </div>

        <div className=" flex justify-center p-3 ">
          <Navbar links={MenuItems} />
        </div>
      </div>
    </main>
  );
}
