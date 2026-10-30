# Dokumen Rencana Implementasi: Modul Journaling System

> Nomor Dokumen: `PLAN-JOURNAL-001`  
> Tanggal: 30 Oktober 2026  
> Status: **Disetujui untuk Implementasi**  
> Target Branch: `feature/journaling-system`  
> Referensi: [`docs/prd.md`](../prd.md) (Modul 3: FR-3.1 s.d FR-3.6), [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md), [`docs/DATABASE_SCHEMA.md`](../DATABASE_SCHEMA.md), [`docs/PAGE_PROPS_SPEC.md`](../PAGE_PROPS_SPEC.md), [`docs/TESTING_GUIDE.md`](../TESTING_GUIDE.md)

---

## 1. Ringkasan Eksekutif & Sasaran

Modul **Journaling System** menyediakan media refleksi personal bagi pengguna Mindstep. Modul ini mendukung dua gaya refleksi (pertanyaan panduan terstruktur dan tulisan bebas), status draf otomatis, kategorisasi tag multi-label, integrasi pencatatan emosi harian, serta pencarian multi-kriteria dan tampilan kalender jurnal.

### Sasaran Utama:
1. **CRUD Entri Jurnal**: Mendukung pembuatan, pengubahan, penerbitan, dan penghapusan jurnal tanpa batas kuota harian (> 1 entri per hari diperbolehkan).
2. **Dual-Mode Input**:
   - `freeform`: Kanvas penulisan bebas dengan judul dan formatting teks dasar.
   - `template`: Refleksi dengan set pertanyaan panduan bawaan sistem (*Daily Reflection*, *Gratitude*, *Problem Solving*).
3. **Draft & Published State**: Dukungan penyimpanan draf (`is_draft = true`) untuk fitur auto-save dan draf belum rampung, serta status publikasi (`is_draft = false`).
4. **Integrasi Mood Melekat (Attached Mood)**: Sinkronisasi skor mood dan emosi ke tabel `mood_logs` dengan tautan `journal_id`.
5. **Multi-Tagging**: Dukungan tag global sistem (`user_id = null`) dan tag kustom pengguna (`user_id = user.id`).
6. **Search & Filtering**: Pencarian kata kunci pada judul/konten, filter rentang tanggal, filter tag, filter skor mood, dan filter status draf/publikasi.
7. **Multi-Tenant Protection**: Isolasi data ketat via `JournalPolicy`.

---

## 2. Arsitektur Data & Model

Tabel `journals`, `tags`, dan pivot `journal_tag` sudah terpasang pada skema database.

### A. Model `Journal.php`
* Field: `user_id`, `title`, `entry_type`, `template_name`, `content`, `entry_date`, `is_draft`, `mood_score`, `ai_summary`.
* Casts: `'entry_date' => 'date'`, `'is_draft' => 'boolean'`, `'mood_score' => 'integer'`.
* Mutator: `setEntryDateAttribute` memastikan format string murni `Y-m-d`.
* Relasi:
  - `user()`: `BelongsTo(User::class)`
  - `tags()`: `BelongsToMany(Tag::class)`
  - `moodLog()`: `HasOne(MoodLog::class)`
* Scopes:
  - `scopePublished(Builder $query)`: `where('is_draft', false)`
  - `scopeDrafts(Builder $query)`: `where('is_draft', true)`
  - `scopeSearch(Builder $query, ?string $search)`
  - `scopeFilter(Builder $query, array $filters)`

### B. Model `Tag.php`
* Field: `user_id` (nullable), `name`, `slug`.
* Relasi: `journals()`: `BelongsToMany(Journal::class)`.
* Scopes: `scopeAvailableFor(Builder $query, int $userId)`: Mengambil tag sistem (`user_id is null`) digabung dengan tag kustom user (`user_id = $userId`).

### C. Model & Skema `JournalTemplate.php` (Dinamis Khusus Admin/Sistem)
* Skema Tabel `journal_templates`:
  - `id`: BIGINT UNSIGNED PK, AUTO_INCREMENT
  - `slug`: VARCHAR(100) UNIQUE (contoh: `daily_reflection`, `gratitude`, `problem_solving`)
  - `name`: VARCHAR(255) (contoh: `Refleksi Harian`)
  - `description`: VARCHAR(500) NULLABLE (ringkasan tujuan refleksi)
  - `prompts`: JSON (array string pertanyaan panduan)
  - `is_active`: BOOLEAN DEFAULT true (toggle keaktifan template tanpa merusak data historis)
  - `order`: INTEGER DEFAULT 0 (urutan tampilan di UI)
  - `timestamps()`
* Model:
  - Casts: `'prompts' => 'array'`, `'is_active' => 'boolean'`, `'order' => 'integer'`
  - Scopes: `scopeActive(Builder $query)`, `scopeOrdered(Builder $query)`
  - Relasi: `journals()`: `HasMany(Journal::class, 'template_name', 'slug')`

---

## 3. Spesifikasi Fitur & Validasi

### A. Template Bawaan Sistem (Seeder Awal di `journal_templates`)
1. `daily_reflection`:
   - *"Apa momen atau pencapaian terbaikmu hari ini?"*
   - *"Tantangan apa yang kamu hadapi dan bagaimana caramu meresponnya?"*
   - *"Apa satu hal yang ingin kamu tingkatkan besok?"*
2. `gratitude`:
   - *"Tiga hal kecil yang kamu syukuri hari ini."*
   - *"Siapa sosok yang kamu hargai keberadaannya hari ini dan mengapa?"*
