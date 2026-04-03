import { motion } from "framer-motion";
import { transition } from "./constants";

// Frutiger Aero — glossy nature leaf icon
export const FrutigerIcon = () => {
  const variants = {
    initial: { scale: 0.5, rotate: -30, opacity: 0 },
    animate: { scale: 1, rotate: 0, opacity: 1, transition },
    whileTap: { scale: 0.92, rotate: 10 },
  };

  return (
    <motion.svg
      key="frutiger"
      width="2em"
      height="2em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial="initial"
      animate="animate"
      whileTap="whileTap"
      variants={variants}
    >
      {/* Leaf shape */}
      <motion.path
        d="M12 3 C12 3 19 6 19 13 C19 17.5 15.5 21 12 21 C8.5 21 5 17.5 5 13 C5 6 12 3 12 3Z"
        fill="currentColor"
        opacity="0.9"
      />
      {/* Center vein */}
      <motion.line
        x1="12"
        y1="6"
        x2="12"
        y2="19"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Side veins */}
      <motion.g stroke="white" strokeWidth="0.9" strokeLinecap="round" opacity="0.4">
        <line x1="12" y1="10" x2="8.5" y2="13" />
        <line x1="12" y1="10" x2="15.5" y2="13" />
        <line x1="12" y1="14" x2="9" y2="16.5" />
        <line x1="12" y1="14" x2="15" y2="16.5" />
      </motion.g>
    </motion.svg>
  );
};
