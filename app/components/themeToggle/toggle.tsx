import { useState } from "react";
import { Theme, useTheme } from "~/utils/theme-provider";
import { motion } from "framer-motion";
import { MoonIcon } from "../navigation/MoonIcon";
import { SunIcon } from "../navigation/SunIcon";

export default function Toggle() {
  const [theme, setTheme] = useTheme();
  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
    );
  };

  return (
    <button
      aria-label="switch-theme"
      onClick={toggleTheme}
      className="m-4 rounded-full  p-4 text-white bg-caret-color "
    >

      {

        theme === Theme.LIGHT ? (
          <motion.div
            layout className="handle"
            key={Theme.LIGHT ? 'sun' : 'moon'}
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: .2 }}>
            <SunIcon></SunIcon>
          </motion.div>

        ) : (

          <MoonIcon ></MoonIcon>
        )
      }
    </button >
  );
}