3. `problem_solving`:
   - *"Apa masalah spesifik yang sedang menguras energimu?"*
   - *"Fakta nyata apa yang ada (pisahkan dari ketakutan/asumsi)?"*
   - *"Apa satu tindakan kecil yang berada di bawah kendalimu saat ini?"*

### B. Aturan Validasi Input

#### 1. `StoreJournalRequest` & `UpdateJournalRequest`
* `title`: `nullable`, `string`, `max:255`.
* `entry_type`: `required`, `in:freeform,template`.
* `template_name`: `required_if:entry_type,template`, `nullable`, `string`, divalidasi dinamis via `Rule::exists('journal_templates', 'slug')->where('is_active', true)`.
* `content`: `required`, `string`. (Pada mode draft diizinkan minimal 1 karakter).
* `entry_date`: `required`, `date_format:Y-m-d`, `before_or_equal:today` (berbasis timezone user).
* `is_draft`: `boolean`.
* `mood_score`: `nullable`, `integer`, `between:1,5`.
* `emotions`: `nullable`, `array`, `max:5`.
* `tags`: `nullable`, `array`.
* `tags.*`: `string`, `max:50` (sistem otomatis mencari tag existing atau membuat tag kustom baru).

---

## 4. Kontrak Rute & Kontroler

```php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/journals', [JournalController::class, 'index'])->name('journals.index');
    Route::get('/journals/create', [JournalController::class, 'create'])->name('journals.create');
    Route::post('/journals', [JournalController::class, 'store'])->name('journals.store');
    Route::get('/journals/{journal}', [JournalController::class, 'show'])->name('journals.show');
    Route::get('/journals/{journal}/edit', [JournalController::class, 'edit'])->name('journals.edit');
    Route::put('/journals/{journal}', [JournalController::class, 'update'])->name('journals.update');
    Route::delete('/journals/{journal}', [JournalController::class, 'destroy'])->name('journals.destroy');
});
```

### Struktur Props Inertia (`journals.index`)
```typescript
interface TagItem {
    id: number;
    name: string;
    slug: string;
}

interface JournalListItem {
    id: number;
    title: string | null;
    entry_type: 'freeform' | 'template';
    template_name: string | null;
    excerpt: string;
    entry_date: string;
    is_draft: boolean;
    mood_score: number | null;
    tags: TagItem[];
    created_at: string;
}

interface JournalIndexProps {
    journals: {
        data: JournalListItem[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        search?: string;
        tag?: string;
        mood_score?: number;
        start_date?: string;
        end_date?: string;
        status?: 'all' | 'published' | 'draft';
    };
    available_tags: TagItem[];
    draft_count: number;
}
```

---

## 5. Rencana Pengujian Otomatis (Testing Strategy)

### Feature Test Suite: `tests/Feature/Journal/JournalManagementTest.php`
1. Guest dialihkan ke login saat mengakses rute jurnal.
2. User dapat melihat daftar jurnal miliknya dengan pagination dan filter.
3. User dapat membuat jurnal mode `freeform` (draft dan published).
4. User dapat membuat jurnal mode `template` dengan validasi template valid.
5. Pembuatan jurnal dengan `mood_score` otomatis menyinkronkan data ke tabel `mood_logs` (`journal_id`).
6. User dapat memasang tag bawaan dan membuat tag kustom baru otomatis.
7. Validasi menolak tanggal masa depan (*future date rejection*).
8. User dapat mengupdate jurnal dan daftar tag-nya.
9. User dapat menghapus jurnal miliknya tanpa menghapus catatan mood (`journal_id` menjadi `null`).
10. **Multi-Tenant Protection**: User A dilarang melihat, mengedit, atau menghapus jurnal milik User B (403 Forbidden).
11. Filter pencarian kata kunci menghasilkan jurnal yang relevan pada judul dan konten.

---

## 6. Tahapan Eksekusi

```
[Tahap 1: Backend Architecture]
  ├── Migration & Model: journal_templates (slug, name, prompts, is_active, order)
  ├── Seeder: JournalTemplateSeeder (Seed 3 template bawaan sistem)
  ├── Update Model Journal & Tag (Mutator, Scopes, Relasi MoodLog & JournalTemplate)
  ├── Policy: JournalPolicy
  ├── Requests: StoreJournalRequest, UpdateJournalRequest (Dinamis validasi template aktif)
  ├── Controller: JournalController (CRUD, tag sync, mood sync, filter search, passing dynamic templates)
  └── Routes: web.php

[Tahap 2: Automated Tests Backend]
  ├── Factory updates: TagFactory, JournalFactory & JournalTemplateFactory
  └── Feature Tests: tests/Feature/Journal/JournalManagementTest.php (14 skenario + template dinamis)

[Tahap 3: Frontend Implementation]
  ├── Types: resources/js/types/journal.d.ts
  ├── Pages:
  │   ├── resources/js/Pages/Journals/Index.tsx (List, filter bar, kalender, tab draft)
  │   ├── resources/js/Pages/Journals/Create.tsx (Pilihan template / freeform, editor, mood picker)
  │   ├── resources/js/Pages/Journals/Edit.tsx (Form edit & auto-save)
  │   └── resources/js/Pages/Journals/Show.tsx (Tampilan baca refleksi + tag + mood badge)
  └── Integrasi Navbar Layout

[Tahap 4: Verifikasi & Standarisasi]
  ├── php artisan test --compact (100% lulus)
  ├── vendor/bin/pint --format agent
  └── npm run build
```
