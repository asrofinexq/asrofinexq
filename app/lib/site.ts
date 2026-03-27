/** Kontak & sosial — satu sumber untuk beranda dan halaman lain */

export const SITE_EMAIL = "m.asrofinexq@gmail.com";

/** Format internasional untuk tel: / wa.me */
export const SITE_PHONE_E164 = "62895397157552";

export const SITE_PHONE_DISPLAY = "+62 895-3971-57552";

export const SITE_ADDRESS =
  "Jl. Gadang Gg 4 No 10, Malang, Jawa Timur 65149, Indonesia";

/** Tautan aktif; nilai `#` atau kosong = tampil maintenance di UI. */
export const SITE_SOCIAL = {
  instagram: "https://www.instagram.com/asrofi_nexq/",
  linkedin: "https://www.linkedin.com/in/mohammad-asrofi",
  whatsapp: `https://wa.me/${SITE_PHONE_E164}`,
  /** Sosial lain — sementara maintenance */
  github: "#",
} as const;

export const THEME_STORAGE_KEY = "asro-theme";
