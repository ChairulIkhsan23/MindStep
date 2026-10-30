# Dokumen Rencana Implementasi: Modul Mood & Emotion Tracking

> Nomor Dokumen: `PLAN-MOOD-001`  
> Tanggal: 30 Oktober 2026  
> Status: **Disetujui untuk Implementasi**  
> Target Branch: `feature/mood-tracking`  
> Referensi: [`docs/prd.md`](../prd.md) (Modul 4: FR-4.1 s.d FR-4.4), [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md), [`docs/DATABASE_SCHEMA.md`](../DATABASE_SCHEMA.md), [`docs/PAGE_PROPS_SPEC.md`](../PAGE_PROPS_SPEC.md), [`docs/TESTING_GUIDE.md`](../TESTING_GUIDE.md)

---

## 1. Ringkasan Eksekutif & Tujuan

Tujuan dari rencana ini adalah membangun subsistem **Mood & Emotion Tracking** pada platform Mindstep. Modul ini memungkinkan pengguna mencatat kondisi psikologis dan emosional harian secara cepat (< 10 detik), fleksibel (> 1 entri per hari), dan terstruktur untuk dianalisis korelasinya terhadap konsistensi kebiasaan pada modul analitik.

### Sasaran Utama:
1. **Skala Mood 1–5 Terstandarisasi**: Mengukur tingkat suasana hati dari *Sangat Buruk (1)* hingga *Sangat Baik (5)* dengan label dan warna representatif.
2. **Multi-Emosi Tagging**: Menyediakan tag perasaan (misal: *Senang, Cemas, Lelah, Fokus, Bersyukur*) yang disimpan dalam format JSON.
3. **Dual-Mode Integration**: Mendukung pencatatan mandiri (*standalone quick check-in*) maupun terikat pada entri penulisan jurnal (`journal_id`).
4. **Agregasi Mood Harian**: Menghitung rata-rata harian (*daily average*) secara deterministik jika terdapat lebih dari satu check-in dalam satu hari kalender.
5. **Multi-Tenant Protection**: Menjamin isolasi data ketat via `MoodLogPolicy` agar riwayat emosi pengguna tidak dapat diakses pengguna lain.

---

## 2. Arsitektur Data & Model

Tabel `mood_logs` telah terpasang di database dan siap digunakan.

### A. Skema Tabel: `mood_logs`
* `id`: BIGINT UNSIGNED PK, AUTO_INCREMENT
* `user_id`: BIGINT UNSIGNED FK (`users.id`, CASCADE)
* `journal_id`: BIGINT UNSIGNED NULLABLE FK (`journals.id`, NULL ON DELETE)
* `log_date`: DATE (format `Y-m-d`)
* `mood_score`: UNSIGNED TINYINT (skala 1 s.d 5)
* `emotions`: JSON NULLABLE (array string tag emosi)
* `note`: VARCHAR(500) NULLABLE (catatan konteks/pemicu singkat)
* `created_at`, `updated_at`: TIMESTAMP
* **Indeks**: INDEX `['user_id', 'log_date']`

### B. Penyesuaian Model `MoodLog.php`
* Mengaktifkan casts: `'log_date' => 'date'`, `'mood_score' => 'integer'`, `'emotions' => 'array'`.
* Menambahkan mutator tanggal murni `setLogDateAttribute` untuk konsistensi SQLite/MySQL/PostgreSQL.
* Relasi: `belongsTo(User::class)` dan `belongsTo(Journal::class)`.
* Scope: `scopeForDate(Builder $query, string $date)`.

---

## 3. Logika Bisnis & Spesifikasi Emosi

### A. Nilai Skala Mood (1–5)
* `1` = **Sangat Buruk** (*Very Bad*) ➔ Merah (`#ef4444`)
* `2` = **Buruk** (*Bad*) ➔ Oranye (`#f97316`)
* `3` = **Netral** (*Neutral*) ➔ Kuning (`#eab308`)
* `4` = **Baik** (*Good*) ➔ Hijau Muda (`#84cc16`)
* `5` = **Sangat Baik** (*Great*) ➔ Zamrud (`#10b981`)

