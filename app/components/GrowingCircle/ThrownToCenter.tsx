import { motion } from "framer-motion";

export default function ThrownToCenter() {
    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gray-50 overflow-hidden">
            <motion.div
                className="w-80 h-56 bg-white shadow-lg rounded-2xl p-6"
                initial={{
                    x: -800,
                    y: 300,
                    rotate: -30,
                    opacity: 0,
                    scale: 0.9,
                }}
                animate={{
                    x: 0,
                    y: 0,
                    rotate: 0,
                    opacity: 1,
                    scale: 1,
                }}
                transition={{
                    // physics-like horizontal throw
                    x: {
                        type: "inertia",
                        velocity: 1500,
                        power: 0.8,
                        timeConstant: 450,
                    },
                    // physics-like vertical motion
                    y: {
                        type: "inertia",
                        velocity: -1100,
                        power: 0.8,
                        timeConstant: 450,
                    },
                    // smoother settle for rotation and size
                    rotate: { type: "spring", stiffness: 120, damping: 14 },
                    scale: { duration: 0.5, ease: "easeOut" },
                    opacity: { duration: 0.4 },
                }}
            >
                {/* content inside the card */}
                <h3 className="text-xl font-bold mb-2">Project Title</h3>
                <p className="text-gray-600 text-sm">
                    A brief summary of this project goes here.
                </p>
            </motion.div>
        </div>
    );
}
