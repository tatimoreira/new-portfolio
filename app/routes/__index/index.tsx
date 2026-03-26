import { Outlet } from "@remix-run/react";
import CardFixed from "~/components/Card/CardFixed";

export default function Index() {
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
