import { motion } from "framer-motion";

export default function PageLoadCircle() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none flex items-end justify-start">
            <motion.div
                className="sm:w-64 sm:h-64 w-24 h-24 rounded-full bg-caret-color dark:bg-sub-color mix-blend-difference"
                initial={{ scale: 0 }}
                animate={{ scale: 4 }}
                transition={{ duration: 2, delay: 0.1 }}
            />
        </div>
    );
}
