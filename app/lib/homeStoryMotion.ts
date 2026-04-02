/**
 * Motion tur layar penuh (home) + dock — satu sumber agar Lanjut/Kembali selaras
 * dengan AnimatePresence mode="wait" (exit panel → enter panel).
 */

export const STORY_SLIDE_EXIT = {
  duration: 0.42,
  ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
};

export const STORY_SLIDE_CENTER = {
  spring: { type: "spring" as const, stiffness: 220, damping: 24, mass: 0.92 },
  opacity: {
    duration: 0.38,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  },
  filter: {
    duration: 0.55,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
  },
};

export const STORY_SLIDE_REDUCED = {
  enterDuration: 0.38,
  enterEase: [0.22, 1, 0.36, 1] as [number, number, number, number],
  exitDuration: 0.3,
};

/** Morf dock (lebar/tinggi/padding): selaras “melek”-nya slide (filter) */
export const STORY_DOCK_PANEL = {
  duration: STORY_SLIDE_CENTER.filter.duration,
  ease: STORY_SLIDE_CENTER.filter.ease,
};

/** Step Contact: dock mekar penuh sedikit lebih panjang agar selaras konten yang muncul bertahap */
export const STORY_DOCK_CONTACT_EXPAND = {
  duration: 1.05,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

/** Geser dock tengah ↔ pojok: selaras slide exit (langkah ganti section) */
export const STORY_DOCK_POSITION = {
  duration: STORY_SLIDE_EXIT.duration,
  ease: STORY_SLIDE_EXIT.ease,
};

/**
 * Satu tombol di tengah dulu; setelah exit + opacity enter section (~selesai ganti konten),
 * baru geser ke pojok — sinkron dengan mode wait.
 */
export const STORY_DOCK_HOLD_COLLAPSED_MS = Math.round(
  STORY_SLIDE_EXIT.duration * 1000 + STORY_SLIDE_CENTER.opacity.duration * 1000,
);
