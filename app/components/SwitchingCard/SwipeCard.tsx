// SwipeCard.jsx
import { motion, useMotionValue, useSpring } from "framer-motion";
import "@react-three/fiber";
import { useState } from "react";

export default function SwipeCard() {
  const [flipped, setFlipped] = useState(false);

  // Motion values for smooth 3D tilt
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  // Springs for natural smoothing
  const rotateX = useSpring(tiltX, { stiffness: 150, damping: 20 });
  const rotateY = useSpring(tiltY, { stiffness: 150, damping: 20 });
  return (
    <div className=" flex items-center justify-center bg-black p-10 perspective">
      <motion.div
        className="relative w-64 h-40 cursor-pointer"
        style={{ rotateX, rotateY }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;

          tiltX.set((y / rect.height) * -15);
          tiltY.set((x / rect.width) * 15);
        }}
        onMouseLeave={() => {
          tiltX.set(0);
          tiltY.set(0);
        }}
      >
        <motion.div
          className="relative w-full h-full preserve-3d"
          onClick={() => setFlipped(!flipped)}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Front */}
          <div className="absolute w-full h-full bg-white rounded-2xl shadow-xl flex items-center justify-center backface-hidden text-xl font-semibold">
            <div className="p-4 text-center">
              <h2 className="text-xl font-bold">Tatiana Moreira</h2>
              <p className="text-sm mt-2 text-gray-700">
                Senior Full‑Stack Developer<br />Team Lead & AI‑Driven Workflow Specialist
              </p>
            </div>
          </div>

          {/* Back */}
          <div className="absolute w-full h-full rounded-2xl shadow-xl flex items-center justify-center backface-hidden rotate-y-180 text-xl font-semibold bg-white/10 backdrop-blur-md border border-white/25">
            <div className="p-4 text-center text-white">
              <h2 className="text-xl font-bold">More About Me</h2>
              <p className="text-sm mt-2 text-white">
                Passionate about building high‑impact products using React, Remix, Node, and AI automation.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        .perspective { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}
