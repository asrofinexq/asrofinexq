# Panduan lengkap Giscus di portofolio ini

Dokumen ini menjelaskan apa itu **Giscus**, cara kerjanya, dan langkah demi langkah menghubungkan repositori **`asrofinexq/komentar`** ke website Next.js kamu (section **Buku tamu** di beranda).

---

## Apa itu Giscus?

**Giscus** adalah sistem komentar **gratis** dan **bersumber terbuka** yang menyimpan semua komentar dan reaksi di **GitHub Discussions**, bukan di basis data sendiri.

| Aspek | Penjelasan |
|--------|------------|
| Privasi / iklan | Tanpa pelacakan iklan khas layanan komentar komersial; data utamanya di GitHub. |
| Biaya | Gratis (sejalan dengan kuota/GitHub untuk repo publik). |
| Basis data | Tidak perlu PostgreSQL/MySQL — diskusi dan komentar ada di **Discussions**. |
| Tema & bahasa | Mendukung banyak tema dan bahasa (di situs ini: **Bahasa Indonesia**). |
| Inspirasi | Mirip ide **Utterances**, tetapi memakai **Discussions** (bukan Issues). |

**Catatan:** Giscus, Discussions, dan API GitHub terus berkembang. Jika ada fitur yang berubah, cek [giscus.app](https://giscus.app) dan [dokumentasi resmi](https://github.com/giscus/giscus).

---

## Cara kerja (singkat)

1. Situs kamu memuat script/widget dari `https://giscus.app/client.js` di halaman (di proyek ini lewat komponen `VisitorComments`).
2. Giscus memanggil **API pencarian GitHub Discussions** untuk mencari diskusi yang **sesuai dengan halaman** menurut **pemetaan** yang kamu pilih (misalnya `pathname`).
3. Jika **belum ada** diskusi yang cocok, saat pengunjung **pertama kali** mengirim komentar atau reaksi, **bot Giscus** dapat **membuat diskusi baru** (di kategori yang kamu tentukan).
4. Untuk menulis komentar dari website, pengunjung mengikuti **OAuth GitHub** (mengizinkan aplikasi Giscus). Alternatif: mereka bisa berkomentar langsung di tab **Discussions** di GitHub.
5. **Moderasi** (menutup, mengedit, menghapus diskusi/komentar) dilakukan di **GitHub** seperti diskusi biasa.

---

## Prasyarat di GitHub (wajib)

Untuk repositori yang dipakai Giscus (contoh: **`asrofinexq/komentar`**), pastikan:

1. **Repo publik** — kalau private, pengunjung umum tidak bisa melihat diskusi.
2. **GitHub Discussions aktif** — di repo: *Settings* → *General* → bagian *Features* → centang **Discussions**.
3. **Aplikasi Giscus terpasang di repo** — ikuti wizard di [giscus.app](https://giscus.app); di langkah repo biasanya ada tautan untuk **Install Giscus** ke organisasi/user & pilih hanya repo `komentar` (atau repo yang kamu pakai).

Tanpa ketiga hal ini, widget bisa kosong atau komentar tidak bisa dikirim.

---

## Konfigurasi yang kamu pakai (ringkas)

Berdasarkan cuplikan dari wizard Giscus kamu:

| Opsi | Nilai |
|------|--------|
| **Repositori** | `asrofinexq/komentar` |
| **Bahasa tampilan** | Indonesia (`id`) |
| **Pemetaan halaman ↔ diskusi** | `pathname` — judul diskusi dicocokkan dengan **path** URL halaman penyemat (mis. `/` untuk beranda). |
| **Kategori diskusi** | **Q&A** (diskusi baru dibuat di kategori ini). |
| **Hanya cari dalam kategori ini** | Aktif (*Hanya cari diskusi dalam kategori ini*) — pencarian diskusi yang sudah ada dibatasi ke kategori Q&A. |
| **Reaksi pada kiriman utama** | Aktif (`data-reactions-enabled="1"`) |
| **Metadata ke halaman induk** | Nonaktif (`data-emit-metadata="0"`) |
| **Posisi kotak komentar** | Bawah (`data-input-position="bottom"`) |
| **Lazy load** | Aktif — iframe dimuat mendekati saat pengunjung scroll ke area komentar. |
| **Strict title** | `0` — tidak memakai pencocokan judul ketat. |

ID teknis dari wizard (untuk `.env.local`):

- `data-repo-id`: `R_kgDORx3uqQ`
- `data-category-id`: `DIC_kwDORx3uqc4C5XGN`

> **Penting:** Jika kamu mengganti repo, kategori, atau menginstal ulang app, buka lagi [giscus.app](https://giscus.app) dan **salin ulang** `data-repo-id` dan `data-category-id` — ID ini spesifik per repo/kategori.

---

## Kenapa tulisan “Belum diaktifkan” tetap muncul?

Hal yang sering terjadi:

1. **File environment tidak ikut ke GitHub**  
   Di proyek ini, `.gitignore` mengabaikan `.env*` (termasuk `.env.local`). Jadi meskipun kamu mengisi env di komputer, **push ke GitHub tidak mengirim variabel itu**. Situs yang di-build di **Vercel / Netlify / lainnya** tidak otomatis tahu isi `.env.local` kamu.

2. **Yang harus dilakukan untuk hosting**  
   Buka **pengaturan proyek** di platform deploy (mis. Vercel → *Settings* → *Environment Variables*), tambah satu per satu variabel `NEXT_PUBLIC_GISCUS_*`, lalu **Redeploy** supaya build membaca env baru.

3. **Lokal**  
   File harus bernama **`.env.local`** dan berada di **folder root** (sejajar `package.json`). Setelah mengubah env, **restart** `npm run dev`.

4. **Kategori `Q&A` di file .env**  
   Kalau ada masalah parsing, coba dengan tanda kutip: `NEXT_PUBLIC_GISCUS_CATEGORY="Q&A"`.

Di kode, konfigurasi **asrofinexq/komentar** juga diset sebagai **fallback bawaan** supaya widget tetap jalan walau env belum di set di server — tetap disarankan memakai env di dashboard deploy agar mudah diganti tanpa rebuild dari fork lain.

---

## Hubungkan ke proyek Next.js ini

### Langkah 1: Buat file `.env.local`

Di **root** proyek (folder yang sama dengan `package.json`), buat file **`.env.local`**.

Isi minimal (salin dan sesuaikan jika ID kamu berubah):

```env
NEXT_PUBLIC_GISCUS_REPO=asrofinexq/komentar
NEXT_PUBLIC_GISCUS_REPO_ID=R_kgDORx3uqQ
NEXT_PUBLIC_GISCUS_CATEGORY=Q&A
NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_kwDORx3uqc4C5XGN
NEXT_PUBLIC_GISCUS_MAPPING=pathname
```

- Variabel harus diawali **`NEXT_PUBLIC_`** agar terbaca di **browser** (widget Giscus jalan di client).
- **Jangan** commit `.env.local` ke Git jika kamu tidak ingin ID tersebar di histori publik (meskipun ID ini juga muncul di HTML/embed). Tambahkan `.env.local` di `.gitignore` (biasanya Next.js sudah mengabaikannya).

### Langkah 2: Restart server pengembangan

Setelah mengubah env:

```bash
npm run dev
```

Hentikan proses lama (Ctrl+C), jalankan lagi. Untuk build produksi:

```bash
npm run build
```

### Langkah 3: Cek di browser

1. Buka beranda (`/`).
2. Scroll ke section **Buku tamu** (`#guestbook`).
3. Harus muncul widget Giscus (bukan teks “Belum diaktifkan”).
4. Coba login GitHub dan kirim komentar uji.

---

## Perbedaan tema: wizard vs kode situs ini

Di wizard kamu memilih tema **“Skema warna pilihan”** (`preferred_color_scheme` = mengikuti sistem operasi/browser).

Di **`VisitorComments.tsx`**, tema widget diset agar **mengikuti toggle light/dark di situs** (class `dark` di `<html>`), lewat `data-theme` awal + `postMessage` ke iframe saat tema berubah. Itu supaya komentar **selaras** dengan mode terang/gelap portofolio, bukan hanya preferensi OS.

Jika kamu lebih suka **murni** `preferred_color_scheme` seperti di wizard, itu perlu penyesuaian kecil di komponen (buka issue atau ubah atribut `data-theme` dan hapus sinkronisasi observer).

---

## Pemetaan `pathname` — apa artinya untuk situsmu?

Dengan **`pathname`**:

- Halaman **`/`** → Giscus mencari/membuat diskusi yang judulnya terkait path **`/`** (biasanya beranda).
- Jika nanti kamu menaruh widget yang **sama** di **`/projects`**, akan ada diskusi **terpisah** untuk path itu.

Jadi setiap “halaman” (path) bisa punya **thread diskusi sendiri** tanpa mengatur nomor diskusi manual.

---

## Moderasi & keamanan

- **Edit / hapus / kunci** diskusi dan komentar dari tab **Discussions** repo `asrofinexq/komentar`.
- Atur **siapa yang bisa membuat diskusi** lewat kategori di GitHub — kategori **Q&A** sering dipakai dengan aturan kolaborator; untuk **hanya maintainer** yang buat topik baru, pertimbangkan kategori bertipe **Announcements** (sesuai saran di wizard Giscus). Kamu sudah memilih **Q&A** — pastikan aturan kategori sesuai keinginanmu.
- Giscus mendukung **penggunaan lanjutan** (mis. membatasi domain situs yang boleh embed); baca [dokumentasi advanced](https://github.com/giscus/giscus/blob/main/ADVANCED_USAGE.md).

---

## Migrasi dari Utterances / Issues

Jika sebelumnya pakai **Utterances** (Issues), kamu bisa **mengonversi issues ke Discussions** di GitHub, lalu sesuaikan **judul diskusi** dengan pemetaan halaman. Setelah cocok, Giscus akan memakai diskusi yang sudah ada.

---

## Troubleshooting

| Gejala | Yang dicek |
|--------|------------|
| Widget tidak muncul / “Belum diaktifkan” | Apakah `.env.local` ada di root, variabel `NEXT_PUBLIC_*` benar, server sudah di-restart? |
| Tidak bisa kirim komentar | App Giscus terpasang? Discussions aktif? Repo publik? |
| Diskusi tidak muncul di path tertentu | Pemetaan `pathname` — pastikan path halaman sama dengan yang diharapkan; cek tab Discussions di GitHub. |
| Tema tidak sesuai | Cek class `dark` di `document.documentElement` saat toggle tema di situs. |

---

## Referensi cepat

- Situs & wizard: [https://giscus.app](https://giscus.app)
- Repositori: [https://github.com/giscus/giscus](https://github.com/giscus/giscus)
- Komponen di proyek ini: `app/components/VisitorComments.tsx`
- Section UI: `app/page.tsx` (section **Buku tamu**, `id="guestbook"`)

Selamat mencoba — kalau ID dan env sudah benar, pengunjung bisa berkomentar langsung dari portofolio kamu.
