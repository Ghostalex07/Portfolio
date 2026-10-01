import { useEffect, useRef } from "react";
import type { DependencyList, RefObject } from "react";
import { gsap as gsapApi } from "gsap";
import { ScrollTrigger as ScrollTriggerApi } from "gsap/ScrollTrigger";

type GSAPCore = typeof gsapApi;
type ScrollTriggerCore = typeof ScrollTriggerApi;

gsapApi.registerPlugin(ScrollTriggerApi);

export function useGSAP<T extends HTMLElement = HTMLElement>(
  setup: (gsap: GSAPCore, ScrollTrigger: ScrollTriggerCore) => void,
  deps: DependencyList = [],
) {
  const ref = useRef<T>(null);
  const setupRef = useRef(setup);
  setupRef.current = setup;

  useEffect(() => {
    // gsap.context() lee ref.current de forma lazy, dentro del closure: para cuando
    // corre el effect el ref ya está adjunto al DOM.
    const ctx = gsapApi.context(() => {
      setupRef.current(gsapApi, ScrollTriggerApi);
    }, ref);

    return () => {
      // ctx.revert() ya mata los tweens y ScrollTrigger creados dentro del contexto.
      // NO usar ScrollTrigger.getAll().forEach(st => st.kill()): eso destruye los
      // triggers del resto del documento y deja los elementos en su estado inicial.
      ctx.revert();
    };
  }, deps);

  return ref as RefObject<T>;
}
