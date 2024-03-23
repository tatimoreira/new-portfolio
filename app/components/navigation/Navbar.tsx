import { ReactNode } from "react";
import type { IconType } from "react-icons";
import { NavLink } from "@remix-run/react";
import { redirect } from "@remix-run/node";
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
    <motion.header
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ease: [0, 0.71, 0.2, 1.01], duration: 0.8, delay: 0.5 }}
      className=" flex w-full rounded-2xl border-4 border-black dark:border-white bg-white dark:bg-black p-4 text-white sm:flex sm:items-center sm:justify-center sm:rounded-2xl">
      {links.map(({ to, label, icon: Icon, external }, idx) => (

        external
          ?
          (<a href={to} target="_blank" className="ml-8">  <Icon className="hover:fill-black text-slate-500 " /></a>) : (
            <NavLink
              to={to}
              key={to}
              target={external ? "_blank" : ""}
              rel="noreferrer"
              className={({ isActive }) => (isActive ? "active" : "pending")}
              style={({ isActive }) => {
                return {
                  marginLeft: idx === 0 ? undefined : " 2rem ",
                  fontWeight: isActive ? "bold " : "",
                  color: isActive ? "black" : "white",
                };
              }}
            >
              <Icon className="hover:fill-black dark:text-white " />
            </NavLink>
          )


      ))}
    </motion.header >
  );
}
