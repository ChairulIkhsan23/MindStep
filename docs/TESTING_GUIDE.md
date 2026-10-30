# Panduan & Strategi Pengujian (Testing Guide) — Mindstep Platform

> Status Dokumen: **Aktual** (Berdasarkan audit konfigurasi PHPUnit dan test suite per 29 Oktober 2026)  
> Referensi Dokumen Terkait: [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md), [`docs/DATABASE_SCHEMA.md`](./DATABASE_SCHEMA.md), [`docs/DEVELOPMENT_GUIDE.md`](./DEVELOPMENT_GUIDE.md)

---

## A. Test Framework dan Hirarki

Aplikasi Mindstep menggunakan **PHPUnit 12.5.42** sebagai framework pengujian otomatis backend.

```text
tests/
├── TestCase.php               # Base test case yang menginisialisasi aplikasi Laravel
├── Unit/                      # Pengujian logika murni tanpa dependensi HTTP/DB
│   └── ExampleTest.php
└── Feature/                   # Pengujian integrasi HTTP, database, auth, dan model
    ├── Auth/                  # Rangkaian uji autentikasi bawaan Breeze (8 file test)
    │   ├── AuthenticationTest.php
    │   ├── EmailVerificationTest.php
    │   ├── PasswordConfirmationTest.php
    │   ├── PasswordResetTest.php
    │   ├── PasswordUpdateTest.php
    │   └── RegistrationTest.php
    ├── ProfileTest.php        # Uji pembaruan profil & penghapusan akun
    ├── CoreModelsTest.php     # Uji relasi Eloquent & unique constraint habit_logs
    ├── DatabaseIndexingTest.php # Uji keberadaan composite index & performa query
    └── ExampleTest.php        # Uji status respons HTTP 200 halaman publik
```

### Hirarki & Peran Pengujian
* **Feature Tests (Prioritas Utama)**: Menguji interaksi penuh antara HTTP request, middleware, validasi Form Request, transaksi database, dan otorisasi. Seluruh skenario bisnis domain habit dan jurnal diuji di level ini.
* **Unit Tests**: Dikhususkan untuk unit fungsi independen yang tidak membutuhkan booting aplikasi Laravel atau koneksi database (misal: algoritma murni kalkulasi streak tanggal).

---

## B. Menjalankan Test

Berikut adalah perintah-perintah resmi yang didukung dan telah diverifikasi pada lingkungan repositori:

```bash
# 1. Menjalankan seluruh test suite secara ringkas (Recommended)
php artisan test --compact

# 2. Menjalankan file test spesifik
php artisan test --compact tests/Feature/CoreModelsTest.php
php artisan test --compact tests/Feature/DatabaseIndexingTest.php

# 3. Menjalankan pengujian dengan filter nama test tertentu
php artisan test --filter=test_habit_log_enforces_unique_habit_and_date

# 4. Menjalankan langsung via binary PHPUnit
vendor/bin/phpunit tests/Feature/CoreModelsTest.php

# 5. Menjalankan pemeriksaan format kode (Laravel Pint)
vendor/bin/pint --format agent
```

*Catatan Hasil Verifikasi*: Saat dokumen ini disusun, seluruh **31 tests** dengan **75 assertions** berada dalam status lulus (*Passed*).

---

## C. Database Testing & Isolasi Data

Konfigurasi database testing dikendalikan melalui berkas `phpunit.xml`:

```xml
<php>
    <env name="APP_ENV" value="testing"/>
    <env name="DB_CONNECTION" value="sqlite"/>
    <env name="DB_DATABASE" value=":memory:"/>
    <env name="QUEUE_CONNECTION" value="sync"/>
    <env name="CACHE_STORE" value="array"/>
    <env name="SESSION_DRIVER" value="array"/>
</php>
```

### Prinsip Keamanan & Isolasi
1. **In-Memory SQLite (`:memory:`)**: Setiap kali test suite dijalankan, database dibuat murni di RAM dan langsung dibuang setelah selesai. Hal ini menjamin bahwa database development (`database/database.sqlite` atau MySQL lokal) **tidak akan pernah tersentuh, terhapus, atau ter-reset**.
2. **Trait `RefreshDatabase`**: Digunakan di setiap kelas test feature untuk me-reset struktur tabel dan menjalankan migrasi secara otomatis sebelum setiap method pengujian dieksekusi.
3. **Pemanfaatan Model Factory**:
   * `UserFactory`: Tersedia dan aktif digunakan untuk membuat entitas user uji.
   * `HabitFactory`, `HabitLogFactory`, `JournalFactory`, `MoodLogFactory`, `TagFactory`: Berkas factory telah tersedia, namun blok definisinya masih kosong (`//`).
   * *Status*: Saat ini data uji pada `CoreModelsTest` dan `DatabaseIndexingTest` dibuat menggunakan `Model::create([...])` secara eksplisit. Pengisian definisi factory direkomendasikan untuk mempermudah penulisan test masa depan.

---

## D. Matriks Skenario Pengujian Wajib (Coverage Matrix)

Tabel berikut memetakan skenario uji esensial terhadap ketersediaan pengujian otomatis saat ini:

