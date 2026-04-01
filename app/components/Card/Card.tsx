import { motion, useMotionValue, useSpring } from "framer-motion";
import { useState } from "react";
import { useIsMobile } from "~/utils/hooks/useIsMobile";
import CardFront from "./CardFront";
import CardChat from "./CardChat";

export default function Card() {
    const tiltX = useMotionValue(0);
    const tiltY = useMotionValue(0);
    const rotateX = useSpring(tiltX, { stiffness: 150, damping: 20 });
    const rotateY = useSpring(tiltY, { stiffness: 150, damping: 20 });

    const [flipped, setFlipped] = useState(false);

    const isMobile = useIsMobile();

    const initial = isMobile
        ? { x: -300, y: 200, rotate: -180, scale: 0.9, opacity: 0 }
        : { x: -1400, y: 500, rotate: -540, scale: 0.85, opacity: 0 };

    const animate = isMobile
        ? { x: [-300, 80, 0], y: [200, 40, 0], rotate: [-180, 20, 0], scale: [0.9, 1.05, 1], opacity: 1 }
        : { x: [-1400, 100, 50], y: [500, 120, 50], rotate: [-540, 30, 0], scale: [0.85, 1.05, 1], opacity: 1 };

    return (
        <div className="w-full px-4">
            <div className="flex justify-center [perspective:1000px]">
                <motion.div
                    className="pointer-events-auto w-full max-w-[300px] h-[450px] sm:max-w-[700px] sm:h-96"
                    style={{ rotateX, rotateY }}
                    initial={initial}
                    animate={animate}
                    transition={{
                        x: { type: "spring", stiffness: isMobile ? 140 : 120, damping: isMobile ? 18 : 20, mass: 0.8 },
                        y: { type: "spring", stiffness: 130, damping: 22 },
                        rotate: { type: "spring", stiffness: 90, damping: 16 },
                        scale: { duration: 0.6, ease: "easeOut" },
                        opacity: { duration: 0.2 },
                    }}
                    onMouseMove={(e) => {
                        if (flipped) return;
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
                        className="relative w-full h-full [transform-style:preserve-3d]"
                        animate={{ rotateY: flipped ? 180 : 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                        {/* FRONT */}
                        <CardFront onFlip={() => setFlipped(true)} />

                        {/* BACK — Chat */}
                        <CardChat onBack={() => setFlipped(false)} />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
