import { useEffect, useState } from "react";

import { InteractiveGrid } from "./InteractiveGrid.tsx";
import { FallbackGrid } from "./FallbackGrid.tsx";

export function Grid() {
  const [isCanvasGridVisible, setCanvasGridVisibility] = useState(false);
  const [isSvgFallbackGridVisible, setSvgFallbackGridVisibility] =
    useState(true);

  function onCanvasInit(): void {
    setSvgFallbackGridVisibility(false);
  }

  function onHomeLogoEnterAnimationComplete(): void {
    setCanvasGridVisibility(true);
  }

  useEffect(() => {
    // Simulate the home logo enter animation completing after 1 second.
    const timer = setTimeout(() => {
      onHomeLogoEnterAnimationComplete();
    }, 1000);

    return (): void => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-dvh overflow-hidden z-0">
      {/* Interactive canvas grid */}
      {isCanvasGridVisible && <InteractiveGrid onInit={onCanvasInit} />}

      {/* SVG fallback grid */}
      {isSvgFallbackGridVisible && <FallbackGrid />}
    </div>
  );
}
