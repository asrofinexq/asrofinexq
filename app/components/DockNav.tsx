"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type TargetAndTransition,
} from "motion/react";
import Dock from "@/app/components/Dock";
import {
  STORY_DOCK_CONTACT_EXPAND,
  STORY_DOCK_HOLD_COLLAPSED_MS,
  STORY_DOCK_PANEL,
  STORY_DOCK_POSITION,
  STORY_SLIDE_CENTER,
} from "@/app/lib/homeStoryMotion";
import Image from "next/image";
import { VscPerson, VscTools, VscCode, VscMail } from "react-icons/vsc";

const NexqLogoIcon = () => {
  return (
    <span className="asro-dock-icon" aria-hidden="true">
      <Image
        src="/logo.png"
        alt=""
        width={24}
        height={24}
        priority
        style={{ width: 24, height: 24, objectFit: "contain" }}
      />
    </span>
  );
};

export type DockNavProps = {
  motionProps?: Omit<HTMLMotionProps<"div">, "children">;
  /** Tur layar penuh di beranda: aktifkan animasi posisi dock */
  homeStoryTour?: boolean;
  /** Step Services ke atas: hanya tombol Home + geser ke kiri atas */
  storyCompact?: boolean;
  /** Step Contact tur: durasi mekar navbar disesuaikan dengan konten */
  contactStoryStep?: boolean;
};

