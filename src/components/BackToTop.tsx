import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { ArrowUp } from "@phosphor-icons/react";
import { useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();

  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > 640));

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          key="back-to-top"
          href="#main"
          aria-label="Back to top"
          className="back-to-top group fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-pill border border-surface-border bg-surface-raised shadow-lift transition-colors hover:border-accent/50 hover:text-accent"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: 12 }}
          transition={{ duration: reduce ? 0 : 0.2, ease: "easeOut" }}
        >
          <ArrowUp className="h-5 w-5 text-text-secondary transition-colors group-hover:text-accent" weight="bold" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}