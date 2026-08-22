import * as THREE from "three";

/**
 * Reads an `h s% l%` custom property (Tailwind's HSL token format) off :root
 * and returns it as a THREE.Color. Falls back to `fallback` if parsing fails.
 */
export function readHslVar(name: string, fallback: string): THREE.Color {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const match = raw.match(/^([\d.]+)(?:deg)?\s+([\d.]+)%\s+([\d.]+)%$/);
    if (!match) return new THREE.Color(fallback);
    const [, h, s, l] = match;
    return new THREE.Color(`hsl(${h}, ${s}%, ${l}%)`);
}