### B. Kurasi Tag Multi-Emosi (Default Categories)
1. **Positif & Berenergi**: `Senang`, `Bersemangat`, `Percaya Diri`, `Bangga`, `Penuh Energi`.
2. **Ketenangan & Bersyukur**: `Tenang`, `Damai`, `Bersyukur`, `Santai`, `Nyaman`.
3. **Cemas & Tekanan**: `Cemas`, `Takut`, `Kewalahan`, `Panik`, `Gelisah`.
4. **Lelah & Penurunan Energi**: `Lelah`, `Mengantuk`, `Bosan`, `Hampa`, `Lesu`.
5. **Frustrasi & Sedih**: `Sedih`, `Kecewa`, `Marah`, `Kesepian`, `Iritabel`.

### C. Aturan Validasi Input (`StoreMoodLogRequest`)
* `mood_score`: required, integer, between: 1, 5.
* `log_date`: required, date, format `Y-m-d`, tidak boleh di masa depan ($> \text{today}$ di timezone pengguna).
* `emotions`: nullable, array, maksimal 5 tag per log.
* `emotions.*`: string, max: 50.
* `note`: nullable, string, max: 500.
* `journal_id`: nullable, exists: journals,id (dan harus milik pengguna aktif).

---

## 4. Kontrak Rute Web & REST API

```php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/moods', [MoodLogController::class, 'index'])->name('moods.index');
    Route::post('/moods', [MoodLogController::class, 'store'])->name('moods.store');
    Route::put('/moods/{moodLog}', [MoodLogController::class, 'update'])->name('moods.update');
    Route::delete('/moods/{moodLog}', [MoodLogController::class, 'destroy'])->name('moods.destroy');
});
```

### Struktur Props Inertia (`moods.index`)
```typescript
interface MoodLogItem {
    id: number;
    log_date: string; // Y-m-d
    mood_score: 1 | 2 | 3 | 4 | 5;
    emotions: string[] | null;
    note: string | null;
    journal_id: number | null;
    journal_title?: string | null;
    created_at: string;
}

interface MoodIndexProps {
    today_logs: MoodLogItem[];
    recent_logs: MoodLogItem[];
    stats: {
        weekly_average: number | null; // 1.0 - 5.0
        dominant_emotion: string | null;
        total_checkins: number;
    };
    available_emotions: string[];
}
```

---

## 5. Rencana Pengujian Otomatis (Testing Strategy)

### A. Feature Tests (`tests/Feature/Mood/MoodTrackingTest.php`)
1. User dapat melihat halaman linimasa mood (`/moods`).
2. Guest diblokir dan dialihkan ke `/login`.
3. User dapat mencatat mood mandiri (*standalone check-in*) dengan data valid.
4. User dapat mencatat > 1 entri mood pada hari yang sama.
5. Validasi menolak skor mood di luar rentang 1–5 (misal: 0 atau 6).
6. Validasi menolak tanggal di masa depan (*future date*).
7. User dapat melakukan backdating pada tanggal masa lalu yang valid.
8. User dapat mengedit skor, emosi, atau catatan pada log miliknya.
9. User dapat menghapus log mood miliknya.
10. **Multi-Tenant Isolation**: User A dilarang mengedit atau menghapus log mood User B (403 Forbidden).

---

## 6. Tahapan Eksekusi Terurut (Work Breakdown)

```
[Tahap 1: Backend Foundation]
  ├── Form Requests: StoreMoodLogRequest, UpdateMoodLogRequest
  ├── Policy: MoodLogPolicy
  ├── Model Enhancement: Mutator & Scopes di MoodLog.php
  ├── Controller: MoodLogController (index, store, update, destroy)
  └── Routes: web.php

[Tahap 2: Automated Tests Backend]
  ├── Factory: MoodLogFactory (State: veryBad, bad, neutral, good, great)
  └── tests/Feature/Mood/MoodTrackingTest.php (10 scenarios)

[Tahap 3: Frontend Implementation]
  ├── TypeScript Types: resources/js/types/mood.d.ts
  ├── Components: MoodScoreSelector.tsx, EmotionTagSelector.tsx, QuickMoodModal.tsx
  └── Page: resources/js/Pages/Moods/Index.tsx

[Tahap 4: Quality & Verification]
  ├── php artisan test --compact (Semua test hijau)
  ├── vendor/bin/pint --format agent (Format standar Pint)
  └── npm run build (Asset bundle tanpa error)
```
