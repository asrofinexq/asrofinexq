"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  type Transition,
} from "motion/react";
import React, { Children, cloneElement, useEffect, useMemo, useRef, useState } from "react";
import type { MotionValue } from "motion/react";

export type DockItemData = {
  icon: React.ReactNode;
  label: React.ReactNode;
  onClick: () => void;
  className?: string;
};

export type DockProps = {
  items: DockItemData[];
  className?: string;
  distance?: number;
  panelHeight?: number;
  baseItemSize?: number;
  dockHeight?: number;
  magnification?: number;
  spring?: SpringOptions;
  /** Framer layout id untuk animasi lebar panel saat jumlah item berubah */
  enablePanelLayout?: boolean;
  /** Ganti transisi layout panel (mis. durasi lambat untuk tur beranda) */
  panelLayoutTransition?: Transition;
  /** Kunci hover sementara supaya spacing tetap stabil selama transisi */
  hoverEnabled?: boolean;
};

type DockItemProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  mouseX: MotionValue<number>;
  spring: SpringOptions;
  distance: number;
  baseItemSize: number;
  magnification: number;
};

function DockItem({
  children,
  className = "",
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: baseItemSize };
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize],
  );
  const size = useSpring(targetSize, spring);

  return (
    <motion.div
      ref={ref}
      style={{
        width: size,
        height: size,
        aspectRatio: "1 / 1",
        borderRadius: "50%",
        flex: "0 0 auto",
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => {
        // Saat klik/tab, `isHovered` bisa aktif sementara `mouseX` belum di-set.
        // Set `mouseX` ke pusat item supaya ukuran tidak melonjak dan panel tetap stabil.
        const rect = ref.current?.getBoundingClientRect();
        if (rect) mouseX.set(rect.left + baseItemSize / 2);
        isHovered.set(1);
      }}
      onBlur={() => isHovered.set(0)}
      onClick={() => {
        // Saat navigasi via klik, reset state hover/focus agar animasi perpindahan tidak ikut "nyangkut".
        isHovered.set(0);
        mouseX.set(Infinity);
        onClick?.();
      }}
      className={`asro-dock-item ${className}`}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
    >
      {Children.map(children, (child) =>
        React.isValidElement(child)
          ? cloneElement(child as React.ReactElement<{ isHovered?: MotionValue<number> }>, { isHovered })
          : child,
      )}
    </motion.div>
  );
}

type DockLabelProps = {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
};

function DockLabel({ children, className = "", isHovered }: DockLabelProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on("change", (latest) => setIsVisible(latest === 1));
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`asro-dock-tooltip ${className}`}
          role="tooltip"
          style={{ transform: "translateX(-50%)" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children }: { children: React.ReactNode }) {
  return <div className="asro-dock-icon">{children}</div>;
}

const DOCK_PANEL_BORDER_PX = 2; /* 1px solid tiap sisi */

/** Ukuran panel tanpa layout-FLIP (hindari scale gepeng); sinkron dengan tween width/height/padding */
function dockPanelMetrics(
  itemCount: number,
  baseItemSize: number,
  panelHeight: number,
): {
  width: number;
  height: number;
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
  gap: number;
} {
  const gap = 16;
  const padXMulti = 14;
  const padYMulti = 10;

  if (itemCount <= 1) {
    const side = panelHeight;
    const inner = side - DOCK_PANEL_BORDER_PX;
    const pad = Math.max(0, (inner - baseItemSize) / 2);
    return {
      width: side,
      height: side,
      paddingTop: pad,
      paddingBottom: pad,
      paddingLeft: pad,
      paddingRight: pad,
      gap: 0,
    };
  }

  const contentW = itemCount * baseItemSize + (itemCount - 1) * gap;
  const width = DOCK_PANEL_BORDER_PX + padXMulti * 2 + contentW;
  return {
    width,
    height: panelHeight,
    paddingTop: padYMulti,
    paddingBottom: padYMulti,
    paddingLeft: padXMulti,
    paddingRight: padXMulti,
    gap,
  };
}

export default function Dock({
  items,
  className = "",
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 200,
  panelHeight = 64,
  dockHeight = 256,
  baseItemSize = 50,
  enablePanelLayout = false,
  panelLayoutTransition,
  hoverEnabled = true,
}: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  useEffect(() => {
    // Saat mode berubah (mis. 5 tombol -> 1 tombol -> balik lagi),
    // reset hover distance agar ukuran item tidak mewarisi state lama.
    isHovered.set(0);
    mouseX.set(Infinity);
  }, [items.length, enablePanelLayout, mouseX, isHovered]);

  useEffect(() => {
    if (hoverEnabled) return;
    isHovered.set(0);
    mouseX.set(Infinity);
  }, [hoverEnabled, mouseX, isHovered]);

  const panelMetrics = useMemo(
    () => dockPanelMetrics(items.length, baseItemSize, panelHeight),
    [items.length, baseItemSize, panelHeight],
  );

  const layoutSpring = { type: "spring" as const, stiffness: 380, damping: 32 };
  const panelTransition =
    enablePanelLayout && panelLayoutTransition
      ? panelLayoutTransition
      : enablePanelLayout
        ? {
            width: layoutSpring,
            height: layoutSpring,
            paddingTop: layoutSpring,
            paddingBottom: layoutSpring,
            paddingLeft: layoutSpring,
            paddingRight: layoutSpring,
            gap: layoutSpring,
          }
        : undefined;

  return (
    <motion.div
      style={{ height: panelHeight, scrollbarWidth: "none", overflow: "visible" }}
      className={`asro-dock-shell ${className ?? ""}`.trim()}
    >
      <motion.div
        onMouseMove={({ pageX }) => {
          if (!hoverEnabled) return;
          isHovered.set(1);
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={`asro-dock-panel${enablePanelLayout ? " asro-dock-panel--tween-size" : ""}`}
        style={
          enablePanelLayout
            ? {
                overflow: "visible",
                boxSizing: "border-box",
                display: "flex",
                flexWrap: "nowrap",
                alignItems: "center",
                justifyContent: "center",
              }
            : { height: panelHeight, overflow: "visible" }
        }
        role="toolbar"
        aria-label="Application dock"
        initial={enablePanelLayout ? false : undefined}
        animate={
          enablePanelLayout
            ? {
                width: panelMetrics.width,
                height: panelMetrics.height,
                paddingTop: panelMetrics.paddingTop,
                paddingBottom: panelMetrics.paddingBottom,
                paddingLeft: panelMetrics.paddingLeft,
                paddingRight: panelMetrics.paddingRight,
                gap: panelMetrics.gap,
              }
            : undefined
        }
        transition={enablePanelLayout ? panelTransition : undefined}
      >
        {items.map((item, index) => (
          <DockItem
            key={`${items.length}-${index}`}
            onClick={item.onClick}
            className={item.className}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </motion.div>
  );
}

