import Link from "next/link";
import AboutMythrillCards from "@/app/components/AboutMythrillCards";
import RevealSection from "@/app/components/RevealSection";
import PageSocialLinks from "@/app/components/PageSocialLinks";
import {
  SITE_ADDRESS,
  SITE_EMAIL,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_E164,
  SITE_SOCIAL,
} from "@/app/lib/site";
import {
  aboutEducation,
  aboutExperience,
  aboutProjects,
  aboutSkillGroups,
  aboutSummary,
} from "./data";

export default function AboutPage() {
  return (
    <main className="page">
      <RevealSection
        className="section section--about"
        delay={0.05}
        from="left"
        blurReveal={false}
      >
        <div className="section__header">
          <h1 className="section__title">About</h1>
          <span className="section__num">01 / 04</span>
        </div>

        <div className="about-hero">
          <div className="about-hero__cards-wrap">
            <AboutMythrillCards />
          </div>
          <div className="about-hero__main">
            <p className="about-hero__kicker">IT Developer · Founder NexQuarter Digital Solution</p>
            <h2 className="about-hero__name">Mohammad Asrofi</h2>
            <ul className="about-hero__meta" aria-label="Kontak">
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
            </ul>
            <div className="about-hero__social-row">
              <span className="about-hero__social-label">Sosial</span>
              <PageSocialLinks />
            </div>
          </div>
        </div>

        <div className="about-summary-wrap">
          <p className="about-summary" lang="id">
            {aboutSummary}
          </p>
        </div>
      </RevealSection>

      <RevealSection className="section section--about" delay={0.06} from="right">
        <h2 className="about-block-title">Experience</h2>
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
      </RevealSection>

      <RevealSection className="section section--about" delay={0.06} from="left">
        <div className="about-stack">
          <section className="about-panel" aria-labelledby="about-academy-heading">
            <h2 className="about-block-title" id="about-academy-heading">
              Academy
            </h2>
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
          </section>

          <section className="about-panel" aria-labelledby="about-projects-heading">
            <h2 className="about-block-title" id="about-projects-heading">
              Project
            </h2>
            <ul className="about-projects">
              {aboutProjects.map((p) => (
                <li key={`${p.title}-${p.period}`} className="about-projects__item">
                  <div className="about-projects__main">
                    <strong>{p.title}</strong>
                    <span className="about-projects__ctx">{p.context}</span>
                  </div>
                  <span className="about-projects__period">{p.period}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="about-panel" aria-labelledby="about-skills-heading">
            <h2 className="about-block-title" id="about-skills-heading">
              Skill
            </h2>
            <div className="about-skills">
              {aboutSkillGroups.map((g) => (
                <div key={g.title} className="project-card about-skill-group">
                  <h3 className="about-skill-group__title">{g.title}</h3>
                  <ul className="about-list about-list--compact">
                    {g.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <div className="about-footer-cta">
            <Link className="btn btn--primary" href="/contact">
              Hubungi saya
            </Link>
            <Link className="btn btn--ghost" href="/projects">
              Lihat proyek
            </Link>
          </div>
        </div>
      </RevealSection>
    </main>
  );
}
