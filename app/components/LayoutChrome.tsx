"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import SiteFooter from "@/app/components/SiteFooter";
import DockNav from "@/app/components/DockNav";
import ThemeToggle from "@/app/components/ThemeToggle";

export default function LayoutChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const isHome = pathname === "/";
  const reduceMotion = useReducedMotion();

  return (
    <>
      {/* Home already renders its own nav/footer in the design */}
      {!isHome && <DockNav />}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.38,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      {!isHome && <ThemeToggle />}
      {!isHome && <SiteFooter />}
    </>
  );
}

