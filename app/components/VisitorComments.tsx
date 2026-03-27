"use client";

import { useEffect, useRef } from "react";

/**
 * Default publik (sama dengan embed di giscus.app). ID ini memang terlihat di HTML;
 * env NEXT_PUBLIC_* tetap bisa menimpa — berguna karena .env.local biasanya tidak ikut ke GitHub.
 */
const GISCUS_DEFAULTS = {
  repo: "asrofinexq/komentar",
  repoId: "R_kgDORx3uqQ",
  category: "Q&A",
  categoryId: "DIC_kwDORx3uqc4C5XGN",
  mapping: "pathname",
} as const;

const REPO = process.env.NEXT_PUBLIC_GISCUS_REPO || GISCUS_DEFAULTS.repo;
const REPO_ID = process.env.NEXT_PUBLIC_GISCUS_REPO_ID || GISCUS_DEFAULTS.repoId;
const CATEGORY = process.env.NEXT_PUBLIC_GISCUS_CATEGORY || GISCUS_DEFAULTS.category;
const CATEGORY_ID =
  process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || GISCUS_DEFAULTS.categoryId;
const MAPPING = process.env.NEXT_PUBLIC_GISCUS_MAPPING || GISCUS_DEFAULTS.mapping;

function currentGiscusTheme(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function sendGiscusTheme() {
  const iframe = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
  iframe?.contentWindow?.postMessage(
    { giscus: { setConfig: { theme: currentGiscusTheme() } } },
    "https://giscus.app",
  );
}

export default function VisitorComments() {
  const hostRef = useRef<HTMLDivElement>(null);
  const configured = Boolean(REPO && REPO_ID && CATEGORY_ID);

  useEffect(() => {
    if (!configured || !hostRef.current) return;

    const el = hostRef.current;
    el.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", REPO!);
    script.setAttribute("data-repo-id", REPO_ID!);
    script.setAttribute("data-category", CATEGORY);
    script.setAttribute("data-category-id", CATEGORY_ID!);
    script.setAttribute("data-mapping", MAPPING);
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", currentGiscusTheme());
    script.setAttribute("data-lang", "id");
    script.setAttribute("data-loading", "lazy");

    el.appendChild(script);

    const obs = new MutationObserver(() => {
      sendGiscusTheme();
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      obs.disconnect();
      el.innerHTML = "";
    };
  }, [configured]);

  if (!configured) {
    return (
      <div className="comments-fallback">
        <p className="comments-fallback__title">Belum diaktifkan</p>
        <p className="comments-fallback__text">
          Untuk mengaktifkan kolom komentar, sambungkan repositori GitHub dengan{" "}
          <a href="https://giscus.app" target="_blank" rel="noopener noreferrer">
            Giscus
          </a>
          , lalu tambahkan variabel berikut di{" "}
          <code className="comments-fallback__code">.env.local</code>:
        </p>
        <pre className="comments-fallback__pre">
          {`NEXT_PUBLIC_GISCUS_REPO=asrofinexq/komentar
NEXT_PUBLIC_GISCUS_REPO_ID=…
NEXT_PUBLIC_GISCUS_CATEGORY=Q&A
NEXT_PUBLIC_GISCUS_CATEGORY_ID=…
NEXT_PUBLIC_GISCUS_MAPPING=pathname`}
        </pre>
        <p className="comments-fallback__hint">
          Ganti ID yang bertitik-titik dengan nilai dari wizard di{" "}
          <a href="https://giscus.app" target="_blank" rel="noopener noreferrer">
            giscus.app
          </a>
          . Panduan lengkap ada di file <code className="comments-fallback__code">GISCUS.md</code>{" "}
          di root proyek.
        </p>
      </div>
    );
  }

  return <div ref={hostRef} className="giscus" />;
}
