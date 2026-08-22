import { useEffect, useRef, useState } from "react";

const INTERACTIVE_SELECTOR =
    'a, button, [role="button"], input, select, textarea, label, summary, [data-cursor-hover]';

function isInteractive(target: EventTarget | null): boolean {
    if (!(target instanceof Element)) return false;
    if (target.closest(INTERACTIVE_SELECTOR)) return true;
    return getComputedStyle(target).cursor === "pointer";
}

export default function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const dot = dotRef.current;
        const glow = glowRef.current;
        if (!dot || !glow) return;

        let mouseX = 0;
        let mouseY = 0;
        let glowX = 0;
        let glowY = 0;
        let raf: number;

        const onMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        };

        const onOver = (e: MouseEvent) => {
            if (isInteractive(e.target)) setIsHovering(true);
        };
        const onOut = (e: MouseEvent) => {
            if (isInteractive(e.target)) setIsHovering(false);
        };

        const animate = () => {
            glowX += (mouseX - glowX) * 0.1;
            glowY += (mouseY - glowY) * 0.1;
            glow.style.transform = `translate(${glowX}px, ${glowY}px)`;
            raf = requestAnimationFrame(animate);
        };

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseover", onOver);
        window.addEventListener("mouseout", onOut);
        raf = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseover", onOver);
            window.removeEventListener("mouseout", onOut);
            cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <>
            {/* Trailing glow */}
            <div
                ref={glowRef}
                className="pointer-events-none fixed top-0 left-0 z-[9999] will-change-transform"
                style={{ transform: "translate(-999px, -999px)" }}
            >
                <div
                    className="transition-transform duration-200 ease-out"
                    style={{
                        width: 40,
                        height: 40,
                        marginLeft: -20,
                        marginTop: -20,
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(245,177,204,0.35) 0%, rgba(245,177,204,0) 70%)",
                        filter: "blur(4px)",
                        transform: isHovering ? "scale(1.8)" : "scale(1)",
                    }}
                />
            </div>

            {/* Cursor dot */}
            <div
                ref={dotRef}
                className="pointer-events-none fixed top-0 left-0 z-[9999] will-change-transform"
                style={{ transform: "translate(-999px, -999px)" }}
            >
                <div
                    className="transition-transform duration-200 ease-out"
                    style={{
                        width: 6,
                        height: 6,
                        marginLeft: -3,
                        marginTop: -3,
                        borderRadius: "50%",
                        background: "#f5b1cc",
                        boxShadow: isHovering
                            ? "0 0 10px 4px rgba(245,177,204,0.8)"
                            : "0 0 6px 2px rgba(245,177,204,0.6)",
                        transform: isHovering ? "scale(3.5)" : "scale(1)",
                    }}
                />
            </div>
        </>
    );
}
