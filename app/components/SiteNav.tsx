"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteNav() {
  const pathname = usePathname() || "/";
  const isActive = (href: string) => pathname === href;

  return (
    <nav className="nav" aria-label="Primary">
      <Link className="nav__avatar" href="/" aria-label="Home">
        <Image
          src="/asrofinexq-logo.png"
          alt="AsrofinexQ"
          width={36}
          height={36}
          priority
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </Link>

      <div className="nav__links">
        <Link className={`nav__link${isActive("/") ? " is-active" : ""}`} href="/">
          Home
        </Link>
        <Link
          className={`nav__link${isActive("/about") ? " is-active" : ""}`}
          href="/about"
        >
          About
        </Link>
        <Link
          className={`nav__link${isActive("/services") ? " is-active" : ""}`}
          href="/services"
        >
          Services
        </Link>
        <Link
          className={`nav__link${isActive("/contact") ? " is-active" : ""}`}
          href="/contact"
        >
          Contact
        </Link>
      </div>

      <Link className="nav__cta" href="/contact">
        Contact
      </Link>
    </nav>
  );
}

