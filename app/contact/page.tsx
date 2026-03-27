import Link from "next/link";
import RevealSection from "@/app/components/RevealSection";
import PageSocialLinks from "@/app/components/PageSocialLinks";
import {
  SITE_ADDRESS,
  SITE_EMAIL,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_E164,
} from "@/app/lib/site";

export default function ContactPage() {
  return (
    <main className="page">
      <RevealSection className="section section--contact" id="contact" delay={0.06} from="right">
        <div className="section__header">
          <h1 className="section__title">Contact</h1>
          <span className="section__num">03 / 04</span>
        </div>

        <div className="contact-split">
          <div className="contact-intro">
            <p className="contact-eyebrow">Start a project</p>
            <h2 className="contact-headline">Let&apos;s build something clean.</h2>
            <p className="contact-lede">
              Ada proyek, kolaborasi, atau pertanyaan teknis? Kirim email dengan konteks singkat —
              tujuan, timeline, dan estimasi budget jika ada. Balasan paling lambat biasanya{" "}
              <strong>1–2 hari kerja</strong>.{" "}
              <strong>mailto</strong> atau WhatsApp.
            </p>
            <div className="contact-intro__actions">
              <a className="btn btn--primary" href={`mailto:${SITE_EMAIL}`}>
                Start a project
              </a>
              <a
                className="btn btn--ghost"
                href={`https://wa.me/${SITE_PHONE_E164}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
              <Link className="btn btn--ghost" href="/services">
                Services
              </Link>
            </div>
          </div>

          <aside className="contact-panel" aria-label="Kanal kontak">
            <span className="contact-panel__kicker">Direct</span>
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
            <p className="page-social-label">Sosial</p>
            <PageSocialLinks />
            <div className="contact-panel__links">
              <Link href="/projects">Karya &amp; sertifikasi</Link>
              <Link href="/#guestbook">Buku tamu</Link>
              <Link href="/">Beranda</Link>
            </div>
          </aside>
        </div>
      </RevealSection>
    </main>
  );
}
