"use client";

import Image from "next/image";
import RevealSection from "@/app/components/RevealSection";
import { motion } from "motion/react";

export default function ServicesPage() {
  const revealEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

  return (
    <main className="page" aria-label="Services page">
      <style>{`
        .services-split { display: grid; grid-template-columns: 1fr; gap: 24px; width: 100%; }
        .services-left { width: 100%; max-width: min(1220px, calc(100vw - 120px)); margin-inline: auto; }
        .services-offer { display: flex; flex-direction: column; text-align: center; }
        .services-offer__eyebrow {
          display: inline-flex; align-items: center; justify-content: center; gap: 10px;
          margin: 0 auto 10px; color: var(--muted); font-family: "Space Mono", monospace;
          font-size: clamp(11px, 1.2vw, 14px); text-transform: uppercase; letter-spacing: 0.06em;
        }
        .services-offer__arrow { width: 20px; height: 20px; color: color-mix(in srgb, var(--accent) 78%, var(--fg)); }
        .services-offer__arrow svg { width: 100%; height: 100%; }
        .services-offer__title {
          margin: 0 auto 16px; max-width: 22ch; color: var(--fg);
          font-size: clamp(28px, 3.8vw, 50px); line-height: 1.14; font-weight: 500;
          font-family: "Playfair Display", "Times New Roman", serif;
        }
        .services-offer__grid {
          display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px;
          max-width: 1140px; margin: 0 auto; text-align: left;
        }
        .services-offer__card {
          position: relative; overflow: hidden; border-radius: 16px;
          padding: clamp(22px, 2.8vw, 34px);
          background: color-mix(in srgb, var(--card-bg) 78%, var(--bg));
          border: 0.5px solid color-mix(in srgb, var(--fg) 16%, var(--border));
          min-height: clamp(220px, 26vh, 300px);
          isolation: isolate;
          transform: translateY(0) scale(1);
          transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.45s ease, border-color 0.35s ease;
        }
        .services-offer__card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.22) 48%, transparent 100%);
          transform: translateX(-130%);
          transition: transform 0.7s ease;
          z-index: 0;
          pointer-events: none;
        }
        .services-offer__card:hover {
          transform: translateY(-5px) scale(1.01);
          border-color: color-mix(in srgb, var(--accent) 44%, var(--border));
          box-shadow:
            0 14px 30px color-mix(in srgb, var(--accent) 20%, transparent),
            0 2px 12px rgba(0, 0, 0, 0.22);
        }
        .services-offer__card:hover::before {
          transform: translateX(130%);
        }
        .services-offer__circle { position: absolute; inset: 0; opacity: 0.72; pointer-events: none; transition: opacity 0.45s ease; }
        .services-offer__circle-image {
          object-fit: cover;
          object-position: center;
          transform: scale(1);
          transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .services-offer__circle::after {
          content: ""; position: absolute; inset: 0;
          background: linear-gradient(145deg, rgba(8, 12, 20, 0.45), rgba(8, 12, 20, 0.72));
          transition: background 0.45s ease;
        }
        .services-offer__card-content {
          position: relative; z-index: 1; max-width: 62ch; padding: 10px 12px; border-radius: 10px;
          background: linear-gradient(180deg, rgba(9, 13, 22, 0.52), rgba(9, 13, 22, 0.36));
          transition: background 0.4s ease, transform 0.4s ease;
        }
        .services-offer__card h4 {
          margin: 0 0 8px; color: #f8fbff; font-size: clamp(22px, 2.5vw, 32px);
          line-height: 1.08; font-family: "Playfair Display", "Times New Roman", serif; font-weight: 400;
          transition: color 0.35s ease;
        }
        .services-offer__card p {
          margin: 0;
          color: rgba(240, 246, 255, 0.92);
          font-size: 14px;
          line-height: 1.6;
          transition: color 0.35s ease;
        }
        .services-offer__card:hover .services-offer__circle { opacity: 0.9; }
        .services-offer__card:hover .services-offer__circle-image { transform: scale(1.08); }
        .services-offer__card:hover .services-offer__circle::after {
          background: linear-gradient(145deg, rgba(8, 12, 20, 0.26), rgba(8, 12, 20, 0.58));
        }
        .services-offer__card:hover .services-offer__card-content {
          transform: translateY(-2px);
          background: linear-gradient(180deg, rgba(9, 13, 22, 0.42), rgba(9, 13, 22, 0.22));
        }
        .services-offer__card:hover h4,
        .services-offer__card:hover p { color: #ffffff; }
        @media (max-width: 1000px) { .services-offer__grid { grid-template-columns: 1fr; } }
      `}</style>
      <RevealSection className="section" delay={0.04} from="left" blurReveal={false}>
        <div className="section__header">
          <h1 className="section__title">Services</h1>
          <span className="section__num">02 / 04</span>
        </div>
        <div className="services-split">
          <div className="services-left">
            <section className="services-offer" aria-label="Services">
              <motion.span
                className="services-offer__eyebrow"
                initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.46, ease: revealEase }}
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
                initial={{ opacity: 0, y: 12, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.1, duration: 0.52, ease: revealEase }}
              >
                Services Built Specifically for Your Business
              </motion.h3>

              <div className="services-offer__grid">
                <article className="services-offer__card">
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
                </article>

                <article className="services-offer__card">
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
                </article>

                <article className="services-offer__card">
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
                </article>

                <article className="services-offer__card">
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
                </article>
              </div>
            </section>
          </div>
        </div>
      </RevealSection>
    </main>
  );
}
