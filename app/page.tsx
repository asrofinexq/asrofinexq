"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import LogoLoop from "@/app/components/LogoLoop";
import ProfileCard from "@/app/components/ProfileCard";
import DockNav from "@/app/components/DockNav";
import HeroSocialLinks from "@/app/components/HeroSocialLinks";
import RevealSection from "@/app/components/RevealSection";
import FooterStagger from "@/app/components/FooterStagger";
import VisitorComments from "@/app/components/VisitorComments";
import FuzzyText from "@/app/components/FuzzyText";
import { MessageCircle, Router, Server, Braces } from "lucide-react";
import TextType from "@/components/TextType";
import CardSwap, { Card } from "@/components/CardSwap";
import { FaLaravel } from "react-icons/fa6";
import {
  SiNextdotjs,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiMysql,
  SiPostgresql,
  SiLinux,
  SiNodedotjs,
  SiPhp,
  SiCodeigniter,
  SiGithub,
} from "react-icons/si";
import ShowcaseAction from "@/app/components/ShowcaseAction";
import {
  showcaseCertificates,
  showcaseProjects,
  type PortfolioTab,
} from "@/app/lib/showcase";
import { SITE_EMAIL, THEME_STORAGE_KEY } from "@/app/lib/site";

const techLogos = [
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
  { node: <FaLaravel />, title: "Laravel", href: "https://fontawesome.com/icons/laravel?style=brands" },
  { node: <SiMysql />, title: "MySQL", href: "https://www.flaticon.com/free-icons/mysql" },
  { node: <SiPostgresql />, title: "PostgreSQL", href: "https://www.flaticon.com/free-icons/postgre" },
  { node: <SiLinux />, title: "Linux", href: "https://www.flaticon.com/free-icons/linux" },
  { node: <SiNodedotjs />, title: "Node.js", href: "https://www.flaticon.com/free-icons/node" },
  { node: <SiPhp />, title: "PHP", href: "https://www.flaticon.com/free-icons/php" },
  { node: <SiCodeigniter />, title: "CodeIgniter 3", href: "https://www.flaticon.com/free-icons/codeigniter" },
  { node: <Braces size={26} />, title: "REST API", href: "https://www.flaticon.com/free-icons/api" },
  { node: <Router size={26} />, title: "Mikrotik", href: "https://www.flaticon.com/free-icons/wireless-router" },
  { node: <Server size={26} />, title: "VPS", href: "https://www.flaticon.com/free-icons/vps" },
];

