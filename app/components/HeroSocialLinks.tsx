"use client";

import { FaGithub, FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa6";
import { isStubHref } from "@/app/lib/showcase";
import { SITE_SOCIAL } from "@/app/lib/site";

const SOCIAL_ITEMS = [
  { href: SITE_SOCIAL.instagram, kicker: "Instagram", Icon: FaInstagram },
  { href: SITE_SOCIAL.linkedin, kicker: "LinkedIn", Icon: FaLinkedinIn },
  { href: SITE_SOCIAL.whatsapp, kicker: "WhatsApp", Icon: FaWhatsapp },
  { href: SITE_SOCIAL.github, kicker: "GitHub", Icon: FaGithub },
] as const;

export default function HeroSocialLinks() {
  return (
    <div className="hero__social" aria-label="Social and contact">
      {SOCIAL_ITEMS.map(({ href, kicker, Icon }) =>
        isStubHref(href) ? (
          <span
            key={kicker}
            className="hero__social-link hero__social-link--maintenance"
            role="button"
            aria-disabled="true"
            aria-label={`${kicker} — sedang pemeliharaan`}
            title="Sedang dalam pemeliharaan — tautan menyusul."
          >
            <Icon aria-hidden />
          </span>
        ) : (
          <a
            key={kicker}
            className="hero__social-link"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={kicker}
          >
            <Icon aria-hidden />
          </a>
        ),
      )}
    </div>
  );
}
