import { useNavigate } from "@remix-run/react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useState } from "react";
import { useIsMobile } from "~/utils/hooks/useIsMobile";
import ParagraphText from "../ParagraphText/ParagraphText";
import { GithubIcon } from "../Icons/GithubIcon";
import { LinkedInLogo } from "../Icons/LinkedInLogo";
import Button from "../Button/Button";
import { Theme, useTheme } from "~/utils/theme-provider";
import SubtitleText from "../SubtitleText/SubtitleText";
import Pill from "../Pill/Pill";
import { DocumentIcon } from "../Icons/DocumentIcon";

export default function Card() {
  const [theme] = useTheme();

  let navigate = useNavigate();
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);


  const routeChange = () => {
    window.open('https://drive.google.com/file/d/1Px0G7dOpRjqvlDODfOHANUBqqEdBppaA/view?usp=sharing', '_blank')
  }

  const rotateX = useSpring(tiltX, { stiffness: 150, damping: 20 });
  const rotateY = useSpring(tiltY, { stiffness: 150, damping: 20 });


  const [page, setPage] = useState("home");
  const [flipped, setFlipped] = useState(false);


  const isMobile = useIsMobile();
  console.log('isMobile', isMobile)
  const initial = isMobile
    ? {
      x: -300,
      y: 200,
      rotate: -180,
      scale: 0.9,
      opacity: 0,
    }
    : {
      x: -1400,
      y: 500,
      rotate: -540,
      scale: 0.85,
      opacity: 0,
    };

  const animate = isMobile
    ? {
      x: 900,
      y: 80,
      rotate: 0,
      scale: 1,
      opacity: 1,
    }
    : {
      x: 50,
      y: 50,
      rotate: 0,
      scale: 1,
      opacity: 1,
    };


  return (
    <motion.div
      className="pointer-events-auto w-[300px] h-[450px] sm:w-[700px] sm:h-96 cursor-pointer"
      style={{ rotateX, rotateY }}
      initial={initial}
      animate={{
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        opacity: 1,
      }}
      transition={{
        x: {
          type: "inertia",
          velocity: isMobile ? 600 : 1600,
          power: 0.85,
          timeConstant: 500,
        },
        y: {
          type: "spring", // mobile-safe
          stiffness: 130,
          damping: 22,
        },
        rotate: {
          type: "spring",
          stiffness: 90,
          damping: 16,
        },
        scale: {
          duration: 3,
          ease: "easeOut",
        },
        opacity: { duration: 0.3 },
      }}
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
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        onClick={() => setFlipped(!flipped)}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* FRONT */}
        <div className="absolute w-full h-full rounded-2xl shadow-xl flex items-center justify-center backface-hidden bg-white/10 backdrop-blur-md border border-white/25">
          <div className="p-4 text-center">
            <span className="font-work text-3xl sm:text-5xl font-extrabold text-[#f5b1cc]">
              Tatiana Moreira
            </span>
            <p className="font-work text-3xl sm:text-5xl font-extrabold text-light-text-color dark:text-dark-text-color">
              Software Developer
            </p>

            <ParagraphText>Crafting web experiences</ParagraphText>

            <div className="flex mb-4 justify-center gap-2">
              <a
                href="https://github.com/tatimoreira"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubIcon fillColor={theme === Theme.LIGHT ? "black" : "white"} />
              </a>
              <a
                href="https://www.linkedin.com/in/tmoreirab/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedInLogo fillColor={theme === Theme.LIGHT ? "black" : "white"} />
              </a>
            </div>

            <Button onClick={routeChange} icon={<DocumentIcon fillColor="#f5b1cc" />}>
              Resume
            </Button>
          </div>
        </div>

        {/* BACK */}
        <div className="absolute w-full h-full rounded-2xl shadow-xl flex items-center justify-center backface-hidden rotate-y-180 bg-white/10 backdrop-blur-md border border-white/25">
          <div className="p-4 text-center">
            <SubtitleText>About</SubtitleText>
            <hr className="border-gray-500 dark:border-neutral-500 mb-4" />

            <ParagraphText>
              I am an experienced Web Developer with a solid background in modern web
              technologies. I specialize in crafting user-centric web applications.
            </ParagraphText>

            <div className="flex gap-2 mt-4 flex-wrap justify-center">
              <Pill text="ReactJs" />
              <Pill text="NextJs" />
              <Pill text="Tailwind CSS" />
              <Pill text="Remix" />
              <Pill text="GraphQl" />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}