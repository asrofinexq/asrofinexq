"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_INNER_GRADIENT =
  "linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)";

const ANIMATION_CONFIG = {
  INITIAL_DURATION: 1200,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  DEVICE_BETA_OFFSET: 20,
  ENTER_TRANSITION_MS: 180,
} as const;

const clamp = (v: number, min = 0, max = 100): number =>
  Math.min(Math.max(v, min), max);
const round = (v: number, precision = 3): number =>
  parseFloat(v.toFixed(precision));
const adjust = (
  v: number,
  fMin: number,
  fMax: number,
  tMin: number,
  tMax: number,
): number => round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

// Inject keyframes once
const KEYFRAMES_ID = "pc-keyframes";
if (typeof document !== "undefined" && !document.getElementById(KEYFRAMES_ID)) {
  const style = document.createElement("style");
  style.id = KEYFRAMES_ID;
  style.textContent = `
    @keyframes pc-holo-bg {
      0% { background-position: 0 var(--background-y), 0 0, center; }
      100% { background-position: 0 var(--background-y), 90% 90%, center; }
    }
  `;
  document.head.appendChild(style);
}

export interface ProfileCardProps {
  avatarUrl?: string;
  hoverAvatarUrl?: string;
  iconUrl?: string;
  grainUrl?: string;
  innerGradient?: string;
  behindGlowEnabled?: boolean;
  behindGlowColor?: string;
  behindGlowSize?: string;
  className?: string;
  enableTilt?: boolean;
  enableMobileTilt?: boolean;
  mobileTiltSensitivity?: number;
  miniAvatarUrl?: string;
  name?: string;
  title?: string;
  handle?: string;
  status?: string;
  contactText?: string;
  showUserInfo?: boolean;
  onContactClick?: () => void;
}

interface TiltEngine {
  setImmediate: (x: number, y: number) => void;
  setTarget: (x: number, y: number) => void;
  toCenter: () => void;
  beginInitial: (durationMs: number) => void;
  getCurrent: () => { x: number; y: number; tx: number; ty: number };
  cancel: () => void;
}

