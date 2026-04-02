"use client";

import { useState } from "react";
import Link from "next/link";
import RevealSection from "@/app/components/RevealSection";
import ShowcaseAction from "@/app/components/ShowcaseAction";
import FuzzyText from "@/app/components/FuzzyText";
import ProjectsNoticePopup from "@/app/components/ProjectsNoticePopup";
import {
  showcaseCertificates,
  showcaseProjects,
  type PortfolioTab,
} from "@/app/lib/showcase";

export default function ProjectsPage() {
  const [portfolioTab, setPortfolioTab] = useState<PortfolioTab>("projects");

  return (
    <main className="page">
      <ProjectsNoticePopup />
      <RevealSection className="section" id="projects" delay={0.08} from="right">
        <div className="section__header">
          <h1 className="section__title">Project &amp; Sertifikasi</h1>
          <span className="section__num">03 / 04</span>
        </div>

        <div className="work-showcase__toolbar">
          <div className="work-tabs" role="tablist" aria-label="Pilih tampilan portofolio">
            <button
              type="button"
              role="tab"
              id="tab-projects-page"
              aria-selected={portfolioTab === "projects"}
              aria-controls="panel-projects-page"
              tabIndex={portfolioTab === "projects" ? 0 : -1}
              onClick={() => setPortfolioTab("projects")}
            >
              Project
            </button>
            <button
              type="button"
              role="tab"
              id="tab-certificates-page"
              aria-selected={portfolioTab === "certificates"}
              aria-controls="panel-certificates-page"
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
            id="panel-projects-page"
            aria-labelledby="tab-projects-page"
            key="panel-projects-page"
          >
            {showcaseProjects.map((p) => (
              <article key={p.id} className="work-tile">
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
                <h2 className="work-tile__title">{p.title}</h2>
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
            id="panel-certificates-page"
            aria-labelledby="tab-certificates-page"
            key="panel-certificates-page"
          >
            {showcaseCertificates.map((c, idx) => (
              <article key={c.id} className="work-tile">
                <div
                  className={`work-tile__thumb work-tile__thumb--v${idx % 6}${c.thumbImage ? " work-tile__thumb--image work-tile__thumb--certificate-image" : ""}`}
                  style={c.thumbImage ? { backgroundImage: `url(${c.thumbImage})` } : undefined}
                  aria-hidden
                />
                <span className="work-tile__kicker">Sertifikat</span>
                <h2 className="work-tile__title">{c.title}</h2>
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
          <p className="work-showcase-cta__kicker">Sudah melihat cuplikan</p>
          <h3 className="work-showcase-cta__title">Diskusikan proyek atau scope berikutnya</h3>
          <p className="work-showcase-cta__desc">
            Ceritakan kebutuhan, timeline, dan stack — saya bantu struktur solusi yang rapi dan siap
            production. Lihat juga halaman Services untuk gambaran cara kerja.
          </p>
          <div className="work-showcase-cta__actions">
            <Link className="btn btn--primary" href="/contact">
              Hubungi
            </Link>
            <Link className="btn btn--ghost" href="/services">
              Services
            </Link>
            <Link className="btn btn--ghost" href="/">
              Kembali ke beranda
            </Link>
          </div>
        </div>
      </RevealSection>
    </main>
  );
}