export default function DockNav({
  motionProps,
  homeStoryTour = false,
  storyCompact = false,
  contactStoryStep = false,
}: DockNavProps = {}) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [narrowViewport, setNarrowViewport] = useState(false);
  /** full = 5 ikon tengah; compactCenter = hanya Home masih di tengah; compactCorner = Home pojok kiri atas */
  const [dockPhase, setDockPhase] = useState<"full" | "compactCenter" | "compactCorner">("full");
  const cornerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverUnlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hoverEnabled, setHoverEnabled] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 900px)");
    const apply = () => setNarrowViewport(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (cornerTimerRef.current) {
      clearTimeout(cornerTimerRef.current);
      cornerTimerRef.current = null;
    }
    if (!storyCompact) {
      setDockPhase("full");
      return;
    }
    if (reduceMotion) {
      setDockPhase("compactCorner");
      return;
    }
    setDockPhase("compactCenter");
    cornerTimerRef.current = setTimeout(() => {
      setDockPhase("compactCorner");
      cornerTimerRef.current = null;
    }, STORY_DOCK_HOLD_COLLAPSED_MS);
    return () => {
      if (cornerTimerRef.current) clearTimeout(cornerTimerRef.current);
    };
  }, [storyCompact, reduceMotion]);

  useEffect(() => {
    if (hoverUnlockTimerRef.current) {
      clearTimeout(hoverUnlockTimerRef.current);
      hoverUnlockTimerRef.current = null;
    }
    if (reduceMotion) {
      setHoverEnabled(true);
      return;
    }
    // Saat kembali ke hero (compact -> full), kunci hover selama expand panel.
    if (homeStoryTour && !storyCompact) {
      const expandDuration = contactStoryStep ? STORY_DOCK_CONTACT_EXPAND.duration : STORY_DOCK_PANEL.duration;
      setHoverEnabled(false);
      hoverUnlockTimerRef.current = setTimeout(() => {
        setHoverEnabled(true);
        hoverUnlockTimerRef.current = null;
      }, Math.round(expandDuration * 1000));
      return;
    }
    setHoverEnabled(true);
  }, [homeStoryTour, storyCompact, contactStoryStep, reduceMotion]);

  const effectivePhase: "full" | "compactCenter" | "compactCorner" = !storyCompact
    ? "full"
    : reduceMotion && storyCompact
      ? "compactCorner"
      : dockPhase;

  const allItems = useMemo(
    () => [
      {
        icon: <NexqLogoIcon />,
        label: "Home",
        onClick: () => router.push("/"),
      },
      {
        icon: <VscPerson size={20} />,
        label: "About",
        onClick: () => router.push("/about"),
      },
      {
        icon: <VscTools size={20} />,
        label: "Services",
        onClick: () => router.push("/services"),
      },
      {
        icon: <VscCode size={20} />,
        label: "Projects",
        onClick: () => router.push("/projects"),
      },
      {
        icon: <VscMail size={20} />,
        label: "Contact",
        onClick: () => router.push("/contact"),
      },
    ],
    [router],
  );

  const items = effectivePhase === "full" ? allItems : allItems.slice(0, 1);

  const {
    animate: mpAnimate,
    transition: mpTransition,
    style: mpStyle,
    ...restMotion
  } = motionProps ?? {};

  const baseAnimate: TargetAndTransition =
    mpAnimate && typeof mpAnimate === "object" && !Array.isArray(mpAnimate)
      ? { ...(mpAnimate as TargetAndTransition) }
      : {};

  const centeredTour: TargetAndTransition = narrowViewport
    ? {
        left: "50%",
        x: "-50%",
        top: "auto",
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 10px)",
        marginLeft: 0,
        marginRight: 0,
      }
    : {
        left: "50%",
        x: "-50%",
        top: 20,
        bottom: "auto",
        marginLeft: 0,
        marginRight: 0,
      };

  const cornerTour: TargetAndTransition = {
    left: 16,
    x: 0,
    top: 16,
    bottom: "auto",
    marginLeft: 0,
    marginRight: 0,
  };

  /** Tanpa tur / tur mekar penuh: tengah; hanya step compact pojok yang geser ke kiri atas */
  const tourPosition: TargetAndTransition =
    homeStoryTour && effectivePhase === "compactCorner" ? cornerTour : centeredTour;

  /** Tur: dock mekar penuh (compact→full); di Contact pakai durasi lebih panjang */
  const expandingToFullBar = homeStoryTour && !storyCompact;
  const contactDockExpand = expandingToFullBar && contactStoryStep;
  const positionTween = contactDockExpand
    ? { duration: STORY_DOCK_CONTACT_EXPAND.duration, ease: STORY_DOCK_CONTACT_EXPAND.ease }
    : expandingToFullBar
      ? { duration: STORY_DOCK_PANEL.duration, ease: STORY_DOCK_PANEL.ease }
      : { duration: STORY_DOCK_POSITION.duration, ease: STORY_DOCK_POSITION.ease };

  const mergedTransition =
    homeStoryTour && !reduceMotion
      ? {
          ...(typeof mpTransition === "object" && mpTransition !== null ? mpTransition : {}),
          left: positionTween,
          right: positionTween,
          top: positionTween,
          bottom: positionTween,
          x: positionTween,
          y: positionTween,
          opacity: STORY_SLIDE_CENTER.opacity,
        }
      : homeStoryTour && reduceMotion
        ? { duration: 0.01 }
        : mpTransition ?? { duration: 0.01 };

  return (
    <motion.div
      key={homeStoryTour ? "story-dock" : "default-dock"}
      className={[
        "asro-docknav-wrap",
        homeStoryTour && effectivePhase === "compactCorner" ? "asro-docknav-wrap--story-compact" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      // Supaya saat dock mount (mis. pindah dari home→about), posisinya langsung benar tanpa "slide" awal.
      initial={false}
      {...restMotion}
      animate={{ ...baseAnimate, ...tourPosition }}
      transition={mergedTransition}
      style={{
        position: "fixed",
        right: "auto",
        width: "fit-content",
        zIndex: 1100,
        pointerEvents: "auto",
        ...(typeof mpStyle === "object" && mpStyle !== null ? mpStyle : {}),
      }}
    >
      <Dock
        items={items}
        panelHeight={70}
        baseItemSize={50}
        magnification={90}
        distance={220}
        dockHeight={256}
        enablePanelLayout={homeStoryTour && !reduceMotion}
        panelLayoutTransition={
          homeStoryTour && !reduceMotion
            ? {
                width: { duration: positionTween.duration, ease: positionTween.ease },
                height: { duration: positionTween.duration, ease: positionTween.ease },
                paddingTop: { duration: positionTween.duration, ease: positionTween.ease },
                paddingBottom: { duration: positionTween.duration, ease: positionTween.ease },
                paddingLeft: { duration: positionTween.duration, ease: positionTween.ease },
                paddingRight: { duration: positionTween.duration, ease: positionTween.ease },
                gap: { duration: positionTween.duration, ease: positionTween.ease },
              }
            : undefined
        }
        hoverEnabled={hoverEnabled}
      />
    </motion.div>
  );
}
