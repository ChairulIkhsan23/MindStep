# PRODUCT REQUIREMENT DOCUMENT (PRD)
## Mindstep: Habit Tracker & Journaling Platform

---

### 1. Tujuan Produk (Product Objectives)

* **Tujuan Utama**: Platform terpadu pembentukan kebiasaan harian dan refleksi diri berbasis AI dengan isolasi data ketat dan privasi penuh.
* **Problem Statement**:
  * Aplikasi habit tracker umum terpisah dari pencatatan emosi/jurnal; pengguna kehilangan konteks korelasi antara suasana hati dan konsistensi habit.
  * Aplikasi jurnal konvensional lambat (*high friction*) dan tidak menyediakan umpan balik reflektif yang aman.
  * Solusi AI eksisting sering melanggar batas privasi dan membuat klaim medis semu (*pseudo-clinical diagnosis*).
* **Core Value Proposition**:
  * *Low Friction Tracking*: Check-in habit dan mood dalam < 10 detik.
  * *Data-Driven Insights*: Analisis korelasi habit vs. mood berdasarkan data riil tanpa asumsi buatan.
  * *Safe & Consensual AI*: AI bertindak murni sebagai fasilitator refleksi (*thought partner*), non-destruktif, dan membutuhkan *explicit consent*.

---

### 2. Target Pengguna (User Persona)

| Parameter | Persona 1: The Goal-Oriented Builder | Persona 2: The Reflective Journaler |
| :--- | :--- | :--- |
| **Profil** | Profesional muda / mahasiswa (20–35 tahun), fokus disiplin dan produktivitas. | Individu fokus *mindfulness*, manajemen stres, dan kesehatan mental pribadi. |
| **Kebutuhan** | Butuh sistem pelacak habit fleksibel (target numerik, durasi, streak, rest days). | Butuh ruang tulis aman, cepat, terstruktur (template pertanyaan) atau bebas. |
| **Pain Points** | Frustrasi jika aplikasi kaku (misal: gagal streak karena rest day). | Khawatir privasi tulisan intim bocor ke pihak ketiga / model pelatihan AI. |
| **Ekspektasi** | Statistik akurat, visualisasi heatmap, ekspor data mandiri. | Ringkasan emosi mingguan, bantuan pemantik refleksi mendalam tanpa diagnosa klinis. |

---

### 3. Arsitektur & Tech Stack

* **Pola**: Modern Monolith (Single codebase, single database).
* **Backend**: Laravel 11/12 (PHP 8.3+), Eloquent ORM, Database Queue & Scheduler.
* **Frontend**: Inertia.js v2, React 18+, TypeScript, Tailwind CSS, shadcn/ui, Lucide Icons.
* **Database**: PostgreSQL / MySQL / SQLite (Development).
* **Editor**: Tiptap / BlockNote (Rich-text minimalis).
* **Visualisasi**: Recharts.

---

### 4. Persyaratan Fungsional (Functional Requirements)

#### Modul 1: Dashboard (Beranda Harian)
* **FR-1.1**: Sistem wajib menampilkan sapaan kontekstual dan tanggal aktif sesuai *timezone* profil pengguna.
* **FR-1.2**: Menampilkan daftar *actionable habits* yang dijadwalkan khusus pada hari berjalan.
* **FR-1.3**: Aksi 1-klik untuk habit *Boolean*; popover input instan untuk habit *Kuantitatif* dan *Durasi*.
* **FR-1.4**: Widget *Standalone Quick Mood Check-in* (skala 1–5 dan pilihan emosi) jika pengguna belum mencatat mood hari ini.
* **FR-1.5**: Tombol pintasan cepat ke draf jurnal terakhir dan pembuatan jurnal baru.
* **FR-1.6**: Mini-insight mingguan (rata-rata mood 7 hari dan persentase sukses habit).

#### Modul 2: Habit Management
* **FR-2.1**: CRUD kebiasaan dengan konfigurasi:
  * Tipe: `boolean`, `quantitative` (contoh: 8 gelas), `duration` (contoh: 30 menit).
  * Jadwal: `daily`, `specific_days` (misal: Sen, Rab, Jum), `weekly_target` (X kali per minggu).
