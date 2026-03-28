import Navbar from "../components/navigation/Navbar";
import { Outlet } from "@remix-run/react";
import Toggle from "~/components/themeToggle/toggle";
import { MenuItems } from "~/components/navigation/MenuItems";
import { motion, useCycle, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { Theme, useTheme } from "~/utils/theme-provider";

const lightClip = "circle(38px at 41px 42px)";

export default function Index() {
  const [theme, setTheme] = useTheme();
  const [, setIsBgExpanded] = useCycle(theme === Theme.LIGHT == false, theme === Theme.DARK == true);
  const bgControls = useAnimation();

  useEffect(() => {
    if (theme === Theme.DARK) {
      const radius = Math.ceil(Math.sqrt(
        Math.pow(window.innerWidth - 40, 2) + Math.pow(window.innerHeight - 40, 2)
      )) + 100;
      bgControls.start({ clipPath: `circle(${radius}px at 40px 40px)`, transition: { type: "tween", duration: 0.6, ease: [0.4, 0, 0.2, 1] } });
    } else {
      bgControls.start({ clipPath: lightClip, transition: { delay: 0.5, type: "spring", stiffness: 400, damping: 40 } });
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme: Theme | null) =>
      prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
    )
  };
  return (

    <div>

      <main className="w-full relative min-h-screen h-full">
        <motion.div>
          <motion.div
            className="bg-[#091f2c] fixed inset-0"
            initial={{ clipPath: lightClip }}
            animate={bgControls}
          >
            <div className="flex">


              <Toggle toggle={() => {

                setIsBgExpanded()
                toggleTheme()

              }} />

            </div>

          </motion.div>
          <div className="pointer-events-none absolute flex flex-col gap-5 items-center ustify-start z-10 mb-10 inset-0">
            <div className="flex flex-col items-center pointer-events-auto">
              <div className="absolute left-6 right-6 top-20 bottom-0 sm:left-12 sm:right-12 sm:top-12 sm:bottom-0 md:left-20 md:right-20 md:top-20 md:bottom-0 overflow-y-auto overflow-x-hidden">
                <Navbar links={MenuItems} />

                <Outlet />
              </div>
            </div>
          </div>


        </motion.div>
      </main>
    </div>

  );
}