| No | Kategori Skenario | Kondisi Awal | Tindakan | Hasil yang Diharapkan | Status Coverage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **Autentikasi & Akses Tamu** | User belum login | Mengakses `GET /dashboard` atau `GET /profile` | Dialihkan ke `login` (HTTP 302) | **Covered** (`AuthenticationTest`) |
| 2 | **Pendaftaran Akun Baru** | Data registrasi valid | Mengirim `POST /register` | User tersimpan, terotentikasi, redirect ke dashboard | **Covered** (`RegistrationTest`) |
| 3 | **Pembaruan Profil & Password** | User terotentikasi | Mengirim `PATCH /profile` & `PUT /password` | Data user diperbarui | **Covered** (`ProfileTest`, `PasswordUpdateTest`) |
| 4 | **Penghapusan Akun Permanen** | User terotentikasi | Mengirim `DELETE /profile` dengan password benar | Akun dan data terkait terhapus bersih, session invalid | **Covered** (`ProfileTest`) |
| 5 | **Relasi Entitas Inti** | User dibuat | Membuat habit, log, jurnal, mood log | Relasi Eloquent tersambung akurat | **Covered** (`CoreModelsTest`) |
| 6 | **Pencegahan Duplikasi Log Harian** | Habit Log tanggal X sudah ada | Menyimpan Habit Log baru pada habit & tanggal X yang sama | Database melempar `QueryException` (Unique Violation) | **Covered** (`CoreModelsTest`) |
| 7 | **Verifikasi Composite Indeks** | Skema termigrasi | Query habit aktif, filter mood jurnal, lookup tag | Eksekusi query sukses menggunakan index yang valid | **Covered** (`DatabaseIndexingTest`) |
| 8 | **CRUD Habit via HTTP** | User login | Mengirim request Create, Read, Update, Delete Habit | Habit tersimpan terikat `auth()->id()`, status HTTP 303 | **Coverage Gap** *(Route & controller belum ada)* |
| 9 | **Penanganan Tipe Habit (Boolean/Kuantitatif/Durasi)** | Habit kuantitatif target 8 | Mengirim log aktual 4 | Status log otomatis berubah menjadi `partial` | **Coverage Gap** *(Logika bisnis belum ada)* |
| 10 | **Perhitungan Streak & Hari Istirahat** | Log berturut-turut pada hari terjadwal | Kalkulasi streak | Current streak bertambah, rest day tidak memutus streak | **Coverage Gap** *(Service streak belum ada)* |
| 11 | **Backdating Habit Log** | Tanggal lampau | Mengisi/mengoreksi log di H-3 | Log tanggal lampau tersimpan tanpa merusak log hari ini | **Coverage Gap** |
| 12 | **CRUD Jurnal & Pengelolaan Draf** | Jurnal tersimpan `is_draft = true` | Memperbarui menjadi `is_draft = false` | Status draf berubah menjadi publikasi | **Coverage Gap** |
| 13 | **Pencatatan Mood Terintegrasi vs Standalone** | Jurnal baru disimpan bersama skor mood | Simpan jurnal + mood log | `mood_logs.journal_id` terisi; log mandiri `journal_id` bernilai null | **Coverage Gap** |
| 14 | **Isolasi IDOR (Akses Silang Antar-User)** | User A memiliki Jurnal ID 10 | User B mengirim `PATCH /journals/10` | Sistem mengembalikan HTTP 403 Forbidden | **Coverage Gap** *(Policy belum ada)* |
| 15 | **Filter & Pencarian Jurnal** | 10 entri jurnal dengan tag beragam | Filter rentang tanggal dan tag | Hanya entri sesuai kriteria yang dikembalikan | **Coverage Gap** |
| 16 | **Persetujuan AI (Explicit Consent Gate)** | User belum setuju AI (`ai_consent = false`) | Memicu aksi AI prompt | Request ditolak sebelum payload teks dikirim ke vendor AI | **Coverage Gap** *(Fitur AI belum ada)* |

---

## E. Edge Cases dan Boundary Testing

Skenario batas yang harus diperhatikan dalam implementasi berikutnya:

1. **Target Nol atau Negatif**:
   * *Risiko*: Nilai `target_value` bernilai `0` atau minus dapat menyebabkan pembagian dengan nol (*division by zero error*) saat menghitung persentase progres.
   * *Aturan Validasi Wajib*: Form Request harus memberlakukan `['target_value' => 'required|numeric|gt:0']`.
2. **Batas Tanggal Mulai dan Akhir (`start_date` vs `end_date`)**:
   * *Aturan Validasi Wajib*: `end_date` harus nullable, namun jika diisi wajib `after_or_equal:start_date`.
3. **Pergantian Hari Berdasarkan Timezone**:
   * *Risiko*: User di zona waktu `Asia/Jakarta` (UTC+7) mencatat log pada pukul 01:00 dini hari. Jika server menggunakan UTC murni, tanggal akan tercatat sebagai hari kemarin, merusak keakuratan streak.
   * *Mitigasi*: Konversi waktu input menggunakan `$user->timezone` sebelum menentukan nilai kolom `log_date`.
4. **Rest Day & Jadwal Mingguan Fleksibel**:
   * *Risiko*: Habit dengan jadwal Senin-Jumat tidak boleh dianggap "gagal" atau memutus streak pada hari Sabtu dan Minggu (*rest days*).
5. **Race Condition pada Habit Logging**:
   * *Risiko*: Dua klik cepat (*double-submit*) pada tombol check-in berpotensi mengirim 2 request bersamaan.
   * *Mitigasi*: Database unique constraint `(habit_id, log_date)` sudah aktif sebagai pertahanan terakhir, namun controller wajib menggunakan `updateOrCreate` (*upsert*) untuk menangani idempotensi secara elegan.
