# Dokumen Rencana Implementasi: Modul Habit Management & Streak Tracking

> Nomor Dokumen: `PLAN-HABIT-001`  
> Tanggal: 30 Oktober 2026  
> Status: **Disetujui untuk Implementasi**  
> Target Branch: `feature/habit-management-tracking`  
> Referensi: [`docs/prd.md`](../prd.md) (Modul 2), [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md), [`docs/DATABASE_SCHEMA.md`](../DATABASE_SCHEMA.md), [`docs/PAGE_PROPS_SPEC.md`](../PAGE_PROPS_SPEC.md), [`docs/TESTING_GUIDE.md`](../TESTING_GUIDE.md)

---

## 1. Ringkasan Eksekutif & Tujuan

Tujuan dari rencana ini adalah membangun subsistem **Habit Management & Tracking** secara menyeluruh pada platform Mindstep, mencakup backend (domain service, controller, form request, policy, automated tests) hingga antarmuka frontend (Inertia React, modal interaktif, komponen tracking, streak milestones).

### Sasaran Utama:
1. **CRUD Kebiasaan Fleksibel**: Mendukung 3 tipe pengukuran (`boolean`, `quantitative`, `duration`) dan 3 tipe frekuensi (`daily`, `specific_days`, `weekly_target`).
2. **Idempotent Daily Logging**: Pencatatan log harian cepat (< 100ms) dengan pencegahan duplikasi data via composite unique key `(habit_id, log_date)` dan dukungan *backdating*.
3. **Streak Calculation Engine**: Penghitungan presisi untuk `current_streak`, `longest_streak`, dan `completion_rate`, dengan toleransi hari libur jadwal (*rest days*).
4. **Fitur Streak Freeze (Opsi A)**: Perlindungan kontinuitas kebiasaan saat keadaan darurat/sakit menggunakan kuota bulanan (maksimal 2 token per bulan per pengguna) tanpa merusak integritas riwayat.
5. **Multi-Tenant Data Isolation**: Menjamin seluruh data habit dan log terisolasi ketat sesuai `user_id` sesi aktif melalui `HabitPolicy`.

---

## 2. Arsitektur Data & Model

Skema tabel `habits` dan `habit_logs` telah terpasang di database dan siap digunakan.

### A. Tabel: `habits`
Menyimpan konfigurasi kebiasaan:
* `id`: BIGINT UNSIGNED PK
* `user_id`: BIGINT UNSIGNED FK (`users.id`, CASCADE)
* `name`: VARCHAR(255)
* `description`: TEXT NULLABLE
* `measurement_type`: VARCHAR(20) DEFAULT `'boolean'` (`boolean`, `quantitative`, `duration`)
* `target_value`: DECIMAL(10,2) DEFAULT `1.00`
* `unit`: VARCHAR(50) NULLABLE (contoh: `gelas`, `menit`, `halaman`)
* `frequency_type`: VARCHAR(20) DEFAULT `'daily'` (`daily`, `specific_days`, `weekly_target`)
* `scheduled_days`: JSON NULLABLE (array integer `[1..7]`, 1=Senin, 7=Minggu)
* `weekly_target_days`: UNSIGNED TINYINT NULLABLE (contoh: `4`)
* `start_date`: DATE
* `end_date`: DATE NULLABLE
* `color`: VARCHAR(30) DEFAULT `'#4f46e5'`
* `icon`: VARCHAR(50) NULLABLE (nama icon Lucide)
* `is_archived`: BOOLEAN DEFAULT `false`

### B. Tabel: `habit_logs`
Menyimpan riwayat eksekusi harian:
* `id`: BIGINT UNSIGNED PK
* `habit_id`: BIGINT UNSIGNED FK (`habits.id`, CASCADE)
* `user_id`: BIGINT UNSIGNED FK (`users.id`, CASCADE)
* `log_date`: DATE
* `actual_value`: DECIMAL(10,2) DEFAULT `0.00`
* `status`: VARCHAR(20) DEFAULT `'not_completed'` (`not_completed`, `partial`, `completed`, `rest_day`, `freeze`)
* `notes`: TEXT NULLABLE
* **Constraints**: UNIQUE `['habit_id', 'log_date']`, INDEX `['user_id', 'log_date']`

