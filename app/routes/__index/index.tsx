import { Outlet, useNavigate } from "@remix-run/react";
import { motion } from "framer-motion";
import Button from "~/components/Button/Button";
import { DocumentIcon } from "~/components/Icons/DocumentIcon";
import { GithubIcon } from "~/components/Icons/GithubIcon";
import { LinkedInLogo } from "~/components/Icons/LinkedInLogo";
import ParagraphText from "~/components/ParagraphText/ParagraphText";


export default function Index() {
  let navigate = useNavigate();
  const routeChange = () => {
    window.open('https://drive.google.com/file/d/1Px0G7dOpRjqvlDODfOHANUBqqEdBppaA/view?usp=sharing', '_blank')
  }

  return (

    <motion.div
      className=" justify-center "
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ease: [0, 0.71, 0.2, 1.01], duration: 0.8, delay: 0.5 }}
    >

      <div className="grid ">
        <div className="relative sm:mt-0 mt-[50%] overflow-hidden rounded-2xl p-12 shadow-xl border-4 dark:border-sub-color border-dark-text-color">
          <div className="relative ">
            <span className="font-work text-3xl sm:text-5xl font-extrabold text-[#f5b1cc]">Tatiana Moreira</span>
            <p className="font-work text-3xl sm:text-5xl font-extrabold text-light-text-color dark:text-dark-text-color">Software Developer </p>
            <ParagraphText>Crafting web experiences</ParagraphText>
            <div className="flex mb-4">
              <a href="https://github.com/tatimoreira" target="_blank" rel="noopener noreferrer"><GithubIcon fillColor="white" /></a>
              <a href="https://www.linkedin.com/in/tmoreirab/" target="_blank" rel="noopener noreferrer"><LinkedInLogo fillColor="white" /></a>
            </div>
            <Button onClick={routeChange} icon={<DocumentIcon fillColor="#f5b1cc" />}>Resume</Button>
          </div>
        </div>
      </div>
      <Outlet />
    </motion.div >
  );
}
