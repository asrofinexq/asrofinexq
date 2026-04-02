"use client";

import { usePathname } from "next/navigation";
import PillNav from "@/app/components/PillNav";

export default function Navbar() {
  const pathname = usePathname() || "/";

  return (
    <header className="asro-navbar">
      <div className="asro-navbar__inner">
        <PillNav
          logo="/asrofinexq-logo.png"
          logoAlt="AsrofinexQ Logo"
          items={[
            { label: "Home", href: "/" },
            { label: "About", href: "/about" },
            { label: "Services", href: "/services" },
            { label: "Contact", href: "/contact" },
          ]}
          activeHref={pathname}
          className="custom-nav"
          ease="power2.easeOut"
          baseColor="#000000"
          pillColor="#ffffff"
          hoveredPillTextColor="#ffffff"
          pillTextColor="#000000"
          initialLoadAnimation
        />
      </div>
    </header>
  );
}

