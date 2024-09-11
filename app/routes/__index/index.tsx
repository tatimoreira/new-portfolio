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

      <div className="relative  overflow-hidden rounded-2xl bg-white dark:bg-black p-12 shadow-xl border-4 border-purple-500">
        <div className="relative ">
          <p className="text-8xl font-extralight text-black dark:text-white">Hi,</p>
          <p className="font-work text-5xl sm:text-7xl font-extrabold text-black dark:text-white">
            I am <span className="underline decoration-purple-500">Tatiana Moreira</span>
          </p>
          <p className="mt-3.5 font-work text-5xl sm:text-7xl font-extralight text-black dark:text-white">
            Web3 Full-stack web developer
          </p>
        </div>

      </div>

      <Outlet />
    </motion.div >
  );
}
