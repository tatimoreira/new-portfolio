import { Outlet, useNavigate } from "@remix-run/react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useState } from "react";
import Button from "~/components/Button/Button";
import { DocumentIcon } from "~/components/Icons/DocumentIcon";
import { GithubIcon } from "~/components/Icons/GithubIcon";
import { LinkedInLogo } from "~/components/Icons/LinkedInLogo";
import ParagraphText from "~/components/ParagraphText/ParagraphText";
import SwipeCard from "~/components/SwitchingCard/SwipeCard";
import { Theme, useTheme } from "~/utils/theme-provider";
import { Html, Environment } from "@react-three/drei";


export default function Index() {
  const [theme] = useTheme();
  let navigate = useNavigate();
  const routeChange = () => {
    window.open('https://drive.google.com/file/d/1Px0G7dOpRjqvlDODfOHANUBqqEdBppaA/view?usp=sharing', '_blank')
  }

  const [page, setPage] = useState("home");

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);


  const rotateX = useSpring(tiltX, { stiffness: 150, damping: 20 });
  const rotateY = useSpring(tiltY, { stiffness: 150, damping: 20 });

  return (

    <motion.div
      className=" justify-center "
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ease: [0, 0.71, 0.2, 1.01], duration: 0.8, delay: 0.5 }}

    >
      <motion.div
        style={{ rotateX, rotateY }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;

          tiltX.set((y / rect.height) * -15);
          tiltY.set((x / rect.width) * 15);
        }}
        onMouseLeave={() => {
          tiltX.set(0);
          tiltY.set(0);
        }}
        className="relative max-w-2xl sm:mt-0 mt-[50%] overflow-hidden rounded-2xl p-12 shadow-xl border-4 dark:border-sub-color border-dark-text-color">
        <div className="relative ">
          <span className="font-work text-3xl sm:text-5xl font-extrabold text-[#f5b1cc]">Tatiana Moreira</span>
          <p className="font-work text-3xl sm:text-5xl font-extrabold text-light-text-color dark:text-dark-text-color">Software Developer </p>
          <ParagraphText>Crafting web experiences</ParagraphText>
          <div className="flex mb-4">
            <a href="https://github.com/tatimoreira" target="_blank" rel="noopener noreferrer"><GithubIcon fillColor={theme === Theme.LIGHT ? "black" : "white"} /></a>
            <a href="https://www.linkedin.com/in/tmoreirab/" target="_blank" rel="noopener noreferrer"><LinkedInLogo fillColor={theme === Theme.LIGHT ? "black" : "white"} /></a>
          </div>
          <Button onClick={routeChange} icon={<DocumentIcon fillColor="#f5b1cc" />}>Resume</Button>
        </div>
      </motion.div>

      <Outlet />
    </motion.div >
  );
}
