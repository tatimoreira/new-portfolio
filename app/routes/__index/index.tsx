import { Outlet } from "@remix-run/react";
import { motion } from "framer-motion";

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
            <p className="text-4xl sm:text-8xl font-extralight text-light-text-color dark:text-dark-text-color">Hi,</p>
            <p className="font-work text-3xl sm:text-7xl font-extrabold text-light-text-color dark:text-dark-text-color">I am <span className="font-work text-3xl sm:text-7xl font-extrabold text-[#f5b1cc] underline decoration-[#f5b1cc]">Tatiana Moreira</span></p>


            <p className="mt-3.5 font-work text-3xl sm:text-7xl font-extralight text-light-text-color dark:text-dark-text-color">
              Full-stack web developer
            </p>
          </div>
        </div>
      </div>
      <Outlet />
    </motion.div >
  );
}
