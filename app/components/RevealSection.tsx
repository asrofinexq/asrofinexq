"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

type As = "div" | "section" | "footer" | "main";

const motionMap = {
  div: motion.div,
  section: motion.section,
  footer: motion.footer,
  main: motion.main,
} as const;

/** Arah konten “masuk” saat memasuki viewport (keluar viewport mengembalikan ke offset yang sama). */
export type RevealFrom = "up" | "down" | "left" | "right";

/** Perjalanan lebih pendek + durasi lebih panjang = terasa halus, tidak “tersentak”. */
const OFFSET = 28;
const BLUR = "5px";

function initialFor(from: RevealFrom, blurReveal: boolean) {
  const blurStyle = blurReveal ? (`blur(${BLUR})` as const) : ("none" as const);
  const base = { opacity: 0, scale: 0.992, filter: blurStyle } as const;
  switch (from) {
    case "up":
      return { ...base, x: 0, y: OFFSET };
    case "down":
      return { ...base, x: 0, y: -OFFSET };
    case "left":
      return { ...base, x: -OFFSET, y: 0, scale: 0.994 };
    case "right":
      return { ...base, x: OFFSET, y: 0, scale: 0.994 };
  }
}

function visibleStateFor(blurReveal: boolean) {
  return {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    filter: blurReveal ? ("blur(0px)" as const) : ("none" as const),
  };
}

export type RevealSectionProps = {
  as?: As;
  className?: string;
  children: ReactNode;
  /** Tunda mulai (detik) saat pertama kali masuk viewport (kunjungan berikutnya tanpa tunda). */
  delay?: number;
  id?: string;
  /** Seberapa banyak elemen masuk viewport sebelum trigger (0–1). */
  amount?: number;
  /** Arah slide + fade saat konten terlihat; berlaku dua arah saat scroll. */
  from?: RevealFrom;
  /** Margin viewport (CSS), mis. "-12% 0px" agar trigger lebih awal. */
  margin?: string;
  /**
   * false = tanpa animasi blur (jauh lebih ringan saat pertama masuk viewport; kurangi “patah-patah”).
   */
  blurReveal?: boolean;
  /** True = render awal langsung terlihat (untuk mencegah "double appear" saat transisi route). */
  initialVisible?: boolean;
};

export function RevealSection({
  as = "div",
  className,
  children,
  delay = 0,
  id,
  amount = 0.18,
  from = "up",
  margin = "0px 0px -10% 0px",
  blurReveal = true,
  initialVisible = false,
}: RevealSectionProps) {
  const reduce = useReducedMotion();
  const [isVisible, setIsVisible] = useState(initialVisible);
  const [hasEntered, setHasEntered] = useState(initialVisible);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const nodeRef = useRef<HTMLElement | null>(null);

  if (reduce) {
    const Tag = as;
    return (
      <Tag id={id} className={className}>
        {children}
      </Tag>
    );
  }

  const Motion = motionMap[as];
  const initial = useMemo(() => initialFor(from, blurReveal), [from, blurReveal]);
  const visibleState = useMemo(() => visibleStateFor(blurReveal), [blurReveal]);
  const initialState = initialVisible ? visibleState : initial;

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        const visible = entry.isIntersecting;
        setIsVisible(visible);
        if (visible) setHasEntered(true);
      },
      {
        root: null,
        rootMargin: margin,
        threshold: [0, amount, 1],
      },
    );

    observerRef.current.observe(node);

    return () => observerRef.current?.disconnect();
  }, [amount, margin]);

  return (
    <Motion
      ref={(el) => {
        nodeRef.current = el as HTMLElement | null;
      }}
      id={id}
      className={className}
      initial={initialState}
      animate={isVisible ? visibleState : initial}
      transition={{
        duration: blurReveal ? 1.22 : 0.92,
        delay: hasEntered ? 0 : delay,
        /** easeOut panjang: mulai responsif, akhir menyatu pelan */
        ease: [0.16, 0.84, 0.24, 1],
        opacity: { duration: blurReveal ? 1.05 : 0.82, ease: [0.2, 0.8, 0.2, 1] },
        ...(blurReveal
          ? { filter: { duration: 1.12, ease: [0.16, 0.84, 0.24, 1] } }
          : {}),
        x: { duration: blurReveal ? 1.22 : 0.92, ease: [0.16, 0.84, 0.24, 1] },
        y: { duration: blurReveal ? 1.22 : 0.92, ease: [0.16, 0.84, 0.24, 1] },
        scale: { duration: blurReveal ? 1.28 : 0.95, ease: [0.16, 0.84, 0.24, 1] },
      }}
    >
      {children}
    </Motion>
  );
}

export default RevealSection;
