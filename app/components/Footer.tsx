import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="asro-footer">
      <div className="asro-container asro-footer__inner">
        <div className="asro-footer__brand">
          <div className="asro-footer__name">AsrofinexQ</div>
          <div className="asro-footer__tagline">
            Full Stack Developer • Next.js • TypeScript
          </div>
        </div>

        <div className="asro-footer__links">
          <Link className="asro-link" href="/">Home</Link>
          <Link className="asro-link" href="/about">About</Link>
          <Link className="asro-link" href="/services">Services</Link>
          <Link className="asro-link" href="/contact">Contact</Link>
        </div>

        <div className="asro-footer__meta">© {year} AsrofinexQ</div>
      </div>
    </footer>
  );
}

