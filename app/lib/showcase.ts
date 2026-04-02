export type PortfolioTab = "projects" | "certificates";

export type ShowcaseProject = {
  id: string;
  title: string;
  desc: string;
  tags: string[];
  live: string;
  source: string;
  thumbVariant: number;
  thumbImage?: string;
};

export type ShowcaseCertificate = {
  id: string;
  title: string;
  issuer: string;
  year: string;
  href: string;
  thumbImage?: string;
};

export const showcaseProjects: ShowcaseProject[] = [
  {
    id: "001",
    title: "E-Commerce Lipa Store",
    desc: "Platform e-commerce untuk kebutuhan penjualan online. NexQuarter Digital Solution (Februari 2023).",
    tags: ["Laravel", "PHP", "MySQL", "REST API"],
    live: "#",
    source: "#",
    thumbVariant: 0,
    thumbImage: "/project/lipastore.png",
  },
  {
    id: "002",
    title: "Web Bumi Samara Property",
    desc: "Website company profile & marketing properti dengan performa tinggi. NexQuarter Digital Solution (Februari 2023).",
    tags: ["Next.js", "React", "SEO", "Deployment"],
    live: "https://buildtech-flax.vercel.app/",
    source: "#",
    thumbVariant: 1,
    thumbImage: "/project/bumisamara.jpg",
  },
  {
    id: "003",
    title: "Web Moocu UMKM",
    desc: "Website UMKM modern dengan pengalaman pengguna responsif dan struktur konten fleksibel.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "UI/UX"],
    live: "#",
    source: "#",
    thumbVariant: 2,
    thumbImage: "/project/moocu.png",
  },
  {
    id: "004",
    title: "Website Kafe CoffeNexQuarter",
    desc: "Website kafe untuk profil bisnis dan promosi online dengan tampilan modern.",
    tags: ["Next.js", "React", "UI/UX", "Vercel"],
    live: "https://coffenexquarter.vercel.app/",
    source: "#",
    thumbVariant: 3,
    thumbImage: "/project/kafe.jpg",
  },
  {
    id: "005",
    title: "Web Little River Fish",
    desc: "Website bisnis untuk profil, layanan, dan kebutuhan promosi digital.",
    tags: ["Next.js", "React", "Performance", "SEO"],
    live: "#",
    source: "#",
    thumbVariant: 4,
    thumbImage: "/project/littleriverfish.png",
  },
  {
    id: "006",
    title: "E-Patrol Security (Magang)",
    desc: "Pengembangan ekosistem full-stack E-Patrol Security dan panel Web Admin. PT UBS Gold (Januari 2022).",
    tags: ["Cordova", "CodeIgniter 3", "PHP", "MySQL"],
    live: "#",
    source: "#",
    thumbVariant: 5,
    thumbImage: "/project/epatrol.png",
  },
  {
    id: "007",
    title: "E-Parking",
    desc: "Pengembangan sistem parkir digital untuk operasional lapangan. Bali Eka Project (Maret 2019).",
    tags: ["Flutter", "Mobile App", "Backend API", "MySQL"],
    live: "#",
    source: "#",
    thumbVariant: 0,
  },
  {
    id: "008",
    title: "Optimalisasi Bandwidth & QoS",
    desc: "Implementasi manajemen bandwidth dan QoS untuk stabilitas jaringan. SMA Negeri 1 Wongsorejo (April 2023).",
    tags: ["Mikrotik", "QoS", "Routing", "Network Analysis"],
    live: "#",
    source: "#",
    thumbVariant: 1,
  },
  {
    id: "009",
    title: "Implementasi Radius Server",
    desc: "Implementasi autentikasi pengguna jaringan terpusat. SMKN Rengel Tuban (Februari 2023).",
    tags: ["RADIUS", "Linux Server", "Network Security", "Mikrotik"],
    live: "#",
    source: "#",
    thumbVariant: 2,
  },
  {
    id: "010",
    title: "Maintenance & Konfigurasi Sistem Jaringan",
    desc: "Maintenance jaringan dan konfigurasi layanan untuk kebutuhan operasional. PT Kebonagung Malang (April 2019).",
    tags: ["Linux", "Network Troubleshooting", "VPN", "Infrastructure"],
    live: "#",
    source: "#",
    thumbVariant: 3,
  },
  {
    id: "011",
    title: "Maintenance & Deployment Hotspot",
    desc: "Deployment hotspot dan pemeliharaan jaringan area kos. Kos 4 Lantai Malang (Februari 2019).",
    tags: ["Hotspot", "Mikrotik", "Deployment", "Monitoring"],
    live: "#",
    source: "#",
    thumbVariant: 4,
  },
];

export const showcaseCertificates: ShowcaseCertificate[] = [
  {
    id: "c1",
    title: "Sertifikat Jaringan Komputer",
    issuer: "BNSP",
    year: "2024",
    href: "https://drive.google.com/file/d/1J_IcFpolUc5BHX64G8EEapSORyrHhvOs/view?usp=sharing",
    thumbImage: "/project/Sertifikat%20Jaringan%20Komputer.jpg",
  },
  {
    id: "c2",
    title: "Sertifikat Junior Web Developer",
    issuer: "BNSP",
    year: "2024",
    href: "https://drive.google.com/file/d/13zC-MN3qcCeWa3Mvv44QQWL6rMnxl8GW/view?usp=sharing",
    thumbImage: "/project/Sertifikat%20Junior%20Web%20Developer.jpg",
  },
];

/** Placeholder links (empty or #) render as maintenance-style controls. */
export function isStubHref(href?: string | null) {
  if (href == null) return true;
  const t = href.trim();
  return t === "" || t === "#";
}
