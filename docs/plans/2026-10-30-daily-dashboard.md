# Dokumen Rencana Implementasi: Modul Dashboard Harian (Daily Hub)

> Nomor Dokumen: `PLAN-DASHBOARD-001`  
> Tanggal: 30 Oktober 2026  
> Status: **Disetujui untuk Implementasi**  
> Target Branch: `feature/daily-dashboard-hub`  
> Referensi: [`docs/prd.md`](../prd.md) (Modul 1: FR-1.1 s.d FR-1.6), [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md), [`docs/DATABASE_SCHEMA.md`](../DATABASE_SCHEMA.md), [`docs/PAGE_PROPS_SPEC.md`](../PAGE_PROPS_SPEC.md), [`docs/TESTING_GUIDE.md`](../TESTING_GUIDE.md)

---

## 1. Ringkasan Eksekutif & Sasaran

**Dashboard Harian (*Daily Hub*)** adalah beranda utama saat pengguna masuk ke aplikasi. Berfungsi sebagai agregator fokus harian (*actionable focal point*) tanpa membebani pengguna dengan grafik statistik rumit. Layar ini menyajikan sapaan hangat, daftar aksi kebiasaan hari ini, pintasan draf jurnal, widget pencatatan emosi kilat, dan mini-insight 7 hari terakhir.

### Sasaran Utama:
1. **Sapaan Kontekstual & Tanggal Aktif (FR-1.1)**:
   - Menghitung waktu lokal berdasarkan `user.timezone` (default `UTC`).
   - Sapaan dinamis berdasarkan jam: Pagi (05:00–11:59), Siang (12:00–14:59), Sore (15:00–18:59), Malam (19:00–04:59).
   - Format tanggal lokal bahasa Indonesia (contoh: *Jumat, 30 Oktober 2026*).
2. **Actionable Habits Hari Ini (FR-1.2 & FR-1.3)**:
   - Mengambil seluruh habit aktif (`is_archived = false`) yang relevan dengan hari ini (jadwal harian, jadwal hari spesifik yang cocok, atau target mingguan).
   - Mengambil status log hari ini (`completed`, `in_progress`, `freeze`, `unlogged`).
   - Menyediakan data streak aktif, indikator risiko putus streak (*at risk*), dan progress target harian.
3. **Widget Quick Mood Check-in (FR-1.4)**:
   - Jika pengguna **belum mencatat mood hari ini**: kirimkan `today_mood = null` untuk memicu widget input cepat (< 10 detik).
   - Jika pengguna **sudah mencatat mood hari ini**: kirimkan daftar log emosi hari ini (skor, emosi, catatan).
4. **Pintasan Cepat Jurnal (FR-1.5)**:
   - Menampilkan draf jurnal terakhir (`is_draft = true`) milik pengguna (judul, tanggal, excerpt) sebagai pengingat untuk melanjutkan tulisan.
   - Menyediakan tautan cepat membuat jurnal baru.
5. **Mini-Insight 7 Hari Terakhir (FR-1.6)**:
   - Rata-rata skor mood 7 hari bergulir (`weekly_mood_average`).
   - Persentase penyelesaian habit 7 hari bergulir (`weekly_habit_completion_rate`).

---

## 2. Arsitektur Data & Aliran Query

Dashboard mengonsolidasikan data dari 3 model domain yang sudah terbangun:

```
                  ┌───────────────────────────────┐
                  │    DashboardController@index  │
                  └───────────────┬───────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
[ Habit + StreakService ]   [ MoodLog Model ]      [ Journal Model ]
• Habits aktif hari ini     • Status log hari ini  • Draf terakhir
• Log & progress hari ini   • Rata-rata 7 hari     • Total jurnal terbit
• % Habit sukses 7 hari     • Emosi dominan
```

### Optimasi Query:
* Menggunakan *eager loading* relasi: `Habit::with(['logs' => fn($q) => $q->whereDate('log_date', $today)])`.
* Tanpa N+1 query pada perhitungan habit completion rate: mengambil seluruh log 7 hari dalam 1 query rentang tanggal.

---

