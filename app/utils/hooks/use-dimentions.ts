import { useState, useEffect, useRef } from 'react';

interface Dimensions {
  width: number;
  height: number;
}

function useDimensions<T extends HTMLElement>(): [Dimensions, React.RefObject<T>] {
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 });
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    // Create a resize observer to observe changes in dimensions
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;

      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });

    resizeObserver.observe(element);

    // Cleanup the observer on component unmount
    return () => {
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, []);

  return [dimensions, elementRef];
}

export default useDimensions;