const partnerLogos = [
  { src: "/client/nexquarter-logo.png", alt: "NexQuarter", title: "NexQuarter" },
  { src: "/client/client1.png", alt: "Client 1", title: "Client 1" },
  { src: "/client/client2.png", alt: "Client 2", title: "Client 2" },
  { src: "/client/client3.png", alt: "Client 3", title: "Client 3" },
  { src: "/client/client4.jpg", alt: "Client 4", title: "Client 4" },
  { src: "/client/client5.jpg", alt: "Client 5", title: "Client 5" },
  { src: "/client/partner1.png", alt: "Partner 1", title: "Partner 1" },
];

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const skipDarkPersist = useRef(true);
  const [portfolioTab, setPortfolioTab] = useState<PortfolioTab>("projects");
  const [introReady, setIntroReady] = useState(false);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const vantaRef = useRef<HTMLDivElement | null>(null);
  const vantaEffectRef = useRef<{ destroy: () => void; setOptions?: (opts: any) => void } | null>(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const reduceHeroMotion = useReducedMotion();

  /** Landing halus (ease-out panjang) + durasi panjang di motion.div hero */
  const heroEase = [0.16, 1, 0.3, 1] as const;

  /** Urutan satu per satu: kiri → kanan (DEVELOPER) → foto fade */
  const heroSeq = useMemo(() => {
    const gap = 0.16;
    const left = { delay: 0.05, duration: 0.98 };
    const right = {
      delay: left.delay + left.duration + gap,
      duration: 0.98,
    };
    const portrait = {
      delay: right.delay + right.duration + gap,
      duration: 0.92,
    };
    return { left, portrait, right };
  }, []);

  const heroRoles = [
    { top: "FRONT", bottom: "END" },
    { top: "BACK", bottom: "END" },
    { top: "FULL", bottom: "STACK" },
  ];

  useEffect(() => {
    const markReady = () => setIntroReady(true);
    if (typeof document !== "undefined" && document.body.classList.contains("asro-intro-done")) {
      markReady();
      return;
    }
    window.addEventListener("asro:intro-complete", markReady, { once: true });
    return () => window.removeEventListener("asro:intro-complete", markReady);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setRoleIndex((v) => (v + 1) % heroRoles.length);
    }, 3200);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

    let raf: number | null = null;
    let x = 0;
    let y = 0;

    const tick = () => {
      raf = null;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
    };

    const handleMouse = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (raf !== null) return;
      raf = window.requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouse);
      if (raf !== null) window.cancelAnimationFrame(raf);
    };
  }, []);

  useLayoutEffect(() => {
    const s = localStorage.getItem(THEME_STORAGE_KEY);
    if (s === "dark") {
      setDarkMode(true);
      return;
    }
    if (s === "light") {
      setDarkMode(false);
      return;
    }
    // Keep behavior consistent with subpages when no saved theme yet.
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(prefersDark);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", darkMode);
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (skipDarkPersist.current) {
      skipDarkPersist.current = false;
      return;
    }
    localStorage.setItem(THEME_STORAGE_KEY, darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      if (!vantaRef.current) return;
      if (vantaEffectRef.current) return;

      const THREE = await import("three");
      const mod = await import("vanta/dist/vanta.globe.min");
      const GlobeEffect = (mod as unknown as { default?: any }).default ?? (mod as any);

      if (cancelled || !vantaRef.current) return;

      vantaEffectRef.current = GlobeEffect({
        el: vantaRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        backgroundColor: darkMode ? 0x0f0f0e : 0xf5f4f0,
        /* Light: transparent clear so hero CSS gradient shows behind the net */
        backgroundAlpha: darkMode ? 1 : 0,
        // Globe + point-to-point net (needs strong Δ vs background in light)
        color: darkMode ? 0xf0ede8 : 0x1c1c18,
        color2: darkMode ? 0x9a9890 : 0x3a3a36,
        showDots: true,
        points: darkMode ? 10 : 12,
        maxDistance: darkMode ? 20 : 24,
        spacing: darkMode ? 15 : 14,
        size: darkMode ? 0.9 : 1.0,
      });
    };

    init();

    return () => {
      cancelled = true;
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
    };
  }, [darkMode]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #f5f4f0;
          --fg: #111110;
          --muted: #6b6b65;
          --accent: #5a50e0;
          --accent-dark: #3d34c0;
          --card-bg: #eeecea;
          --border: rgba(0,0,0,0.1);
          --nav-bg: rgba(245,244,240,0.85);
          --hero-sheen-1: rgba(0,0,0,0.07);
          --hero-sheen-2: rgba(0,0,0,0.05);
          /* Light hero: atas abu-abu → ke bawah makin cerah */
          --hero-grad-top: #b0aea8;
          --hero-grad-mid: #e0ded6;
          --hero-grad-bot: #faf9f6;
          --hero-vignette: radial-gradient(1100px 680px at 50% 108%, rgba(255,255,255,0.45), transparent 58%);
          --hero-vanta-opacity: 0.78;
          --hero-vanta-opacity-mobile: 0.64;
          --hero-vanta-overlay-a: rgba(0,0,0,0.06);
          --hero-vanta-line-grad-top: rgba(0,0,0,0.08);
          --hero-vanta-line-grad-bot: rgba(0,0,0,0.03);
          --hero-vanta-filter: contrast(1.08) saturate(0.35);
        }

        .dark {
          --bg: #0f0f0e;
          --fg: #f0ede8;
          --muted: #9a9890;
          --accent: #7b72f0;
          --accent-dark: #9d96f5;
          --card-bg: #1a1a18;
          --border: rgba(255,255,255,0.08);
          --nav-bg: rgba(15,15,14,0.85);
          --hero-sheen-1: rgba(255,255,255,0.06);
          --hero-sheen-2: rgba(255,255,255,0.04);
          --hero-vanta-opacity: 0.50;
          --hero-vanta-opacity-mobile: 0.44;
          --hero-vanta-filter: grayscale(1) contrast(1.05);
        }

        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--bg);
          color: var(--fg);
          transition: background 0.4s, color 0.4s;
          overflow-x: hidden;
        }

        @keyframes homeRevealCursor {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.4);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        /* Dock dipusatkan lebar (margin auto di nexq); animasi hanya menggeser Y */
        @keyframes homeRevealDock {
          0% {
            opacity: 0;
            transform: translateY(28px);
            filter: blur(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        .home-viewport--ready > *:nth-child(1) {
          animation: homeRevealCursor 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.32s both;
        }
        .home-viewport--ready > *:nth-child(2) {
          animation: homeRevealDock 0.75s cubic-bezier(0.22, 1, 0.36, 1) 0.08s both;
        }

        @media (prefers-reduced-motion: reduce) {
          .home-viewport--ready > *:nth-child(1) {
            animation: none !important;
            opacity: 1 !important;
            filter: none !important;
            transform: translate(-50%, -50%) !important;
          }
          .home-viewport--ready > *:nth-child(2) {
            animation: none !important;
            opacity: 1 !important;
            filter: none !important;
            transform: none !important;
          }
        }

        /* ── NAV ── */
        .nav {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 100;
          display: flex;
          align-items: center;
          gap: 0;
          background: var(--nav-bg);
          backdrop-filter: blur(20px);
          border: 0.5px solid var(--border);
          border-radius: 100px;
          padding: 8px 10px 8px 10px;
          width: min(980px, calc(100% - 40px));
          min-width: unset;
        }

        .nav__avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          overflow: hidden;
          background: var(--bg);
          border: 0.5px solid var(--border);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 4px;
        }

        .nav__avatar img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 6px;
        }

        .nav__avatar-placeholder {
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          color: #fff;
          font-weight: 700;
        }

        .nav__links {
          display: flex;
          align-items: center;
          gap: 4px;
          flex: 1;
          justify-content: center;
          padding: 0 8px;
        }

        .nav__link {
          font-size: 14px;
          font-weight: 400;
          color: var(--muted);
          text-decoration: none;
          padding: 6px 14px;
          border-radius: 100px;
          transition: color 0.2s, background 0.2s;
        }

        .nav__link:hover {
          color: var(--fg);
          background: var(--border);
        }

        .nav__cta {
          background: var(--fg);
          color: var(--bg);
          font-size: 14px;
          font-weight: 500;
          padding: 8px 20px;
          border-radius: 100px;
          text-decoration: none;
          transition: opacity 0.2s;
          flex-shrink: 0;
        }

        .nav__cta:hover { opacity: 0.8; }

        /* ── HERO ── */
        .hero {
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: clamp(92px, 10vh, 132px) clamp(18px, 4vw, 64px) clamp(52px, 7vh, 84px);
          overflow: hidden;
          background:
            radial-gradient(1000px 520px at 20% 10%, var(--hero-sheen-1), transparent 60%),
            radial-gradient(900px 520px at 80% 0%, var(--hero-sheen-2), transparent 60%),
            var(--hero-vignette),
            linear-gradient(180deg, var(--hero-grad-top) 0%, var(--hero-grad-mid) 46%, var(--hero-grad-bot) 100%);
        }

        /* Dark: hanya bg hero — wash panjang ke var(--bg) agar rapat dengan Services */
        .dark .hero {
          background:
            radial-gradient(1000px 520px at 20% 10%, var(--hero-sheen-1), transparent 58%),
            radial-gradient(900px 520px at 80% 0%, var(--hero-sheen-2), transparent 58%),
            linear-gradient(
              180deg,
              #0b0b09 0%,
              #0c0c0a 22%,
              #0d0d0b 44%,
              #0e0e0c 58%,
              var(--bg) 76%,
              var(--bg) 100%
            );
        }

        .dark .hero__desc {
          color: rgba(250, 250, 250, 0.94);
          -webkit-text-stroke: 0.45px rgba(255, 255, 255, 0.5);
          text-shadow:
            0 0 1px rgba(255, 255, 255, 0.35),
            0 0 4px rgba(255, 255, 255, 0.12);
        }

        .hero__vanta {
          position: absolute;
          inset: 0;
          z-index: 0;
          opacity: var(--hero-vanta-opacity);
          filter: var(--hero-vanta-filter);
          pointer-events: none;
        }

        .hero__vanta::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(900px 540px at 30% 20%, var(--hero-vanta-overlay-a), transparent 60%),
            linear-gradient(180deg, var(--hero-vanta-line-grad-top), var(--hero-vanta-line-grad-bot));
          pointer-events: none;
        }

        /* Dark: jangan gelapkan bawah — biar selaras dengan var(--bg) / Services */
        .dark .hero__vanta::after {
          background:
            radial-gradient(920px 520px at 28% 16%, rgba(0,0,0,0.28), transparent 58%),
            linear-gradient(
              180deg,
              rgba(0,0,0,0.22) 0%,
              rgba(0,0,0,0.12) 32%,
              rgba(0,0,0,0.05) 52%,
              rgba(15,15,14,0) 72%,
              rgba(15,15,14,0) 100%
            );
        }

        .hero__title-wrap {
          width: 100%;
          max-width: 1240px;
          position: relative;
          display: grid;
          grid-template-columns: minmax(280px, 1fr) auto minmax(280px, 1fr);
          align-items: center;
          column-gap: clamp(32px, 5vw, 56px);
          z-index: 2;
        }

        .hero__name-area {
          display: flex;
          flex-direction: column;
          gap: 4px;
          width: 100%;
          justify-self: stretch;
          align-items: flex-start;
        }

        .hero__label {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.12em;
          color: var(--muted);
          text-transform: uppercase;
        }

        .hero__word {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(64px, 8.8vw, 136px);
          line-height: 0.88;
          color: var(--fg);
          letter-spacing: 0.01em;
        }

        /* Jarak visual teks besar dari kolom tengah (foto) */
        .hero__word--developer {
          position: relative;
          z-index: 4;
          margin-inline-end: clamp(0px, 1vw, 8px);
        }

        /* Reserve 2-line space so typing doesn't reflow layout */
        .hero__word--type {
          min-height: 1.8em; /* ~ 2 lines * line-height(0.9) */
          display: block;
        }

        .hero__word--typeLine {
          display: inline;
        }

        .hero__word--right {
          text-align: right;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
          width: 100%;
          justify-self: stretch;
          position: relative;
          z-index: 4;
          padding-inline-start: clamp(12px, 2.5vw, 32px);
        }

        .hero__desc {
          font-size: clamp(16px, 1.55vw, 19px);
          font-weight: 600;
          letter-spacing: 0.015em;
          color: #0a0a0a;
          max-width: 38ch;
          line-height: 1.62;
          text-align: right;
          -webkit-text-stroke: 0.65px rgba(255, 255, 255, 0.62);
          paint-order: stroke fill;
          text-shadow:
            0 0 1px rgba(255, 255, 255, 0.5),
            0 0 3px rgba(255, 255, 255, 0.22);
        }

        .hero__social {
          display: flex;
          flex-wrap: wrap;
          gap: 12px 14px;
          align-items: center;
          justify-content: flex-end;
          margin-top: 4px;
        }

        .hero__social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          color: color-mix(in srgb, var(--fg) 52%, var(--muted));
          background: color-mix(in srgb, var(--fg) 9%, transparent);
          border: 0.5px solid color-mix(in srgb, var(--fg) 14%, var(--border));
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.32),
            0 0 0 2px rgba(255, 255, 255, 0.08),
            inset 0 0 0 1px rgba(255, 255, 255, 0.18);
          transition:
            color 0.2s,
            transform 0.2s,
            background 0.2s,
            border-color 0.2s,
            box-shadow 0.2s;
        }

        .hero__social-link:hover:not(.hero__social-link--maintenance) {
          color: var(--fg);
          background: color-mix(in srgb, var(--accent) 14%, transparent);
          border-color: color-mix(in srgb, var(--accent) 40%, var(--border));
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.4),
            0 0 0 2.5px rgba(255, 255, 255, 0.12),
            inset 0 0 0 1px rgba(255, 255, 255, 0.22);
          transform: translateY(-2px);
        }

        .hero__social-link--maintenance {
          cursor: not-allowed !important;
          opacity: 0.78;
          border: 1px dashed color-mix(in srgb, var(--muted) 42%, var(--border)) !important;
        }

        .hero__social-link--maintenance:hover {
          transform: none;
        }

        .hero__social-link svg {
          width: 24px;
          height: 24px;
          flex-shrink: 0;
          filter:
            drop-shadow(0 0 0.65px rgba(255, 255, 255, 0.95))
            drop-shadow(0 0 1.5px rgba(255, 255, 255, 0.55))
            drop-shadow(0 0 2.5px rgba(255, 255, 255, 0.25))
            drop-shadow(0 0.5px 0 color-mix(in srgb, var(--fg) 22%, transparent));
        }

        /* Portrait Card */
        .portrait-wrap {
          width: clamp(240px, 26vw, 360px);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          position: relative;
          z-index: 2;
          justify-self: center;
          /* Sedikit ke kiri agar optis sejajar antara role & DEVELOPER */
          transform: translateX(clamp(-88px, -6.2vw, -36px));
          margin-inline: clamp(4px, 1.5vw, 16px);
        }

        .portrait-wrap__motion {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .portrait-frame {
          width: 100%;
          aspect-ratio: 3/4;
          border-radius: 20px;
          position: relative;
          overflow: visible;
        }

        .portrait-media {
          position: absolute;
          inset: 0;
          border-radius: 20px;
          overflow: hidden;
          background: var(--card-bg);
          border: 0.5px solid var(--border);
        }

        .portrait-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Hi bubble */
        .hi-bubble {
          position: absolute;
          bottom: -45px;
          left: -34px;
          width: 92px;
          height: 92px;
          background: var(--bg);
          border-radius: 999px;
          border: 0.5px solid var(--border);
          box-shadow: 0 14px 40px rgba(0,0,0,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
          cursor: default;
          user-select: none;
          transition: transform 0.3s ease;
        }

        .hi-bubble:hover { transform: scale(1.08); }

        .hi-bubble__logo {
          width: 62%;
          height: 62%;
          border-radius: 999px;
          overflow: hidden;
          display: grid;
          place-items: center;
          background: transparent;
        }

        /* ── TOGGLE ── */
        .toggle-wrap {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 3;
        }

        .toggle-btn {
          width: 52px;
          height: 28px;
          border-radius: 100px;
          background: var(--accent);
          border: none;
          cursor: pointer;
          position: relative;
          transition: background 0.3s;
          padding: 0;
        }

        .toggle-btn::after {
          content: '';
          position: absolute;
          top: 3px;
          left: 3px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #fff;
          transition: transform 0.3s;
        }

        .toggle-btn.active::after {
          transform: translateX(24px);
        }

        /* ── SECTION ── */
        .section {
          width: 100%;
          max-width: none;
          margin: 0;
          padding: clamp(64px, 7vw, 96px) clamp(18px, 4vw, 64px);
        }

        .section__header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 48px;
          border-bottom: 0.5px solid var(--border);
          padding-bottom: 20px;
        }

        .section__title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(48px, 6vw, 80px);
          line-height: 1;
          color: var(--fg);
          letter-spacing: 0.01em;
        }

        .section__num {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: var(--muted);
          letter-spacing: 0.1em;
        }

        /* Services grid */
        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--border);
          border: 0.5px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
        }

        .service-card {
          background: var(--bg);
          padding: 36px 32px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: background 0.2s;
        }

        .service-card:hover { background: var(--card-bg); }

        .service-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .service-icon svg { width: 22px; height: 22px; stroke: #fff; fill: none; stroke-width: 1.5; }

        /* ScrollStack (Services) */
        /* CardSwap (Services) */
        .services-split {
          display: grid;
          grid-template-columns: 1fr minmax(420px, 560px);
          gap: 28px;
          align-items: start;
        }

        .services-left {
          padding-right: 10px;
        }

        .services-eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
          margin: 0 0 10px;
        }

        .services-headline {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(44px, 5.2vw, 76px);
          line-height: 0.95;
          letter-spacing: 0.01em;
          color: var(--fg);
          margin: 0 0 14px;
        }

        .services-lede {
          color: var(--muted);
          font-size: 16px;
          line-height: 1.7;
          max-width: 58ch;
          margin: 0 0 16px;
        }

        .services-lede b {
          color: var(--fg);
          font-weight: 700;
        }

        .services-metrics {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin: 14px 0 18px;
        }

        .services-metric {
          border-radius: 16px;
          border: 0.5px solid var(--border);
          background: rgba(255, 255, 255, 0.04);
          padding: 12px 12px 10px;
        }

        .services-metric strong {
          display: block;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 30px;
          line-height: 1;
          letter-spacing: 0.02em;
          color: var(--fg);
        }

        .services-metric span {
          display: block;
          margin-top: 6px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: var(--muted);
        }

        .services-points {
          display: grid;
          gap: 12px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .services-point {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 14px 16px;
          border-radius: 18px;
          border: 0.5px solid var(--border);
          background: rgba(255, 255, 255, 0.04);
        }

        .services-point strong {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--fg);
          white-space: nowrap;
        }

        .services-point span {
          color: var(--muted);
          font-size: 14px;
          line-height: 1.6;
        }

        .asro-cardswap-stage {
          height: 600px;
          position: relative;
          overflow: visible;
        }

        .asro-cardswap-wrap {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .asro-cardswap-card {
          pointer-events: auto;
          background: var(--card-bg);
          color: var(--fg);
          border: 0.5px solid var(--border);
          box-shadow: 0 24px 90px rgba(0,0,0,0.18);
          padding: 28px;
          border-radius: 24px;
          display: grid;
          grid-template-columns: 1.35fr 0.85fr;
          gap: 22px;
          align-items: stretch;
        }

        .asro-service__meta {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 16px;
          min-width: 0;
        }

        .asro-service__visual {
          border-radius: 18px;
          border: 0.5px solid var(--border);
          background:
            radial-gradient(700px 260px at 30% 20%, rgba(123,114,240,0.30), transparent 55%),
            radial-gradient(520px 260px at 70% 70%, rgba(125,190,255,0.22), transparent 60%),
            linear-gradient(145deg, rgba(255,255,255,0.08), rgba(0,0,0,0.02));
          position: relative;
          overflow: hidden;
        }

        .asro-service__visual svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .asro-service__ctaRow {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 4px;
          flex-wrap: wrap;
        }

        .asro-service__cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 999px;
          border: 0.5px solid var(--border);
          background: rgba(255,255,255,0.06);
          color: var(--fg);
          text-decoration: none;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .asro-service__cta:hover { background: rgba(255,255,255,0.10); }

        .asro-service__kicker {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 10px;
        }

        .asro-service__title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(28px, 3.4vw, 44px);
          letter-spacing: 0.01em;
          line-height: 1;
          margin: 0 0 12px;
          color: var(--fg);
        }

        .asro-service__desc {
          margin: 0 0 18px;
          max-width: 62ch;
          color: var(--muted);
          line-height: 1.7;
          font-size: 14px;
        }

        .asro-service__tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        @media (max-width: 900px) {
          .services-split { grid-template-columns: 1fr; }
          .services-metrics { grid-template-columns: 1fr; }
          .asro-cardswap-card { grid-template-columns: 1fr; }
          .asro-service__visual { min-height: 220px; }
        }

        .service-card h3 {
          font-family: 'DM Sans', sans-serif;
          font-size: 18px;
          font-weight: 500;
          color: var(--fg);
        }

        .service-card p {
          font-size: 14px;
          line-height: 1.6;
          color: var(--muted);
        }

        .tag {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          padding: 4px 10px;
          border-radius: 100px;
          border: 0.5px solid var(--border);
          color: var(--muted);
        }

        .btn {
          font-size: 13px;
          font-weight: 500;
          padding: 8px 20px;
          border-radius: 100px;
          text-decoration: none;
          transition: all 0.2s;
          cursor: pointer;
          border: none;
        }

        .btn--primary {
          background: var(--fg);
          color: var(--bg);
        }

        .btn--primary:hover { opacity: 0.75; }

        .btn--ghost {
          background: transparent;
          color: var(--fg);
          border: 0.5px solid var(--border);
        }

        .btn--ghost:hover { background: var(--card-bg); }

        /* Skills */
        .skills-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .skill-pill {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          padding: 10px 20px;
          border-radius: 100px;
          background: var(--card-bg);
          border: 0.5px solid var(--border);
          color: var(--fg);
          transition: all 0.2s;
          cursor: default;
        }

        .skill-pill:hover {
          background: var(--accent);
          color: #fff;
          border-color: var(--accent);
        }

        /* CTA */
        .cta-block {
          margin-top: 60px;
          border-top: 0.5px solid var(--border);
          padding-top: 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
        }

        .cta-block h2 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(36px, 5vw, 72px);
          line-height: 1;
          color: var(--fg);
          max-width: 600px;
          letter-spacing: 0.01em;
        }

        .cta-btns {
          display: flex;
          gap: 12px;
          flex-shrink: 0;
        }

        /* Guestbook / comments (Giscus) */
        .comments-section {
          position: relative;
          isolation: isolate;
        }

        .comments-section__glow {
          pointer-events: none;
          position: absolute;
          left: 50%;
          top: 0;
          transform: translateX(-50%);
          width: min(900px, 100vw);
          height: min(380px, 52vw);
          background: radial-gradient(
            ellipse 75% 65% at 50% 0%,
            color-mix(in srgb, var(--accent) 22%, transparent) 0%,
            color-mix(in srgb, var(--accent) 6%, transparent) 42%,
            transparent 72%
          );
          opacity: 0.9;
          z-index: -1;
        }

        .comments-section__titleRow.section__header {
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 16px 24px;
        }

        .comments-section__titleBlock {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
          flex: 1;
          min-width: min(100%, 280px);
        }

        .comments-section__titleBlock .section__title {
          margin: 0;
        }

        .comments-section__eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--accent);
        }

        .comments-section__eyebrow svg {
          flex-shrink: 0;
          opacity: 0.85;
        }

        .comments-section__highlights {
          display: flex;
          flex-wrap: wrap;
          gap: 10px 22px;
          list-style: none;
          margin: clamp(20px, 3vw, 28px) 0 0;
          padding: 0;
        }

        .comments-section__highlights li {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.04em;
          color: var(--muted);
        }

        .comments-section__highlights .comments-section__dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          opacity: 0.55;
          flex-shrink: 0;
        }

        .comments-section__lead {
          max-width: 56ch;
          font-size: 14px;
          line-height: 1.7;
          color: var(--muted);
          margin: clamp(18px, 2.5vw, 22px) 0 0;
        }

        .comments-section__lead a {
          color: var(--accent);
          text-decoration: underline;
          text-underline-offset: 3px;
          font-weight: 500;
        }

        .comments-section__panel {
          margin-top: clamp(24px, 3.5vw, 36px);
          border-radius: 22px;
          padding: 1px;
          background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--accent) 42%, var(--border)) 0%,
            var(--border) 38%,
            color-mix(in srgb, var(--accent) 18%, var(--border)) 100%
          );
          box-shadow:
            0 4px 24px rgba(0, 0, 0, 0.06),
            0 1px 0 color-mix(in srgb, var(--fg) 6%, transparent);
        }

        .dark .comments-section__panel {
          box-shadow:
            0 8px 40px rgba(0, 0, 0, 0.4),
            0 1px 0 rgba(255, 255, 255, 0.04);
        }

        .comments-section__panelInner {
          border-radius: 21px;
          overflow: hidden;
          background: var(--card-bg);
        }

        .comments-section__panelHead {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 12px 16px;
          padding: 16px 20px 14px;
          border-bottom: 0.5px solid var(--border);
          background: linear-gradient(
            180deg,
            color-mix(in srgb, var(--bg) 35%, var(--card-bg)) 0%,
            var(--card-bg) 100%
          );
        }

        .comments-section__panelLabel {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--fg);
        }

        .comments-section__panelLabel::before {
          content: '';
          width: 22px;
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, var(--accent), transparent);
          opacity: 0.85;
        }

        .comments-section__panelGit {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 12px;
          font-weight: 500;
          color: var(--muted);
          text-decoration: none;
          padding: 6px 12px;
          border-radius: 100px;
          border: 0.5px solid var(--border);
          background: var(--bg);
          transition: color 0.2s, border-color 0.2s, background 0.2s;
        }

        .comments-section__panelGit svg {
          flex-shrink: 0;
          width: 15px;
          height: 15px;
        }

        .comments-section__panelGit:hover {
          color: var(--accent);
          border-color: color-mix(in srgb, var(--accent) 35%, var(--border));
          background: color-mix(in srgb, var(--accent) 6%, var(--bg));
        }

        .comments-section__frame {
          padding: clamp(18px, 2.8vw, 26px);
          background: color-mix(in srgb, var(--bg) 55%, var(--card-bg));
          min-height: 140px;
          border: none;
          border-radius: 0;
        }

        .comments-section__frame .giscus {
          width: 100%;
        }

        @media (max-width: 600px) {
          .comments-section__panelHead {
            flex-direction: column;
            align-items: stretch;
          }
          .comments-section__panelGit {
            justify-content: center;
          }
        }

        .comments-fallback__title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(26px, 3vw, 32px);
          line-height: 1;
          color: var(--fg);
          margin: 0 0 12px;
          letter-spacing: 0.02em;
        }

        .comments-fallback__text {
          font-size: 14px;
          line-height: 1.65;
          color: var(--muted);
          margin: 0 0 16px;
        }

        .comments-fallback__text a {
          color: var(--accent);
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .comments-fallback__code {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          padding: 2px 8px;
          border-radius: 6px;
          background: var(--bg);
          border: 0.5px solid var(--border);
          color: var(--fg);
        }

        .comments-fallback__pre {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          line-height: 1.55;
          padding: 16px 18px;
          border-radius: 12px;
          background: var(--bg);
          border: 0.5px solid var(--border);
          overflow-x: auto;
          margin: 0 0 16px;
          color: var(--muted);
        }

        .comments-fallback__hint {
          font-size: 12px;
          line-height: 1.55;
          color: var(--muted);
          margin: 0;
          opacity: 0.92;
        }

        /* FOOTER */
        footer {
          border-top: 0.5px solid var(--border);
          width: 100%;
          padding: 28px clamp(18px, 4vw, 64px);
          max-width: none;
          margin: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        footer.footer-stagger {
          justify-content: flex-start;
          flex-wrap: wrap;
          row-gap: 10px;
        }

        footer p {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: var(--muted);
        }

        footer.footer-stagger .footer-stagger__word {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: var(--muted);
        }

        footer.footer-stagger .footer-stagger__link {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: var(--muted);
          text-decoration: none;
          transition: color 0.2s;
        }

        footer.footer-stagger .footer-stagger__link:hover:not(.footer-stagger__link--maintenance) {
          color: var(--fg);
        }

        footer.footer-stagger .footer-stagger__link--maintenance {
          cursor: not-allowed;
          opacity: 0.72;
          border-bottom: 1px dashed color-mix(in srgb, var(--muted) 45%, var(--border));
        }

        footer.footer-stagger .footer-stagger__link--maintenance:hover {
          color: var(--muted);
        }

        .footer-links {
          display: flex;
          gap: 20px;
        }

        .footer-links a {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: var(--muted);
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-links a:hover { color: var(--fg); }

        /* Cursor dot */
        .cursor-dot {
          width: 8px;
          height: 8px;
          background: var(--accent);
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
          transition: transform 0.1s;
        }

        @media (max-width: 900px) {
          .nav { min-width: unset; width: calc(100% - 40px); }
          .hero {
            justify-content: flex-start;
            padding-top: clamp(108px, 14vh, 152px);
            padding-bottom: 96px;
          }
          .hero__vanta { opacity: var(--hero-vanta-opacity-mobile); }
          .hero__title-wrap { grid-template-columns: 1fr; gap: 18px; text-align: center; max-width: 720px; }
          .hero__word--right {
            align-items: center;
            padding-inline-start: 0;
          }
          .hero__desc { text-align: center; max-width: 100%; }
          .hero__social { justify-content: center; }
          .portrait-wrap { margin-inline: 0; }
          .portrait-wrap { order: -1; width: min(320px, 78vw); transform: none; }
          .services-grid { grid-template-columns: 1fr; }
          .cta-block { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div
        className={introReady ? "home-viewport home-viewport--ready" : "home-viewport"}
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          transition: "background 0.4s",
        }}
      >
        {/* Cursor dot */}
        <div className="cursor-dot" ref={cursorRef} />

        {/* NAV (Dock model) */}
        <DockNav />

        {/* HERO — animasi: kiri dari kiri, kanan dari kanan, foto fade-in */}
        <section className="hero">
          <div className="hero__vanta" ref={vantaRef} aria-hidden="true" />
          <div className="hero__title-wrap">
            {/* Left — AsrofinexQ + role (FULL STACK dll) */}
            {reduceHeroMotion ? (
              <div className="hero__name-area">
                <span className="hero__label">AsrofinexQ</span>
                <div className="hero__word hero__word--type" aria-label="Role">
                  <TextType
                    key={`role-top-${roleIndex}`}
                    text={heroRoles[roleIndex].top}
                    typingSpeed={75}
                    pauseDuration={1500}
                    deletingSpeed={50}
                    loop={false}
                    showCursor={false}
                    className="hero__word hero__word--typeLine"
                  />
                  <br />
                  <TextType
                    key={`role-bottom-${roleIndex}`}
                    text={heroRoles[roleIndex].bottom}
                    typingSpeed={75}
                    pauseDuration={1500}
                    deletingSpeed={50}
                    loop={false}
                    showCursor
                    cursorCharacter="|"
                    cursorBlinkDuration={0.5}
                    className="hero__word hero__word--typeLine"
                  />
                </div>
              </div>
            ) : (
              <motion.div
                className="hero__name-area"
                initial={{ opacity: 0, x: -48 }}
                animate={
                  introReady ? { opacity: 1, x: 0 } : { opacity: 0, x: -48 }
                }
                transition={{
                  delay: heroSeq.left.delay,
                  duration: heroSeq.left.duration,
                  ease: heroEase,
                }}
              >
                <span className="hero__label">AsrofinexQ</span>
                <div className="hero__word hero__word--type" aria-label="Role">
                  <TextType
                    key={`role-top-${roleIndex}`}
                    text={heroRoles[roleIndex].top}
                    typingSpeed={75}
                    pauseDuration={1500}
                    deletingSpeed={50}
                    loop={false}
                    showCursor={false}
                    className="hero__word hero__word--typeLine"
                  />
                  <br />
                  <TextType
                    key={`role-bottom-${roleIndex}`}
                    text={heroRoles[roleIndex].bottom}
                    typingSpeed={75}
                    pauseDuration={1500}
                    deletingSpeed={50}
                    loop={false}
                    showCursor
                    cursorCharacter="|"
                    cursorBlinkDuration={0.5}
                    className="hero__word hero__word--typeLine"
                  />
                </div>
              </motion.div>
            )}

            {/* Center portrait — fade in */}
            <div className="portrait-wrap">
              {reduceHeroMotion ? (
                <ProfileCard
                  name="Asrofi"
                  title="Full Stack Developer"
                  handle="asrofinexq"
                  status="Online"
                  contactText="Contact Me"
                  avatarUrl="/profil.jpeg"
                  hoverAvatarUrl="/profilw.jpeg"
                  showUserInfo={false}
                  enableTilt={true}
                  enableMobileTilt={false}
                  onContactClick={() => (location.href = "/contact")}
                  behindGlowColor="rgba(125, 190, 255, 0.67)"
                  iconUrl="/asrofinexq-logo.png"
                  behindGlowEnabled
                  innerGradient="linear-gradient(145deg,#111111aa 0%,#ffffff22 100%)"
                />
              ) : (
                <motion.div
                  className="portrait-wrap__motion"
                  initial={{ opacity: 0 }}
                  animate={introReady ? { opacity: 1 } : { opacity: 0 }}
                  transition={{
                    delay: heroSeq.portrait.delay,
                    duration: heroSeq.portrait.duration,
                    ease: heroEase,
                  }}
                >
                  <ProfileCard
                    name="Asrofi"
                    title="Full Stack Developer"
                    handle="asrofinexq"
                    status="Online"
                    contactText="Contact Me"
                    avatarUrl="/profil.jpeg"
                    hoverAvatarUrl="/profilw.jpeg"
                    showUserInfo={false}
                    enableTilt={true}
                    enableMobileTilt={false}
                    onContactClick={() => (location.href = "/contact")}
                    behindGlowColor="rgba(125, 190, 255, 0.67)"
                    iconUrl="/asrofinexq-logo.png"
                    behindGlowEnabled
                    innerGradient="linear-gradient(145deg,#111111aa 0%,#ffffff22 100%)"
                  />
                </motion.div>
              )}
            </div>

            {/* Right — DEVELOPER + deskripsi + sosial */}
            {reduceHeroMotion ? (
              <div className="hero__word--right">
                <div className="hero__word hero__word--developer">DEVELOPER</div>
                <p className="hero__desc">
                  I&apos;m a Malang-based full stack developer and Next.js engineer
                </p>
                <HeroSocialLinks />
              </div>
            ) : (
              <motion.div
                className="hero__word--right"
                initial={{ opacity: 0, x: 48 }}
                animate={
                  introReady ? { opacity: 1, x: 0 } : { opacity: 0, x: 48 }
                }
                transition={{
                  delay: heroSeq.right.delay,
                  duration: heroSeq.right.duration,
                  ease: heroEase,
                }}
              >
                <div className="hero__word hero__word--developer">DEVELOPER</div>
                <p className="hero__desc">
                  I&apos;m a Malang-based full stack developer and Next.js engineer
                </p>
                <HeroSocialLinks />
              </motion.div>
            )}
          </div>

          <div className="toggle-wrap">
            <button
              className={`toggle-btn${darkMode ? " active" : ""}`}
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle dark mode"
            />
          </div>
        </section>

        {/* SERVICES */}
        <RevealSection className="section" delay={0.04} from="left">
          <div className="section__header">
            <h2 className="section__title">Services</h2>
            <span className="section__num">01 / 04</span>
          </div>
          <div className="services-split">
            <div className="services-left">
              <p className="services-eyebrow">What I deliver</p>
              <h3 className="services-headline">
                Premium UI.
                <br />
                Solid backend.
                <br />
                Ship fast.
              </h3>
              <p className="services-lede">
                Saya bangun website dan aplikasi yang <b>terasa premium</b>—cepat, rapi, dan siap
                scale. Dari UI sampai API, saya fokus ke <b>struktur yang maintainable</b>, performa,
                dan praktik security yang aman untuk production.
              </p>
              <div className="services-metrics" aria-label="Highlights">
                <div className="services-metric">
                  <strong>UI</strong>
                  <span>Design system</span>
                </div>
                <div className="services-metric">
                  <strong>API</strong>
                  <span>Auth + DB</span>
                </div>
                <div className="services-metric">
                  <strong>SHIP</strong>
                  <span>Deploy ready</span>
                </div>
              </div>
              <ul className="services-points">
                <li className="services-point">
                  <strong>UI</strong>
                  <span>Design system, responsive layout, aksesibilitas, dan micro-interactions yang halus.</span>
                </li>
                <li className="services-point">
                  <strong>API</strong>
                  <span>Auth, validation, database schema, caching, dan security best-practices.</span>
                </li>
                <li className="services-point">
                  <strong>Ship</strong>
                  <span>Deploy, CI/CD, observability, dan release flow yang minim risiko.</span>
                </li>
              </ul>
            </div>

            <div className="asro-cardswap-stage">
              <div className="asro-cardswap-wrap" aria-hidden="true">
                <CardSwap cardDistance={60} verticalDistance={70} delay={5000} pauseOnHover={false}>
                  <Card className="asro-cardswap-card">
                    <div className="asro-service__meta">
                      <div>
                        <div className="asro-service__kicker">Service 01</div>
                        <h3 className="asro-service__title">Front-end Engineering</h3>
                        <p className="asro-service__desc">
                          UI yang rapih, responsif, dan terasa premium. Komponen reusable,
                          design system, dan micro-interactions yang halus.
                        </p>
                        <div className="asro-service__tags">
                          <span className="tag">React</span>
                          <span className="tag">Next.js</span>
                          <span className="tag">TypeScript</span>
                          <span className="tag">UI/UX</span>
                        </div>
                      </div>
                      <div className="asro-service__ctaRow">
                        <Link className="asro-service__cta" href="/projects">See work</Link>
                        <Link className="asro-service__cta" href="/contact">Request quote</Link>
                      </div>
                    </div>
                    <div className="asro-service__visual">
                      <img
                        className="asro-service__visual-img"
                        src="/project/service1.jpg"
                        alt="Front-end engineering preview"
                        loading="lazy"
                      />
                    </div>
                  </Card>

                  <Card className="asro-cardswap-card">
                    <div className="asro-service__meta">
                      <div>
                        <div className="asro-service__kicker">Service 02</div>
                        <h3 className="asro-service__title">Backend & API</h3>
                        <p className="asro-service__desc">
                          REST API, auth, validation, database design, dan arsitektur yang
                          rapi. Fokus ke security, performance, dan DX.
                        </p>
                        <div className="asro-service__tags">
                          <span className="tag">Node</span>
                          <span className="tag">PostgreSQL</span>
                          <span className="tag">Auth</span>
                          <span className="tag">Caching</span>
                        </div>
                      </div>
                      <div className="asro-service__ctaRow">
                        <Link className="asro-service__cta" href="/projects">See work</Link>
                        <Link className="asro-service__cta" href="/contact">Integrate API</Link>
                      </div>
                    </div>
                    <div className="asro-service__visual">
                      <img
                        className="asro-service__visual-img"
                        src="/project/service2.jpg"
                        alt="Backend and API preview"
                        loading="lazy"
                      />
                    </div>
                  </Card>

                  <Card className="asro-cardswap-card">
                    <div className="asro-service__meta">
                      <div>
                        <div className="asro-service__kicker">Service 03</div>
                        <h3 className="asro-service__title">Full-stack Delivery</h3>
                        <p className="asro-service__desc">
                          End-to-end dari desain, implementasi, testing, sampai deploy.
                          Setup env, CI/CD, monitoring, dan release yang bersih.
                        </p>
                        <div className="asro-service__tags">
                          <span className="tag">Docker</span>
                          <span className="tag">CI/CD</span>
                          <span className="tag">Vercel</span>
                          <span className="tag">Observability</span>
                        </div>
                      </div>
                      <div className="asro-service__ctaRow">
                        <Link className="asro-service__cta" href="/projects">See work</Link>
                        <Link className="asro-service__cta" href="/contact">Ship product</Link>
                      </div>
                    </div>
                    <div className="asro-service__visual">
                      <img
                        className="asro-service__visual-img"
                        src="/project/service3.jpg"
                        alt="Full-stack delivery preview"
                        loading="lazy"
                      />
                    </div>
                  </Card>
                </CardSwap>
              </div>
            </div>
          </div>
        </RevealSection>

        {/* KARYA & SERTIFIKASI */}
        <RevealSection className="section" id="projects" delay={0.08} from="right">
          <div className="section__header">
            <h2 className="section__title">Project &amp; Sertifikasi</h2>
            <span className="section__num">02 / 04</span>
          </div>
          <div className="work-showcase__toolbar">
            <div className="work-tabs" role="tablist" aria-label="Pilih tampilan portofolio">
              <button
                type="button"
                role="tab"
                id="tab-projects"
                aria-selected={portfolioTab === "projects"}
                aria-controls="panel-projects"
                tabIndex={portfolioTab === "projects" ? 0 : -1}
                onClick={() => setPortfolioTab("projects")}
              >
                Project
              </button>
              <button
                type="button"
                role="tab"
                id="tab-certificates"
                aria-selected={portfolioTab === "certificates"}
                aria-controls="panel-certificates"
                tabIndex={portfolioTab === "certificates" ? 0 : -1}
                onClick={() => setPortfolioTab("certificates")}
              >
                Sertifikat
              </button>
            </div>
          </div>

          {portfolioTab === "projects" ? (
            <div
              className="work-showcase-grid"
              role="tabpanel"
              id="panel-projects"
              aria-labelledby="tab-projects"
              key="panel-projects"
            >
              {showcaseProjects.slice(0, 3).map((p) => (
                <article
                  key={p.id}
                  className="work-tile"
                >
                  <div
                    className={`work-tile__thumb work-tile__thumb--v${p.thumbVariant}${p.thumbImage ? " work-tile__thumb--image" : ""}`}
                    style={p.thumbImage ? { backgroundImage: `url(${p.thumbImage})` } : undefined}
                    aria-hidden
                  >
                    {!p.thumbImage ? (
                      <div className="work-tile__thumb-fuzzy">
                        <FuzzyText baseIntensity={0.2} hoverIntensity={0.5} enableHover>
                          404
                        </FuzzyText>
                      </div>
                    ) : null}
                  </div>
                  <span className="work-tile__kicker">Project {p.id}</span>
                  <h3 className="work-tile__title">{p.title}</h3>
                  <p className="work-tile__desc">{p.desc}</p>
                  <div className="work-tile__tags">
                    {p.tags.map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="work-tile__actions">
                    <ShowcaseAction className="btn btn--primary" href={p.live}>
                      Live demo
                    </ShowcaseAction>
                    <ShowcaseAction className="btn btn--ghost" href={p.source}>
                      Source
                    </ShowcaseAction>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div
              className="work-showcase-grid"
              role="tabpanel"
              id="panel-certificates"
              aria-labelledby="tab-certificates"
              key="panel-certificates"
            >
              {showcaseCertificates.map((c, idx) => (
                <article key={c.id} className="work-tile">
                  <div
                    className={`work-tile__thumb work-tile__thumb--v${idx % 6}${c.thumbImage ? " work-tile__thumb--image work-tile__thumb--certificate-image" : ""}`}
                    style={c.thumbImage ? { backgroundImage: `url(${c.thumbImage})` } : undefined}
                    aria-hidden
                  />
                  <span className="work-tile__kicker">Sertifikat</span>
                  <h3 className="work-tile__title">{c.title}</h3>
                  <p className="work-tile__issuer">{c.issuer}</p>
                  <p className="work-tile__year">{c.year}</p>
                  <div className="work-tile__actions">
                    <ShowcaseAction className="btn btn--primary" href={c.href}>
                      Lihat / verifikasi
                    </ShowcaseAction>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="work-showcase-cta">
            <p className="work-showcase-cta__kicker">Tidak cukup di sini saja</p>
            <h3 className="work-showcase-cta__title">Jelajahi arsip lebih lengkap</h3>
            <p className="work-showcase-cta__desc">
              Studi kasus tambahan, repositori, dan tautan verifikasi sertifikat sedang dirapikan
              untuk halaman arsip. Sementara itu, silakan hubungi jika ingin melihat lebih detail.
            </p>
            <div className="work-showcase-cta__actions">
              <ShowcaseAction className="btn btn--primary" href="/projects">
                Lihat lebih banyak
              </ShowcaseAction>
              <ShowcaseAction className="btn btn--ghost" href="/contact">
                Hubungi untuk detail
              </ShowcaseAction>
            </div>
          </div>
        </RevealSection>

        {/* SKILLS + CTA */}
        <RevealSection className="section" delay={0.12} from="left">
          <div className="section__header">
            <h2 className="section__title">Skills</h2>
            <span className="section__num">03 / 04</span>
          </div>
          <div className="skills-wrap">
            {[
              "Next.js",
              "React",
              "Node.js",
              "Laravel",
              "TypeScript",
              "JavaScript",
              "PHP",
              "CodeIgniter 3",
              "HTML & CSS",
              "Tailwind CSS",
              "Mikrotik (Routing, VPN, Bandwidth)",
              "Linux Server (Ubuntu, Debian)",
              "Nginx & Apache",
              "MySQL",
              "PostgreSQL",
              "RESTful API",
              "Authentication Security",
              "VPS / Domain / SSL",
              "WhatsApp & Telegram Bot API",
              "UI/UX Implementation",
            ].map((s) => (
              <span key={s} className="skill-pill">
                {s}
              </span>
            ))}
          </div>

          <div className="logoRows" aria-label="Logo loops">
            <div className="logoRow">
              <div className="logoRow__label">Skills</div>
              <LogoLoop
                logos={techLogos}
                speed={100}
                direction="left"
                logoHeight={34}
                gap={56}
                hoverSpeed={20}
                scaleOnHover
                fadeOut
                fadeOutColor="var(--bg)"
                ariaLabel="Technology stack"
              />
            </div>

            <div className="logoRow">
              <div className="logoRow__label">Partners</div>
              <LogoLoop
                logos={partnerLogos}
                speed={90}
                direction="left"
                logoHeight={40}
                gap={56}
                hoverSpeed={20}
                fadeOut
                fadeOutColor="var(--bg)"
                ariaLabel="Partners"
                className="logoloop--partners"
              />
            </div>
          </div>

          <div className="cta-block" id="contact">
            <h2>Let&apos;s build something clean.</h2>
            <div className="cta-btns">
              <a className="btn btn--primary" href={`mailto:${SITE_EMAIL}`}>
                Start a project
              </a>
              <Link className="btn btn--ghost" href="/services">
                Services
              </Link>
            </div>
          </div>
        </RevealSection>

        {/* BUKU TAMU / KOMENTAR */}
        <RevealSection
          className="section comments-section"
          id="guestbook"
          delay={0.15}
          from="right"
        >
          <div className="comments-section__glow" aria-hidden />
          <div className="section__header comments-section__titleRow">
            <div className="comments-section__titleBlock">
              <span className="comments-section__eyebrow">
                <MessageCircle size={18} strokeWidth={1.75} aria-hidden />
                Ruang diskusi
              </span>
              <h2 className="section__title">Buku tamu</h2>
            </div>
            <span className="section__num">04 / 04</span>
          </div>
          <ul className="comments-section__highlights" aria-label="Keunggulan sistem komentar">
            <li>
              <span className="comments-section__dot" aria-hidden />
              Gratis &amp; open source
            </li>
            <li>
              <span className="comments-section__dot" aria-hidden />
              Sinkron dengan GitHub
            </li>
            <li>
              <span className="comments-section__dot" aria-hidden />
              Tanpa database sendiri
            </li>
          </ul>
          <p className="comments-section__lead">
            Tinggalkan komentar, sapaan, atau masukan. Thread disimpan lewat{" "}
            <a href="https://giscus.app" target="_blank" rel="noopener noreferrer">
              Giscus
            </a>{" "}
            &amp; GitHub Discussions — pengunjung perlu login GitHub untuk menulis dari sini.
          </p>
          <div className="comments-section__panel">
            <div className="comments-section__panelInner">
              <div className="comments-section__panelHead">
                <span className="comments-section__panelLabel">Komentar pengunjung</span>
                <a
                  className="comments-section__panelGit"
                  href="https://github.com/asrofinexq/komentar/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SiGithub aria-hidden />
                  Buka di GitHub
                </a>
              </div>
              <div className="comments-section__frame">
                <VisitorComments />
              </div>
            </div>
          </div>
        </RevealSection>

        {/* FOOTER — per kata + per tautan */}
        <FooterStagger delayChildren={0.18} />
      </div>
    </>
  );
}