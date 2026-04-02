"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { isStubHref } from "@/app/lib/showcase";
import { SITE_SOCIAL } from "@/app/lib/site";

const COPYRIGHT = "© 2025 AsrofinexQ. All rights reserved.";

export type FooterLinkItem = {
  href: string;
  label: string;
  rel?: string;
  target?: string;
};

/** Selaras hero / PageSocialLinks: IG, LinkedIn, WA aktif; sisanya maintenance (#). */
export const FOOTER_LINKS_DEFAULT: readonly FooterLinkItem[] = [
  {
    href: SITE_SOCIAL.instagram,
    label: "Instagram",
    rel: "noopener noreferrer",
    target: "_blank",
  },
  {
    href: SITE_SOCIAL.linkedin,
    label: "LinkedIn",
    rel: "noopener noreferrer",
    target: "_blank",
  },
  {
    href: SITE_SOCIAL.whatsapp,
    label: "WhatsApp",
    rel: "noopener noreferrer",
    target: "_blank",
  },
  { href: SITE_SOCIAL.github, label: "GitHub" },
];

const itemEase = [0.19, 0.72, 0.22, 1] as const;

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.88, ease: itemEase },
  },
};

/** Dokumen hampir di ujung bawah (px dari bawah scroll). */
function useNearDocumentBottom(thresholdPx: number) {
  const [near, setNear] = useState(false);

  useLayoutEffect(() => {
    const check = () => {
      const root = document.documentElement;
      const viewHeight = window.visualViewport?.height ?? window.innerHeight;
      const scrollBottom = window.scrollY + viewHeight;
      setNear(scrollBottom >= root.scrollHeight - thresholdPx);
    };

    check();
    window.addEventListener("scroll", check, { passive: true });
    window.visualViewport?.addEventListener("resize", check);
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.visualViewport?.removeEventListener("resize", check);
      window.removeEventListener("resize", check);
    };
  }, [thresholdPx]);

  return near;
}

export type FooterStaggerProps = {
  className?: string;
  /** Jeda sebelum kata / tautan pertama mulai (detik). */
  delayChildren?: number;
  /** Ganti teks hak cipta (opsional). */
  copyright?: string;
  /** Tautan kustom; default sama dengan footer situs. */
  links?: readonly FooterLinkItem[];
  /** Piksel dari bawah dokumen: di dalam ini = “sudah di ujung website”. */
  bottomThresholdPx?: number;
};

function splitWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

const MAINTENANCE_TITLE = "Sedang dalam pemeliharaan — tautan menyusul.";

export function FooterStagger({
  className,
  delayChildren = 0.1,
  copyright = COPYRIGHT,
  links = FOOTER_LINKS_DEFAULT,
  bottomThresholdPx = 200,
}: FooterStaggerProps) {
  const reduce = useReducedMotion();
  const words = splitWords(copyright);
  const footerRef = useRef<HTMLElement | null>(null);

  const nearBottom = useNearDocumentBottom(bottomThresholdPx);

  /** Cadangan: intersect dengan area viewport yang diperluas ke bawah (bukan margin negatif). */
  const inViewLoose = useInView(footerRef, {
    once: false,
    amount: 0.02,
    margin: "0px 0px 35% 0px",
  });

  const revealed = nearBottom || inViewLoose;

  const containerVariants = useMemo(
    () => ({
      hidden: {
        opacity: 1,
        transition: {
          staggerChildren: 0.036,
          staggerDirection: -1 as const,
        },
      },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.064,
          delayChildren: delayChildren,
        },
      },
    }),
    [delayChildren],
  );

  if (reduce) {
    return (
      <footer className={className}>
        <p>{copyright}</p>
        <div className="footer-links">
          {links.map((link) =>
            isStubHref(link.href) ? (
              <span
                key={link.label}
                className="footer-stagger__link footer-stagger__link--maintenance"
                role="button"
                aria-disabled="true"
                title={MAINTENANCE_TITLE}
              >
                {link.label}
              </span>
            ) : (
              <a key={link.label} href={link.href} rel={link.rel} target={link.target}>
                {link.label}
              </a>
            ),
          )}
        </div>
      </footer>
    );
  }

  return (
    <motion.footer
      ref={footerRef}
      className={[className, "footer-stagger"].filter(Boolean).join(" ")}
      initial="hidden"
      animate={revealed ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="footer-stagger__word"
          variants={itemVariants}
          style={
            i === words.length - 1
              ? ({ marginInlineEnd: "auto" } as const)
              : undefined
          }
        >
          {word}
          {i < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
      {links.map((link, i) => {
        const gapStyle = i > 0 ? { marginInlineStart: 20 } : undefined;
        if (isStubHref(link.href)) {
          return (
            <motion.span
              key={link.label}
              className="footer-stagger__link footer-stagger__link--maintenance"
              variants={itemVariants}
              style={gapStyle}
              role="button"
              aria-disabled="true"
              title={MAINTENANCE_TITLE}
            >
              {link.label}
            </motion.span>
          );
        }
        return (
          <motion.a
            key={link.label}
            href={link.href}
            rel={link.rel}
            target={link.target}
            className="footer-stagger__link"
            variants={itemVariants}
            style={gapStyle}
          >
            {link.label}
          </motion.a>
        );
      })}
    </motion.footer>
  );
}

export default FooterStagger;
