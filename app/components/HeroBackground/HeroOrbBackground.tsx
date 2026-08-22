import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useTheme } from "~/utils/theme-provider";

/**
 * Reads an `--h s% l%` custom property (Tailwind's HSL token format) off :root
 * and returns it as a THREE.Color. Falls back to `fallback` if parsing fails.
 */
function readHslVar(name: string, fallback: string): THREE.Color {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const match = raw.match(/^([\d.]+)(?:deg)?\s+([\d.]+)%\s+([\d.]+)%$/);
    if (!match) return new THREE.Color(fallback);
    const [, h, s, l] = match;
    return new THREE.Color(`hsl(${h}, ${s}%, ${l}%)`);
}

const ORB_COUNT = 16;

type Orb = {
    mesh: THREE.Mesh;
    basePosition: THREE.Vector3;
    floatSpeed: number;
    floatPhase: number;
    floatAmplitude: number;
    spinSpeed: THREE.Vector2;
};

export default function HeroOrbBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [theme] = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        const accentColor = readHslVar("--accent-color", "#f5b1cc");
        const mainColor = readHslVar("--main-color", "#00a693");
        const subColor = readHslVar("--sub-color", "#ffb37b");
        const palette = [accentColor, mainColor, subColor];

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            50,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );
        camera.position.z = 9;

        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);

        // One-time env map so clearcoat/metalness pick up soft reflections
        // instead of reading flat — this is computed once, not per frame.
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        const envMap = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
        scene.environment = envMap;
        pmremGenerator.dispose();

        scene.add(new THREE.AmbientLight(0xffffff, 0.55));

        const keyLight = new THREE.PointLight(0xffffff, 1.4, 30);
        keyLight.position.set(6, 6, 8);
        scene.add(keyLight);

        const accentLight = new THREE.PointLight(accentColor, 1.6, 25);
        accentLight.position.set(-6, -3, 6);
        scene.add(accentLight);

        const mainLight = new THREE.PointLight(mainColor, 1.1, 25);
        mainLight.position.set(4, -5, 4);
        scene.add(mainLight);

        const subLight = new THREE.PointLight(subColor, 0.9, 25);
        subLight.position.set(0, 7, -4);
        scene.add(subLight);

        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const orbs: Orb[] = [];
        const group = new THREE.Group();

        for (let i = 0; i < ORB_COUNT; i++) {
            const orbColor = palette[i % palette.length].clone();
            orbColor.offsetHSL(
                THREE.MathUtils.randFloatSpread(0.06),
                THREE.MathUtils.randFloatSpread(0.16),
                THREE.MathUtils.randFloatSpread(0.14)
            );

            const material = new THREE.MeshPhysicalMaterial({
                color: orbColor,
                metalness: 0.4,
                roughness: 0.08,
                clearcoat: 1,
                clearcoatRoughness: 0.06,
                envMapIntensity: 1.6,
                transparent: true,
                opacity: 0.75,
            });

            const mesh = new THREE.Mesh(geometry, material);
            const scale = THREE.MathUtils.randFloat(0.28, 0.85);
            mesh.scale.setScalar(scale);

            const basePosition = new THREE.Vector3(
                THREE.MathUtils.randFloatSpread(16),
                THREE.MathUtils.randFloatSpread(9),
                THREE.MathUtils.randFloatSpread(6) - 2
            );
            mesh.position.copy(basePosition);

            group.add(mesh);
            orbs.push({
                mesh,
                basePosition,
                floatSpeed: THREE.MathUtils.randFloat(0.15, 0.4),
                floatPhase: Math.random() * Math.PI * 2,
                floatAmplitude: THREE.MathUtils.randFloat(0.3, 0.8),
                spinSpeed: new THREE.Vector2(
                    THREE.MathUtils.randFloat(-0.15, 0.15),
                    THREE.MathUtils.randFloat(-0.15, 0.15)
                ),
            });
        }

        scene.add(group);

        const pointer = { x: 0, y: 0 };
        const targetPointer = { x: 0, y: 0 };
        const worldPointer = new THREE.Vector3();
        const repulsionRadius = 3.2;

        const onPointerMove = (e: PointerEvent) => {
            targetPointer.x = (e.clientX / window.innerWidth) * 2 - 1;
            targetPointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener("pointermove", onPointerMove);

        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
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

            const elapsed = clock.getElapsedTime();

            pointer.x += (targetPointer.x - pointer.x) * 0.06;
            pointer.y += (targetPointer.y - pointer.y) * 0.06;

            camera.position.x += (pointer.x * 1.2 - camera.position.x) * 0.04;
            camera.position.y += (pointer.y * 0.8 - camera.position.y) * 0.04;
            camera.lookAt(0, 0, 0);

            worldPointer.set(pointer.x * 8, pointer.y * 4.5, 0);

            for (const orb of orbs) {
                const floatOffset = prefersReducedMotion
                    ? 0
                    : Math.sin(elapsed * orb.floatSpeed + orb.floatPhase) *
                      orb.floatAmplitude;

                let targetX = orb.basePosition.x;
                let targetY = orb.basePosition.y + floatOffset;
                const targetZ = orb.basePosition.z;

                if (!prefersReducedMotion) {
                    const toOrb = new THREE.Vector2(
                        orb.basePosition.x - worldPointer.x,
                        orb.basePosition.y + floatOffset - worldPointer.y
                    );
                    const dist = toOrb.length();
                    if (dist < repulsionRadius) {
                        const push = (1 - dist / repulsionRadius) * 1.4;
                        toOrb.normalize().multiplyScalar(push);
                        targetX += toOrb.x;
                        targetY += toOrb.y;
                    }

                    orb.mesh.rotation.x += orb.spinSpeed.x * 0.02;
                    orb.mesh.rotation.y += orb.spinSpeed.y * 0.02;
                }

                orb.mesh.position.x += (targetX - orb.mesh.position.x) * 0.08;
                orb.mesh.position.y += (targetY - orb.mesh.position.y) * 0.08;
                orb.mesh.position.z = targetZ;
            }

            renderer.render(scene, camera);
        };
        rafId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("resize", onResize);
            document.removeEventListener("visibilitychange", onVisibilityChange);
            geometry.dispose();
            for (const orb of orbs) {
                (orb.mesh.material as THREE.Material).dispose();
            }
            envMap.dispose();
            renderer.dispose();
        };
    }, [theme]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none"
            aria-hidden="true"
        />
    );
}