const ProfileCardComponent: React.FC<ProfileCardProps> = ({
  avatarUrl = "/profile.svg",
  hoverAvatarUrl,
  iconUrl,
  grainUrl,
  innerGradient,
  behindGlowEnabled = true,
  behindGlowColor,
  behindGlowSize,
  className = "",
  enableTilt = true,
  enableMobileTilt = false,
  mobileTiltSensitivity = 5,
  miniAvatarUrl,
  name = "AsrofinexQ",
  title = "Software Engineer",
  handle = "asrofinexq",
  status = "Online",
  contactText = "Contact",
  showUserInfo = false,
  onContactClick,
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const enterTimerRef = useRef<number | null>(null);
  const leaveRafRef = useRef<number | null>(null);
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);
  // User requested the avatar to be full color by default.
  const defaultAvatarFilter = "none";
  const defaultEffectsOpacity = "1";
  const activeAvatarUrl = isAvatarHovered && hoverAvatarUrl ? hoverAvatarUrl : avatarUrl;

  const tiltEngine = useMemo<TiltEngine | null>(() => {
    if (!enableTilt) return null;

    let rafId: number | null = null;
    let running = false;
    let lastTs = 0;

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const DEFAULT_TAU = 0.14;
    const INITIAL_TAU = 0.6;
    let initialUntil = 0;

    const setVarsFromXY = (x: number, y: number): void => {
      const shell = shellRef.current;
      const wrap = wrapRef.current;
      if (!shell || !wrap) return;

      const width = shell.clientWidth || 1;
      const height = shell.clientHeight || 1;

      const percentX = clamp((100 / width) * x);
      const percentY = clamp((100 / height) * y);

      const centerX = percentX - 50;
      const centerY = percentY - 50;

      const properties: Record<string, string> = {
        "--pointer-x": `${percentX}%`,
        "--pointer-y": `${percentY}%`,
        "--background-x": `${adjust(percentX, 0, 100, 35, 65)}%`,
        "--background-y": `${adjust(percentY, 0, 100, 35, 65)}%`,
        "--pointer-from-center": `${clamp(
          Math.hypot(percentY - 50, percentX - 50) / 50,
          0,
          1,
        )}`,
        "--pointer-from-top": `${percentY / 100}`,
        "--pointer-from-left": `${percentX / 100}`,
        "--rotate-x": `${round(-(centerX / 5))}deg`,
        "--rotate-y": `${round(centerY / 4)}deg`,
        "--card-opacity": `${clamp(Math.hypot(centerX, centerY) / 50, 0, 1)}`,
      };

      for (const [k, v] of Object.entries(properties)) {
        wrap.style.setProperty(k, v);
      }
    };

    const step = (ts: number): void => {
      if (!running) return;
      if (lastTs === 0) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;

      const tau = ts < initialUntil ? INITIAL_TAU : DEFAULT_TAU;
      const k = 1 - Math.exp(-dt / tau);

      currentX += (targetX - currentX) * k;
      currentY += (targetY - currentY) * k;

      setVarsFromXY(currentX, currentY);

      const stillFar =
        Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05;

      if (stillFar || document.hasFocus()) {
        rafId = requestAnimationFrame(step);
      } else {
        running = false;
        lastTs = 0;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const start = (): void => {
      if (running) return;
      running = true;
      lastTs = 0;
      rafId = requestAnimationFrame(step);
    };

    return {
      setImmediate(x: number, y: number): void {
        currentX = x;
        currentY = y;
        setVarsFromXY(currentX, currentY);
      },
      setTarget(x: number, y: number): void {
        targetX = x;
        targetY = y;
        start();
      },
      toCenter(): void {
        const shell = shellRef.current;
        if (!shell) return;
        this.setTarget(shell.clientWidth / 2, shell.clientHeight / 2);
      },
      beginInitial(durationMs: number): void {
        initialUntil = performance.now() + durationMs;
        start();
      },
      getCurrent(): { x: number; y: number; tx: number; ty: number } {
        return { x: currentX, y: currentY, tx: targetX, ty: targetY };
      },
      cancel(): void {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        running = false;
        lastTs = 0;
      },
    };
  }, [enableTilt]);

  const getOffsets = (evt: PointerEvent, el: HTMLElement): { x: number; y: number } => {
    const rect = el.getBoundingClientRect();
    return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
  };

  const handlePointerMove = useCallback(
    (event: PointerEvent): void => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) return;
      const { x, y } = getOffsets(event, shell);
      tiltEngine.setTarget(x, y);
    },
    [tiltEngine],
  );

  const handlePointerEnter = useCallback(
    (event: PointerEvent): void => {
      setIsAvatarHovered(true);
      const shell = shellRef.current;
      if (!shell || !tiltEngine) return;

      shell.classList.add("pc-active");
      shell.classList.add("pc-entering");
      // Hover behavior: turn the avatar back to color.
      wrapRef.current?.style.setProperty("--pc-avatar-filter", "none");
      // Remove overlay effects so colors look normal.
      wrapRef.current?.style.setProperty("--pc-effects-opacity", "0");
      if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
      enterTimerRef.current = window.setTimeout(() => {
        shell.classList.remove("pc-entering");
      }, ANIMATION_CONFIG.ENTER_TRANSITION_MS);

      const { x, y } = getOffsets(event, shell);
      tiltEngine.setTarget(x, y);
    },
    [tiltEngine],
  );

  const handlePointerLeave = useCallback((): void => {
    setIsAvatarHovered(false);
    const shell = shellRef.current;
    if (!shell || !tiltEngine) return;

    tiltEngine.toCenter();
    // Leave behavior: return to monochrome.
    wrapRef.current?.style.setProperty("--pc-avatar-filter", defaultAvatarFilter);
    wrapRef.current?.style.setProperty("--pc-effects-opacity", defaultEffectsOpacity);

    const checkSettle = (): void => {
      const { x, y, tx, ty } = tiltEngine.getCurrent();
      const settled = Math.hypot(tx - x, ty - y) < 0.6;
      if (settled) {
        shell.classList.remove("pc-active");
        leaveRafRef.current = null;
      } else {
        leaveRafRef.current = requestAnimationFrame(checkSettle);
      }
    };
    if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
    leaveRafRef.current = requestAnimationFrame(checkSettle);
  }, [tiltEngine, defaultAvatarFilter, defaultEffectsOpacity]);

  const handleDeviceOrientation = useCallback(
    (event: DeviceOrientationEvent): void => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) return;

      const { beta, gamma } = event;
      if (beta == null || gamma == null) return;

      const centerX = shell.clientWidth / 2;
      const centerY = shell.clientHeight / 2;
      const x = clamp(centerX + gamma * mobileTiltSensitivity, 0, shell.clientWidth);
      const y = clamp(
        centerY + (beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) * mobileTiltSensitivity,
        0,
        shell.clientHeight,
      );

      tiltEngine.setTarget(x, y);
    },
    [tiltEngine, mobileTiltSensitivity],
  );

  useEffect(() => {
    // Default avatar filter (monochrome). Hover switches it to color.
    wrapRef.current?.style.setProperty("--pc-avatar-filter", defaultAvatarFilter);
    wrapRef.current?.style.setProperty("--pc-effects-opacity", defaultEffectsOpacity);
    if (!enableTilt || !tiltEngine) return;
    const shell = shellRef.current;
    if (!shell) return;

    const pointerMoveHandler = handlePointerMove as EventListener;
    const pointerEnterHandler = handlePointerEnter as EventListener;
    const pointerLeaveHandler = handlePointerLeave as EventListener;
    const deviceOrientationHandler = handleDeviceOrientation as EventListener;

    shell.addEventListener("pointerenter", pointerEnterHandler);
    shell.addEventListener("pointermove", pointerMoveHandler, { passive: true });
    shell.addEventListener("pointerleave", pointerLeaveHandler);

    const handleClick = (): void => {
      if (!enableMobileTilt || location.protocol !== "https:") return;
      const anyMotion = window.DeviceMotionEvent as typeof DeviceMotionEvent & {
        requestPermission?: () => Promise<string>;
      };
      if (anyMotion && typeof anyMotion.requestPermission === "function") {
        anyMotion
          .requestPermission()
          .then((state: string) => {
            if (state === "granted") {
              window.addEventListener("deviceorientation", deviceOrientationHandler);
            }
          })
          .catch(() => {});
      } else {
        window.addEventListener("deviceorientation", deviceOrientationHandler);
      }
    };
    shell.addEventListener("click", handleClick);

    const initialX = (shell.clientWidth || 0) - ANIMATION_CONFIG.INITIAL_X_OFFSET;
    const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;
    tiltEngine.setImmediate(initialX, initialY);
    tiltEngine.toCenter();
    tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);

    return () => {
      shell.removeEventListener("pointerenter", pointerEnterHandler);
      shell.removeEventListener("pointermove", pointerMoveHandler);
      shell.removeEventListener("pointerleave", pointerLeaveHandler);
      shell.removeEventListener("click", handleClick);
      window.removeEventListener("deviceorientation", deviceOrientationHandler);
      if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
      if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
      tiltEngine.cancel();
      shell.classList.remove("pc-entering");
      shell.classList.remove("pc-active");
    };
  }, [
    enableTilt,
    enableMobileTilt,
    tiltEngine,
    handlePointerMove,
    handlePointerEnter,
    handlePointerLeave,
    handleDeviceOrientation,
  ]);

  useEffect(() => {
    if (!hoverAvatarUrl) return;
    const img = new Image();
    img.src = hoverAvatarUrl;
  }, [hoverAvatarUrl]);

  const cardRadius = "30px";

  const cardStyle = useMemo(
    () =>
      ({
        ["--icon" as any]: iconUrl ? `url(${iconUrl})` : "none",
        ["--grain" as any]: grainUrl ? `url(${grainUrl})` : "none",
        ["--inner-gradient" as any]: innerGradient ?? DEFAULT_INNER_GRADIENT,
        ["--behind-glow-color" as any]: behindGlowColor ?? "rgba(125, 190, 255, 0.67)",
        ["--behind-glow-size" as any]: behindGlowSize ?? "50%",
        ["--pointer-x" as any]: "50%",
        ["--pointer-y" as any]: "50%",
        ["--pointer-from-center" as any]: "0",
        ["--pointer-from-top" as any]: "0.5",
        ["--pointer-from-left" as any]: "0.5",
        ["--card-opacity" as any]: "0",
        ["--rotate-x" as any]: "0deg",
        ["--rotate-y" as any]: "0deg",
        ["--background-x" as any]: "50%",
        ["--background-y" as any]: "50%",
        ["--card-radius" as any]: cardRadius,
        // Monochrome "pillars" to avoid color shift on hover.
        ["--sunpillar-1" as any]: "hsl(0, 0%, 82%)",
        ["--sunpillar-2" as any]: "hsl(0, 0%, 76%)",
        ["--sunpillar-3" as any]: "hsl(0, 0%, 70%)",
        ["--sunpillar-4" as any]: "hsl(0, 0%, 64%)",
        ["--sunpillar-5" as any]: "hsl(0, 0%, 58%)",
        ["--sunpillar-6" as any]: "hsl(0, 0%, 52%)",
      }) as React.CSSProperties,
    [iconUrl, grainUrl, innerGradient, behindGlowColor, behindGlowSize, cardRadius],
  );

  const handleContactClick = useCallback((): void => {
    onContactClick?.();
  }, [onContactClick]);

  const shineStyle: React.CSSProperties = {
    maskImage: "var(--icon)",
    maskMode: "luminance",
    maskRepeat: "repeat",
    maskSize: "150%",
    maskPosition:
      "top calc(200% - (var(--background-y) * 5)) left calc(100% - var(--background-x))",
    filter: "brightness(0.66) contrast(1.33) saturate(0) opacity(1)",
    animation: "pc-holo-bg 18s linear infinite",
    animationPlayState: "running",
    mixBlendMode: "color-dodge",
    transform: "translate3d(0, 0, 1px)",
    overflow: "hidden",
    zIndex: 3,
    opacity: "var(--pc-effects-opacity)" as any,
    transition: "opacity 220ms ease",
    background: "transparent",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundImage: `
      repeating-linear-gradient(
        0deg,
        var(--sunpillar-1) 0%,
        var(--sunpillar-2) 12%,
        var(--sunpillar-3) 24%,
        var(--sunpillar-4) 36%,
        var(--sunpillar-5) 48%,
        var(--sunpillar-6) 60%,
        var(--sunpillar-1) 72%
      ),
      repeating-linear-gradient(
        -45deg,
        rgba(255,255,255,0.08) 0%,
        rgba(255,255,255,0.20) 4%,
        rgba(255,255,255,0.08) 8%,
        rgba(0,0,0,0.08) 14%
      ),
      radial-gradient(
        farthest-corner circle at var(--pointer-x) var(--pointer-y),
        rgba(255,255,255,0.10) 12%,
        rgba(0,0,0,0.15) 70%
      )
    `.replace(/\\s+/g, " "),
    gridArea: "1 / -1",
    borderRadius: cardRadius,
    pointerEvents: "none",
  };

  const glareStyle: React.CSSProperties = {
    transform: "translate3d(0, 0, 1.1px)",
    overflow: "hidden",
    backgroundImage: `radial-gradient(
      farthest-corner circle at var(--pointer-x) var(--pointer-y),
      rgba(255,255,255,0.35) 12%,
      rgba(0,0,0,0.55) 90%
    )`,
    mixBlendMode: "overlay",
    filter: "brightness(0.85) contrast(1.15) saturate(0)",
    zIndex: 4,
    gridArea: "1 / -1",
    borderRadius: cardRadius,
    pointerEvents: "none",
    opacity: "var(--pc-effects-opacity)" as any,
    transition: "opacity 220ms ease",
  };

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{
        perspective: "500px",
        transform: "translate3d(0, 0, 0.1px)",
        position: "relative",
        touchAction: "none",
        ...cardStyle,
      }}
    >
      {behindGlowEnabled && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            transition: "opacity 200ms ease-out",
            background: `radial-gradient(circle at var(--pointer-x) var(--pointer-y), var(--behind-glow-color) 0%, transparent var(--behind-glow-size))`,
            filter: "blur(50px) saturate(1.1)",
            opacity: "calc(0.8 * var(--card-opacity))" as any,
          }}
        />
      )}

      <div ref={shellRef} style={{ position: "relative", zIndex: 1 }}>
        <section
          style={{
            display: "grid",
            position: "relative",
            overflow: "hidden",
            height: "min(62vh, 540px)",
            aspectRatio: "0.718",
            borderRadius: cardRadius,
            backgroundBlendMode: "color-dodge, normal, normal, normal",
            boxShadow:
              "rgba(0, 0, 0, 0.8) calc((var(--pointer-from-left) * 10px) - 3px) calc((var(--pointer-from-top) * 20px) - 6px) 20px -5px",
            transition: "transform 1s ease",
            transform: "translateZ(0) rotateX(0deg) rotateY(0deg)",
            background: "rgba(0, 0, 0, 0.9)",
            backfaceVisibility: "hidden",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transition = "none";
            e.currentTarget.style.transform =
              "translateZ(0) rotateX(var(--rotate-y)) rotateY(var(--rotate-x))";
          }}
          onMouseLeave={(e) => {
            const shell = shellRef.current;
            if (shell?.classList.contains("pc-entering")) {
              e.currentTarget.style.transition = "transform 180ms ease-out";
            } else {
              e.currentTarget.style.transition = "transform 1s ease";
            }
            e.currentTarget.style.transform = "translateZ(0) rotateX(0deg) rotateY(0deg)";
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "var(--inner-gradient)",
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              borderRadius: cardRadius,
              display: "grid",
              gridArea: "1 / -1",
            }}
          >
            <div style={shineStyle} />
            <div style={glareStyle} />

            <div
              style={{
                mixBlendMode: "normal",
                transform: "translateZ(2px)",
                gridArea: "1 / -1",
                borderRadius: cardRadius,
                pointerEvents: "none",
                backfaceVisibility: "hidden",
                overflow: "visible",
              }}
            >
              <img
                src={avatarUrl}
                alt={`${name} avatar`}
                loading="lazy"
                style={{
                  width: "100%",
                  position: "absolute",
                  left: "50%",
                  bottom: "-1px",
                  transformOrigin: "50% 100%",
                  transform:
                    "translateX(calc(-50% + (var(--pointer-from-left) - 0.5) * 6px)) translateZ(0) scaleY(calc(1 + (var(--pointer-from-top) - 0.5) * 0.02)) scaleX(calc(1 + (var(--pointer-from-left) - 0.5) * 0.01))",
                  borderRadius: cardRadius,
                  backfaceVisibility: "hidden",
                  willChange: "transform, opacity",
                  filter: "var(--pc-avatar-filter)",
                  opacity: hoverAvatarUrl ? (isAvatarHovered ? 0 : 1) : 1,
                  transition:
                    "transform 160ms ease-out, opacity 560ms cubic-bezier(0.22, 1, 0.36, 1), filter 280ms ease",
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              {hoverAvatarUrl ? (
                <img
                  src={hoverAvatarUrl}
                  alt={`${name} avatar hover`}
                  loading="eager"
                  style={{
                    width: "100%",
                    position: "absolute",
                    left: "50%",
                    bottom: "-1px",
                    transformOrigin: "50% 100%",
                    transform:
                      "translateX(calc(-50% + (var(--pointer-from-left) - 0.5) * 6px)) translateZ(0) scaleY(calc(1 + (var(--pointer-from-top) - 0.5) * 0.02)) scaleX(calc(1 + (var(--pointer-from-left) - 0.5) * 0.01))",
                    borderRadius: cardRadius,
                    backfaceVisibility: "hidden",
                    willChange: "transform, opacity",
                    filter: "var(--pc-avatar-filter)",
                    opacity: isAvatarHovered ? 1 : 0,
                    transition:
                      "transform 160ms ease-out, opacity 560ms cubic-bezier(0.22, 1, 0.36, 1), filter 280ms ease",
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : null}

              {showUserInfo && (
                <div
                  style={{
                    position: "absolute",
                    zIndex: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    pointerEvents: "auto",
                    bottom: 20,
                    left: 20,
                    right: 20,
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    borderRadius: `calc(max(0px, ${cardRadius} - 20px + 6px))`,
                    padding: "12px 14px",
                    backdropFilter: "blur(30px)",
                    WebkitBackdropFilter: "blur(30px)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 999,
                        overflow: "hidden",
                        border: "1px solid rgba(255,255,255,0.10)",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={miniAvatarUrl || activeAvatarUrl}
                        alt={`${name} mini avatar`}
                        loading="lazy"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                          borderRadius: 999,
                          pointerEvents: "auto",
                        }}
                        onError={(e) => {
                          const t = e.target as HTMLImageElement;
                          t.style.opacity = "0.5";
                          t.src = activeAvatarUrl;
                        }}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ fontSize: 12, fontWeight: 650, color: "rgba(255,255,255,0.9)" }}>
                        @{handle}
                      </div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{status}</div>
                    </div>
                  </div>

                  <button
                    onClick={handleContactClick}
                    type="button"
                    aria-label={`Contact ${name}`}
                    style={{
                      border: "1px solid rgba(255,255,255,0.10)",
                      borderRadius: 10,
                      padding: "10px 12px",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.9)",
                      cursor: "pointer",
                      background: "rgba(255,255,255,0.06)",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      transition: "transform 200ms ease, border-color 200ms ease",
                    }}
                  >
                    {contactText}
                  </button>
                </div>
              )}
            </div>

            <div
              style={{
                maxHeight: "100%",
                overflow: "hidden",
                textAlign: "center",
                position: "relative",
                zIndex: 5,
                transform:
                  "translate3d(calc(var(--pointer-from-left) * -6px + 3px), calc(var(--pointer-from-top) * -6px + 3px), 0.1px)",
                mixBlendMode: "normal",
                gridArea: "1 / -1",
                borderRadius: cardRadius,
                pointerEvents: "none",
              }}
            >
              <div style={{ position: "absolute", top: "3em", left: 0, right: 0, display: "flex", flexDirection: "column" }}>
                <h3
                  style={{
                    fontSize: "min(5svh, 3em)",
                    fontWeight: 750,
                    margin: 0,
                    backgroundImage: "linear-gradient(to bottom, #fff, #6f6fbe)",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                  }}
                >
                  {name}
                </h3>
                <p
                  style={{
                    position: "relative",
                    top: -12,
                    fontSize: 16,
                    fontWeight: 750,
                    margin: "0 auto",
                    backgroundImage: "linear-gradient(to bottom, #fff, #4a4ac0)",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    whiteSpace: "nowrap",
                  }}
                >
                  {title}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const ProfileCard = React.memo(ProfileCardComponent);
export default ProfileCard;

