# Spesifikasi Rancangan: Interactive Hybrid Landing Page (Welcome.tsx)

> Nomor Dokumen: `SPEC-UI-LANDING-001`  
> Tanggal: 30 Oktober 2026  
> Status: **Final Disetujui (Tahap Perancangan)**  
> Target File: `resources/js/Pages/Welcome.tsx`, `resources/js/Components/Landing/*`  
> Referensi: [`docs/prd.md`](../prd.md) (Modul 1 s.d 7), [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md)

---

## 1. Ringkasan Eksekutif & Filosofi Desain

Landing Page Mindstep mengadopsi model **Interactive Hybrid (Semi-Dinamis)**:
- **Konten Statis (Zero Database Overhead)**: Copywriting, penjelasan fitur bento grid, filosofi AI, dan jaminan keamanan disajikan di frontend secara cepat dan efisien.
- **Interaktivitas Dinamis di Client**: Menyertakan **Interactive Micro-Demo** (pengunjung dapat mencoba check-in dummy habit dan memilih skala mood secara langsung di browser tanpa registrasi) untuk mendemonstrasikan prinsip *Low Friction Tracking* (< 10 detik).
- **Context-Aware Auth State**: Navigasi dan Call-To-Action (CTA) beradaptasi otomatis terhadap status autentikasi pengunjung (menampilkan `Mulai Sekarang` jika Guest, atau `Buka Dashboard →` jika sudah Login).

---

## 2. Rincian 7 Section Final

### Section 1: Sticky Navigation Bar
* **Kiri**: Logo Mindstep + Tipografi Brand (`Mindstep`).
* **Tengah (Desktop)**: Smooth scroll anchors: `#features` (Fitur), `#ai-partner` (Filosofi AI), `#privacy` (Kedaulatan Data).
* **Kanan**:
  * Dark/Light mode toggle switch.
  * *Jika Guest*: Tombol `Masuk` (ghost/outline) dan `Daftar Gratis` (solid primary).
  * *Jika Auth*: Tombol `Ke Dashboard →` (solid primary).

### Section 2: Hero Section dengan Interactive Micro-Demo
* **Kiri (Copywriting & Value Proposition)**:
  * Headline: *"Bangun Kebiasaan Baik, Pahami Diri Lebih Dalam Tanpa Rasa Bersalah."*
  * Subheadline: *"Platform terpadu pelacak habit fleksibel dan jurnal refleksi harian bertenaga AI etis. Selesai dalam waktu kurang dari 10 detik per hari."*
  * Dual CTA: `Mulai Refleksi Sekarang (Gratis)` dan `Jelajahi Fitur ↓`.
  * Micro-trust badges: *100% Data Sovereignty*, *Non-Clinical Safe AI*, *No Credit Card Required*.
* **Kanan (Interactive Playground Widget)**:
  * Mini Card interaktif berbasis client-state React:
    1. **Dummy Habit Checklist**: Dua kebiasaan contoh (e.g. *"Lari Pagi 15 Menit"*, *"Minum Air 2 Liter"*). Klik menghasilkan checklist animasi instan & counter streak naik.
    2. **Quick Mood Slider/Selector**: Skala 1–5 dengan visual emoji & pilihan emotion tag (e.g. *Fokus*, *Bersyukur*).
    3. Feedback instan: Banner mini *"Refleksi hari ini tuntas dalam 8 detik!"*.

### Section 3: Problem vs. Mindstep Solution (The Contrast Grid)
* 3 Kolom perbandingan tajam antara rasa frustrasi umum vs. solusi Mindstep:
  1. *Streak Frustration*: Patah streak karena lupa sehari vs. **Flexible Streaks & Rest Days**.
  2. *Blank Page Paralysis*: Bingung mau menulis apa di jurnal kosong vs. **Dynamic Guided Templates**.
  3. *Privacy Anxiety*: Kekhawatiran catatan intim bocor ke pihak ketiga vs. **Multi-Tenant Strict Isolation & Safe AI**.

### Section 4: Core Features Bento Grid
* Tata letak asimetris (Bento Grid) yang modern dan informatif:
  * **Card 1 (Besar)**: *Habit Engine* (Visualisasi boolean, target numerik, dan durasi).
  * **Card 2 (Sedang)**: *Mood & Emotion Sync* (Korelasi suasana hati langsung di jurnal).
  * **Card 3 (Sedang)**: *Dynamic Admin Templates* (Stoic, CBT, Gratitude, dan Weekly Review).
  * **Card 4 (Besar)**: *Cross-Correlation Analytics* (Grafik perbandingan mood saat habit tuntas vs. tidak).

### Section 5: Safe & Reflective AI Assistant Spotlight
* **Filosofi Inti**: *"Mitra Pemantul Pikiran, Bukan Pengganti Tenaga Medis."*
* **3 Kapabilitas Utama**:
  1. *Polish Draft*: Merapikan catatan draf poin kasar tanpa menambah fakta fiktif.
  2. *Deepening Prompts*: 3 pertanyaan pemantik filosofis untuk memancing akar masalah.
  3. *Periodic Synthesis*: Rangkuman pola emosional dan tema pikiran 7/30 hari.
* **3 Batasan Etika Permanen**:
  - *Explicit Consent*: Nonaktif sampai pengguna menyalakan izin secara sadar.
  - *PII Sanitization*: Nama dan email disensor otomatis sebelum dikirim ke LLM.
  - *Non-Clinical Disclaimer*: Penafian medis resmi selalu disertakan.

### Section 6: Data Sovereignty & Portability (Trust Anchor)
* Menampilkan komitmen privasi pengguna:
  * Ekspor lengkap mandiri kapan saja (format JSON dan CSV ZIP).
  * Tidak ada penguncian data (*Zero vendor lock-in*).
  * Opsi hapus akun permanen dalam 1 klik.

### Section 7: Final Conversion CTA & Minimalist Footer
* **Closing Call-To-Action**:
  * Banner penutup: *"Mulai langkah kecil menuju hidup yang lebih berkesadaran hari ini."*
  * Tombol CTA ukuran besar menuju registrasi.
* **Footer**:
  * Disclaimer Hukum Medis Permanen (PRD FR-6.6).
  * Tautan copyright & navigasi cepat.

---

## 3. Komponen Frontend Baru yang Dibutuhkan

Untuk menjaga kode modular dan mudah dipelihara:
```text
resources/js/
├── Pages/
│   └── Welcome.tsx (Main landing page container)
├── Components/
│   └── Landing/
│       ├── LandingNavbar.tsx
│       ├── HeroInteractiveWidget.tsx (Demo interaktif habit + mood)
│       ├── ProblemSolutionGrid.tsx
│       ├── FeaturesBentoGrid.tsx
│       ├── AiAssistantSpotlight.tsx
│       ├── DataPortabilityBanner.tsx
│       └── LandingFooter.tsx
```

---

## 4. Rencana Pengujian Otomatis

File Test: `tests/Feature/Landing/LandingPageTest.php`
1. Halaman `/` dapat diakses pengunjung umum (HTTP 200).
2. Menampilkan tombol registrasi dan login saat pengunjung berstatus Guest.
3. Menampilkan tombol pintasan Dashboard saat pengunjung sudah terautentikasi (Auth).
4. Seluruh copy penting (value prop, disclaimer medis AI, fitur kedaulatan data) ter-render dengan benar.
