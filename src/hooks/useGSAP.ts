import { useEffect, useRef } from "react";
import type { DependencyList, RefObject } from "react";
import { gsap as gsapApi } from "gsap";
import { ScrollTrigger as ScrollTriggerApi } from "gsap/ScrollTrigger";

type GSAPCore = typeof gsapApi;
type ScrollTriggerCore = typeof ScrollTriggerApi;

gsapApi.registerPlugin(ScrollTriggerApi);

export function useGSAP(
  setup: (gsap: GSAPCore, ScrollTrigger: ScrollTriggerCore) => void | (() => void),
  deps: DependencyList = [],
) {
  const ref = useRef<HTMLElement>(null);
  const setupRef = useRef(setup);
  setupRef.current = setup;

  useEffect(() => {
    const ctx = gsapApi.context(() => {
      setupRef.current(gsapApi, ScrollTriggerApi);
    }, ref);

    return () => {
      ctx.revert();
      ScrollTriggerApi.getAll().forEach((st) => st.kill());
    };
  }, deps);

  return ref as RefObject<HTMLElement>;
}