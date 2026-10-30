# Dokumen Rencana Implementasi: Modul Data Portability & Export

> Nomor Dokumen: `PLAN-EXPORT-001`  
> Tanggal: 30 Oktober 2026  
> Status: **Disetujui untuk Implementasi Langsung**  
> Target Branch: `feature/data-portability-export`  
> Referensi: [`docs/prd.md`](../prd.md) (Modul 7: FR-7.4), [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md), [`docs/DATABASE_SCHEMA.md`](../DATABASE_SCHEMA.md), [`docs/TESTING_GUIDE.md`](../TESTING_GUIDE.md)

---

## 1. Ringkasan Eksekutif & Sasaran

Modul **Data Portability & Export** mengimplementasikan hak kedaulatan data pengguna (*data portability / GDPR compliance*) pada platform Mindstep. Modul ini memungkinkan pengguna mengunduh seluruh data historis mereka (kebiasaan, log check-in, catatan suasana hati, entri jurnal, dan tag) dalam format terstruktur: **JSON tunggal** atau **kumpulan berkas CSV dalam arsip ZIP**.

### Sasaran Utama:
1. **Ekspor Format JSON (`/export/json`)**:
   - Berkas `.json` hierarkis tunggal mencakup metadata pengguna (tanpa kredensial sensitif), daftar habits, habit logs, mood logs, dan journals beserta tags terkait.
2. **Ekspor Format CSV (`/export/csv`)**:
   - Berkas `.zip` berisi 4 berkas CSV terpisah: `habits.csv`, `habit_logs.csv`, `mood_logs.csv`, dan `journals.csv`.
3. **Efisiensi Memori (Low-Memory Footprint)**:
   - Menggunakan stream response native PHP (`php://temp` dan `ZipArchive`) untuk menghindari konsumsi RAM berlebih.
4. **Isolasi Multi-Tenant Ketat**:
   - Memastikan 100% data yang diekspor terikat secara eksplisit pada `auth()->id()`. Data pengguna lain tidak boleh bocor.
5. **Sanitasi Kredensial**:
   - Kolom `password`, `remember_token`, hash OTP, dan id sesi sistem diabaikan.

---

## 2. Arsitektur Komponen Backend

1. **`DataExportService.php` (`app/Services/DataExportService.php`)**:
   - Mengambil data seluruh entitas milik pengguna aktif.
   - Metode `exportJson(User $user)`: Memformat array hierarkis dan mengembalikan string JSON.
   - Metode `exportCsvZip(User $user)`: Menghasilkan berkas arsip zip temporer berisi 4 file CSV.
2. **`DataExportController.php` (`app/Http/Controllers/DataExportController.php`)**:
   - Endpoint `GET /export/json` dengan header download attachment `application/json`.
   - Endpoint `GET /export/csv` dengan header download attachment `application/zip`.
3. **Routing**: Didaftarkan di `routes/web.php` dalam middleware group `['auth', 'verified']`.

---

## 3. Rencana Pengujian Otomatis

### File Test: `tests/Feature/Export/DataExportTest.php`
1. Guest dialihkan ke halaman login saat mengakses rute ekspor.
2. Pengguna belum verifikasi email dialihkan ke notice verifikasi.
3. User dapat mengunduh berkas ekspor JSON lengkap dengan struktur metadata, habits, habit_logs, mood_logs, dan journals.
4. User dapat mengunduh berkas arsip ZIP berisi 4 berkas CSV (`habits.csv`, `habit_logs.csv`, `mood_logs.csv`, `journals.csv`).
5. Ekspor JSON dan CSV tidak membocorkan data pengguna lain (*multi-tenant isolation*).
6. Ekspor JSON tidak menyertakan kolom sensitif (`password`, `remember_token`).
