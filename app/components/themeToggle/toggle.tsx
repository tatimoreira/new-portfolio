import { Theme, useTheme } from "~/utils/theme-provider";
import { motion, AnimatePresence } from "framer-motion";
import { MoonIcon } from "../navigation/MoonIcon";
import { SunIcon } from "../navigation/SunIcon";
import { FrutigerIcon } from "../navigation/DuskIcon";

const themeIcons: Record<Theme, React.ReactNode> = {
  [Theme.LIGHT]: <SunIcon />,
  [Theme.DARK]: <MoonIcon />,
  [Theme.FRUTIGER]: <FrutigerIcon />,
};

export default function Toggle({ toggle }: { toggle: () => void }) {
  const [theme] = useTheme();

  return (
    <button
      aria-label="switch-theme"
      onClick={toggle}
      className="m-2 rounded-full p-4 text-white"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={theme ?? Theme.LIGHT}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {themeIcons[theme ?? Theme.LIGHT]}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
