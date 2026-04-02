"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import ProfileCard from "@/app/components/ProfileCard";
import DockNav from "@/app/components/DockNav";
import HeroSocialLinks from "@/app/components/HeroSocialLinks";
import RevealSection from "@/app/components/RevealSection";
import FooterStagger from "@/app/components/FooterStagger";
import HeroShaderBackground from "@/app/components/HeroShaderBackground";
import SkillsStarfieldBackground from "@/app/components/SkillsStarfieldBackground";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Router,
  Server,
  Braces,
  House,
  UserRound,
  Blocks,
  FolderKanban,
  Cpu,
  BookText,
  Mail,
} from "lucide-react";
import BlurText from "@/components/BlurText";
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
} from "react-icons/si";
import type { PortfolioTab } from "@/app/lib/showcase";
import {
  HomeAboutBlock,
  HomeContactBlock,
  HomeGuestbookBlock,
  HomeProjectsBlock,
  HomeServicesBlock,
  HomeSkillsBlock,
} from "@/app/components/homeStoryBlocks";
import { THEME_STORAGE_KEY } from "@/app/lib/site";
import {
  STORY_SLIDE_CENTER,
  STORY_SLIDE_EXIT,
  STORY_SLIDE_REDUCED,
} from "@/app/lib/homeStoryMotion";
import { AnimatedThemeToggler } from "@/registry/magicui/animated-theme-toggler";
import { MorphingText } from "@/registry/magicui/morphing-text";
import { RetroGrid } from "@/registry/magicui/retro-grid";

const heroEase = [0.16, 1, 0.3, 1] as const;

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

