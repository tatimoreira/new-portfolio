import { Theme, useTheme } from "~/utils/theme-provider";
import { motion, useCycle } from "framer-motion";
import { MoonIcon } from "../navigation/MoonIcon";
import { SunIcon } from "../navigation/SunIcon";
import useDimensions from "~/hooks/use-dimentions";
import { useRef } from "react";

export default function Toggle({ toggle }) {
  const [theme, setTheme] = useTheme();



  return (
    <button
      aria-label="switch-theme"
      onClick={toggle}
      className="m-2 rounded-full  p-4 text-white  "
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
