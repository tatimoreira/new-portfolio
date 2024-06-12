import React from "react";
import { motion } from "framer-motion";


type AnimatedCharacterProps = {
  text: string;
  el?: keyof JSX.IntrinsicElements;
  className?: string;
};

const AnimatedTextCharacter = ({ text }: AnimatedCharacterProps) => {
  // splitting text into letters
  const letters = Array.from(text);

  // Variants for Container
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
    }),
  };

  // Variants for each letter
  const child = {
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      x: -20,
      y: 10,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      style={{ overflow: "hidden", display: "flex", fontSize: "2rem" }}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <h1 className="text-center text-6xl font-extrabold tracking-tight text-pink-500 sm:text-8xl lg:text-5xl">
          <motion.span variants={child} key={index} className="mt-12 block uppercase drop-shadow-md">
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        </h1>
      ))}
    </motion.div>

  );
};

export default AnimatedTextCharacter;




export const AnimatedText = ({
  text,
  el: Wrapper = "p",
  className,
}: AnimatedTextProps) => {
  return (
    <Wrapper className={className}>
      <span className="sr-only">{text}</span>

      <span aria-hidden>
        {text.split("").map((char, charIndex) => (
          <motion.span
            key={`${char}-${charIndex}`}
            className="inline-block"
          >
            {char}
          </motion.span>
        ))}
      </span>

    </Wrapper>
  );
};