## 3. Spesifikasi Kontrak Halaman & Inertia Props

Rute bawaan closure di `routes/web.php`:
```php
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');
```

### Struktur Props Inertia (`Dashboard.tsx`):
```typescript
interface ActionableHabitItem {
    id: number;
    name: string;
    description: string | null;
    color: string;
    icon: string;
    measurement_type: 'boolean' | 'quantitative' | 'duration';
    target_value: number;
    unit: string | null;
    frequency_type: 'daily' | 'specific_days' | 'weekly_target';
    today_log: {
        id: number | null;
        current_value: number;
        status: 'completed' | 'in_progress' | 'freeze' | 'unlogged';
    };
    stats: {
        current_streak: number;
        is_at_risk: boolean;
        level: number;
        level_name: string;
    };
}

interface DashboardProps {
    greeting: {
        message: string; // "Selamat Pagi, [Nama]"
        date_formatted: string; // "Jumat, 30 Oktober 2026"
    };
    habits: {
        summary: {
            total_today: number;
            completed_today: number;
            progress_percent: number; // 0 - 100
        };
        items: ActionableHabitItem[];
    };
    mood: {
        has_logged_today: boolean;
        today_logs: Array<{
            id: number;
            mood_score: number;
            emotions: string[] | null;
            note: string | null;
        }>;
        available_emotions: string[];
    };
    journal: {
        latest_draft: {
            id: number;
            title: string | null;
            excerpt: string;
            entry_date: string;
            updated_at: string;
        } | null;
        total_published: number;
    };
    mini_insights: {
        weekly_mood_avg: number | null; // 1.0 - 5.0
        weekly_habit_rate: number; // persentase 0 - 100
    };
}
```

---

## 4. Rencana Pengujian Otomatis (Testing Strategy)

### Feature Test Suite: `tests/Feature/Dashboard/DashboardTest.php`
1. Guest dialihkan ke login saat mengakses `/dashboard`.
2. Pengguna yang belum verifikasi email dialihkan ke halaman verifikasi.
3. Pengguna aktif dapat membuka dashboard dan menerima props sapaan, tanggal sesuai zona waktu, dan ringkasan data.
4. Dashboard hanya menampilkan habit aktif (kebiasaan yang diarsipkan tidak muncul di daftar hari ini).
5. Dashboard secara tepat menyaring habit hari ini sesuai jadwal (`daily`, `specific_days`, `weekly_target`).
6. Status log habit hari ini terpetakan dengan benar (`completed`, `in_progress`, `unlogged`).
7. Widget mood mengenali ketika pengguna belum pernah mencatat mood hari ini (`has_logged_today = false`).
8. Widget mood menampilkan data log emosi jika pengguna sudah check-in hari ini (`has_logged_today = true`).
9. Pintasan jurnal menampilkan draf terakhir pengguna jika ada, dan bernilai `null` jika tidak ada draf.
10. Mini-insight 7 hari menghitung rata-rata skor mood dan persentase sukses kebiasaan secara akurat.
11. **Multi-Tenant Protection**: Data habit, mood, dan draf jurnal milik pengguna lain tidak bocor ke dashboard pengguna aktif.

---

## 5. Tahapan Eksekusi Terurut

```
[Tahap 1: Backend Architecture]
  ├── Controller: app/Http/Controllers/DashboardController.php
  │     ├── Logika sapaan kontekstual timezone
  │     ├── Filter actionable habits & status hari ini
  │     ├── Query status mood hari ini & daftar emosi
  │     ├── Query latest draft jurnal
  │     └── Agregasi metrik 7 hari (mini-insight)
  └── Routing: Update routes/web.php menghubungkan DashboardController

[Tahap 2: Automated Tests Backend]
  └── Feature Test: tests/Feature/Dashboard/DashboardTest.php (11 skenario pengujian)

[Tahap 3: Verifikasi & Standarisasi Backend]
  ├── php artisan test --compact (Semua test lulus)
  └── vendor/bin/pint --format agent

[Tahap 4: Frontend Implementation (Opsional)]
  ├── Update resources/js/Pages/Dashboard.tsx
  └── npm run build
```