---

## 3. Logika Bisnis & Spesifikasi Mesin Streak

### A. Evaluasi Status Log Otomatis
Saat log dikirim melalui endpoint `/habits/{habit}/logs`:
1. **Tipe `boolean`**:
   * `actual_value >= 1.00` $\rightarrow$ `status = 'completed'`
   * `actual_value < 1.00` $\rightarrow$ `status = 'not_completed'`
2. **Tipe `quantitative` & `duration`**:
   * `actual_value >= target_value` $\rightarrow$ `status = 'completed'`
   * `0 < actual_value < target_value` $\rightarrow$ `status = 'partial'`
   * `actual_value == 0` $\rightarrow$ `status = 'not_completed'`
3. **Manual Status Override**:
   * Pengguna dapat memilih status khusus: `rest_day` atau `freeze`.

### B. Aturan Streak Freeze (Opsi A)
1. **Kuota Bulanan**: Maksimal 2 token `freeze` per pengguna per bulan kalender.
2. **Perhitungan Sisa Kuota**:
   $$\text{Sisa Token} = 2 - \text{Count}(\text{habit\_logs where } user\_id = X \text{ and status = 'freeze' and } \text{MONTH}(log\_date) = current\_month)$$
3. **Validasi Pemakaian**:
   * Menolak permintaan freeze jika sisa kuota $\le 0$.
   * Menolak jika digunakan $> 2$ hari berturut-turut pada kebiasaan yang sama.
4. **Efek terhadap Streak**:
   * Tanggal berstatus `freeze` mempertahankan streak (tidak menambah hitungan streak dan tidak memutus rantai).

### C. Algoritma Kalkulasi Streak (`StreakCalculationService`)
1. **Current Streak**:
   * Mulai dari **Hari Ini** (jika sudah `completed`).
   * Jika Hari Ini belum `completed`: status hari ini adalah `at_risk` (jika hari wajib) atau `resting` (jika hari libur jadwal), dan hitungan mundur dimulai dari **Kemarin**.
   * Rantai berlanjut jika:
     * Tanggal wajib berstatus `completed` $\rightarrow$ `streak += 1`.
     * Tanggal non-jadwal pada `specific_days` berstatus `rest_day` $\rightarrow$ pertahankan streak (`streak` tetap, tidak putus).
     * Tanggal berstatus `freeze` $\rightarrow$ pertahankan streak (`streak` tetap, tidak putus).
   * Rantai putus jika ditemukan tanggal wajib tanpa log atau berstatus `not_completed` / `partial`.
2. **Longest Streak**:
   * Iterasi riwayat dari `start_date` sampai sekarang untuk menemukan rantai hari berurutan terpanjang.
3. **Completion Rate**:
   $$\text{Completion Rate} = \left( \frac{\text{Jumlah Hari Sukses (Completed)}}{\text{Total Hari Wajib Jadwal Aktif}} \right) \times 100\%$$

### D. Kategori Milestone Streak
* **Level 1 (Spark)**: 1 – 3 Hari (`Memulai`)
* **Level 2 (Momentum)**: 4 – 7 Hari (`Membangun Ritme`)
* **Level 3 (Formation)**: 8 – 21 Hari (`Membentuk Pola`)
* **Level 4 (Consistency)**: 22 – 65 Hari (`Konsisten`)
* **Level 5 (Automaticity)**: 66 – 99 Hari (`Otomatis`)
* **Level 6 (Mastery)**: 100+ Hari (`Mastery`)

---

## 4. Kontrak Rute & REST API

