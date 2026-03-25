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

export default function CardFixed() {
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
            x: [-300, 80, 0],   // throw → overshoot → center
            y: [200, 40, 0],
            rotate: [-180, 20, 0],
            scale: [0.9, 1.05, 1],
            opacity: 1,
        }
        : {
            x: [-1400, 100, 50],
            y: [500, 120, 50],
            rotate: [-540, 30, 0],
            scale: [0.85, 1.05, 1],
            opacity: 1,
        };

    return (
        <div className="w-screen overflow-x-hidden">
            <div className="flex justify-center [perspective:1000px] py-24">
                <motion.div
                    className="pointer-events-auto w-[300px] h-[450px] sm:w-[700px] sm:h-96"
                    style={{ rotateX, rotateY }}
                    initial={initial}
                    animate={animate}
                    transition={{
                        x: {
                            type: "spring",
                            stiffness: isMobile ? 140 : 120,
                            damping: isMobile ? 18 : 20,
                            mass: 0.8,
                        },
                        y: {
                            type: "spring",
                            stiffness: 130,
                            damping: 22,
                        },
                        rotate: {
                            type: "spring",
                            stiffness: 90,
                            damping: 16,
                        },
                        scale: {
                            duration: 0.6,
                            ease: "easeOut",
                        },
                        opacity: { duration: 0.2 },
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
                    onClick={() => setFlipped((v) => !v)}
                >
                    <motion.div
                        className="relative w-full h-full [transform-style:preserve-3d]"
                        animate={{ rotateY: flipped ? 180 : 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
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
                                <a
                                    className="border-2 rounded-2xl p-2 border-[#f5b1cc] text-[#f5b1cc]"
                                    href="/resume/Tatiana_Moreira_Resume.pdf"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                    download
                                >
                                    Download Resume
                                </a>
                            </div>
                        </div>

                        {/* BACK */}
                        <motion.div
                            className="absolute w-full h-full rounded-2xl shadow-xl flex items-center justify-center backface-hidden rotate-y-180 bg-white/10 backdrop-blur-md border border-white/25"
                            style={{
                                backfaceVisibility: "hidden",
                                rotateY: 180, // 👈 IMPORTANT: motion style, not CSS
                            }}>
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
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}