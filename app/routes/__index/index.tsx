import { Outlet } from "@remix-run/react";
import { motion } from "framer-motion";
import { GithubIcon } from "~/components/Icons/GithubIcon";
import { LinkedInLogo } from "~/components/Icons/LinkedInLogo";
import ParagraphText from "~/components/ParagraphText/ParagraphText";

export default function Index() {
  return (

    <motion.div
      className=" justify-center "
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ease: [0, 0.71, 0.2, 1.01], duration: 0.8, delay: 0.5 }}
    >

      <div className="grid ">
        <div className="relative  overflow-hidden rounded-2xl p-12 shadow-xl border-4 dark:border-sub-color border-dark-text-color">
          <div className="relative ">
            <span className="font-work text-3xl sm:text-5xl font-extrabold text-[#f5b1cc]">Tatiana Moreira</span>
            <p className="font-work text-3xl sm:text-5xl font-extrabold text-light-text-color dark:text-dark-text-color">Software Developer </p>
            <ParagraphText>Crafting web experiences</ParagraphText>
            <div className="flex">
              <GithubIcon fillColor="white" />
              <LinkedInLogo fillColor="white" />
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </motion.div >
  );
}
