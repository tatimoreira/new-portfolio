import { Outlet } from "@remix-run/react";
import { ClientOnly } from "~/components/ClientOnly";
import Card from "~/components/Card/Card";
import HeroOrbBackground from "~/components/HeroBackground/HeroOrbBackground.client";

export default function Index() {
  return (
    <>
      <ClientOnly>{() => <HeroOrbBackground />}</ClientOnly>

      {/* FULLSCREEN CENTER ANCHOR */}
      {/* CARD — viewport anchored */}
      <div className="fixed inset-0 z-40 flex items-center justify-center pt-16 sm:pt-0 pointer-events-none">
        <Card />
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