```php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/habits', [HabitController::class, 'index'])->name('habits.index');
    Route::post('/habits', [HabitController::class, 'store'])->name('habits.store');
    Route::put('/habits/{habit}', [HabitController::class, 'update'])->name('habits.update');
    Route::delete('/habits/{habit}', [HabitController::class, 'destroy'])->name('habits.destroy');
    Route::post('/habits/{habit}/archive', [HabitController::class, 'archive'])->name('habits.archive');
    Route::post('/habits/{habit}/unarchive', [HabitController::class, 'unarchive'])->name('habits.unarchive');

    Route::post('/habits/{habit}/logs', [HabitLogController::class, 'store'])->name('habits.logs.store');
    Route::delete('/habits/{habit}/logs/{date}', [HabitLogController::class, 'destroy'])->name('habits.logs.destroy');
});
```

### Data Props Halaman `Habits/Index` (`Inertia::render`)
* `habits`: Daftar objek kebiasaan aktif/terfilter beserta log hari ini dan ringkasan metrik streak.
* `archived_count`: Jumlah kebiasaan yang diarsipkan.
* `freeze_credits_remaining`: Sisa kuota freeze bulan ini (0–2).
* `filter_date`: Tanggal aktif tampilan (default: hari ini di timezone pengguna).

---

## 5. Rencana Pengujian Otomatis (Testing Strategy)

### A. Unit Tests (`tests/Unit/StreakCalculationServiceTest.php`)
1. Penghitungan streak harian bertambah saat sukses berurutan.
2. Rest day resmi pada jadwal `specific_days` tidak merusak streak.
3. Status `freeze` mempertahankan streak tanpa menambah counter.
4. Hari wajib yang terlewat mereset current streak menjadi 0.
5. Toleransi grace period hari berjalan (kemarin sukses, hari ini belum check-in).
6. Kalkulasi kuota bulanan `freeze_credits` (maksimal 2 per bulan).
7. Penolakan token freeze ketiga dalam bulan yang sama.

### B. Feature Tests (`tests/Feature/Habit/HabitManagementTest.php`)
1. User dapat membuat habit dengan berbagai tipe pengukuran dan jadwal.
2. User dapat memperbarui konfigurasi habit.
3. User dapat mengarsipkan dan mengaktifkan kembali habit.
4. User dapat menghapus habit (cascade menghapus seluruh riwayat log).
5. User A dilarang mengakses, mengubah, atau menghapus habit User B (Policy 403/404).

### C. Feature Tests (`tests/Feature/Habit/HabitLoggingTest.php`)
1. Check-in 1-klik untuk habit boolean menyimpan log `completed` secara idempotent.
2. Input parsial menghasilkan status `partial`, input penuh menghasilkan `completed`.
3. Penolakan pencatatan log pada tanggal di masa depan (*future date*).
4. Penolakan pencatatan log sebelum `start_date` habit.
5. Dukungan *backdating* pada tanggal masa lalu yang valid.

---

## 6. Tahapan Eksekusi Terurut (Work Breakdown)

```
[Tahap 1: Backend Foundation]
  ├── Form Requests: StoreHabitRequest, UpdateHabitRequest, LogHabitRequest
  ├── Policy: HabitPolicy
  ├── Service: StreakCalculationService
  ├── Controllers: HabitController & HabitLogController
  └── Routes: web.php

[Tahap 2: Automated Tests Backend]
  ├── tests/Unit/StreakCalculationServiceTest.php
  ├── tests/Feature/Habit/HabitManagementTest.php
  └── tests/Feature/Habit/HabitLoggingTest.php

[Tahap 3: Frontend Implementation]
  ├── TypeScript Types: resources/js/types/habit.d.ts
  ├── Pages: resources/js/Pages/Habits/Index.tsx
  ├── Modals: CreateHabitModal.tsx, EditHabitModal.tsx, QuickLogModal.tsx
  └── Components: HabitCard.tsx, StreakBadge.tsx, FreezeTokenButton.tsx

[Tahap 4: Quality & Verification]
  ├── php artisan test --compact (Semua test hijau)
  ├── vendor/bin/pint --format agent (Format standar Laravel Pint)
  └── npm run build (Asset bundle tanpa error)
```
