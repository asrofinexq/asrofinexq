export type ExperienceItem = {
  role: string;
  company: string;
  location?: string;
  period: string;
  bullets: string[];
  /** Catatan tambahan (mis. magang) */
  note?: string;
};

export const aboutSummary = `Web Developer dan IT Specialist dengan pengalaman sejak 2019 dalam pengembangan sistem full-stack, manajemen jaringan, dan administrasi server Linux. Sebagai Founder NexQuarter Digital Solution, memiliki pengalaman dalam merancang website bisnis, platform e-commerce, dan mengelola siklus pengembangan perangkat lunak dari analisis kebutuhan hingga deployment. Menguasai framework modern (Next.js, React, Laravel) dan keahlian mendalam pada infrastruktur jaringan Mikrotik, untuk menghadirkan solusi teknologi yang scalable, aman, dan berorientasi pada target bisnis.`;

export const aboutExperience: ExperienceItem[] = [
  {
    role: "Freelance Web Developer",
    company: "Nexquarter Digital Solution",
    location: "Owner",
    period: "Februari 2023 – Sekarang",
    bullets: [
      "Mengembangkan aplikasi web full-stack menggunakan Laravel, Next.js, dan React sesuai kebutuhan berbagai klien.",
      "Membangun dan melakukan deployment website perusahaan, platform e-commerce, serta landing page yang dioptimalkan untuk performa tinggi.",
      "Mengimplementasikan RESTful API dan sistem autentikasi yang aman.",
    ],
  },
  {
    role: "Digital Marketing",
    company: "Bumi Samara Property",
    location: "Malang, Jawa Timur",
    period: "Agustus 2022 – Desember 2022",
    bullets: [
      "Mengelola strategi pemasaran digital untuk promosi properti melalui media sosial dan website.",
      "Membuat konten visual dan copywriting yang menarik untuk meningkatkan engagement.",
      "Melakukan analisis performa iklan untuk mengoptimalkan budget promosi.",
    ],
  },
  {
    role: "Pemilik Usaha",
    company: "Amnesia Coffeshop",
    location: "Malang, Jawa Timur",
    period: "Oktober 2021 – Desember 2022",
    bullets: [
      "Mendirikan, mengelola, dan mengawasi seluruh operasional harian bisnis, termasuk manajemen inventaris, arus kas keuangan, dan standar layanan pelanggan.",
      "Merekrut, melatih, dan mengevaluasi staf untuk mempertahankan kualitas pelayanan yang konsisten.",
      "Menangani pemasaran dan promosi media sosial untuk menarik serta mempertahankan pelanggan.",
    ],
  },
  {
    role: "Full Stack Developer (Magang)",
    company: "PT UBS Gold",
    location: "Malang, Jawa Timur",
    period: "Januari 2022 – Juli 2022",
    bullets: [
      "Mengembangkan secara mandiri ekosistem full-stack aplikasi E-Patrol Security, mencakup arsitektur Back-End API, database, dan Front-End Android (Cordova).",
      "Membangun panel Web Admin (CodeIgniter 3) sebagai pusat kendali operasional untuk manajemen data perusahaan secara real-time.",
      "Mengeksekusi desain UI/UX responsif serta menjamin stabilitas sistem melalui pengujian mandiri dan pemeliharaan rutin.",
    ],
  },
  {
    role: "Teknisi Jaringan",
    company: "Mitra Network",
    location: "Malang, Jawa Timur",
    period: "Maret 2019 – Januari 2021",
    note: "Magang: Februari 2018 – Juli 2018",
    bullets: [
      "Mengimplementasikan dan mengelola server berbasis Linux untuk berbagai kebutuhan klien.",
      "Mengonfigurasi dan mengoptimalkan jaringan Mikrotik, termasuk routing, manajemen bandwidth, dan pengaturan VPN.",
      "Melakukan troubleshooting jaringan untuk mengatasi masalah konektivitas dan performa.",
    ],
  },
];

export const aboutEducation = {
  degree: "S1 Teknik Informatika",
  school: "Institut Teknologi Dan Bisnis Asia",
  location: "Malang",
  period: "September 2019 – Maret 2024",
  gpa: "3,26",
};

export type ProjectItem = { title: string; context: string; period: string };

export const aboutProjects: ProjectItem[] = [
  {
    title: "Platform E-Commerce Development",
    context: "Nexquarter Digital Solution",
    period: "Februari 2023 – Sekarang",
  },
  {
    title: "Modern Web Development",
    context: "Nexquarter Digital Solution",
    period: "Februari 2023 – Sekarang",
  },
  {
    title: "Optimalisasi Bandwidth & QoS",
    context: "SMA Negeri 1 Wongsorejo",
    period: "April 2023",
  },
  {
    title: "Implementasi Radius Server",
    context: "SMKN Rengel Tuban",
    period: "Februari 2023",
  },
  {
    title: "E-Patrol Security (Magang)",
    context: "PT Untung Bersama Sejahtera (UBS Gold)",
    period: "Januari 2022",
  },
  {
    title: "Maintenance & Konfigurasi Sistem Jaringan",
    context: "PT Kebonagung Malang",
    period: "April 2019",
  },
  {
    title: "Troubleshooting Jaringan",
    context: "Jatim Park 2 Malang",
    period: "Maret 2019",
  },
  {
    title: "E-Parking",
    context: "Bali Eka Project",
    period: "Maret 2019",
  },
  {
    title: "Maintenance & Deployment Hotspot",
    context: "Kos 4 Lantai Malang",
    period: "Februari 2019",
  },
  {
    title: "Manajemen Server & Infrastruktur",
    context: "SMKN 1 Malang",
    period: "Juni 2018",
  },
];

export const aboutSkillGroups: { title: string; items: string[] }[] = [
  {
    title: "Web Development (Full-Stack)",
    items: [
      "Next.js, React, Laravel, Node.js, PHP, CodeIgniter 3, Tailwind CSS, JavaScript, HTML & CSS",
    ],
  },
  {
    title: "Network & System Administration",
    items: [
      "Konfigurasi Mikrotik (Routing, VPN, Bandwidth Management)",
      "Administrasi Server Linux (Ubuntu, Debian)",
      "Analisis Trafik Jaringan, Nginx & Apache Web Server",
    ],
  },
  {
    title: "Database & Backend Infrastructure",
    items: [
      "MySQL, PostgreSQL",
      "Perancangan RESTful API, Sistem Autentikasi & Keamanan",
      "Manajemen Database & Relasi Data",
    ],
  },
  {
    title: "Cloud & Deployment",
    items: [
      "Manajemen VPS (Virtual Private Server)",
      "Deployment Hosting & Domain, Konfigurasi SSL",
      "Cloud Server Maintenance",
    ],
  },
  {
    title: "Integration",
    items: [
      "Pengembangan Bot Otomatisasi (WhatsApp & Telegram API)",
      "Implementasi Desain UI/UX",
    ],
  },
];
