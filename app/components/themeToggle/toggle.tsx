import { useState } from "react";
import { BsMoon, BsSun } from "react-icons/bs";
import { Theme, useTheme } from "~/utils/theme-provider";
import { motion } from "framer-motion";

export default function Toggle() {
  const [theme, setTheme] = useTheme();
  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
    );
  };

  return (
    <button
      onClick={toggleTheme}
      className="m-4 rounded-full border-4  border-black p-4 dark:border-white bg-white dark:bg-black"
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
            <BsSun className="h-6 w-6 text-black dark:text-white"></BsSun>
          </motion.div>

        ) : (

          <BsMoon className="h-6 w-6 text-black dark:text-white"></BsMoon>
        )}
    </button>
  );
}
