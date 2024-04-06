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
          <h1 className="text-center text-6xl font-extrabold tracking-tight text-pink-500 sm:text-8xl lg:text-5xl">
            <span className="mt-12 block uppercase drop-shadow-md">
              Tatiana Moreira
            </span>
          </h1>
          <div className="text-center text-black dark:text-white">
            <p className="mx-auto mt-6 max-w-lg  text-xl  sm:max-w-3xl text-black dark:text-white">
              Developing cool software
            </p>
          </div>
        </div>

      </div>

      <Outlet />
    </motion.div >
  );
}
