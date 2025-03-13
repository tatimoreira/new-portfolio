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
            <hr className="border-gray-500 dark:border-neutral-500 mb-4"></hr>
            <div className="mb-6">
              <ParagraphText>I am an experienced Web Developer with a solid background in modern web technologies, I specialize in crafting responsive, stateful and user-centric web applications. I have worked in multiple industries and different company sizes delivering optimal web experiences.</ParagraphText>
              <ParagraphText> I'm always eager to expand my skill set, as a self-driven and quick learner I thrive in agile team environments. My commitment to staying current with industry trends and best practices allows me to  create innovative solutions that align with user needs and business goals.</ParagraphText>
            </div>
            <div >
              <ParagraphText>Tech stack</ParagraphText>
              <div className="flex gap-2 mt-3 flex-wrap">
                <Pill text="ReactJs"></Pill>
                <Pill text="NextJs"></Pill>
                <Pill text="Tailwind CSS"></Pill>
                <Pill text="Remix"></Pill>
                <Pill text="GraphQl"></Pill>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </motion.div >
  );
}
