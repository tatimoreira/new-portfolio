

import { FaEnvelope } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaLightbulb } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaDownload } from "react-icons/fa";

export const MenuItems = [
  { to: "/", label: "HOME", icon: FaHome, active: true, external: false },
  {
    to: "https://drive.google.com/file/d/1Yjy2_-1OTlM6hdP5hAMuEUWJKOIhQtvB/view?usp=drive_link",
    label: "CV",
    icon: FaDownload,
    active: false,
    external: true,
  },
  {
    to: "https://github.com/tatimoreira",
    label: "GITHUB",
    icon: FaGithub,
    active: false,
    external: true,
  },
  {
    to: "https://www.linkedin.com/in/tmoreirab/",
    label: "LINKEDIN",
    icon: FaLinkedin,
    active: false,
    external: true,
  },
  {
    to: "mailto:tatimb14@gmail.com",
    label: "MAIL",
    icon: FaEnvelope,
    active: false,
    external: true,
  }
];