* **FR-2.2**: Log harian habit disimpan dengan proteksi *unique constraint* kombinasi `habit_id` + `log_date`.
* **FR-2.3**: Mendukung *backdating* (pencatatan/koreksi nilai log di tanggal masa lalu).
* **FR-2.4**: Fitur Arsip (*archive/unarchive*); kebiasaan non-aktif tidak muncul di dashboard, riwayat historis tetap utuh.
* **FR-2.5**: Kalkulasi metrik: *Current Streak*, *Longest Streak*, dan *Completion Rate* berbasis jadwal valid.

#### Modul 3: Journaling
* **FR-3.1**: CRUD entri jurnal; mengizinkan >1 entri per hari.
* **FR-3.2**: Mendukung dua mode penulisan:
  * *Template-based*: Menggunakan pertanyaan panduan bawaan (*prompts*). Input opsional per pertanyaan.
  * *Freeform*: Bidang tulis bebas dengan formatting dasar (bold, italic, list, headings).
* **FR-3.3**: Status entri: `draft` atau `published`. Auto-save draft lokal/server.
* **FR-3.4**: Manajemen Tag multi-label per jurnal (bawaan sistem dan kustom pengguna).
* **FR-3.5**: Pencarian full-text (judul & isi) dan filter multi-kriteria (rentang tanggal, mood, emosi, tag, status).
* **FR-3.6**: Kalender jurnal bulanan dengan indikator visual mood tanpa *auto-fill* entri kosong.

#### Modul 4: Mood & Emotion Tracking
* **FR-4.1**: Skala mood terstandarisasi 1–5 (1: Sangat Buruk, 2: Buruk, 3: Netral, 4: Baik, 5: Sangat Baik).
* **FR-4.2**: Pilihan multi-emosi (kombinasi tag: Senang, Cemas, Lelah, Fokus, Tenang, dll.).
* **FR-4.3**: Integrasi ganda: mood dapat dicatat melekat pada entri jurnal ATAU sebagai log mandiri (*standalone*).
* **FR-4.4**: Linimasa riwayat mood dengan tautan langsung ke jurnal terkait jika ada.

#### Modul 5: Insights & Analytics
* **FR-5.1**: Filter rentang waktu: 7 Hari, 30 Hari, Bulan Berjalan, 3 Bulan, atau Custom Date Range.
* **FR-5.2**: Visualisasi Habit: Grafik tren mingguan/bulanan, daftar habit paling konsisten vs paling sering gagal.
* **FR-5.3**: Visualisasi Jurnal & Mood: Line chart pergerakan mood, bar chart distribusi skala mood, peringkat Top Emotions dan Top Tags, heatmap aktivitas.
* **FR-5.4**: Analisis Korelasi Silang: Perbandingan rata-rata mood pada hari habit 100% tuntas vs hari habit tidak tuntas.

#### Modul 6: AI Assistant (Non-Clinical Reflection)
* **FR-6.1 (Explicit Consent)**: Fitur AI non-aktif secara default sampai pengguna mengaktifkan toggle persetujuan kirim data teks.
* **FR-6.2 (Polish & Structure)**: Mengubah draf poin kasar menjadi narasi mengalir tanpa mengubah substansi fakta.
* **FR-6.3 (Deepening Prompts)**: Menghasilkan 2–3 pertanyaan pemantik lanjutan berdasarkan konteks jurnal terkini.
* **FR-6.4 (Periodic Summaries)**: Merangkum tema dan perkembangan pikiran dari kumpulan jurnal rentang waktu tertentu.
* **FR-6.5 (Non-Destructive UI)**: Output AI disajikan di panel samping (*sidebar drawer*); draf pengguna tidak pernah ditimpa otomatis.
* **FR-6.6 (Safety Disclaimer)**: Menyertakan penafian hukum permanen di bawah respons AI bahwa sistem bukan alat diagnostik medis.

#### Modul 7: Autentikasi, Pengaturan & Data Portability
* **FR-7.1**: Autentikasi lengkap (Register, Login, Logout, Forgot/Reset Password, Session Termination).
* **FR-7.2**: Strict Multi-Tenant Scoping: Setiap query DB wajib terikat `user_id` sesi aktif via Global Scope / Policy.
* **FR-7.3**: Pengaturan preferensi: Zona Waktu (IANA format), tema (Light/Dark).
* **FR-7.4**: Ekspor Data Lengkap (Habits, Logs, Journals, Moods) ke format JSON dan CSV.
* **FR-7.5**: Penghapusan Akun Permanen (Cascade delete semua relasi data) dengan verifikasi password.

---

### 5. Persyaratan Non-Fungsional (Non-Functional Requirements)

