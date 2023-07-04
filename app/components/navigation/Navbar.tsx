import { ReactNode } from "react";
import type { IconType } from "react-icons";

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
    <header className="flex rounded-2xl  bg-orange-400 p-4 text-white sm:flex sm:items-center sm:justify-center sm:rounded-2xl">
      {links.map(({ to, label, icon: Icon, external }, idx) => (
        <a
          className={idx === 0 ? undefined : " ml-8  active:fill-teal-500 "}
          href={to}
          key={to}
          target={external ? "_blank" : ""}
          rel="noreferrer"
        >
          <Icon className="hover:fill-blue-700  " />
        </a>
      ))}
    </header>
  );
}
