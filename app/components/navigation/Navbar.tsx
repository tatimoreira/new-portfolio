import { ReactNode } from "react";
import type { IconType } from "react-icons";
import { NavLink } from "@remix-run/react";
import { redirect } from "@remix-run/node";

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
    <header className=" flex w-full rounded-2xl  bg-teal-500 p-4 text-white sm:flex sm:items-center sm:justify-center sm:rounded-2xl">
      {links.map(({ to, label, icon: Icon, external }, idx) => (

        external
          ?
          (<a href={to} target="_blank" className="ml-8">  <Icon className="hover:fill-orange-300  " /></a>) : (
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
                  color: isActive ? "rgb(253 186 116)" : "white",
                };
              }}
            >
              <Icon className="hover:fill-orange-300  " />
            </NavLink>
          )


      ))}
    </header >
  );
}
