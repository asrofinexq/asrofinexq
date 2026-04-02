"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import AboutMythrillCards from "@/app/components/AboutMythrillCards";
import LogoLoop, { type LogoItem } from "@/app/components/LogoLoop";
import VisitorComments from "@/app/components/VisitorComments";
import ShowcaseAction from "@/app/components/ShowcaseAction";
import PageSocialLinks from "@/app/components/PageSocialLinks";
import ProjectsNoticePopup from "@/app/components/ProjectsNoticePopup";
import { StripedPattern } from "@/registry/magicui/striped-pattern";
import {
  aboutEducation,
  aboutExperience,
  aboutSummary,
} from "@/app/about/data";
import {
  showcaseCertificates,
  showcaseProjects,
  type PortfolioTab,
} from "@/app/lib/showcase";
import { SITE_ADDRESS, SITE_EMAIL, SITE_PHONE_DISPLAY, SITE_PHONE_E164, SITE_SOCIAL } from "@/app/lib/site";
import { MessageCircle } from "lucide-react";
import { SiGithub } from "react-icons/si";

const storyParent: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.11, delayChildren: 0.14 },
  },
};

const storyItem: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.96,
    filter: "blur(12px)",
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 340, damping: 28, mass: 0.82 },
  },
};

export function HomeServicesBlock({
  storyMode,
  introFromAbout = false,
}: {
  storyMode?: boolean;
  introFromAbout?: boolean;
} = {}) {
  const revealEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const stagedReveal = (delay = 0) =>
    introFromAbout
      ? {
          initial: { opacity: 0, y: 16, filter: "blur(10px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { delay, duration: 0.44, ease: revealEase },
        }
      : {
          initial: false as const,
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        };

  const stagedHeaderReveal = (delay = 0) =>
    introFromAbout
      ? {
          initial: { opacity: 0, y: 14, filter: "blur(8px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { delay, duration: 0.54, ease: revealEase },
          exit: { opacity: 0, y: -14, filter: "blur(8px)" },
        }
      : {
          initial: false as const,
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          exit: { opacity: 0, y: -14, filter: "blur(8px)" },
          transition: { duration: 0.34, ease: revealEase },
        };

  const stagedCardReveal = (delay = 0, fromLeft = true) =>
    introFromAbout
      ? {
          initial: { opacity: 0, x: fromLeft ? -54 : 54, y: 8, filter: "blur(10px)" },
          animate: { opacity: 1, x: 0, y: 0, filter: "blur(0px)" },
          transition: { delay, duration: 0.62, ease: revealEase },
          exit: { opacity: 0, x: fromLeft ? 54 : -54, y: -6, filter: "blur(10px)" },
        }
      : {
          initial: false as const,
          animate: { opacity: 1, x: 0, y: 0, filter: "blur(0px)" },
          exit: { opacity: 0, x: fromLeft ? 54 : -54, y: -6, filter: "blur(10px)" },
          transition: { duration: 0.36, ease: revealEase },
        };

  const leftInner = (
    <section className="services-offer" aria-label="Services">
      <motion.span
        className="services-offer__eyebrow"
        {...stagedHeaderReveal(0.04)}
        transition={{ delay: introFromAbout ? 0.04 : 0, duration: introFromAbout ? 0.54 : 0.34, ease: revealEase }}
        exit={{
          opacity: 0,
          y: -14,
          filter: "blur(8px)",
          transition: { delay: 0.66, duration: 0.34, ease: revealEase },
        }}
      >
        what i&apos;m offering
        <span className="services-offer__arrow" aria-hidden>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
          </svg>
        </span>
      </motion.span>
      <motion.h3
        className="services-offer__title"
        {...stagedHeaderReveal(0.18)}
        transition={{ delay: introFromAbout ? 0.18 : 0, duration: introFromAbout ? 0.54 : 0.34, ease: revealEase }}
        exit={{
          opacity: 0,
          y: -14,
          filter: "blur(8px)",
          transition: { delay: 0.54, duration: 0.34, ease: revealEase },
        }}
      >
        Services Built Specifically for Your Business
      </motion.h3>

      <div className="services-offer__grid">
        <motion.article
          className="services-offer__card"
          {...stagedCardReveal(0.36, true)}
          transition={{ delay: introFromAbout ? 0.36 : 0, duration: introFromAbout ? 0.62 : 0.36, ease: revealEase }}
          exit={{
            opacity: 0,
            x: 54,
            y: -6,
            filter: "blur(10px)",
            transition: { delay: 0.4, duration: 0.42, ease: revealEase },
          }}
        >
          <div className="services-offer__circle" aria-hidden>
            <Image
              src="/services/web development.jpg"
              alt=""
              fill
              className="services-offer__circle-image"
              sizes="(max-width: 1000px) 100vw, 50vw"
              quality={60}
            />
          </div>
          <div className="services-offer__card-content services-offer__card-content--right">
            <h4>Web &amp; Application Development</h4>
            <p>
              Development website dan aplikasi end-to-end: mulai dari perencanaan, implementasi fitur inti,
              sampai deployment yang siap digunakan di lingkungan production.
            </p>
          </div>
        </motion.article>
        <motion.article
          className="services-offer__card"
          {...stagedCardReveal(0.48, false)}
          transition={{ delay: introFromAbout ? 0.48 : 0, duration: introFromAbout ? 0.62 : 0.36, ease: revealEase }}
          exit={{
            opacity: 0,
            x: -54,
            y: -6,
            filter: "blur(10px)",
            transition: { delay: 0.28, duration: 0.42, ease: revealEase },
          }}
        >
          <div className="services-offer__circle" aria-hidden>
            <Image
              src="/services/uiux.jpg"
              alt=""
              fill
              className="services-offer__circle-image"
              sizes="(max-width: 1000px) 100vw, 50vw"
              quality={60}
            />
          </div>
          <div className="services-offer__card-content services-offer__card-content--left">
            <h4>Interactive User Experience (UI/UX) Implementation</h4>
            <p>
              Implementasi antarmuka modern yang responsif dan interaktif, dengan fokus pada pengalaman
              pengguna, aksesibilitas, serta konsistensi design system di setiap halaman.
            </p>
          </div>
        </motion.article>
        <motion.article
          className="services-offer__card"
          {...stagedCardReveal(0.6, true)}
          transition={{ delay: introFromAbout ? 0.6 : 0, duration: introFromAbout ? 0.62 : 0.36, ease: revealEase }}
          exit={{
            opacity: 0,
            x: 54,
            y: -6,
            filter: "blur(10px)",
            transition: { delay: 0.16, duration: 0.42, ease: revealEase },
          }}
        >
          <div className="services-offer__circle" aria-hidden>
            <Image
              src="/services/apibackend.jpg"
              alt=""
              fill
              className="services-offer__circle-image"
              sizes="(max-width: 1000px) 100vw, 50vw"
              quality={60}
            />
          </div>
          <div className="services-offer__card-content services-offer__card-content--right">
            <h4>Scalable API &amp; Backend Solutions</h4>
            <p>
              Pembuatan API dan backend yang scalable, termasuk autentikasi, desain database, caching, dan
              integrasi sistem eksternal dengan standar keamanan yang baik.
            </p>
          </div>
        </motion.article>
        <motion.article
          className="services-offer__card"
          {...stagedCardReveal(0.72, false)}
          transition={{ delay: introFromAbout ? 0.72 : 0, duration: introFromAbout ? 0.62 : 0.36, ease: revealEase }}
          exit={{
            opacity: 0,
            x: -54,
            y: -6,
            filter: "blur(10px)",
            transition: { delay: 0.04, duration: 0.42, ease: revealEase },
          }}
        >
          <div className="services-offer__circle" aria-hidden>
            <Image
              src="/services/Network Infrastructure.jpg"
              alt=""
              fill
              className="services-offer__circle-image"
              sizes="(max-width: 1000px) 100vw, 50vw"
              quality={60}
            />
          </div>
          <div className="services-offer__card-content services-offer__card-content--left">
            <h4>Network Infrastructure &amp; Security</h4>
            <p>
              Setup infrastruktur jaringan mencakup routing, VPN, manajemen bandwidth, dan hardening sistem
              agar konektivitas tetap aman, stabil, dan andal untuk operasional harian.
            </p>
          </div>
        </motion.article>
      </div>
    </section>
  );

  if (storyMode) {
    if (introFromAbout) {
      return (
        <motion.div className="home-story-block">
          <div className="services-split">
            <motion.div className="services-left" {...stagedReveal(0.18)}>
              {leftInner}
            </motion.div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        className="home-story-block"
        variants={storyParent}
        initial="hidden"
        animate="show"
      >
        <div className="services-split">
          <motion.div className="services-left" variants={storyItem}>
            {leftInner}
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <div className="services-split">
        <div className="services-left">{leftInner}</div>
      </div>
    </>
  );
}

type ProjectsBlockProps = {
  portfolioTab: PortfolioTab;
  setPortfolioTab: (t: PortfolioTab) => void;
  storyMode?: boolean;
};

export function HomeProjectsBlock({
  portfolioTab,
  setPortfolioTab,
  storyMode,
}: ProjectsBlockProps) {
  const scrollContentRef = useRef<HTMLDivElement | null>(null);

  const handleTabChange = (nextTab: PortfolioTab) => {
    if (nextTab === portfolioTab) return;
    setPortfolioTab(nextTab);
    if (storyMode && scrollContentRef.current) {
      scrollContentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const header = (
    <div className="projects-top-controls">
      <div className="section__header">
        <h2 className="section__title">Project &amp; Sertifikasi</h2>
      </div>
      <div className="project-shelf__tabs" role="tablist" aria-label="Pilih kategori portofolio">
        <button
          type="button"
          role="tab"
          aria-selected={portfolioTab === "projects"}
          className={[
            "project-shelf__tab",
            portfolioTab === "projects" ? "project-shelf__tab--active" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() => handleTabChange("projects")}
        >
          Project
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={portfolioTab === "certificates"}
          className={[
            "project-shelf__tab",
            portfolioTab === "certificates" ? "project-shelf__tab--active" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() => handleTabChange("certificates")}
        >
          Sertifikasi
        </button>
      </div>
    </div>
  );

  const colorTokens = [
    "#b0b6a9",
    "#afa294",
    "#3c3c3d",
    "#b47460",
    "#60a6ce",
    "#46666f",
    "#8e898f",
    "#8d516e",
  ] as const;

  const content = (
    <div className="project-shelf">
      <AnimatePresence mode="wait" initial={false}>
        {portfolioTab === "projects" ? (
          <motion.section
            key="projects"
            className="project-shelf__section"
            initial={{ opacity: 0, y: 18, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.995 }}
            transition={{ duration: 0.33, ease: [0.22, 1, 0.36, 1] }}
          >
            {showcaseProjects.slice(0, 9).map((p, idx) => (
              <article
                key={p.id}
                className="project-shelf__card"
                style={{ "--average-color": colorTokens[idx % colorTokens.length] } as CSSProperties}
              >
                <figure>
                  <Image
                    src={p.thumbImage ?? "/profile.svg"}
                    alt={p.title}
                    width={700}
                    height={980}
                    className="project-shelf__image"
                    sizes="(max-width: 900px) 50vw, 25vw"
                  />
                  <figcaption>
                    <span className="project-shelf__title">{p.title}</span>
                    <span className="project-shelf__meta">Project #{p.id}</span>
                    <span className="project-shelf__desc">{p.desc}</span>
                    <span className="project-shelf__chips" aria-label="Tech stack">
                      {p.tags.slice(0, 3).map((tag) => (
                        <span key={`${p.id}-${tag}`} className="project-shelf__chip">
                          {tag}
                        </span>
                      ))}
                    </span>
                  </figcaption>
                </figure>
                <div className="project-shelf__actions">
                  <ShowcaseAction className="btn btn--primary" href={p.live}>
                    Live demo
                  </ShowcaseAction>
                  <ShowcaseAction className="btn btn--ghost" href={p.source}>
                    Source
                  </ShowcaseAction>
                </div>
              </article>
            ))}
          </motion.section>
        ) : (
          <motion.section
            key="certificates"
            className="project-shelf__section"
            initial={{ opacity: 0, y: 18, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.995 }}
            transition={{ duration: 0.33, ease: [0.22, 1, 0.36, 1] }}
          >
            {showcaseCertificates.slice(0, 9).map((c, idx) => (
              <article
                key={c.id}
                className="project-shelf__card"
                style={{ "--average-color": colorTokens[(idx + 2) % colorTokens.length] } as CSSProperties}
              >
                <figure>
                  <Image
                    src={c.thumbImage ?? "/profile.svg"}
                    alt={c.title}
                    width={700}
                    height={980}
                    className="project-shelf__image"
                    sizes="(max-width: 900px) 50vw, 25vw"
                  />
                  <figcaption>
                    <span className="project-shelf__title">{c.title}</span>
                    <span className="project-shelf__meta">
                      {c.issuer} • {c.year}
                    </span>
                    <span className="project-shelf__desc">
                      Sertifikasi resmi untuk validasi kompetensi profesional.
                    </span>
                    <span className="project-shelf__chips" aria-label="Detail sertifikat">
                      <span className="project-shelf__chip">Credential</span>
                      <span className="project-shelf__chip">Verifiable</span>
                    </span>
                  </figcaption>
                </figure>
                <div className="project-shelf__actions">
                  <ShowcaseAction className="btn btn--primary" href={c.href}>
                    Lihat / verifikasi
                  </ShowcaseAction>
                </div>
              </article>
            ))}
          </motion.section>
        )}
      </AnimatePresence>
      <p className="project-shelf__note">
        Daftar project dan sertifikasi ini akan terus bertambah seiring waktu, sejalan dengan pengembangan
        skill, pengalaman, dan kolaborasi baru.
      </p>
    </div>
  );

  if (storyMode) {
    return (
      <motion.div
        variants={storyParent}
        initial="hidden"
        animate="show"
        className="home-story-block projects-story-shell"
      >
        <ProjectsNoticePopup enabled={storyMode} />
        <motion.div variants={storyItem} className="projects-story-shell__header">
          {header}
        </motion.div>
        <motion.div ref={scrollContentRef} variants={storyItem} className="projects-story-shell__content">
          {content}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <>
      {header}
      {content}
    </>
  );
}

const SKILL_ITEMS = [
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
] as const;

type SkillsBlockProps = {
  techLogos: LogoItem[];
  partnerLogos: LogoItem[];
  storyMode?: boolean;
};

export function HomeSkillsBlock({ techLogos, partnerLogos, storyMode }: SkillsBlockProps) {
  const header = (
    <div className="section__header">
      <h2 className="section__title">Skills</h2>
    </div>
  );

  const pills = (
    <div className="skills-wrap">
      {SKILL_ITEMS.map((s) => (
        <span key={s} className="skill-pill">
          {s}
        </span>
      ))}
    </div>
  );

  const logos = (
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
  );

  const cta = (
    <div className="cta-block" id="contact">
      <h2>Let&apos;s build something clean.</h2>
    </div>
  );

  if (storyMode) {
    return (
      <motion.div variants={storyParent} initial="hidden" animate="show" className="home-story-block">
        <motion.div variants={storyItem}>{header}</motion.div>
        <motion.div variants={storyItem}>{pills}</motion.div>
        <motion.div variants={storyItem}>{logos}</motion.div>
        <motion.div variants={storyItem}>{cta}</motion.div>
      </motion.div>
    );
  }

  return (
    <>
      {header}
      {pills}
      {logos}
      {cta}
    </>
  );
}

export function HomeGuestbookBlock({ storyMode }: { storyMode?: boolean } = {}) {
  const top = (
    <>
      <div className="comments-section__glow" aria-hidden />
      <div className="section__header comments-section__titleRow">
        <div className="comments-section__titleBlock">
          <span className="comments-section__eyebrow">
            <MessageCircle size={18} strokeWidth={1.75} aria-hidden />
            Ruang diskusi
          </span>
          <h2 className="section__title">Buku tamu</h2>
        </div>
      </div>
    </>
  );

  const highlights = (
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
  );

  const lead = (
    <p className="comments-section__lead">
        Tinggalkan komentar, sapaan, atau masukan. Thread disimpan lewat{" "}
        <a href="https://giscus.app" target="_blank" rel="noopener noreferrer">
          Giscus
        </a>{" "}
        &amp; GitHub Discussions — pengunjung perlu login GitHub untuk menulis dari sini.
    </p>
  );

  const quickNote = (
    <div className="comments-section__noteCard" aria-label="Panduan singkat komentar">
      <p className="comments-section__noteTitle">Sebelum kirim komentar</p>
      <ul className="comments-section__noteList">
        <li>Gunakan bahasa yang sopan dan tetap on-topic.</li>
        <li>Bagikan konteks singkat jika memberi saran teknis.</li>
        <li>Spam atau link berbahaya akan dihapus.</li>
      </ul>
    </div>
  );

  const panel = (
    <div className="comments-section__panel">
      <div className="comments-section__panelMeta">
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
      <div className="comments-section__panelInner">
        <div className="comments-section__frame">
          <VisitorComments />
        </div>
      </div>
    </div>
  );

  const contentLayout = (
    <div className="comments-section__layout">
      <aside className="comments-section__infoCard">
        {highlights}
        {lead}
        {quickNote}
      </aside>
      <section className="comments-section__discussion">
        {panel}
      </section>
    </div>
  );

  if (storyMode) {
    return (
      <motion.div variants={storyParent} initial="hidden" animate="show" className="home-story-block">
        <motion.div variants={storyItem}>{top}</motion.div>
        <motion.div variants={storyItem}>{contentLayout}</motion.div>
      </motion.div>
    );
  }

  return (
    <>
      {top}
      {contentLayout}
    </>
  );
}

export function HomeAboutBlock({
  storyMode,
  introFromHero = false,
}: {
  storyMode?: boolean;
  introFromHero?: boolean;
} = {}) {
  const [aboutModal, setAboutModal] = useState<"experience" | "academy" | null>(null);
  const closeAboutModal = () => setAboutModal(null);
  const revealEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const stagedReveal = (delay = 0, opts?: { noBlur?: boolean }) =>
    introFromHero
      ? {
          initial: {
            opacity: 0,
            y: 16,
            filter: opts?.noBlur ? "none" : "blur(10px)",
          },
          animate: { opacity: 1, y: 0, filter: "none" },
          transition: { delay, duration: 0.44, ease: revealEase },
        }
      : {
          initial: false as const,
          animate: { opacity: 1, y: 0, filter: "none" },
        };

  useEffect(() => {
    if (!aboutModal) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAboutModal();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [aboutModal]);

  const block = (
    <>
      <div className="about-pattern-wrap">
        <StripedPattern className="about-pattern-bg [mask-image:radial-gradient(460px_circle_at_center,white,transparent)]" />
        <div className="about-pattern-content">
          <motion.div className="section__header" {...stagedReveal(0.04)}>
            <h1 className="section__title">About</h1>
          </motion.div>

          <div className="about-hero">
            <motion.div className="about-hero__cards-wrap" {...stagedReveal(0.18, { noBlur: true })}>
              <AboutMythrillCards />
            </motion.div>
            <div className="about-hero__main">
              <motion.p className="about-hero__kicker" {...stagedReveal(0.28)}>
                IT Developer · Founder NexQuarter Digital Solution
              </motion.p>
              <motion.div className="about-hero__name-row" {...stagedReveal(0.38)}>
                <h2 className="about-hero__name">Mohammad Asrofi</h2>
                <div className="about-modal-launchers" aria-label="Detail profil lanjutan">
                  <button type="button" className="btn btn--primary" onClick={() => setAboutModal("experience")}>
                    Lihat Experience
                  </button>
                  <button type="button" className="btn btn--ghost" onClick={() => setAboutModal("academy")}>
                    Lihat Academy
                  </button>
                </div>
            </motion.div>
              <motion.ul className="about-hero__meta" aria-label="Kontak" {...stagedReveal(0.48)}>
                <li>
                  <span className="about-hero__meta-label">Alamat</span>
                  <span>{SITE_ADDRESS}</span>
                </li>
                <li>
                  <span className="about-hero__meta-label">Telepon</span>
                  <a href={`tel:+${SITE_PHONE_E164}`}>{SITE_PHONE_DISPLAY}</a>
                </li>
                <li>
                  <span className="about-hero__meta-label">Email</span>
                  <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a>
                </li>
                <li>
                  <span className="about-hero__meta-label">Instagram</span>
                  <a href={SITE_SOCIAL.instagram} target="_blank" rel="noopener noreferrer">
                    @asrofi_nexq
                  </a>
                </li>
                <li>
                  <span className="about-hero__meta-label">LinkedIn</span>
                  <a href={SITE_SOCIAL.linkedin} target="_blank" rel="noopener noreferrer">
                    Profil LinkedIn
                  </a>
                </li>
              </motion.ul>
              <motion.div className="about-hero__social-row" {...stagedReveal(0.56)}>
                <span className="about-hero__social-label">Sosial</span>
                <PageSocialLinks />
              </motion.div>
            </div>
          </div>

          <motion.div className="about-summary-wrap" {...stagedReveal(0.68)}>
            <p className="about-summary" lang="id">
              {aboutSummary}
            </p>
          </motion.div>
        </div>
      </div>

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {aboutModal ? (
                <motion.div
                  className="about-modal"
                  role="dialog"
                  aria-modal="true"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  onClick={closeAboutModal}
                >
                  <div className="about-modal__background">
                    <motion.div
                      className="about-modal__panel about-modal__panel--sketch"
                      initial={{ opacity: 0, y: 18, scale: 0.975 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 16, scale: 0.985 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="about-modal__head">
                        <h3>{aboutModal === "experience" ? "Experience" : "Academy"}</h3>
                        <button
                          type="button"
                          className="about-modal__close"
                          onClick={closeAboutModal}
                          aria-label="Tutup modal"
                        >
                          ×
                        </button>
                      </div>
                      <div className="about-modal__body">
                        {aboutModal === "experience" ? (
                          <div className="about-timeline">
                            {aboutExperience.map((exp) => (
                              <article key={`${exp.company}-${exp.period}`} className="about-exp">
                                <div className="about-exp__head">
                                  <h3 className="about-exp__role">{exp.role}</h3>
                                  <p className="about-exp__company">
                                    {exp.company}
                                    {exp.location ? ` · ${exp.location}` : ""}
                                  </p>
                                  <p className="about-exp__period">{exp.period}</p>
                                  {exp.note ? <p className="about-exp__note">{exp.note}</p> : null}
                                </div>
                                <ul className="about-list">
                                  {exp.bullets.map((b, i) => (
                                    <li key={`${exp.company}-${i}`}>{b}</li>
                                  ))}
                                </ul>
                              </article>
                            ))}
                          </div>
                        ) : (
                          <div className="project-card about-edu-card">
                            <span className="project-num">Pendidikan</span>
                            <h3 className="about-edu-degree">{aboutEducation.degree}</h3>
                            <p className="about-edu-school">
                              {aboutEducation.school} — {aboutEducation.location}
                            </p>
                            <p className="about-edu-meta">
                              {aboutEducation.period}
                              <span className="about-edu-gpa"> · IPK: {aboutEducation.gpa}</span>
                            </p>
                          </div>
                        )}
                    </div>
                      <svg
                        className="about-modal__svg"
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="100%"
                        preserveAspectRatio="none"
                        aria-hidden
                      >
                        <rect x="0" y="0" width="100%" height="100%" rx="15" ry="15" pathLength="1" />
                      </svg>
                    </motion.div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );

  if (!storyMode) return block;
  return (
    <motion.div className="home-story-block" variants={storyParent} initial="hidden" animate="show">
      <motion.div variants={storyItem}>{block}</motion.div>
    </motion.div>
  );
}

const contactStoryEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function HomeContactBlock({ storyMode }: { storyMode?: boolean } = {}) {
  const reduceMotion = useReducedMotion();

  const block = (
    <>
      <div className="section__header">
        <h2 className="section__title">Contact</h2>
      </div>
      <div className="contact-split">
        <div className="contact-intro">
          <p className="contact-eyebrow">Start a project</p>
          <h3 className="contact-headline">Let&apos;s build something clean.</h3>
          <p className="contact-lede">
            Ada proyek atau kolaborasi? Kirim konteks singkat (tujuan, timeline, budget) dan saya balas
            secepatnya.
          </p>
          <ul className="contact-focus" aria-label="Fokus layanan utama">
            <li>Website company profile, landing page, dan dashboard internal.</li>
            <li>Integrasi API, automasi workflow, dan optimasi performa aplikasi.</li>
            <li>Setup server/VPS, hardening dasar, dan deployment berkelanjutan.</li>
          </ul>
          <div className="contact-flow" aria-label="Alur kolaborasi">
            <article className="contact-flow__item">
              <span className="contact-flow__step">01</span>
              <div>
                <h4>Brief awal</h4>
                <p>Ceritakan kebutuhan, target user, dan prioritas fitur utama.</p>
              </div>
            </article>
            <article className="contact-flow__item">
              <span className="contact-flow__step">02</span>
              <div>
                <h4>Scope &amp; estimasi</h4>
                <p>Saya susun ruang lingkup kerja, timeline, serta opsi implementasi.</p>
              </div>
            </article>
            <article className="contact-flow__item">
              <span className="contact-flow__step">03</span>
              <div>
                <h4>Eksekusi</h4>
                <p>Pengerjaan bertahap dengan update rutin sampai siap dipakai.</p>
              </div>
            </article>
          </div>
        </div>
        <aside className="contact-panel">
          <span className="contact-panel__kicker">Direct</span>
          <p className="contact-panel__lead">
            Siap untuk project freelance, retainer bulanan, atau kolaborasi jangka panjang.
          </p>
          <ul className="contact-channels">
            <li>
              <span className="contact-channel__label">Email</span>
              <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a>
            </li>
            <li>
              <span className="contact-channel__label">Telepon</span>
              <a href={`tel:+${SITE_PHONE_E164}`}>{SITE_PHONE_DISPLAY}</a>
            </li>
            <li>
              <span className="contact-channel__label">Alamat</span>
              <span>{SITE_ADDRESS}</span>
            </li>
          </ul>
          <ul className="contact-panel__meta" aria-label="Informasi tambahan">
            <li>
              <span>Response time</span>
              <strong>&lt; 24 jam kerja</strong>
            </li>
            <li>
              <span>Timezone</span>
              <strong>WIB (UTC+7)</strong>
            </li>
          </ul>
          <div className="contact-panel__actions">
            <a className="btn btn--primary" href={`mailto:${SITE_EMAIL}`}>
              Email saya
            </a>
            <a
              className="btn btn--ghost"
              href={`https://wa.me/${SITE_PHONE_E164}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          </div>
        </aside>
      </div>
    </>
  );

  if (!storyMode) return block;

  const step = (index: number) =>
    reduceMotion
      ? { initial: false as const, animate: { opacity: 1, y: 0, filter: "blur(0px)" }, transition: { duration: 0.01 } }
      : {
          initial: { opacity: 0, y: 22, filter: "blur(8px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { delay: 0.06 + index * 0.11, duration: 0.46, ease: contactStoryEase },
        };

  return (
    <div className="home-story-block">
      <motion.div className="section__header" {...step(0)}>
        <h2 className="section__title">Contact</h2>
      </motion.div>
      <div className="contact-split">
        <div className="contact-intro">
          <motion.p className="contact-eyebrow" {...step(1)}>
            Start a project
          </motion.p>
          <motion.h3 className="contact-headline" {...step(2)}>
            Let&apos;s build something clean.
          </motion.h3>
          <motion.p className="contact-lede" {...step(3)}>
            Ada proyek atau kolaborasi? Kirim konteks singkat (tujuan, timeline, budget) dan saya balas
            secepatnya.
          </motion.p>
          <ul className="contact-focus" aria-label="Fokus layanan utama">
            <motion.li {...step(4)}>Website company profile, landing page, dan dashboard internal.</motion.li>
            <motion.li {...step(5)}>Integrasi API, automasi workflow, dan optimasi performa aplikasi.</motion.li>
            <motion.li {...step(6)}>
              Setup server/VPS, hardening dasar, dan deployment berkelanjutan.
            </motion.li>
          </ul>
          <div className="contact-flow" aria-label="Alur kolaborasi">
            <motion.article className="contact-flow__item" {...step(7)}>
              <span className="contact-flow__step">01</span>
              <div>
                <h4>Brief awal</h4>
                <p>Ceritakan kebutuhan, target user, dan prioritas fitur utama.</p>
              </div>
            </motion.article>
            <motion.article className="contact-flow__item" {...step(8)}>
              <span className="contact-flow__step">02</span>
              <div>
                <h4>Scope &amp; estimasi</h4>
                <p>Saya susun ruang lingkup kerja, timeline, serta opsi implementasi.</p>
              </div>
            </motion.article>
            <motion.article className="contact-flow__item" {...step(9)}>
              <span className="contact-flow__step">03</span>
              <div>
                <h4>Eksekusi</h4>
                <p>Pengerjaan bertahap dengan update rutin sampai siap dipakai.</p>
              </div>
            </motion.article>
          </div>
        </div>
        <motion.aside className="contact-panel" {...step(10)}>
          <span className="contact-panel__kicker">Direct</span>
          <p className="contact-panel__lead">
            Siap untuk project freelance, retainer bulanan, atau kolaborasi jangka panjang.
          </p>
          <ul className="contact-channels">
            <li>
              <span className="contact-channel__label">Email</span>
              <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a>
            </li>
            <li>
              <span className="contact-channel__label">Telepon</span>
              <a href={`tel:+${SITE_PHONE_E164}`}>{SITE_PHONE_DISPLAY}</a>
            </li>
            <li>
              <span className="contact-channel__label">Alamat</span>
              <span>{SITE_ADDRESS}</span>
            </li>
          </ul>
          <ul className="contact-panel__meta" aria-label="Informasi tambahan">
            <li>
              <span>Response time</span>
              <strong>&lt; 24 jam kerja</strong>
            </li>
            <li>
              <span>Timezone</span>
              <strong>WIB (UTC+7)</strong>
            </li>
          </ul>
          <div className="contact-panel__actions">
            <a className="btn btn--primary" href={`mailto:${SITE_EMAIL}`}>
              Email saya
            </a>
            <a
              className="btn btn--ghost"
              href={`https://wa.me/${SITE_PHONE_E164}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