type StoryMotionCustom = { dir: number; noSlide?: boolean; servicesExitSequence?: boolean };

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const skipDarkPersist = useRef(true);
  const [portfolioTab, setPortfolioTab] = useState<PortfolioTab>("projects");
  /** Tur layar penuh: Hero → … → Selesai, lalu halaman bisa di-scroll. */
  const [storyComplete, setStoryComplete] = useState(false);
  const [storyStep, setStoryStep] = useState(0);
  /** 1 = maju (slide dari kanan), -1 = mundur (slide dari kiri) */
  const [storyDir, setStoryDir] = useState(1);
  const [storyNoSlide, setStoryNoSlide] = useState(false);
  const [aboutFromHeroTransition, setAboutFromHeroTransition] = useState(false);
  const [servicesFromAboutTransition, setServicesFromAboutTransition] = useState(false);
  const [servicesExitSequence, setServicesExitSequence] = useState(false);
  const lastStoryStep = 6;
  /** Contact → halaman penuh: durasi fade keluar tur (ms), selaras motion wrapper */
  const STORY_CONTACT_TO_FULL_MS = 560;
  const STORY_COMPLETE_STORAGE_KEY = "asro:story-complete";
  const [introReady, setIntroReady] = useState(false);
  const reduceHeroMotion = useReducedMotion();
  /** Sedang animasi keluar dari step Contact sebelum unmount tur */
  const [storyFinishAnimating, setStoryFinishAnimating] = useState(false);
  const storyExitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Setelah intro: bg → nav → ketik → DEVELOPER → foto → Malang → sosmed → AsrofinexQ (~4s) */
  const homeLand = useMemo(
    () => ({
      pageBg: 0,
      bgHero: 0.05,
      nav: 0.11,
      typeLine: 0.34,
      developer: 0.88,
      portrait: 1.52,
      desc: 2.18,
      social: 2.78,
      brand: 3.38,
    }),
    [],
  );

  const homeLandTx = useCallback(
    (delaySec: number, duration = 0.52) =>
      reduceHeroMotion
        ? { duration: 0.01, delay: 0 }
        : { delay: delaySec, duration, ease: heroEase },
    [reduceHeroMotion],
  );

  const heroMorphTexts = ["FRONT\nEND", "BACK\nEND", "FULL\nSTACK"];
  const storyFlowSteps = [
    { key: "hero", label: "Hero", icon: House },
    { key: "about", label: "About", icon: UserRound },
    { key: "services", label: "Services", icon: Blocks },
    { key: "projects", label: "Project & Sertifikasi", icon: FolderKanban },
    { key: "skills", label: "Skills", icon: Cpu },
    { key: "guestbook", label: "Buku Tamu", icon: BookText },
    { key: "contact", label: "Kontak", icon: Mail },
  ] as const;
  const isProjectsStoryStep = storyStep === 3;
  const lockStorySectionScroll = !storyComplete;

  useEffect(() => {
    const markReady = () => setIntroReady(true);
    if (typeof document !== "undefined" && document.body.classList.contains("asro-intro-done")) {
      markReady();
      return;
    }
    window.addEventListener("asro:intro-complete", markReady, { once: true });
    return () => window.removeEventListener("asro:intro-complete", markReady);
  }, []);

  // Persist state "full page" untuk navigasi antar route (via navbar),
  // tapi saat refresh (reload) kita tetap kembali ke story dari awal.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const entries = window.performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
      const navType = entries?.[0]?.type;
      const isReload = navType === "reload";
      if (isReload) return;

      const saved = sessionStorage.getItem(STORY_COMPLETE_STORAGE_KEY);
      if (saved === "1") {
        setStoryComplete(true);
        setStoryStep(lastStoryStep);
      }
    } catch {
      // ignore storage/performance errors
    }
  }, []);

  useEffect(() => {
    if (!storyComplete) return;
    try {
      sessionStorage.setItem(STORY_COMPLETE_STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  }, [storyComplete]);

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
    if (storyComplete) return;
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [storyComplete]);

  useEffect(() => {
    return () => {
      if (storyExitTimerRef.current) {
        clearTimeout(storyExitTimerRef.current);
        storyExitTimerRef.current = null;
      }
    };
  }, []);

  const finalizeStoryToFullPage = useCallback(() => {
    setStoryFinishAnimating(false);
    setStoryComplete(true);
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: reduceHeroMotion ? "instant" : "smooth",
      });
    });
  }, [reduceHeroMotion]);

  const handleStoryForward = () => {
    setStoryDir(1);
    if (storyStep >= lastStoryStep) {
      if (storyFinishAnimating) return;
      if (reduceHeroMotion) {
        finalizeStoryToFullPage();
        return;
      }
      setStoryFinishAnimating(true);
      if (storyExitTimerRef.current) clearTimeout(storyExitTimerRef.current);
      storyExitTimerRef.current = setTimeout(() => {
        storyExitTimerRef.current = null;
        finalizeStoryToFullPage();
      }, STORY_CONTACT_TO_FULL_MS);
      return;
    }
    if (storyStep === 0 && !reduceHeroMotion) {
      setStoryNoSlide(true);
      setAboutFromHeroTransition(true);
      setServicesFromAboutTransition(false);
      setServicesExitSequence(false);
      setStoryStep(1);
      return;
    }
    if (storyStep === 1 && !reduceHeroMotion) {
      setStoryNoSlide(true);
      setAboutFromHeroTransition(false);
      setServicesFromAboutTransition(true);
      setServicesExitSequence(false);
      setStoryStep(2);
      return;
    }
    if (storyStep === 2 && !reduceHeroMotion) {
      setStoryNoSlide(true);
      setAboutFromHeroTransition(false);
      setServicesFromAboutTransition(false);
      setServicesExitSequence(true);
      setStoryStep(3);
      return;
    }
    if (storyStep === 3 && !reduceHeroMotion) {
      setStoryNoSlide(true);
      setAboutFromHeroTransition(false);
      setServicesFromAboutTransition(false);
      setServicesExitSequence(false);
      setStoryStep(4);
      return;
    }
    if (storyStep === 4 && !reduceHeroMotion) {
      setStoryNoSlide(true);
      setAboutFromHeroTransition(false);
      setServicesFromAboutTransition(false);
      setServicesExitSequence(false);
      setStoryStep(5);
      return;
    }
    if (storyStep === 5 && !reduceHeroMotion) {
      setStoryNoSlide(true);
      setAboutFromHeroTransition(false);
      setServicesFromAboutTransition(false);
      setServicesExitSequence(false);
      setStoryStep(6);
      return;
    }
    setStoryNoSlide(false);
    setAboutFromHeroTransition(false);
    setServicesFromAboutTransition(false);
    setServicesExitSequence(false);
    setStoryStep((s) => s + 1);
  };

  const handleStoryBack = () => {
    if (storyFinishAnimating) return;
    if (storyStep <= 0) return;
    setStoryDir(-1);
    setStoryNoSlide(storyStep === 1 || storyStep === 2 || storyStep === 4 || storyStep === 5 || storyStep === 6);
    if (storyStep === 1) setAboutFromHeroTransition(false);
    if (storyStep === 2) setServicesFromAboutTransition(false);
    setServicesExitSequence(false);
    setStoryStep((s) => s - 1);
  };

  const storySlideVariants: Variants = {
    enter: (custom: StoryMotionCustom) =>
      custom?.noSlide
        ? {
            x: 0,
            opacity: 0,
            scale: 1,
            rotateY: 0,
            filter: "blur(10px)",
            transformOrigin: "50% 45%",
          }
        : {
            x: custom?.dir >= 0 ? "min(85vw, 480px)" : "max(-85vw, -480px)",
            opacity: 0,
            scale: 0.88,
            rotateY: custom?.dir >= 0 ? -16 : 16,
            filter: "blur(18px) brightness(0.82)",
            transformOrigin: "50% 45%",
          },
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      filter: "blur(0px) brightness(1)",
      transition: {
        ...STORY_SLIDE_CENTER.spring,
        opacity: STORY_SLIDE_CENTER.opacity,
        filter: STORY_SLIDE_CENTER.filter,
      },
    },
    exit: (custom: StoryMotionCustom) =>
      custom?.noSlide
        ? custom?.servicesExitSequence
          ? {
              x: 0,
              opacity: [1, 1, 0],
              scale: [1, 1, 0.995],
              rotateY: 0,
              filter: ["blur(0px)", "blur(0px)", "blur(10px)"],
              transition: {
                duration: 1.08,
                ease: [0.22, 1, 0.36, 1],
                times: [0, 0.78, 1],
              },
            }
          : {
              x: 0,
              opacity: 0,
              scale: 1,
              rotateY: 0,
              filter: "blur(10px)",
              transition: { duration: STORY_SLIDE_EXIT.duration, ease: STORY_SLIDE_EXIT.ease },
            }
        : {
            x: custom?.dir >= 0 ? "max(-70vw, -400px)" : "min(70vw, 400px)",
            opacity: 0,
            scale: 0.92,
            rotateY: custom?.dir >= 0 ? 14 : -14,
            filter: "blur(14px)",
            transition: { duration: STORY_SLIDE_EXIT.duration, ease: STORY_SLIDE_EXIT.ease },
          },
  };

  const storySlideVariantsReduced: Variants = {
    enter: (custom: StoryMotionCustom) =>
      custom?.noSlide ? { x: 0, opacity: 0 } : { x: custom?.dir >= 0 ? 48 : -48, opacity: 0 },
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: STORY_SLIDE_REDUCED.enterDuration, ease: STORY_SLIDE_REDUCED.enterEase },
    },
    exit: (custom: StoryMotionCustom) => ({
      x: custom?.noSlide ? 0 : custom?.dir >= 0 ? -40 : 40,
      opacity: 0,
      transition: { duration: STORY_SLIDE_REDUCED.exitDuration },
    }),
  };

  const renderHeroSection = () => {
    const profile = (
      <ProfileCard
        name="Asrofi"
        title="Full Stack Developer"
        handle="asrofinexq"
        status="Online"
        contactText="Contact Me"
        avatarUrl="/profil.jpeg"
        avatarVideoUrl="/profil.mp4"
        avatarPosterUrl="/profil.jpeg"
        showUserInfo={false}
        enableTilt={true}
        enableMobileTilt={false}
        onContactClick={() => (location.href = "/contact")}
        behindGlowColor="rgba(125, 190, 255, 0.67)"
        iconUrl="/asrofinexq-logo.png"
        behindGlowEnabled
        innerGradient="linear-gradient(145deg,#111111aa 0%,#ffffff22 100%)"
      />
    );

    const sceneBack = <HeroShaderBackground darkMode={darkMode} className="hero__shader-canvas" />;

    const nameTyping = (
      <div className="hero__word hero__word--type" aria-label="Role">
        <MorphingText texts={heroMorphTexts} className="hero__morphing" />
      </div>
    );

    const descText = (
      <p className="hero__desc">
        I&apos;m a Malang-based full stack developer and network engineer
      </p>
    );

    const signatureEl = (
      <Image
        src="/signature.png"
        alt="Tanda tangan Asrofi"
        width={640}
        height={140}
        className="hero__signature-img"
        sizes="(max-width: 900px) min(320px, 88vw), min(460px, 46vw)"
        priority
      />
    );

    if (reduceHeroMotion) {
      return (
        <section className="hero">
          <div className="hero__scene-back">{sceneBack}</div>
          <div className="hero__title-wrap">
            <div className="hero__name-area">
              <span className="hero__label">AsrofinexQ</span>
              {nameTyping}
            </div>
            <div className="portrait-wrap">
              <div className="portrait-wrap__motion">{profile}</div>
              <div className="hero__signature-on-portrait">
                <div className="hero__signature-wrap">{signatureEl}</div>
              </div>
            </div>
            <div className="hero__word--right">
              <div className="hero__right-text-column">
                <div className="hero__developer-stack">
                  <div className="hero__word hero__word--developer">DEVELOPER</div>
                </div>
                <div className="hero__desc-wrap">{descText}</div>
                <div className="hero__social-land">
                  <HeroSocialLinks />
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }

    const landOn = introReady;

    return (
      <section className="hero">
        <motion.div
          className="hero__scene-back"
          aria-hidden
          initial={false}
          animate={landOn ? { opacity: 1 } : { opacity: 0 }}
          transition={homeLandTx(homeLand.bgHero, 0.52)}
        >
          {sceneBack}
        </motion.div>
        <div className="hero__title-wrap">
          <div className="hero__name-area">
            <motion.span
              className="hero__label"
              initial={false}
              animate={landOn ? { opacity: 1 } : { opacity: 0 }}
              transition={homeLandTx(homeLand.brand, 0.58)}
            >
              AsrofinexQ
            </motion.span>
            <motion.div
              initial={false}
              animate={landOn ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: -44, scale: 0.94 }}
              transition={homeLandTx(homeLand.typeLine, 0.58)}
            >
              {nameTyping}
            </motion.div>
          </div>
          <div className="portrait-wrap">
            <motion.div
              className="portrait-wrap__motion"
              initial={false}
              animate={landOn ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
              transition={homeLandTx(homeLand.portrait, 0.55)}
            >
              {profile}
            </motion.div>
            <motion.div
              className="hero__signature-on-portrait"
              initial={false}
              animate={landOn ? { opacity: 1 } : { opacity: 0 }}
              transition={homeLandTx(homeLand.portrait, 0.55)}
            >
              <div className="hero__signature-wrap">{signatureEl}</div>
            </motion.div>
          </div>
          <div className="hero__word--right">
            <div className="hero__right-text-column">
              <div className="hero__developer-stack">
                <BlurText
                  text="DEVELOPER"
                  delay={200}
                  animateBy="words"
                  direction="top"
                  active={landOn}
                  className="hero__word hero__word--developer mb-0 w-full justify-end"
                />
              </div>
              <motion.div
                className="hero__desc-wrap"
                initial={false}
                animate={landOn ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                transition={homeLandTx(homeLand.desc, 0.52)}
              >
                {descText}
              </motion.div>
              <motion.div
                className="hero__social-land"
                initial={false}
                animate={landOn ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 18, scale: 0.9 }}
                transition={homeLandTx(homeLand.social, 0.52)}
              >
                <HeroSocialLinks />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    );
  };

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
          /* --hero-grad-* & intro curtain: global di nexq.css */
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
          background: transparent;
        }

        .hero__scene-back {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          overflow: hidden;
          opacity: 1;
          transition: opacity 0.4s ease;
        }

        .dark .hero__scene-back {
          opacity: 0.84;
        }

        .hero__shader-canvas {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .dark .hero__desc {
          color: rgba(250, 250, 250, 0.94);
          -webkit-text-stroke: 0.45px rgba(255, 255, 255, 0.5);
          text-shadow:
            0 0 1px rgba(255, 255, 255, 0.35),
            0 0 4px rgba(255, 255, 255, 0.12);
        }

        .hero__title-wrap {
          width: 100%;
          max-width: 1240px;
          position: relative;
          display: grid;
          grid-template-columns: minmax(280px, 1fr) auto minmax(280px, 1fr);
          align-items: center;
          column-gap: clamp(14px, 2.2vw, 28px);
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
          font-weight: 700;
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
        }

        /* DEVELOPER + deskripsi: satu kolom, rata kanan sama — biar Malang tepat di bawah huruf R */
        .hero__right-text-column {
          display: grid;
          justify-items: end;
          align-content: start;
          row-gap: 10px;
          width: max-content;
          max-width: 100%;
          align-self: flex-end;
          transform: translateX(clamp(-32px, -4vw, -10px));
        }

        .hero__desc-wrap {
          min-width: 0;
          max-width: 38ch;
          width: min(38ch, 100%);
        }

        .hero__desc-wrap .hero__desc {
          max-width: none;
        }

        /* Sosmed sejajar tepi kanan paragraf (tepat di bawah "network engineer") */
        .hero__right-text-column .hero__social-land {
          width: min(38ch, 100%);
          max-width: 38ch;
          display: flex;
          justify-content: flex-end;
          align-self: end;
          margin-top: 2px;
        }

        .hero__developer-stack {
          position: relative;
          width: fit-content;
          max-width: 100%;
          z-index: 8;
        }

        /* Tanda tangan menempel di depan bagian bawah foto profil */
        .hero__signature-on-portrait {
          position: absolute;
          left: 50%;
          bottom: clamp(-6px, 0.8vw, 10px);
          transform: translateX(-50%);
          width: min(122%, 440px);
          z-index: 20;
          pointer-events: none;
          line-height: 0;
        }

        .hero__signature-wrap {
          width: 100%;
          transform: none;
        }

        .hero__signature-img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: contain;
          filter: drop-shadow(0 3px 14px color-mix(in srgb, var(--bg) 55%, transparent));
        }

        .dark .hero__signature-img {
          filter: brightness(0) invert(1) drop-shadow(0 2px 16px rgba(0, 0, 0, 0.5));
        }

        /* Reserve 2-line space so typing doesn't reflow layout */
        .hero__word--type {
          min-height: 1.8em; /* ~ 2 lines * line-height(0.9) */
          display: block;
        }

        .hero__morphing {
          margin: 0 !important;
          max-width: none !important;
          width: clamp(250px, 30vw, 460px);
          height: clamp(116px, 15vw, 184px);
          text-align: left;
        }

        .hero__morphing span {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(64px, 8.8vw, 136px);
          line-height: 0.88;
          color: var(--fg);
          letter-spacing: 0.01em;
          text-align: left;
          white-space: pre-line;
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
          padding-inline-start: clamp(2px, 0.5vw, 10px);
          margin-inline-start: clamp(-14px, -1.8vw, -6px);
        }

        .hero__desc {
          font-size: clamp(16px, 1.55vw, 19px);
          font-weight: 600;
          letter-spacing: 0.015em;
          color: #0a0a0a;
          line-height: 1.62;
          text-align: right;
          -webkit-text-stroke: 0.65px rgba(255, 255, 255, 0.62);
          paint-order: stroke fill;
          text-shadow:
            0 0 1px rgba(255, 255, 255, 0.5),
            0 0 3px rgba(255, 255, 255, 0.22);
        }

        .hero__social-land {
          display: flex;
          justify-content: flex-end;
        }

        .hero__social {
          display: flex;
          flex-wrap: wrap;
          gap: 12px 14px;
          align-items: center;
          justify-content: flex-end;
          margin-top: 4px;
          margin-inline-start: auto;
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
          color: #ef4444;
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
          z-index: 3;
          justify-self: center;
          overflow: visible;
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

        /* ── THEME: bar atas, tidak nempel pojok ── */
        .theme-toggle-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 240;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding: max(14px, env(safe-area-inset-top)) clamp(24px, 6vw, 56px) 14px;
          pointer-events: none;
          background: linear-gradient(
            180deg,
            color-mix(in srgb, var(--bg) 88%, transparent) 0%,
            color-mix(in srgb, var(--bg) 40%, transparent) 55%,
            transparent 100%
          );
        }

        .theme-toggle-bar .theme-toggle-trigger {
          pointer-events: auto;
          flex-shrink: 0;
          width: 44px;
          height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          border: 0.5px solid var(--border);
          background: var(--nav-bg);
          color: var(--fg);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          box-shadow:
            0 2px 12px color-mix(in srgb, var(--fg) 8%, transparent),
            0 8px 28px color-mix(in srgb, var(--accent) 12%, transparent);
          transition: transform 0.22s ease, border-color 0.22s ease, background 0.22s ease;
        }

        .theme-toggle-bar .theme-toggle-trigger:hover {
          transform: translateY(-2px);
          border-color: color-mix(in srgb, var(--accent) 36%, var(--border));
        }

        .theme-toggle-bar .theme-toggle-trigger svg {
          width: 20px;
          height: 20px;
        }

        .home-viewport--story {
          height: 100dvh;
          max-height: 100dvh;
          overflow: hidden;
          overscroll-behavior: none;
        }

        .home-story {
          position: absolute;
          inset: 0;
          z-index: 1;
          perspective: 1280px;
          perspective-origin: 50% 42%;
        }

        .home-story__progress {
          position: fixed;
          left: clamp(8px, 1.8vw, 24px);
          top: 50%;
          transform: translateY(-50%);
          z-index: 216;
          pointer-events: none;
          width: 44px;
        }

        .home-story__progress-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .home-story__progress-item {
          display: flex;
          align-items: center;
          min-height: 58px;
          justify-content: center;
        }

        .home-story__progress-node {
          position: relative;
          width: 36px;
          height: 58px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
        }

        .home-story__progress-dot {
          width: 24px;
          height: 24px;
          border-radius: 999px;
          border: 1px solid color-mix(in srgb, var(--fg) 24%, var(--border));
          background: color-mix(in srgb, var(--bg) 74%, transparent);
          color: color-mix(in srgb, var(--fg) 55%, var(--muted));
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          font-weight: 600;
          box-shadow: 0 0 0 1px color-mix(in srgb, var(--bg) 36%, transparent);
          transition: border-color 0.26s ease, background 0.26s ease, color 0.26s ease;
        }

        .home-story__progress-dot--done {
          border-color: color-mix(in srgb, var(--accent) 45%, var(--border));
          background: color-mix(in srgb, var(--accent) 22%, var(--bg));
          color: var(--fg);
        }

        .home-story__progress-dot--active {
          border-color: color-mix(in srgb, var(--accent) 66%, var(--border));
          background: color-mix(in srgb, var(--accent) 30%, var(--bg));
          color: var(--fg);
          box-shadow:
            0 0 0 1px color-mix(in srgb, var(--accent) 34%, transparent),
            0 0 18px color-mix(in srgb, var(--accent) 24%, transparent);
        }

        .home-story__progress-dot svg {
          width: 12px;
          height: 12px;
        }

        .home-story__progress-segment {
          position: absolute;
          top: 24px;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          height: 34px;
          border-radius: 999px;
          background: color-mix(in srgb, var(--fg) 16%, transparent);
          overflow: hidden;
        }

        .home-story__progress-segment-fill {
          position: absolute;
          inset: 0;
          transform-origin: top center;
          background: linear-gradient(
            180deg,
            color-mix(in srgb, var(--accent) 72%, var(--fg)) 0%,
            color-mix(in srgb, var(--accent) 44%, var(--fg)) 100%
          );
        }

        .home-story__panel {
          position: absolute;
          inset: 0;
          overflow-x: hidden;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 210px;
          transform-style: preserve-3d;
          will-change: transform, opacity, filter;
        }

        .home-story__panel--scroll-locked {
          overflow-y: hidden;
          overscroll-behavior: none;
        }

        .home-story__panel--services-fit {
          padding-bottom: 124px;
        }

        .projects-story-shell {
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .projects-story-shell__header {
          flex: 0 0 auto;
        }

        .projects-story-shell__header .section__header {
          margin-bottom: 18px;
        }

        .projects-top-controls {
          display: grid;
          gap: 14px;
        }

        .projects-top-controls .section__header {
          margin-bottom: 0;
        }

        .project-shelf__tabs {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: fit-content;
          margin-inline: auto;
          margin-block: 8px 10px;
          padding: 4px;
          border-radius: 999px;
          border: 0.5px solid var(--border);
          background: color-mix(in srgb, var(--card-bg) 72%, transparent);
        }

        .project-shelf__tab {
          border: 0;
          border-radius: 999px;
          padding: 8px 16px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--muted);
          background: transparent;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
        }

        .project-shelf__tab:hover {
          color: var(--fg);
          transform: translateY(-1px);
        }

        .project-shelf__tab--active {
          color: var(--bg);
          background: var(--fg);
        }

        .projects-story-shell__content {
          flex: 1 1 auto;
          min-height: 0;
          max-height: calc(100dvh - 270px);
          overflow-y: auto;
          overflow-x: hidden;
          overscroll-behavior: contain;
          padding-inline-end: 6px;
          scrollbar-width: thin;
          scrollbar-color: color-mix(in srgb, var(--fg) 34%, transparent) transparent;
        }

        .projects-story-shell__content::-webkit-scrollbar {
          width: 7px;
        }

        .projects-story-shell__content::-webkit-scrollbar-track {
          background: transparent;
        }

        .projects-story-shell__content::-webkit-scrollbar-thumb {
          background: color-mix(in srgb, var(--fg) 28%, transparent);
          border-radius: 999px;
        }

        .projects-story-shell__content::-webkit-scrollbar-thumb:hover {
          background: color-mix(in srgb, var(--fg) 44%, transparent);
        }

        .about-story {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(280px, 420px);
          gap: 24px;
          align-items: start;
          width: 100%;
          margin: 0;
        }

        .about-rain-content {
          min-height: 0;
          display: block;
          padding: 0;
          width: 100%;
          margin: 0;
        }

        .section.section--about-rain {
          min-height: 100dvh;
          height: auto;
          width: 100%;
          max-width: none;
          margin: 0;
          padding: 0 !important;
          overflow: visible;
        }

        .section.section--about-rain .section__header {
          width: 100%;
          margin: 0 0 48px;
        }

        .section.section--about-rain .project-card {
          background: transparent;
          border: 0;
          box-shadow: none;
          padding: 0;
        }

        .section.section--about-rain .services-point {
          background: transparent;
          border: 0;
          padding: 8px 0;
        }

        .about-story__left {
          min-width: 0;
          transition: opacity 0.36s ease, transform 0.36s ease, filter 0.36s ease;
        }

        .about-story__right {
          display: flex;
          min-width: 0;
          justify-content: center;
          align-items: flex-start;
        }

        .about-story__profile-target {
          width: 100%;
          max-width: 420px;
          min-height: 520px;
          border-radius: 22px;
          display: flex;
          flex-direction: column;
        }

        .about-story__lede {
          margin-bottom: 14px;
        }

        .about-story__identity {
          margin-bottom: 14px;
        }

        .about-story__experience,
        .about-story__academy {
          margin-top: 14px;
        }

        .about-story__experience h4,
        .about-story__academy h4 {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: color-mix(in srgb, var(--fg) 88%, var(--muted));
          margin: 0 0 8px;
        }

        .about-story__experience-list {
          display: grid;
          gap: 8px;
        }

        .about-story__experience-item {
          border-left: 2px solid color-mix(in srgb, var(--accent) 40%, var(--border));
          padding-left: 10px;
          display: grid;
          gap: 3px;
        }

        .about-story__experience-item strong {
          font-size: 13px;
          line-height: 1.3;
        }

        .about-story__experience-item p {
          margin: 0;
          font-size: 12px;
          color: color-mix(in srgb, var(--fg) 82%, var(--muted));
        }

        .about-story__experience-item span {
          font-family: 'Space Mono', monospace;
          font-size: 10.5px;
          color: var(--muted);
        }

        .about-story__academy-card {
          border: 0.5px solid color-mix(in srgb, var(--fg) 20%, var(--border));
          border-radius: 12px;
          padding: 10px 12px;
          background: color-mix(in srgb, var(--bg) 70%, transparent);
          display: grid;
          gap: 4px;
        }

        .about-story__academy-card strong {
          font-size: 14px;
        }

        .about-story__academy-card p {
          margin: 0;
          font-size: 12.5px;
          color: color-mix(in srgb, var(--fg) 84%, var(--muted));
        }

        .about-story__academy-card span {
          font-family: 'Space Mono', monospace;
          font-size: 10.5px;
          color: var(--muted);
        }

        .about-pattern-wrap {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          border-radius: 18px;
          padding: clamp(14px, 1.8vw, 22px);
        }

        .about-pattern-bg {
          color: color-mix(in srgb, var(--fg) 14%, transparent);
          opacity: 0.7;
          z-index: 0;
        }

        .about-pattern-content {
          position: relative;
          z-index: 1;
        }

        .about-modal-launchers {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin: 0;
        }

        .about-hero__name-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 10px;
        }

        .about-hero__name-row .about-hero__name {
          margin: 0;
        }

        .about-hero__name-row .about-modal-launchers .btn {
          padding: 8px 12px;
          font-size: 11px;
        }

        .about-modal {
          position: fixed;
          inset: 0;
          z-index: 260;
          background: transparent;
          backdrop-filter: blur(12px) saturate(0.82);
          -webkit-backdrop-filter: blur(12px) saturate(0.82);
          display: grid;
          place-items: center;
          padding: clamp(16px, 4vw, 28px);
          --about-modal-max-h: min(84dvh, 820px);
        }

        .about-modal__background {
          display: grid;
          place-items: center;
          width: 100%;
          height: 100%;
        }

        .about-modal__panel {
          width: min(760px, calc(100vw - clamp(24px, 6vw, 56px)));
          max-height: var(--about-modal-max-h);
          overflow: hidden;
          border-radius: 16px;
          border: 1px solid color-mix(in srgb, var(--fg) 16%, var(--border));
          background: color-mix(in srgb, var(--bg) 94%, var(--card-bg));
          box-shadow:
            0 24px 70px color-mix(in srgb, var(--fg) 22%, transparent),
            0 0 0 1px color-mix(in srgb, var(--fg) 10%, transparent);
          padding: clamp(16px, 2.6vw, 24px);
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .about-modal__panel--sketch {
          background: transparent;
          animation: aboutModalFadeIn 0.5s 0.2s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
        }

        .about-modal__panel--sketch .about-modal__head,
        .about-modal__panel--sketch .about-modal__body {
          opacity: 0;
          position: relative;
          z-index: 2;
          animation: aboutModalContentFadeIn 0.45s 0.46s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
        }

        .about-modal__head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;
          border-bottom: 0.5px solid var(--border);
          padding-bottom: 10px;
          position: sticky;
          top: 0;
          z-index: 1;
          background: var(--bg);
        }

        .about-modal__head h3 {
          margin: 0;
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.02em;
          font-size: clamp(30px, 4vw, 40px);
        }

        .about-modal__close {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          border: 0.5px solid var(--border);
          background: color-mix(in srgb, var(--bg) 86%, transparent);
          color: var(--fg);
          font-size: 22px;
          line-height: 1;
          cursor: pointer;
        }

        .about-modal__body {
          padding-top: 4px;
          overflow: auto;
          max-height: calc(var(--about-modal-max-h) - 112px);
          overscroll-behavior: contain;
          scroll-behavior: smooth;
          scrollbar-width: thin;
          scrollbar-color: color-mix(in srgb, var(--fg) 38%, transparent) transparent;
          padding-right: 4px;
        }

        .about-modal__body::-webkit-scrollbar {
          width: 10px;
        }

        .about-modal__body::-webkit-scrollbar-track {
          background: transparent;
        }

        .about-modal__body::-webkit-scrollbar-thumb {
          background: color-mix(in srgb, var(--fg) 34%, transparent);
          border: 2px solid transparent;
          border-radius: 999px;
          background-clip: padding-box;
        }

        .about-modal__body::-webkit-scrollbar-thumb:hover {
          background: color-mix(in srgb, var(--fg) 52%, transparent);
          background-clip: padding-box;
        }

        .about-modal__svg {
          position: absolute;
          inset: 1px;
          width: calc(100% - 2px);
          height: calc(100% - 2px);
          pointer-events: none;
          z-index: 1;
          border-radius: 15px;
        }

        .about-modal__svg rect {
          fill: none;
          stroke: color-mix(in srgb, var(--fg) 84%, transparent);
          stroke-width: 1.25px;
          stroke-linejoin: round;
          stroke-linecap: round;
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: aboutSketchIn 0.56s 0.12s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
        }

        @keyframes aboutSketchIn {
          0% { stroke-dashoffset: 1; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes aboutModalFadeIn {
          0% {
            background-color: transparent;
            box-shadow: none;
          }
          100% {
            background-color: color-mix(in srgb, var(--bg) 94%, var(--card-bg));
            box-shadow:
              0 24px 70px color-mix(in srgb, var(--fg) 22%, transparent),
              0 0 0 1px color-mix(in srgb, var(--fg) 10%, transparent);
          }
        }

        @keyframes aboutModalContentFadeIn {
          0% {
            opacity: 0;
            transform: translateY(-12px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .home-footer-dock {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 140;
          pointer-events: none;
          padding-inline: 0;
        }

        .home-footer-dock footer {
          width: 100%;
          max-width: none;
          margin: 0;
          pointer-events: auto;
        }

        .home-story__nav {
          position: fixed;
          bottom: max(100px, calc(env(safe-area-inset-bottom) + 88px));
          left: 0;
          right: 0;
          padding: 0 clamp(14px, 4vw, 28px);
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 220;
          pointer-events: none;
        }

        .home-story__nav-btn {
          pointer-events: auto;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 22px;
          min-width: 120px;
          justify-content: center;
          border-radius: 999px;
          border: 0.5px solid var(--border);
          background: var(--nav-bg);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          color: var(--fg);
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          box-shadow: 0 12px 40px color-mix(in srgb, var(--fg) 10%, transparent);
          transition: transform 0.22s ease, background 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;
        }

        .home-story__nav-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          border-color: color-mix(in srgb, var(--accent) 35%, var(--border));
        }

        .home-story__nav-btn:disabled {
          opacity: 0.32;
          cursor: not-allowed;
          transform: none;
        }

        .home-story__nav-btn svg {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          opacity: 0.92;
        }

        .home-story__nav-btn--primary {
          background: color-mix(in srgb, var(--accent) 18%, var(--nav-bg));
          border-color: color-mix(in srgb, var(--accent) 28%, var(--border));
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

        /* Services section */
        .services-split {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          align-items: start;
          width: 100%;
        }

        .services-left {
          padding-right: 0;
          width: 100%;
          max-width: min(1220px, calc(100vw - 120px));
          margin-inline: auto;
        }

        .services-offer {
          min-height: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
          border-radius: 0;
          border: 0;
          padding: clamp(8px, 1.8vw, 20px) clamp(10px, 2vw, 20px);
          background: transparent;
          box-shadow: none;
        }

        .section--services-retro {
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          min-height: 100dvh;
          display: flex;
          align-items: stretch;
          justify-content: center;
          overflow: hidden;
        }

        .services-retro-shell {
          position: relative;
          isolation: isolate;
          width: 100%;
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .services-retro-shell .services-split {
          position: relative;
          z-index: 1;
        }

        .services-retro-grid {
          opacity: 0.4;
        }

        .section--skills-grid {
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          min-height: 100dvh;
          display: flex;
          align-items: stretch;
          justify-content: center;
          overflow: hidden;
        }

        .home-story__section--skills {
          min-height: 100dvh;
        }

        .skills-grid-shell {
          position: relative;
          isolation: isolate;
          width: 100%;
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .skills-grid-content {
          position: relative;
          z-index: 1;
          width: 100%;
          padding: clamp(64px, 7vw, 96px) clamp(18px, 4vw, 64px);
        }

        .home-story__section--services {
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .home-story__section--services .services-offer {
          transform: translateY(clamp(12px, 2.2vh, 28px));
        }

        .services-offer__eyebrow {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin: 0 auto 10px;
          color: var(--muted);
          font-size: clamp(11px, 1.2vw, 14px);
          line-height: 1.3;
          font-family: 'Space Mono', monospace;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .services-offer__arrow {
          width: 20px;
          height: 20px;
          color: color-mix(in srgb, var(--accent) 78%, var(--fg));
        }

        .services-offer__arrow svg {
          width: 100%;
          height: 100%;
        }

        .services-offer__title {
          color: var(--fg);
          margin: 0 auto 16px;
          max-width: 22ch;
          font-size: clamp(28px, 3.8vw, 50px);
          line-height: 1.14;
          font-weight: 500;
          font-family: "Playfair Display", "Times New Roman", serif;
        }

        .services-offer__grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          max-width: 1140px;
          margin: 0 auto;
          text-align: left;
        }

        .services-offer__card {
          position: relative;
          overflow: hidden;
          border-radius: 16px;
          padding: clamp(22px, 2.8vw, 34px);
          background: color-mix(in srgb, var(--card-bg) 78%, var(--bg));
          border: 0.5px solid color-mix(in srgb, var(--fg) 16%, var(--border));
          isolation: isolate;
          min-height: clamp(220px, 26vh, 300px);
          transition: box-shadow 0.38s ease;
        }

        .services-offer__card::before {
          position: absolute;
          content: "";
          width: 100%;
          height: 100%;
          transition: clip-path 0.6s ease;
          z-index: 0;
          background: color-mix(in srgb, var(--accent) 78%, #4f46e5);
        }

        .services-offer__card:hover {
          box-shadow: 0 10px 26px color-mix(in srgb, var(--accent) 18%, transparent);
        }

        .services-offer__card:nth-child(1)::before {
          bottom: 0;
          right: 0;
          clip-path: circle(calc(6.25rem + 7.5vw) at 100% 100%);
        }

        .services-offer__card:nth-child(2)::before {
          bottom: 0;
          left: 0;
          clip-path: circle(calc(6.25rem + 7.5vw) at 0% 100%);
        }

        .services-offer__card:nth-child(3)::before {
          top: 0;
          right: 0;
          clip-path: circle(calc(6.25rem + 7.5vw) at 100% 0%);
        }

        .services-offer__card:nth-child(4)::before {
          top: 0;
          left: 0;
          clip-path: circle(calc(6.25rem + 7.5vw) at 0% 0%);
        }

        .services-offer__card:hover::before {
          clip-path: circle(110vw at 100% 100%);
        }

        .services-offer__circle {
          position: absolute;
          width: 100%;
          height: 100%;
          inset: 0;
          z-index: 0;
          opacity: 0.72;
          pointer-events: none;
          transition: clip-path 0.68s ease;
        }

        .services-offer__circle-image {
          object-fit: cover;
          object-position: center;
          transform: scale(1);
          transition: transform 0.72s ease;
        }

        .services-offer__circle::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(145deg, rgba(8, 12, 20, 0.45), rgba(8, 12, 20, 0.72));
        }

        .services-offer__card:nth-child(1) .services-offer__circle {
          clip-path: circle(calc(6.25rem + 7.5vw) at 100% 100%);
        }

        .services-offer__card:nth-child(2) .services-offer__circle {
          clip-path: circle(calc(6.25rem + 7.5vw) at 0% 100%);
        }

        .services-offer__card:nth-child(3) .services-offer__circle {
          clip-path: circle(calc(6.25rem + 7.5vw) at 100% 0%);
        }

        .services-offer__card:nth-child(4) .services-offer__circle {
          clip-path: circle(calc(6.25rem + 7.5vw) at 0% 0%);
        }

        .services-offer__card:hover .services-offer__circle {
          clip-path: circle(140% at 50% 50%);
        }

        .services-offer__card:hover .services-offer__circle-image {
          transform: scale(1.08);
        }

        .services-offer__card-content {
          position: relative;
          z-index: 1;
          max-width: 62ch;
          padding: 10px 12px;
          border-radius: 10px;
          background: linear-gradient(180deg, rgba(9, 13, 22, 0.52), rgba(9, 13, 22, 0.36));
          backdrop-filter: blur(1.5px);
        }

        .services-offer__card-content--right {
          padding-right: clamp(0px, 4vw, 64px);
        }

        .services-offer__card-content--left {
          padding-left: clamp(0px, 4vw, 64px);
        }

        .services-offer__card h4 {
          margin: 0 0 8px;
          color: #f8fbff;
          font-size: clamp(22px, 2.5vw, 32px);
          line-height: 1.08;
          letter-spacing: 0.01em;
          text-transform: capitalize;
          font-family: "Playfair Display", "Times New Roman", serif;
          font-weight: 400;
          text-shadow: 0 1px 10px rgba(0, 0, 0, 0.35);
        }

        .services-offer__card p {
          margin: 0;
          color: rgba(240, 246, 255, 0.92);
          transition: color 0.8s ease;
          font-size: 14px;
          line-height: 1.6;
          text-shadow: 0 1px 8px rgba(0, 0, 0, 0.28);
        }

        .services-offer__card:hover p {
          color: #ffffff;
        }

        .services-offer__cta {
          margin-top: 10px;
        }

        @media (max-width: 1000px) {
          .services-offer__grid {
            grid-template-columns: 1fr;
          }

          .services-offer__card {
            min-height: 0;
          }

          .services-offer__card-content--left,
          .services-offer__card-content--right {
            padding-left: 0;
            padding-right: 0;
          }
        }

        @media (max-width: 720px) {
          .services-offer {
            padding: 8px 0;
          }

          .services-offer__eyebrow {
            font-size: 12px;
            letter-spacing: 0.04em;
          }

          .services-offer__title {
            margin-bottom: 12px;
          }
        }

        /* Project & certificate shelf */
        @property --project-item-scale {
          syntax: "<number>";
          inherits: true;
          initial-value: 1;
        }

        @property --project-item-angle {
          syntax: "<angle>";
          inherits: true;
          initial-value: 0deg;
        }

        @keyframes project-shrink-top {
          0% {
            --project-item-scale: 0.5;
            --project-item-angle: -60deg;
            transform-origin: top;
          }
        }

        @keyframes project-shrink-bottom {
          0% {
            --project-item-scale: 0.5;
            --project-item-angle: 60deg;
            transform-origin: bottom;
          }
        }

        .project-shelf {
          display: grid;
          gap: 22px;
        }

        .project-shelf__section {
          position: relative;
          perspective: 2200px;
          display: grid;
          gap: 14px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          width: 100%;
          margin-inline: 0;
        }

        .project-shelf__section-head {
          grid-column: 1 / -1;
        }

        .project-shelf__section-head h3 {
          margin: 0;
          color: color-mix(in srgb, var(--accent) 85%, var(--fg));
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(30px, 3.2vw, 46px);
          letter-spacing: 0.02em;
        }

        .project-shelf__card {
          --deg: 0.8deg;
          --y: 0;
          --base: color-mix(in srgb, var(--average-color, var(--accent)) 65%, var(--bg));
          --shadow: color-mix(in srgb, var(--average-color, var(--accent)) 44%, #000);
          border: 3px solid var(--base);
          border-radius: 12px;
          background-color: var(--base);
          background-image: radial-gradient(color-mix(in srgb, var(--shadow) 65%, transparent) 1px, transparent 0px);
          background-size: 7px 7px;
          box-shadow: 0 0 0 1px var(--bg), 4px 4px 0 var(--shadow);
          opacity: min(var(--project-item-scale), 0.9);
          overflow: hidden;
          transform: rotate(var(--deg)) translateY(var(--y)) scale(var(--project-item-scale))
            rotateX(var(--project-item-angle));
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
          will-change: transform;
          transform-style: preserve-3d;
        }

        .project-shelf__image {
          width: 100%;
          height: auto;
          aspect-ratio: 16 / 9;
          object-fit: cover;
          display: block;
          border-radius: 8px;
        }

        .project-shelf__card figure {
          margin: 0;
          padding: 8px;
        }

        .project-shelf__card figcaption {
          margin: 8px 2px 0;
          display: grid;
          gap: 5px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          line-height: 1.35;
          color: color-mix(in srgb, var(--fg) 92%, var(--bg));
          min-height: 8.4em;
        }

        .project-shelf__title {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 900;
          line-height: 1.25;
          color: color-mix(in srgb, var(--fg) 98%, var(--bg));
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }

        .project-shelf__meta {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: color-mix(in srgb, var(--accent) 70%, var(--fg));
        }

        .project-shelf__desc {
          font-size: 11px;
          font-weight: 800;
          line-height: 1.5;
          color: color-mix(in srgb, var(--fg) 84%, var(--bg));
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }

        .project-shelf__chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 2px;
        }

        .project-shelf__chip {
          display: inline-flex;
          align-items: center;
          border: 0.5px solid color-mix(in srgb, var(--fg) 28%, transparent);
          border-radius: 999px;
          padding: 3px 8px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.03em;
          color: color-mix(in srgb, var(--fg) 90%, var(--bg));
          background: color-mix(in srgb, var(--bg) 26%, transparent);
        }

        .project-shelf__actions {
          display: flex;
          gap: 8px;
          padding: 0 8px 10px;
          flex-wrap: wrap;
        }

        .project-shelf__actions .btn {
          padding: 6px 12px;
          font-size: 11px;
          font-weight: 800;
        }

        .project-shelf__note {
          margin: 10px 0 2px;
          text-align: center;
          font-family: 'Space Mono', monospace;
          font-size: clamp(13px, 1.15vw, 15px);
          line-height: 1.65;
          color: color-mix(in srgb, var(--fg) 82%, var(--muted));
          max-width: 72ch;
          margin-inline: auto;
          padding-bottom: clamp(160px, 22vh, 280px);
        }

        .project-shelf__card:nth-child(2n) { --deg: -0.75deg; }
        .project-shelf__card:nth-child(3n) { --deg: 0.5deg; }
        .project-shelf__card:nth-child(4n + 2) { --deg: -0.55deg; }

        @supports (animation-timeline: view()) {
          .project-shelf__card {
            animation: project-shrink-top both ease-in-out,
              project-shrink-bottom both ease-in-out reverse;
            animation-timeline: view(block);
            animation-range: entry, exit;
          }
        }

        @media (max-width: 960px) {
          .project-shelf__section {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 620px) {
          .project-shelf__section {
            grid-template-columns: 1fr;
          }

          .project-shelf__tabs {
            width: 100%;
            justify-content: stretch;
          }

          .project-shelf__tab {
            flex: 1 1 0;
            text-align: center;
          }
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
          background: color-mix(in srgb, var(--card-bg) 58%, transparent);
          border: 1px solid color-mix(in srgb, var(--fg) 14%, var(--border));
          box-shadow:
            0 8px 24px color-mix(in srgb, var(--bg) 78%, transparent),
            inset 0 1px 0 color-mix(in srgb, #ffffff 28%, transparent);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          color: var(--fg);
          transition: background 0.25s ease, border-color 0.25s ease, color 0.25s ease, transform 0.25s ease;
          cursor: default;
        }

        .skill-pill:hover {
          background: color-mix(in srgb, var(--accent) 22%, transparent);
          color: #fff;
          border-color: color-mix(in srgb, var(--accent) 58%, var(--border));
          transform: translateY(-1px);
        }

        /* CTA */
        .cta-block {
          margin-top: 60px;
          border-top: 0.5px solid var(--border);
          padding-top: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 32px;
        }

        .cta-block h2 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(36px, 5vw, 72px);
          line-height: 1;
          color: var(--fg);
          max-width: 600px;
          letter-spacing: 0.01em;
          text-align: center;
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
          padding-bottom: 0;
        }

        .comments-section__glow {
          display: none;
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
          margin: 0;
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
          margin: 14px 0 0;
        }

        .comments-section__lead a {
          color: var(--accent);
          text-decoration: underline;
          text-underline-offset: 3px;
          font-weight: 500;
        }

        .comments-section__noteCard {
          margin-top: 16px;
          border-radius: 14px;
          border: 1px solid color-mix(in srgb, var(--fg) 10%, var(--border));
          background: color-mix(in srgb, var(--card-bg) 78%, transparent);
          padding: 12px 14px;
        }

        .comments-section__noteTitle {
          margin: 0 0 8px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--fg);
        }

        .comments-section__noteList {
          margin: 0;
          padding-left: 16px;
          display: grid;
          gap: 6px;
          font-size: 12px;
          line-height: 1.55;
          color: var(--muted);
        }

        .comments-section__layout {
          display: grid;
          grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
          gap: clamp(16px, 2.4vw, 28px);
          align-items: start;
          margin-top: clamp(20px, 3vw, 30px);
        }

        .comments-section__infoCard {
          border-radius: 18px;
          border: 1px solid color-mix(in srgb, var(--fg) 10%, var(--border));
          background: color-mix(in srgb, var(--card-bg) 72%, transparent);
          padding: clamp(14px, 2vw, 20px);
          box-shadow:
            0 8px 22px color-mix(in srgb, var(--bg) 80%, transparent),
            inset 0 1px 0 color-mix(in srgb, #ffffff 22%, transparent);
        }

        .comments-section__discussion {
          min-width: 0;
          max-width: none;
        }

        .comments-section__panel {
          margin-top: 0;
          max-width: 100%;
          width: 100%;
          margin-inline: 0;
          position: static;
          padding-top: 0;
        }

        .comments-section__panelMeta {
          position: static;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 10px 14px;
          margin-bottom: 8px;
          padding-inline: 0;
        }

        .comments-section__panelInner {
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
          font-size: 11px;
          font-weight: 500;
          color: var(--muted);
          text-decoration: none;
          padding: 5px 11px;
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
          padding: clamp(6px, 1vw, 10px);
          background: color-mix(in srgb, var(--bg) 55%, var(--card-bg));
          min-height: 72px;
          max-height: clamp(320px, 44vh, 460px);
          overflow-y: auto;
          overflow-x: hidden;
          border: none;
          border-radius: 0;
        }

        .comments-section__frame .giscus {
          width: 100%;
        }

        @media (max-width: 600px) {
          .comments-section__layout {
            grid-template-columns: 1fr;
            gap: 18px;
          }
          .comments-section__panel {
            max-width: 100%;
          }
          .comments-section__panelMeta {
            flex-direction: column;
            align-items: stretch;
            margin-bottom: 10px;
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
          color: #ef4444;
          border-bottom: 1px dashed color-mix(in srgb, var(--muted) 45%, var(--border));
        }

        footer.footer-stagger .footer-stagger__link--maintenance:hover {
          color: #ef4444;
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

        @media (max-width: 900px) {
          .home-footer-dock {
            padding-inline: 0;
          }
          .home-footer-dock footer,
          footer {
            width: 100%;
            padding: 22px 18px;
          }
          .nav { min-width: unset; width: calc(100% - 40px); }
          .hero {
            justify-content: flex-start;
            padding-top: clamp(108px, 14vh, 152px);
            padding-bottom: 96px;
          }
          .hero__title-wrap { grid-template-columns: 1fr; gap: 18px; text-align: center; max-width: 720px; }
          .hero__morphing {
            margin-inline: auto !important;
            text-align: center;
          }
          .hero__morphing span {
            text-align: center;
          }
          .hero__word--right {
            align-items: flex-end;
            padding-inline-start: 0;
            margin-inline-start: 0;
          }
          .hero__right-text-column {
            justify-items: end;
            transform: translateX(clamp(-12px, -2vw, -4px));
            align-self: flex-end;
            width: 100%;
            max-width: 100%;
          }
          .hero__desc-wrap {
            max-width: 100%;
          }
          .hero__desc { text-align: right; max-width: 100%; }
          .hero__right-text-column .hero__social-land {
            width: 100%;
            max-width: 100%;
            justify-content: flex-end;
          }
          .hero__social { justify-content: flex-end; margin-inline-start: 0; }
          .portrait-wrap { margin-inline: 0; }
          .portrait-wrap { order: -1; width: min(320px, 78vw); transform: none; }
          .hero__signature-on-portrait {
            bottom: clamp(2px, 1.5vw, 12px);
            width: min(112%, 360px);
          }
          .services-grid { grid-template-columns: 1fr; }
          .about-story { grid-template-columns: 1fr; }
          .about-story__profile-target { min-height: 470px; }
          .about-story__right {
            max-width: min(420px, 100%);
          }
          .about-rain-content {
            min-height: 0;
            padding: 0;
            width: 100%;
            margin: 0;
          }
          .about-modal__panel {
            width: min(700px, calc(100vw - 24px));
            max-height: 88dvh;
            padding: 14px;
          }
          .about-pattern-wrap {
            border-radius: 14px;
            padding: 12px;
          }
          .about-modal__body {
            max-height: calc(88dvh - 104px);
          }
          .about-hero__name-row {
            flex-direction: column;
            align-items: flex-start;
          }
          .cta-block { flex-direction: column; align-items: center; }
          .home-story__progress {
            left: 8px;
            width: 54px;
          }
        }
      `}</style>

      <div
        className={["home-viewport", !storyComplete ? "home-viewport--story" : ""].filter(Boolean).join(" ")}
        style={{
          minHeight: storyComplete ? "100vh" : "100dvh",
          background: "transparent",
          transition:
            "background 0.4s, min-height 0.72s cubic-bezier(0.22, 1, 0.36, 1), padding-bottom 0.72s cubic-bezier(0.22, 1, 0.36, 1)",
          position: "relative",
          paddingBottom: storyComplete ? "132px" : 0,
        }}
      >
        <motion.div
          aria-hidden
          initial={false}
          animate={reduceHeroMotion || introReady ? { opacity: 1 } : { opacity: 0 }}
          transition={homeLandTx(homeLand.pageBg, 0.42)}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            background: "var(--bg)",
            pointerEvents: "none",
          }}
        />

        {/* NAV (Dock model) */}
        <DockNav
          homeStoryTour={!storyComplete}
          storyCompact={!storyComplete && storyStep >= 1 && storyStep < 6}
          contactStoryStep={!storyComplete && storyStep === 6}
          motionProps={
            reduceHeroMotion
              ? { initial: false, animate: { opacity: 1, y: 0 }, transition: { duration: 0.01 } }
              : {
                  initial: false,
                  animate: introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: -36 },
                  transition: homeLandTx(homeLand.nav, 0.46),
                }
          }
        />

        {!storyComplete ? (
          <motion.div
            className="home-story"
            initial={false}
            animate={
              storyFinishAnimating
                ? {
                    opacity: 0,
                    y: reduceHeroMotion ? 0 : -12,
                    scale: reduceHeroMotion ? 1 : 0.988,
                    filter: reduceHeroMotion ? "blur(0px)" : "blur(8px)",
                  }
                : {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: "blur(0px)",
                  }
            }
            transition={{
              duration: reduceHeroMotion ? 0.12 : STORY_CONTACT_TO_FULL_MS / 1000,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <aside className="home-story__progress" aria-label="Progres tur section">
              <ol className="home-story__progress-list">
                {storyFlowSteps.map((item, index) => {
                  const StepIcon = item.icon;
                  const isActive = storyStep === index;
                  const isDone = storyStep > index;
                  const isFilled = storyStep > index;
                  return (
                    <li
                      className="home-story__progress-item"
                      key={item.key}
                      aria-current={isActive ? "step" : undefined}
                      aria-label={item.label}
                    >
                      <div className="home-story__progress-node">
                        <span
                          className={[
                            "home-story__progress-dot",
                            isDone ? "home-story__progress-dot--done" : "",
                            isActive ? "home-story__progress-dot--active" : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          <StepIcon aria-hidden strokeWidth={2} />
                        </span>
                        {index < storyFlowSteps.length - 1 ? (
                          <span className="home-story__progress-segment" aria-hidden>
                            <motion.span
                              className="home-story__progress-segment-fill"
                              initial={false}
                              animate={{ scaleY: isFilled ? 1 : 0 }}
                              transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
                            />
                          </span>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </aside>
            <AnimatePresence
              mode="wait"
              custom={{ dir: storyDir, noSlide: storyNoSlide, servicesExitSequence }}
            >
              <motion.div
                key={storyStep}
                className={[
                  "home-story__panel",
                  lockStorySectionScroll ? "home-story__panel--scroll-locked" : "",
                  storyStep === 2 ? "home-story__panel--services-fit" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                role="region"
                aria-label={`Langkah ${storyStep + 1} dari ${lastStoryStep + 1}`}
                custom={{ dir: storyDir, noSlide: storyNoSlide, servicesExitSequence }}
                variants={reduceHeroMotion ? storySlideVariantsReduced : storySlideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                style={lockStorySectionScroll && !isProjectsStoryStep ? { touchAction: "none" } : undefined}
              >
                {storyStep === 0 ? renderHeroSection() : null}
                {storyStep === 1 ? (
                  <div className="section home-story__section">
                    <HomeAboutBlock storyMode introFromHero={aboutFromHeroTransition} />
                  </div>
                ) : null}
                {storyStep === 2 ? (
                  <div className="section home-story__section home-story__section--services section--services-retro">
                    <div className="services-retro-shell">
                      <RetroGrid
                        className="services-retro-grid"
                        cellSize={72}
                        opacity={0.6}
                        lightLineColor="rgba(99, 102, 241, 0.7)"
                        darkLineColor="rgba(129, 140, 248, 0.72)"
                      />
                      <HomeServicesBlock storyMode introFromAbout={servicesFromAboutTransition} />
                    </div>
                  </div>
                ) : null}
                {storyStep === 3 ? (
                  <div className="section home-story__section" id="projects">
                    <HomeProjectsBlock
                      portfolioTab={portfolioTab}
                      setPortfolioTab={setPortfolioTab}
                      storyMode
                    />
                  </div>
                ) : null}
                {storyStep === 4 ? (
                  <div className="section home-story__section home-story__section--skills section--skills-grid">
                    <div className="skills-grid-shell">
                      <SkillsStarfieldBackground />
                      <div className="skills-grid-content">
                        <HomeSkillsBlock techLogos={techLogos} partnerLogos={partnerLogos} storyMode />
                      </div>
                    </div>
                  </div>
                ) : null}
                {storyStep === 5 ? (
                  <div className="section comments-section home-story__section home-story__section--guestbook" id="guestbook">
                    <HomeGuestbookBlock storyMode />
                  </div>
                ) : null}
                {storyStep === 6 ? (
                  <div className="section home-story__section" id="contact">
                    <HomeContactBlock storyMode />
                  </div>
                ) : null}
              </motion.div>
            </AnimatePresence>
            <div className="home-story__nav">
              <button
                type="button"
                className="home-story__nav-btn"
                onClick={handleStoryBack}
                disabled={storyStep <= 0 || storyFinishAnimating}
                aria-label="Kembali ke bagian sebelumnya"
              >
                <ChevronLeft aria-hidden strokeWidth={2} />
                Kembali
              </button>
              <button
                type="button"
                className="home-story__nav-btn home-story__nav-btn--primary"
                onClick={handleStoryForward}
                disabled={storyFinishAnimating}
                aria-label={
                  storyStep >= lastStoryStep ? "Selesai tur dan buka halaman penuh" : "Lanjut ke bagian berikutnya"
                }
              >
                {storyStep >= lastStoryStep ? "Selesai" : "Lanjut"}
                <ChevronRight aria-hidden strokeWidth={2} />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="home-full-page"
            initial={reduceHeroMotion ? false : { opacity: 0, y: 22, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: reduceHeroMotion ? 0.01 : 0.82,
              ease: [0.16, 1, 0.3, 1],
              opacity: { duration: reduceHeroMotion ? 0.01 : 0.74, delay: reduceHeroMotion ? 0 : 0.04 },
              y: { duration: reduceHeroMotion ? 0.01 : 0.82, delay: reduceHeroMotion ? 0 : 0.04 },
              filter: { duration: reduceHeroMotion ? 0.01 : 0.88, delay: reduceHeroMotion ? 0 : 0.02 },
            }}
          >
            {renderHeroSection()}
            <RevealSection className="section" delay={0.03} from="right">
              <HomeAboutBlock />
            </RevealSection>
            <RevealSection
              className="section section--services-retro"
              delay={0.04}
              from="left"
              blurReveal={false}
              margin="200px 0px 200px 0px"
            >
              <div className="services-retro-shell">
                <RetroGrid
                  className="services-retro-grid"
                  cellSize={72}
                  opacity={0.6}
                  lightLineColor="rgba(99, 102, 241, 0.7)"
                  darkLineColor="rgba(129, 140, 248, 0.72)"
                />
                <HomeServicesBlock />
              </div>
            </RevealSection>

            <RevealSection className="section" id="projects" delay={0.08} from="right">
              <HomeProjectsBlock portfolioTab={portfolioTab} setPortfolioTab={setPortfolioTab} />
            </RevealSection>

            <RevealSection className="section section--skills-grid" delay={0.12} from="left">
              <div className="skills-grid-shell">
                <SkillsStarfieldBackground />
                <div className="skills-grid-content">
                  <HomeSkillsBlock techLogos={techLogos} partnerLogos={partnerLogos} />
                </div>
              </div>
            </RevealSection>

            <RevealSection
              className="section comments-section"
              id="guestbook"
              delay={0.15}
              from="right"
            >
              <HomeGuestbookBlock />
            </RevealSection>
            <RevealSection className="section section--contact" id="contact" delay={0.17} from="left">
              <HomeContactBlock />
            </RevealSection>
          </motion.div>
        )}

        {/* FOOTER — selalu menempel di bawah viewport */}
        <div className="home-footer-dock">
          <FooterStagger delayChildren={0.18} />
        </div>

        <motion.div
          className="theme-toggle-bar"
          initial={false}
          animate={
            reduceHeroMotion || introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: -32 }
          }
          transition={homeLandTx(homeLand.nav, 0.46)}
        >
          <AnimatedThemeToggler
            className="theme-toggle-trigger"
            isDark={darkMode}
            onThemeChange={setDarkMode}
            storageKey={THEME_STORAGE_KEY}
            aria-label={darkMode ? "Gunakan tema terang" : "Gunakan tema gelap"}
            aria-pressed={darkMode}
          />
        </motion.div>
      </div>
    </>
  );
}