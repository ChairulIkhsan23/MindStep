# Mindstep — Habit Tracker & Journaling Platform

> Platform pengembangan diri (*self-development*) berbasis web yang memadukan pelacakan kebiasaan harian, pencatatan jurnal terstruktur & bebas, pemantauan tren emosi, serta refleksi diri mendalam berbantuan AI dengan kendali privasi penuh (*privacy-first*).

---

## Daftar Isi
- [Gambaran Umum](#gambaran-umum)
- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Struktur Database & Relasi](#struktur-database--relasi)
- [Panduan Instalasi & Menjalankan Aplikasi](#panduan-instalasi--menjalankan-aplikasi)
- [Pengujian (Testing)](#pengujian-testing)
- [Tata Kelola Keamanan & Privasi](#tata-kelola-keamanan--privasi)
- [Dokumentasi Lengkap](#dokumentasi-lengkap)
- [Lisensi](#lisensi)

---

## Gambaran Umum

Mindstep dirancang untuk menjembatani kesenjangan antara pelacakan produktivitas (*habit tracking*) dan kesehatan mental (*journaling & mood tracking*). Dengan menyatukan kedua data ini secara jujur (*data-driven*), pengguna dapat memahami korelasi nyata antara kebiasaan harian dan fluktuasi suasana hati mereka.

### Nilai Utama (Core Value Proposition)
1. **Low Friction**: Check-in habit, mood, dan draf jurnal harian selesai dalam hitungan detik.
2. **Multi-User & Terisolasi**: Isolasi data penuh antar-pengguna (*strict user scoping*).
3. **Fleksibel**: Mendukung jurnal terpandu (*template prompts*) dan jurnal bebas (*freeform*).
4. **AI Reflektif Berbasis Persetujuan**: Bantuan AI bertindak sebagai teman berpikir (*thought partner*), non-destruktif, tanpa klaim klinis semu, dan memerlukan persetujuan eksplisit (*explicit consent*).

---

## Fitur Utama

### 1. Dashboard Harian (Daily Command Center)
- Ringkasan tanggal aktif berbasis zona waktu pengguna (*timezone-aware*).
- Daftar kebiasaan yang terjadwal hari ini (*today's actionable habits*).
- 1-klik check-in untuk habit boolean; quick-input modal untuk habit kuantitatif dan durasi.
- Widget *Quick Mood Check-in* (skala 1–5 & tag emosi) tanpa harus menulis jurnal panjang.
- Pintasan langsung ke draf jurnal terakhir dan entri baru.
- Kartu *Mini Insights* (rata-rata mood 7 hari dan persentase sukses habit).

### 2. Habit Management
- **Tipe Pengukuran**:
  - `Boolean`: Selesai (1) / Belum Selesai (0).
  - `Quantitative`: Target angka dan satuan kustom (misal: 8 gelas, 20 halaman).
  - `Duration`: Lama waktu aktivitas (misal: 30 menit, 1 jam).
- **Penjadwalan Fleksibel**: Harian (*daily*), hari-hari tertentu dalam seminggu (*specific days*), atau target frekuensi mingguan (*weekly target*).
- **Integritas Log**: Unique constraint `(habit_id, log_date)` di level database guna mencegah duplikasi.
- **Kalkulasi Metrik**: *Current Streak*, *Longest Streak*, dan *Completion Rate*.
- **Siklus Hidup**: Fitur Arsip (*archive/unarchive*) untuk menyembunyikan habit tanpa menghilangkan riwayat historis.

### 3. Journaling
- Mendukung multi-entri per hari dengan mode baca bersih (*distraction-free*).
- **Template-Based**: Panduan pertanyaan terstruktur (Refleksi Malam, Gratitude, Evaluasi Mingguan).
- **Freeform**: Ruang tulis bebas dengan formatting esensial.
- **Status Entri**: Pengelolaan draf (*draft*) dan publikasi (*published*).
- **Kategori & Tag**: Tag bawaan sistem dan tag kustom pengguna.
- **Pencarian & Filter**: Pencarian teks penuh, filter berdasarkan mood, rentang tanggal, status, dan tag.
- **Kalender Jurnal**: Tampilan bulanan dengan indikator visual mood harian.

### 4. Mood & Emotion Tracking
- Skala suasana hati standar 1–5 (Sangat Buruk, Buruk, Netral, Baik, Sangat Baik).
- Pemilihan multi-emosi (Senang, Cemas, Lelah, Fokus, Tenang, Bersyukur, dll.).
- Pencatatan ganda: Melekat pada entri jurnal ATAU log mandiri (*standalone*).
- Linimasa perubahan mood dengan tautan langsung ke jurnal terkait.

### 5. Insights & Analytics
- Visualisasi tren konsistensi kebiasaan dan pergerakan suasana hati.
- Analisis korelasi silang: Perbandingan rata-rata mood pada hari habit tuntas 100% vs hari tanpa habit.
- Peringkat emosi paling sering muncul (*Top Emotions*) dan topik kehidupan teratas (*Top Tags*).

### 6. AI Assistant (Refleksi Pintar)
- **Writing Polish**: Merapikan catatan kasar menjadi paragraf rapi tanpa mengubah esensi.
- **Deepening Prompts**: 2–3 pertanyaan refleksi lanjutan berdasarkan isi tulisan pengguna.
- **Rangkuman Berkala**: Ringkasan tema mingguan atau bulanan dari kumpulan jurnal.
- **AI Guardrails**:
  - *Explicit Consent*: Wajib disetujui pengguna sebelum teks dikirim ke AI API.
  - *Non-Destructive*: Output AI ditampilkan di panel samping tanpa menimpa naskah asli.
  - *Non-Clinical Disclaimer*: Penafian permanen bahwa AI bukan alat diagnostik medis.

### 7. Keamanan & Pengaturan Akun
- Autentikasi aman (Register, Login, Password Reset, Session Management).
- Preferensi profil: Zona Waktu (IANA format), Tema (Light/Dark).
- Ekspor data pribadi (JSON, CSV).
- Penghapusan akun permanen (*cascade delete*).

---

## Tech Stack

| Layer | Teknologi |
| :--- | :--- |
| **Backend Framework** | Laravel 11/12 (PHP 8.3+) |
| **Frontend Framework** | React 18+ (TypeScript) |
| **Monolith Bridge** | Inertia.js v2 |
| **Styling & UI** | Tailwind CSS + Lucide Icons |
| **Database** | PostgreSQL / MySQL / SQLite |
| **Queue & Scheduling**| Laravel Queue & Task Scheduler |
| **Testing** | PHPUnit (Feature & Unit) |

---

## Struktur Database & Relasi

```text
users
 ├── habits (1:N)
 │    └── habit_logs (1:N) [unique: habit_id + log_date]
 ├── journals (1:N)
 │    ├── mood_logs (1:1 opsional)
 │    └── journal_tag (N:M pivot ke tags)
 ├── mood_logs (1:N) [bisa standalone tanpa journal_id]
 └── tags (1:N custom tags, atau user_id null untuk default system)
```

Telah dilengkapi optimasi indeks:
- `habits`: `(user_id, is_archived, start_date)`
- `journals`: `(user_id, mood_score)`, `(user_id, entry_date)`, `(user_id, is_draft)`
- `journal_tag`: `(tag_id)`
- `habit_logs`: `(user_id, log_date)`

---

## Panduan Instalasi & Menjalankan Aplikasi

### 1. Prasyarat
- PHP >= 8.3 (dengan ekstensi `pdo`, `mbstring`, `openssl`, `tokenizer`, `xml`, `sqlite3` atau `pdo_mysql`/`pdo_pgsql`)
- Composer >= 2.x
- Node.js >= 18.x & npm

### 2. Kloning & Instal Dependensi
```bash
# Salin file konfigurasi environment
cp .env.example .env

# Instal dependensi PHP
composer install

# Instal dependensi Frontend
npm install --legacy-peer-deps
```

### 3. Konfigurasi Aplikasi & Database
```bash
# Generate application encryption key
php artisan key:generate

# Jalankan migrasi database beserta seeder awal
php artisan migrate --seed
```

### 4. Menjalankan Server Pengembangan
Jalankan kedua perintah berikut di terminal terpisah atau gunakan concurrently:

```bash
# Terminal 1: Backend Laravel
php artisan serve

# Terminal 2: Vite Dev Server
npm run dev
```

Buka peramban di `http://localhost:8000`.

---

## Pengujian (Testing)

Proyek ini menerapkan pengujian otomatis berbasis PHPUnit untuk memastikan integritas logika bisnis, isolasi multi-tenant, dan batasan constraint database.

```bash
# Menjalankan seluruh test suite
php artisan test --compact

# Menjalankan test modul spesifik
php artisan test --compact tests/Feature/CoreModelsTest.php
php artisan test --compact tests/Feature/DatabaseIndexingTest.php

# Memeriksa dan memformat standar kode PHP (Laravel Pint)
vendor/bin/pint --format agent
```

---

## Tata Kelola Keamanan & Privasi

1. **Strict Multi-Tenant Scoping**: Setiap kueri Eloquent disaring berdasarkan `user_id` yang terautentikasi untuk mencegah kerentanan IDOR (*Insecure Direct Object Reference*).
2. **AI Privacy & Consent**: Fitur AI non-aktif secara bawaan. Data teks jurnal tidak dikirim ke API eksternal tanpa izin sadar dari pengguna di menu Pengaturan. Data PII (nama, email, user ID) dihilangkan sebelum teks diproses oleh model bahasa.
3. **Data Portability**: Pengguna memiliki hak penuh untuk mengunduh seluruh arsip data mereka atau menghapus akun secara permanen (*Right to be Forgotten*).

---

## Dokumentasi Lengkap
Spesifikasi produk, acceptance criteria, dan metrik KPI rinci dapat ditinjau di berkas:
- [`docs/prd.md`](docs/prd.md)

---

## Lisensi
Aplikasi ini dikembangkan di bawah lisensi terbuka [MIT License](LICENSE).
