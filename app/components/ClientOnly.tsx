import { useEffect, useState, type ReactNode } from "react";

type Props = {
  children: () => ReactNode;
  fallback?: ReactNode;
};

/**
 * Defers rendering `children` until after client-side hydration. Used to
 * keep browser-only modules (e.g. Three.js `.client.tsx` components, which
 * resolve to an empty module on the server) out of SSR entirely.
 */
export function ClientOnly({ children, fallback = null }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return <>{mounted ? children() : fallback}</>;
}
