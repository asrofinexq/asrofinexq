"use client";

import Link from "next/link";
import CardSwap, { Card } from "@/components/CardSwap";
import RevealSection from "@/app/components/RevealSection";

export default function ServicesPage() {
  return (
    <main className="page">
      <RevealSection className="section" delay={0.04} from="left">
        <div className="section__header">
          <h1 className="section__title">Services</h1>
          <span className="section__num">01 / 04</span>
        </div>

        <div className="services-split">
          <div className="services-left">
            <p className="services-eyebrow">What I deliver</p>
            <h2 className="services-headline">
              Premium UI.
              <br />
              Solid backend.
              <br />
              Ship fast.
            </h2>
            <p className="services-lede">
              Saya bangun website dan aplikasi yang <b>terasa premium</b>—cepat, rapi, dan siap scale.
              Dari UI sampai API, saya fokus ke <b>struktur yang maintainable</b>, performa, dan praktik
              security yang aman untuk production.
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
                <span>
                  Design system, responsive layout, aksesibilitas, dan micro-interactions yang halus.
                </span>
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
              <CardSwap
                cardDistance={60}
                verticalDistance={70}
                delay={5000}
                startDelay={900}
                easing="smooth"
                pauseOnHover={false}
              >
                <Card className="asro-cardswap-card">
                  <div className="asro-service__meta">
                    <div>
                      <div className="asro-service__kicker">Service 01</div>
                      <h3 className="asro-service__title">Front-end Engineering</h3>
                      <p className="asro-service__desc">
                        UI yang rapih, responsif, dan terasa premium. Komponen reusable, design
                        system, dan micro-interactions yang halus.
                      </p>
                      <div className="asro-service__tags">
                        <span className="tag">React</span>
                        <span className="tag">Next.js</span>
                        <span className="tag">TypeScript</span>
                        <span className="tag">UI/UX</span>
                      </div>
                    </div>
                    <div className="asro-service__ctaRow">
                      <Link className="asro-service__cta" href="/projects">
                        See work
                      </Link>
                      <Link className="asro-service__cta" href="/contact">
                        Request quote
                      </Link>
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
                        REST API, auth, validation, database design, dan arsitektur yang rapi. Fokus ke
                        security, performance, dan DX.
                      </p>
                      <div className="asro-service__tags">
                        <span className="tag">Node</span>
                        <span className="tag">PostgreSQL</span>
                        <span className="tag">Auth</span>
                        <span className="tag">Caching</span>
                      </div>
                    </div>
                    <div className="asro-service__ctaRow">
                      <Link className="asro-service__cta" href="/projects">
                        See work
                      </Link>
                      <Link className="asro-service__cta" href="/contact">
                        Integrate API
                      </Link>
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
                        End-to-end dari desain, implementasi, testing, sampai deploy. Setup env, CI/CD,
                        monitoring, dan release yang bersih.
                      </p>
                      <div className="asro-service__tags">
                        <span className="tag">Docker</span>
                        <span className="tag">CI/CD</span>
                        <span className="tag">Vercel</span>
                        <span className="tag">Observability</span>
                      </div>
                    </div>
                    <div className="asro-service__ctaRow">
                      <Link className="asro-service__cta" href="/projects">
                        See work
                      </Link>
                      <Link className="asro-service__cta" href="/contact">
                        Ship product
                      </Link>
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

        <div className="cta-block">
          <h2>Butuh estimasi?</h2>
          <div className="cta-btns">
            <Link className="btn btn--primary" href="/contact">
              Request quote
            </Link>
            <Link className="btn btn--ghost" href="/projects">
              See work
            </Link>
          </div>
        </div>
      </RevealSection>
    </main>
  );
}