* **NFR-1: Performa**:
  * Response time API backend < 200 ms untuk 95% request (P95).
  * First Contentful Paint (FCP) dashboard < 1.2 detik pada koneksi standar.
* **NFR-2: Keamanan & Privasi**:
  * Enkripsi data *in-transit* (HTTPS/TLS 1.3) dan *at-rest*.
  * Strict Data Isolation: IDOR prevention di seluruh controller/policy.
  * Teks jurnal yang dikirim ke API AI tidak boleh menyertakan PII (Personally Identifiable Information) seperti nama asli, email, atau user ID.
* **NFR-3: Skalabilitas & Efisiensi Sumber Daya**:
  * Task scheduling dan kalkulasi streak berat diproses di background queue worker.
  * Single Monolith architecture siap dijalankan pada VPS minimal (1 vCPU, 2GB RAM).
* **NFR-4: Aksesibilitas & Responsivitas**:
  * Desain responsif penuh (Mobile-first, Tablet, Desktop).
  * Kontras warna memenuhi standar WCAG 2.1 AA.
  * Target sentuh tombol aksi minimal 44x44 px pada layar mobile.

---

### 6. Kriteria Penerimaan (Acceptance Criteria)

```gherkin
Scenario: Pengguna mencatat habit kuantitatif dari Dashboard
  Given Pengguna berada di Dashboard pada tanggal "2026-10-30"
  And Pengguna memiliki habit "Minum Air" dengan target "8 gelas"
  When Pengguna membuka popover habit "Minum Air" dan memasukkan angka "4"
  Then Sistem menyimpan log harian dengan habit_id terkait dan nilai aktual "4"
  And Status log berubah menjadi "Partial"
  And Persentase progres pada kartu habit menampilkan "50%"

Scenario: Pencegahan duplikasi log habit di tanggal yang sama
  Given Log habit untuk habit ID 5 pada tanggal "2026-10-30" sudah ada
  When Request pencatatan baru dikirim untuk habit ID 5 pada tanggal "2026-10-30"
  Then Sistem melakukan update (upsert) pada record yang ada tanpa membuat record duplikat

Scenario: Isolasi data antar pengguna
  Given Pengguna A memiliki entri jurnal dengan ID 101
  When Pengguna B mencoba mengakses rute "/journals/101"
  Then Sistem mengembalikan respon HTTP 403 Forbidden atau 404 Not Found

Scenario: Tata kelola persetujuan AI
  Given Pengguna belum mengaktifkan toggle "AI Consent" di Pengaturan
  When Pengguna menekan tombol "Minta Saran AI" di editor jurnal
  Then Sistem menampilkan modal persetujuan privasi data eksplisit
  And Sistem tidak mengirimkan payload teks ke API AI sebelum tombol "Saya Setuju" ditekan
```

---

### 7. Metrik Keberhasilan (Success Metrics / KPIs)

| Metrik | Definisi | Target |
| :--- | :--- | :--- |
| **D1 / D7 / D30 Retention** | Persentase pengguna yang kembali membuka aplikasi setelah hari ke-1, 7, dan 30. | D1 > 40%, D7 > 25%, D30 > 15% |
| **Check-in Friction Rate** | Waktu rata-rata yang dihabiskan pengguna menyelesaikan habit check-in di Dashboard. | < 15 detik |
| **Journaling Completion** | Rasio draf jurnal yang berhasil dipublikasikan (*published vs draft*). | > 70% |
| **Streak Adherence** | Rata-rata durasi streak aktif pengguna per habit terdaftar. | > 14 hari |
| **AI Feature Value** | Persentase pengguna yang menyimpan/menerapkan saran pemantik AI. | > 30% dari total pemanggilan AI |
| **Zero Data Leakage** | Insiden kebocoran data jurnal/IDOR antar-pengguna. | 0 Insiden (Toleransi Nol) |

---

### 8. Batasan Sistem & Out of Scope (Tahap Awal)

* Tidak ada integrasi sensor hardware / smartwatch pihak ketiga (Apple Health, Google Fit).
* Tidak ada fitur media sosial, berbagi progres ke publik, atau pertemanan (100% platform privat).
* AI tidak memberikan intervensi krisis kesehatan mental atau rujukan medis darurat.
* Ekspor data terbatas pada format tabular dan teks (JSON, CSV, Markdown); PDF layout majalah dievaluasi pada fase lanjutan.
