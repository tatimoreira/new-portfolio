import { Outlet } from "@remix-run/react";
import { motion } from "framer-motion";
import ParagraphText from "~/components/ParagraphText/ParagraphText";
import Pill from "~/components/Pill/Pill";
import SubtitleText from "~/components/SubtitleText/SubtitleText";

export default function Index() {
  return (

    <motion.div
      className=" justify-center "
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ease: [0, 0.71, 0.2, 1.01], duration: 0.8, delay: 0.5 }}
    >
      <div className="grid ">
        <div className="relative sm:mt-0 mt-10 overflow-hidden rounded-2xl p-8 shadow-xl border-4 dark:border-sub-color border-dark-text-color">
          <div className="relative ">
            <SubtitleText>About</SubtitleText>

          </div>
        </div>
      </div>
      <Outlet />
    </motion.div >
  );
}
