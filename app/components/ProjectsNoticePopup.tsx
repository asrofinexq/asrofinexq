"use client";

import { useEffect, useState } from "react";

type ProjectsNoticePopupProps = {
  enabled?: boolean;
};

export default function ProjectsNoticePopup({ enabled = true }: ProjectsNoticePopupProps) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  const openPopup = () => {
    setMounted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
  };

  const closePopup = () => {
    setVisible(false);
    window.setTimeout(() => setMounted(false), 280);
  };

  useEffect(() => {
    if (!enabled) return;
    const id = window.setTimeout(() => openPopup(), 180);
    return () => window.clearTimeout(id);
  }, [enabled]);

  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePopup();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [visible]);

  if (!mounted) return null;

  return (
    <div
      className={`project-notice ${visible ? "is-open" : "is-closing"}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-notice-title"
      onClick={closePopup}
    >
      <div
        className={`project-notice__panel ${visible ? "is-open" : "is-closing"}`}
        onClick={(event) => event.stopPropagation()}
      >
        <p className="project-notice__eyebrow">Catatan</p>
        <h2 id="project-notice-title" className="project-notice__title">
          Informasi Project &amp; Sertifikasi
        </h2>
        <p className="project-notice__desc">
          Konten project yang ditampilkan mayoritas berupa demo/presentasi kemampuan teknis. Detail sensitif
          dan arsitektur keamanan sistem klien disamarkan demi menjaga kerahasiaan data serta keamanan
          implementasi produksi.
        </p>
        <button type="button" className="btn btn--primary project-notice__btn" onClick={closePopup}>
          Mengerti
        </button>
      </div>
    </div>
  );
}
