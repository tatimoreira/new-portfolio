import { Outlet } from "@remix-run/react";
import { motion } from "framer-motion";
import AnimatedTextCharacter from "~/components/AnimatedText/AnimatedText";

export default function Index() {
  return (

    <div>

      <div className="relative  overflow-hidden rounded-2xl bg-white dark:bg-black p-12 shadow-xl border-4 border-purple-500">
        <div className="relative ">
          <h1 className="text-center text-6xl font-extrabold tracking-tight text-pink-500 sm:text-8xl lg:text-5xl">

            <AnimatedTextCharacter
              text="Tatiana Moreira"
            />
          </h1>
          <div className="text-center text-black dark:text-white">
            <p className="mx-auto mt-6 max-w-lg  text-xl  sm:max-w-3xl text-black dark:text-white">
              Developing cool software
            </p>
          </div>
        </div>

      </div>

      <Outlet />
    </div >
  );
}
