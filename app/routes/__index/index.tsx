import { Outlet, useNavigate } from "@remix-run/react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import Button from "~/components/Button/Button";
import { DocumentIcon } from "~/components/Icons/DocumentIcon";
import { GithubIcon } from "~/components/Icons/GithubIcon";
import { LinkedInLogo } from "~/components/Icons/LinkedInLogo";
import ParagraphText from "~/components/ParagraphText/ParagraphText";
import SwipeCard from "~/components/Card/Card";
import { Theme, useTheme } from "~/utils/theme-provider";
import { Html, Environment } from "@react-three/drei";
import SubtitleText from "~/components/SubtitleText/SubtitleText";
import Pill from "~/components/Pill/Pill";
import GrowingCircle from "~/components/GrowingCircle/ThrownToCenter";
import PageLoadCircle from "~/components/GrowingCircle/PageLoadCirlcle";
import ThrownToCenter from "~/components/GrowingCircle/ThrownToCenter";
import { useIsMobile } from "~/utils/hooks/useIsMobile";
import { is } from "@react-three/fiber/dist/declarations/src/core/utils";
import Card from "~/components/Card/Card";
import CardFixed from "~/components/Card/CardFixed";

export default function Index() {
  const [theme] = useTheme();




  return (
    <>
      {/* FULLSCREEN CENTER ANCHOR */}
      {/* CARD — viewport anchored */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <CardFixed />
      </div>

      <Outlet />

      <style>{`
      .perspective { perspective: 1000px; }
      .preserve-3d { transform-style: preserve-3d; }
      .backface-hidden { backface-visibility: hidden; }
      .rotate-y-180 { transform: rotateY(180deg); }
    `}</style>
    </>
  );

}
