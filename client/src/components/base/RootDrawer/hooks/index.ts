import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const currentWindow = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
    );

    const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    currentWindow.addEventListener("change", onChange);

    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    return () => currentWindow.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
