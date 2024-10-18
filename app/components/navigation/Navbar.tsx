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
      className="  w-max rounded-2xl border-4 dark:border-sub-color border-dark-text-color text-white sm:rounded-2xl">
      <div className="flex m-3 justify-around items-center ">
        {links.map(({ to, label, icon: Icon, external }, idx) => (
          <NavLink
            to={to}
            key={to}
            target={external ? "_blank" : ""}
            rel="noreferrer"
            aria-label={to}
            className={({ isActive }) => (isActive ? "active" : "pending")}
            style={({ isActive }) => {
              return {
                marginLeft: idx === 0 ? undefined : " 2rem ",
                fontWeight: isActive ? "bold " : "",
                color: isActive ? "black" : "#e45c96",
              };
            }}
          >
            <motion.div
              whileHover={{ scale: 1.5 }}
              whileTap={{ scale: 0.9 }}
            >
              {
                external ?
                  (<a href={to} aria-label={to} target="_blank" >  <Icon className="hover:fill-black dark:hover:fill-white text-[#f5b1cc]" /></a>)
                  :
                  (<Icon className=" dark:text-white " />)
              }

            </motion.div>
          </NavLink>



        ))
        }
      </div>
    </motion.div >
  );
}
