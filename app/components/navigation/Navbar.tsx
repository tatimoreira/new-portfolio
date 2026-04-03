import type { IconType } from "react-icons";
import { NavLink } from "@remix-run/react";
import { motion } from "framer-motion";
import { Theme, useTheme } from "~/utils/theme-provider";

interface NavbarProps {
  links: Array<{
    to: string;
    label: string;
    icon: IconType;
    external: boolean;
  }>;
}

const navColors: Record<Theme, { active: string; inactive: string; underline: string }> = {
  [Theme.LIGHT]:    { active: "#f5b1cc", inactive: "#e45c96", underline: "#f5b1cc" },
  [Theme.DARK]:     { active: "#f5b1cc", inactive: "#e45c96", underline: "#f5b1cc" },
  [Theme.FRUTIGER]: { active: "#0032db", inactive: "#0689e4", underline: "#fbb905" },
};

export default function Navbar({ links }: NavbarProps) {
  const [theme] = useTheme();
  const colors = navColors[theme ?? Theme.LIGHT];

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
              color: isActive ? colors.active : colors.inactive,
            })}
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? "font-semibold" : "font-normal"}>{label}</span>
                {isActive && (
                  <span
                    className="pointer-events-none absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full"
                    style={{ backgroundColor: colors.underline }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </motion.div>
  );
}
