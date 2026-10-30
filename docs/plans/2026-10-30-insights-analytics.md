# Dokumen Rencana Implementasi: Modul Insights & Analytics

> Nomor Dokumen: `PLAN-ANALYTICS-001`  
> Tanggal: 30 Oktober 2026  
> Status: **Disetujui untuk Implementasi Langsung**  
> Target Branch: `feature/daily-dashboard-hub`  
> Referensi: [`docs/prd.md`](../prd.md) (Modul 5: FR-5.1 s.d FR-5.4), [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md), [`docs/DATABASE_SCHEMA.md`](../DATABASE_SCHEMA.md), [`docs/PAGE_PROPS_SPEC.md`](../PAGE_PROPS_SPEC.md), [`docs/TESTING_GUIDE.md`](../TESTING_GUIDE.md)

---

## 1. Ringkasan Eksekutif & Sasaran

Modul **Insights & Analytics** mengubah catatan harian menjadi visualisasi tren dan korelasi matematis antara kebiasaan hidup dan suasana hati pengguna.

### Sasaran Utama:
1. **Filter Rentang Waktu (FR-5.1)**: `7d` (default), `30d`, `this_month`, `3m`, dan `custom` (start_date & end_date) berbasis `user.timezone`.
2. **Visualisasi Kebiasaan (FR-5.2)**:
   - Tren persentase penyelesaian kebiasaan harian (*daily completion rate*).
   - Top 3 habit paling konsisten (*highest completion rate*).
   - Top 3 habit yang paling sering terlewat/gagal (*needs attention*).
3. **Visualisasi Mood & Jurnal (FR-5.3)**:
   - Tren pergerakan rata-rata mood harian (*mood score trend* 1.0–5.0).
   - Distribusi frekuensi skor mood (skor 1 sampai 5).
   - Peringkat Top 5 emosi dominan.
   - Peringkat Top 5 tag jurnal terbanyak.
   - Matriks kalender aktivitas harian (*activity heatmap*).
4. **Analisis Korelasi Silang (Cross-Correlation Analysis) (FR-5.4)**:
   - Membandingkan rata-rata skor mood pada hari di mana seluruh habit terjadwal tuntas 100% vs hari di mana habit tidak tuntas.
   - Menghasilkan ringkasan insight naratif otomatis.

---

## 2. Arsitektur Komponen Backend

1. **`AnalyticsAggregationService.php` (`app/Services/AnalyticsAggregationService.php`)**:
   - Menangani kalkulasi agregasi tanggal, tren habit, statistik mood, heatmap, dan korelasi silang.
   - Menjalankan agregasi efisien berbasis SQL `GROUP BY` dan `AVG`.
2. **`AnalyticsController.php` (`app/Http/Controllers/AnalyticsController.php`)**:
   - Menerima request filter rentang tanggal.
   - Mengirim data props terstruktur ke halaman Inertia `Analytics/Index`.
3. **Routing**: `Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics.index')` di `routes/web.php`.

---

## 3. Rencana Pengujian Otomatis

### File Test: `tests/Feature/Analytics/AnalyticsTest.php`
1. Guest dialihkan ke login.
2. User dapat mengakses `/analytics` dan menerima props lengkap.
3. Filter rentang waktu (`7d`, `30d`, `this_month`, `custom`) berfungsi presisi.
4. Perhitungan Top Habits (paling konsisten dan sering gagal) akurat.
5. Perhitungan tren mood, distribusi skor 1–5, dan top emosi akurat.
6. Perhitungan korelasi silang (mood hari sukses vs hari gagal) menghasilkan perbandingan matematis yang benar.
7. Isolasi multi-tenant: Data milik user lain tidak dihitung dalam agregasi analitik.
