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
import SubtitleText from "~/components/SubtitleText/SubtitleText";
import Pill from "~/components/Pill/Pill";


export default function Index() {
  const [theme] = useTheme();
  let navigate = useNavigate();
  const routeChange = () => {
    window.open('https://drive.google.com/file/d/1Px0G7dOpRjqvlDODfOHANUBqqEdBppaA/view?usp=sharing', '_blank')
  }

  const [page, setPage] = useState("home");
  const [flipped, setFlipped] = useState(false);

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);


  const rotateX = useSpring(tiltX, { stiffness: 150, damping: 20 });
  const rotateY = useSpring(tiltY, { stiffness: 150, damping: 20 });

  return (
    <div className="min-h-screen flex items-center justify-center p-10 perspective">

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
        className="relative  w-[700px] h-96 cursor-pointer">

        <motion.div
          className="relative w-full h-full preserve-3d"
          onClick={() => setFlipped(!flipped)}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Front */}
          {/* Front */}
          <div className="absolute w-full h-full  rounded-2xl shadow-xl flex items-center justify-center backface-hidden text-xl font-semibold bg-white/10 backdrop-blur-md border border-white/25">
            <div className="p-4 text-center">
              <span className="font-work text-3xl sm:text-5xl font-extrabold text-[#f5b1cc]">Tatiana Moreira</span>
              <p className="font-work text-3xl sm:text-5xl font-extrabold text-light-text-color dark:text-dark-text-color">Software Developer </p>
              <ParagraphText>Crafting web experiences</ParagraphText>
              <div className="flex mb-4">
                <a href="https://github.com/tatimoreira" target="_blank" rel="noopener noreferrer"><GithubIcon fillColor={theme === Theme.LIGHT ? "black" : "white"} /></a>
                <a href="https://www.linkedin.com/in/tmoreirab/" target="_blank" rel="noopener noreferrer"><LinkedInLogo fillColor={theme === Theme.LIGHT ? "black" : "white"} /></a>
              </div>
              <Button onClick={routeChange} icon={<DocumentIcon fillColor="#f5b1cc" />}>Resume</Button>
            </div>
          </div>

          {/*  <div className=" absolute w-full h-full  bg-white rounded-2xl  flex items-center backface-hidden text-xl font-semibold">
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
          </div> */}

          {/* Back */}
          <div className="absolute w-full h-full rounded-2xl shadow-xl flex items-center justify-center backface-hidden rotate-y-180 text-xl font-semibold bg-white/10 backdrop-blur-md border border-white/25">
            <div className="p-4 text-center">
              <div className="relative ">
                <SubtitleText>About</SubtitleText>
                <hr className="border-gray-500 dark:border-neutral-500 mb-4"></hr>
                <div className="mb-6">
                  <ParagraphText>I am an experienced Web Developer with a solid background in modern web technologies, I specialize in crafting user-centric web applications. I have worked in multiple industries and different company sizes delivering optimal web experiences.</ParagraphText>
                </div>
                <div >
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
        </motion.div>
        <style>{`
        .perspective { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
      </motion.div>

      <Outlet />
    </div>
  );
}
