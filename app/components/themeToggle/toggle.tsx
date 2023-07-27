import { useState } from "react";
import { BsMoon, BsSun } from "react-icons/bs";
import { Theme, useTheme } from "~/utils/theme-provider";

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
      className="m-4 rounded-full border-2  border-neutral-500 p-4 dark:border-white"
    >
      {theme === Theme.LIGHT ? (
        <BsSun className="h-6 w-6 text-neutral-500 dark:text-white"></BsSun>
      ) : (
        <BsMoon className="h-6 w-6 text-neutral-500 dark:text-white"></BsMoon>
      )}
    </button>
  );
}
