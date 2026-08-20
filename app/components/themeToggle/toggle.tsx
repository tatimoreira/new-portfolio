import { Theme, useTheme } from "~/utils/theme-provider";
import { motion, AnimatePresence as AnimatePresenceRaw } from "framer-motion";
import { MoonIcon } from "../navigation/MoonIcon";
import { SunIcon } from "../navigation/SunIcon";
import { FrutigerIcon } from "../navigation/DuskIcon";

// framer-motion 11's AnimatePresence typing returns `JSX.Element | undefined`,
// which TS rejects as a JSX component; re-type it to a valid component signature.
const AnimatePresence = AnimatePresenceRaw as React.FC<
  Parameters<typeof AnimatePresenceRaw>[0]
>;

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
