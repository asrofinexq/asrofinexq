"use client";

import { useCallback, useEffect, useState } from "react";

const INTRO_EVENT = "asro:intro-complete";
const NOTICE_SHOWN_KEY = "asro:dev-notice-shown";

export default function DevelopmentNoticePopup() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  const openPopup = useCallback(() => {
    setMounted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    window.setTimeout(() => setMounted(false), 280);
    try {
      sessionStorage.setItem(NOTICE_SHOWN_KEY, "1");
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      if (sessionStorage.getItem(NOTICE_SHOWN_KEY) === "1") return;
    } catch {
      // ignore storage errors
    }

    const show = () => openPopup();

    if (document.body.classList.contains("asro-intro-done")) {
      const id = window.setTimeout(show, 220);
      return () => window.clearTimeout(id);
    }

    window.addEventListener(INTRO_EVENT, show, { once: true });
    return () => window.removeEventListener(INTRO_EVENT, show);
  }, [openPopup]);

  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [visible, close]);

  if (!mounted) return null;

  return (
    <div
      className={`dev-notice ${visible ? "is-open" : "is-closing"}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dev-notice-title"
      onClick={close}
    >
      <div
        className={`dev-notice__panel ${visible ? "is-open" : "is-closing"}`}
        onClick={(event) => event.stopPropagation()}
      >
        <p className="dev-notice__eyebrow">Informasi</p>
        <h2 id="dev-notice-title" className="dev-notice__title">
          Website masih dalam tahap pengembangan
        </h2>
        <p className="dev-notice__desc">
          Beberapa fitur, konten, dan animasi masih terus disempurnakan. Terima kasih sudah berkunjung.
        </p>
        <button type="button" className="btn btn--primary dev-notice__btn" onClick={close}>
          Mengerti
        </button>
      </div>
    </div>
  );
}
