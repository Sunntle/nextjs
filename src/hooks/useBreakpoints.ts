"use client"
import { useEffect, useState } from "react";

/**
 * Custom hook that tells you whether a given media query is active.
 *
 * Inspired by https://usehooks.com/useMedia/
 * https://gist.github.com/gragland/ed8cac563f5df71d78f4a1fefa8c5633
 */
export function useMediaQuery(query:string) {
  const [matches, setMatches] = useState(false);
  useEffect(
    () => {
      const mediaQuery = window.matchMedia(query);
      setMatches(mediaQuery.matches);
      const handler = (event:MediaQueryListEvent) => setMatches(event.matches);
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    },
    [] // Empty array ensures effect is only run on mount and unmount
  );
  return matches;
}

export function useBreakpoints() {
  const breakpoints = {
    isXs: useMediaQuery("(max-width: 575px)"),
    isSm: useMediaQuery("(min-width: 576px) and (max-width: 768px)"),
    isMd: useMediaQuery("(min-width: 769px) and (max-width: 992px)"),
    isLg: useMediaQuery("(min-width: 993px) and (max-width: 1200px)"),
    isXL: useMediaQuery("(min-width: 1201px) and (max-width: 1400px)"),
    isXXL: useMediaQuery("(min-width: 1401px)"),
    active: "xs"
  };
  if (breakpoints.isXs) breakpoints.active = "xs";
  if (breakpoints.isSm) breakpoints.active = "sm";
  if (breakpoints.isMd) breakpoints.active = "md";
  if (breakpoints.isLg) breakpoints.active = "lg";
  if (breakpoints.isXL) breakpoints.active = "xl";
  if (breakpoints.isXXL) breakpoints.active = "xxl";
  return breakpoints;
}
