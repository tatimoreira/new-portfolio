import { Form, Link, Outlet } from "@remix-run/react";
import { ReactNode } from "react";
import { IconType } from "react-icons";

interface NavbarProps {
  links: Array<{ to: string; label: string; icon: IconType }>;
}

export default function Navbar({ links }: NavbarProps) {
  return (
    <div>
      <header className="flex rounded-2xl  bg-rose-300 p-4 text-white sm:flex sm:items-center sm:justify-center sm:rounded-2xl">
        {links.map(({ to, label, icon: Icon }, idx) => (
          <a
            className={idx === 0 ? undefined : " ml-8  active:fill-teal-500 "}
            href={to}
            key={to}
          >
            <Icon className="hover:fill-blue-700  " />
          </a>
        ))}
      </header>

      <Outlet />
    </div>
  );
}
