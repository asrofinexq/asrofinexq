"use client";

import { FaGithub, FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa6";
import { isStubHref } from "@/app/lib/showcase";
import { SITE_SOCIAL } from "@/app/lib/site";

const SOCIAL_ITEMS = [
  { href: SITE_SOCIAL.instagram, label: "Instagram", Icon: FaInstagram },
  { href: SITE_SOCIAL.linkedin, label: "LinkedIn", Icon: FaLinkedinIn },
  { href: SITE_SOCIAL.whatsapp, label: "WhatsApp", Icon: FaWhatsapp },
  { href: SITE_SOCIAL.github, label: "GitHub", Icon: FaGithub },
] as const;

export default function PageSocialLinks() {
  return (
    <div className="page-social" aria-label="Social links">
      {SOCIAL_ITEMS.map(({ href, label, Icon }) =>
        isStubHref(href) ? (
          <span
            key={label}
            className="page-social__link page-social__link--maintenance"
            role="button"
            aria-disabled="true"
            aria-label={`${label} — sedang pemeliharaan`}
            title="Sedang dalam pemeliharaan — tautan menyusul."
          >
            <Icon aria-hidden />
          </span>
        ) : (
          <a
            key={label}
            className="page-social__link"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
          >
            <Icon aria-hidden />
          </a>
        ),
      )}
    </div>
  );
}
