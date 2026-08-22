import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { Theme, useTheme } from "~/utils/theme-provider";
import { readHslVar } from "~/utils/three-theme-color.client";

type Props = {
    scrollContainerRef: RefObject<HTMLElement>;
};

/**
 * Persistent chrome/glass torus knot pinned in the corner across every
 * route. Idles with a slow spin and briefly spins up in response to page
 * scroll, so it reads as a living identity mark rather than a static logo.
 */
export default function IdentityOrb({ scrollContainerRef }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [theme] = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Hidden below `sm` (see the canvas's `hidden sm:block` classes) —
        // on short mobile viewports the fixed corner badge collides with
        // whatever content ends up in that corner, so skip the render loop
        // entirely there rather than spend GPU/battery on something unseen.
        if (!window.matchMedia("(min-width: 640px)").matches) return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        const mainColor = readHslVar("--main-color", "#00a693");
        const accentColor = readHslVar("--accent-color", "#f5b1cc");
        // --main-color and --accent-color are identical between light and
        // dark (only frutiger's tokens differ), so swap which one leads in
        // dark mode — otherwise the knot reads as the same color everywhere.
        const isDark = theme === Theme.DARK;
        const primaryColor = isDark ? accentColor : mainColor;
        const rimColor = isDark ? mainColor : accentColor;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 20);

        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const setCanvasSize = () => {
            const size = canvas.clientWidth || 96;
            renderer.setSize(size, size, false);
        };
        setCanvasSize();

        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        const envMap = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
        scene.environment = envMap;
        pmremGenerator.dispose();

        scene.add(new THREE.AmbientLight(0xffffff, 0.5));

        const keyLight = new THREE.PointLight(0xffffff, 1.7, 20);
        keyLight.position.set(3, 3, 4);
        scene.add(keyLight);

        const rimLight = new THREE.PointLight(rimColor, 1.3, 20);
        rimLight.position.set(-3, -2, 2);
        scene.add(rimLight);

        const geometry = new THREE.TorusKnotGeometry(0.85, 0.26, 180, 24);
        const material = new THREE.MeshPhysicalMaterial({
            color: primaryColor,
            metalness: 0.85,
            roughness: 0.06,
            clearcoat: 1,
            clearcoatRoughness: 0.05,
            envMapIntensity: 1.8,
        });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Fit the camera to the knot's true bounding sphere (its winding
        // extends further than radius+tube alone) with margin so it never
        // clips the canvas edge at any rotation.
        geometry.computeBoundingSphere();
        const boundingRadius = geometry.boundingSphere?.radius ?? 1.2;
        const fovRadians = (camera.fov * Math.PI) / 180;
        camera.position.set(0, 0, (boundingRadius / Math.sin(fovRadians / 2)) * 1.35);

        const scrollEl = scrollContainerRef.current;
        let lastScrollTop = scrollEl?.scrollTop ?? 0;
        let scrollBoost = 0;

        const onScroll = () => {
            if (!scrollEl) return;
            const delta = scrollEl.scrollTop - lastScrollTop;
            lastScrollTop = scrollEl.scrollTop;
            scrollBoost += delta * 0.002;
        };
        scrollEl?.addEventListener("scroll", onScroll, { passive: true });

        const onResize = () => setCanvasSize();
        window.addEventListener("resize", onResize);

        let running = true;
        const onVisibilityChange = () => {
            running = !document.hidden;
        };
        document.addEventListener("visibilitychange", onVisibilityChange);

        let rafId: number;
        const clock = new THREE.Clock();

        const animate = () => {
            rafId = requestAnimationFrame(animate);
            if (!running) return;

            const delta = clock.getDelta();

            if (!prefersReducedMotion) {
                scrollBoost *= 0.92;
                mesh.rotation.y += delta * 0.25 + scrollBoost;
                mesh.rotation.x += delta * 0.08;
            }

            renderer.render(scene, camera);
        };
        rafId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(rafId);
            scrollEl?.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
            document.removeEventListener("visibilitychange", onVisibilityChange);
            geometry.dispose();
            material.dispose();
            envMap.dispose();
            renderer.dispose();
        };
    }, [theme, scrollContainerRef]);

    return (
        <canvas
            ref={canvasRef}
            className="hidden sm:block fixed bottom-6 right-6 z-50 h-24 w-24 pointer-events-none"
            aria-hidden="true"
        />
    );
}
