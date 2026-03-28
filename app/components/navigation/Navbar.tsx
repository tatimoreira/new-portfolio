import type { IconType } from "react-icons";
import { NavLink } from "@remix-run/react";
import { motion } from "framer-motion";

interface NavbarProps {
  links: Array<{
    to: string;
    label: string;
    icon: IconType;
    external: boolean;
  }>;
}

export default function Navbar({ links }: NavbarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ease: [0, 0.71, 0.2, 1.01], duration: 0.8, delay: 0.5 }}
      className="w-max content-center fixed top-4 right-4 text-white sm:rounded-2xl z-50">
      <div className="flex m-3 justify-end items-center ">

        {links.map(({ to, label, external }, idx) => (
          <NavLink
            to={to}
            key={to}
            end={to === "/"}
            target={external ? "_blank" : ""}
            rel="noreferrer"
            aria-label={to}
            className="relative pb-1"
            style={({ isActive }) => ({
              marginLeft: idx === 0 ? undefined : "2rem",
              color: isActive ? "#f5b1cc" : "#e45c96",
            })}
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? "font-semibold" : "font-normal"}>{label}</span>
                {isActive && (
                  <span className="pointer-events-none absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full bg-[#f5b1cc]" />
                )}
              </>
            )}
          </NavLink>



        ))
        }
      </div>
    </motion.div >
  );
}
