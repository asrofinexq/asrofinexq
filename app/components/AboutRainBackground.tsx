"use client";

import { useMemo } from "react";

type AboutRainBackgroundProps = {
  className?: string;
};

type Drop = {
  left: number;
  delay: number;
  duration: number;
  opacity: number;
  height: number;
};

const DROP_COUNT = 52;

export default function AboutRainBackground({ className }: AboutRainBackgroundProps) {
  const drops = useMemo<Drop[]>(
    () =>
      Array.from({ length: DROP_COUNT }, () => ({
        left: Math.random() * 100,
        delay: -Math.random() * 4.2,
        duration: 1.9 + Math.random() * 2.7,
        opacity: 0.16 + Math.random() * 0.34,
        height: 16 + Math.random() * 28,
      })),
    [],
  );

  return (
    <div className={className} aria-hidden>
      {drops.map((drop, idx) => (
        <span
          // eslint-disable-next-line react/no-array-index-key
          key={idx}
          className="about-rain__drop"
          style={
            {
              left: `${drop.left}%`,
              height: `${drop.height}px`,
              opacity: drop.opacity,
              animationDelay: `${drop.delay}s`,
              animationDuration: `${drop.duration}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
