import { DateTime } from "luxon";
import Navbar from "../components/navigation/Navbar";
import { NavLink, Outlet } from "@remix-run/react";
import Toggle from "~/components/themeToggle/toggle";

import Tile from "~/components/Tile";
import { MenuItems } from "~/components/navigation/MenuItems";
import { motion, useCycle } from "framer-motion";
import { useRef } from "react";
import { Theme, useTheme } from "~/utils/theme-provider";
import useDimensions from "~/utils/hooks/use-dimentions";
import Pill from "~/components/Pill/Pill";

const sidebar = {
  dark: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  light: {
    clipPath: "circle(38px at 41px 42px)",
    transition: {
      delay: 0.5,
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

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
  const [theme, setTheme] = useTheme();
  const [isBgExpanded, setIsBgExpanded] = useCycle(theme === Theme.LIGHT == false, theme === Theme.DARK == true);
  const [dimensions, ref] = useDimensions<HTMLDivElement>();


  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
    )
  };
  return (

    <div>

      <main className="w-full relative min-h-screen  h-full backdrop-blur-sm   ">
        <motion.div
          initial={false}
          animate={theme === Theme.LIGHT ? "light" : "dark"}
          custom={dimensions.height}
          ref={ref}

        >
          <motion.div className="bg-[#091f2c] h-full h-screen" variants={sidebar} >
            <div className="flex">


              <Toggle toggle={() => {

                setIsBgExpanded()
                toggleTheme()

              }} />

            </div>

          </motion.div>
          <Navbar links={MenuItems} />
          <div className="pointer-events-none absolute flex flex-col gap-5 items-center ustify-start sm:justify-center z-10 mb-10 inset-0">
            <div className="flex flex-col items-center pointer-events-auto">
              <div className="relative  m-9">
                <Navbar links={MenuItems} />
                <Outlet />
              </div>
            </div>
          </div>

        </motion.div>
      </main>
    </div>

  );
}
