import { Form, Link, Outlet } from "@remix-run/react";
import { ReactNode } from "react";
import { IconType } from "react-icons";

interface NavbarProps {
  links: Array<{ to: string; label: string; icon: IconType }>;
}

export default function Navbar({ links }: NavbarProps) {
  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center bg-slate-800 p-4 text-white">
        {links.map(({ to, label, icon: Icon }, idx) => (
          <Link className={idx === 0 ? undefined : "ml-8"} key={to} to={to}>
            <Icon />
          </Link>
        ))}
      </header>

      <Outlet />
    </div>
  );
}
