import { NavLink, Outlet } from "@remix-run/react";
import { motion } from "framer-motion";
import SubtitleText from "~/components/SubtitleText/SubtitleText";

export default function MandarinLayout() {
  return (
    <motion.div
      className="justify-center"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ease: [0, 0.71, 0.2, 1.01], duration: 0.8, delay: 0.5 }}
    >
      <div className="grid">
        <div className="relative max-w-2xl sm:mt-0 mt-10 overflow-hidden rounded-2xl p-8 shadow-xl border-4 border-sub-color">
          <div className="relative">
            <SubtitleText>普通话</SubtitleText>
            <p className="font-work text-sm font-light text-text-color mb-6 opacity-60">
              Mandarin vocabulary catalog — for teaching my daughter
            </p>

            <div className="flex gap-2 mb-6">
              <NavLink
                to="/mandarin"
                end
                className={({ isActive }) =>
                  `font-work text-sm font-medium px-4 py-1.5 rounded-full border transition-colors ${
                    isActive
                      ? "border-sub-color bg-sub-color text-white"
                      : "border-sub-color text-sub-color hover:bg-sub-color/10"
                  }`
                }
              >
                Catalog
              </NavLink>
              <NavLink
                to="/mandarin/queue"
                className={({ isActive }) =>
                  `font-work text-sm font-medium px-4 py-1.5 rounded-full border transition-colors ${
                    isActive
                      ? "border-sub-color bg-sub-color text-white"
                      : "border-sub-color text-sub-color hover:bg-sub-color/10"
                  }`
                }
              >
                To Research
              </NavLink>
            </div>

            <hr className="border-gray-500 dark:border-neutral-500 mb-6" />

            <Outlet />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
