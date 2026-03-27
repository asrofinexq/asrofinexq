import type { ReactNode } from "react";
import { isStubHref } from "@/app/lib/showcase";

export default function ShowcaseAction({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: ReactNode;
}) {
  if (isStubHref(href)) {
    return (
      <span
        className={`${className} btn--maintenance`}
        role="button"
        aria-disabled="true"
        title="Sedang dalam pemeliharaan — tautan menyusul."
      >
        <span className="btn-maintenance__row">
          {children}
          <span className="btn-maintenance__badge" aria-hidden>
            Maintenance
          </span>
        </span>
      </span>
    );
  }
  return (
    <a className={className} href={href}>
      {children}
    </a>
  );
}
