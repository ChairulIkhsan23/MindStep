# Dokumen Rencana Implementasi: Modul AI Assistant (Reflective Partner)

> Nomor Dokumen: `PLAN-AI-001`  
> Tanggal: 30 Oktober 2026  
> Status: **Disetujui untuk Implementasi**  
> Target Branch: `feature/ai-assistant-integration`  
> Referensi: [`docs/prd.md`](../prd.md) (Modul 6: FR-6.1 s.d FR-6.6), [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md), [`docs/DATABASE_SCHEMA.md`](../DATABASE_SCHEMA.md), [`docs/TESTING_GUIDE.md`](../TESTING_GUIDE.md)

---

## 1. Ringkasan Eksekutif & Sasaran

Modul **AI Assistant** pada platform Mindstep dirancang sebagai **Reflective Partner (Mitra Pemantul Pikiran)** non-klinis untuk membantu pengguna memperdalam refleksi diri, merapikan catatan draf, dan melihat perkembangan pola pikir berkala tanpa mengubah fakta maupun menimpa tulisan asli pengguna.

Modul ini dibangun dengan arsitektur **Dynamic Driver-based LLM Gateway** yang memungkinkan pengguna/pengembang berganti provider AI (Google Gemini, OpenAI, Anthropic Claude, atau Mock Driver lokal) secara instan hanya melalui konfigurasi file `.env` tanpa mengubah logika aplikasi.

### Sasaran Utama:
1. **Persetujuan Eksplisit Pengguna (FR-6.1)**:
   - Pengecekan gerbang `user.ai_consent === true`. Jika belum disetujui, semua endpoint AI menolak dengan status HTTP `403 Forbidden`.
2. **Polish & Structure Draft (FR-6.2)**:
   - Mengubah draf poin kasar menjadi narasi mengalir tanpa menambah opini fiktif atau mengubah substansi fakta pengguna.
3. **Deepening Prompts (FR-6.3)**:
   - Menganalisis konteks jurnal terkini dan menghasilkan 2–3 pertanyaan pemantik lanjutan untuk menggali perasaan lebih mendalam.
4. **Periodic Summary (FR-6.4)**:
   - Merangkum tema emosional dan pola pikir pengguna dari kumpulan jurnal rentang waktu tertentu (7 hari atau 30 hari).
5. **Non-Destructive & Safety Disclaimer (FR-6.5 & FR-6.6)**:
   - Setiap respons AI menyertakan teks penafian hukum medis permanen (*non-clinical disclaimer*).
   - Teks pengguna di database tidak pernah ditimpa secara otomatis.
6. **Redaksi PII (Privacy by Design - NFR-2)**:
   - Nama, email, dan user ID disaring dari payload prompt sebelum dikirim ke API pihak ketiga.
7. **Multi-Driver LLM Gateway & Mocking**:
   - Mendukung switch provider (`gemini`, `openai`, `claude`, `mock`).
   - Mock driver bawaan untuk testing bebas biaya token API.

---

## 2. Arsitektur Komponen & Konfigurasi

### A. Konfigurasi `config/ai.php` & Environment
```php
return [
    'default' => env('AI_PROVIDER', 'mock'), // gemini, openai, claude, mock
    'disclaimer' => 'Mindstep AI adalah alat refleksi diri, bukan pengganti saran, diagnosis, atau penanganan psikologis/medis profesional.',
    'providers' => [
        'gemini' => [
            'api_key' => env('GEMINI_API_KEY'),
            'model' => env('GEMINI_MODEL', 'gemini-1.5-flash'),
            'base_url' => 'https://generativelanguage.googleapis.com/v1beta',
        ],
        'openai' => [
            'api_key' => env('OPENAI_API_KEY'),
            'model' => env('OPENAI_MODEL', 'gpt-4o-mini'),
            'base_url' => 'https://api.openai.com/v1',
        ],
        'claude' => [
            'api_key' => env('ANTHROPIC_API_KEY'),
            'model' => env('ANTHROPIC_MODEL', 'claude-3-5-haiku-20241022'),
            'base_url' => 'https://api.anthropic.com/v1',
        ],
        'mock' => [
            'model' => 'mock-reflective-v1',
        ],
    ],
];
```

### B. Struktur Hirarki Kelas
```
app/Services/Ai/
  ├── Contracts/
  │     └── AiDriverInterface.php
  ├── Drivers/
  │     ├── MockAiDriver.php
  │     ├── GeminiAiDriver.php
  │     ├── OpenAiDriver.php
  │     └── ClaudeAiDriver.php
  ├── AiManager.php (Factory resolving driver via config)
  └── ReflectiveAiService.php (Prompt builder, PII sanitizer, response parser)
```

---

## 3. Spesifikasi Endpoint REST API

Semua rute dilindungi oleh middleware `['auth', 'verified']`.

```php
Route::middleware(['auth', 'verified'])->prefix('ai')->name('ai.')->group(function () {
    Route::post('/polish', [AiAssistantController::class, 'polish'])->name('polish');
    Route::post('/deepening-prompts', [AiAssistantController::class, 'deepeningPrompts'])->name('prompts');
    Route::post('/summary', [AiAssistantController::class, 'periodicSummary'])->name('summary');
});
```

### Format Respon Terstandarisasi:
```json
{
  "success": true,
  "action": "polish",
  "provider": "gemini",
  "data": {
    "result": "Teks hasil pemolesan draf...",
    "disclaimer": "Mindstep AI adalah alat refleksi diri, bukan pengganti saran medis profesional."
  }
}
```

---

## 4. Rencana Pengujian Otomatis

### File Test: `tests/Feature/Ai/AiAssistantTest.php`
1. Guest dialihkan ke login saat memanggil API AI.
2. Pengguna tanpa persetujuan AI (`ai_consent = false`) ditolak dengan HTTP `403 Forbidden`.
3. Pengguna dengan `ai_consent = true` dapat menjalankan fitur `polish` draf jurnal.
4. Pengguna dapat meminta 2–3 `deepening-prompts` berdasarkan isi jurnal.
5. Pengguna dapat meminta `summary` kumpulan jurnal rentang waktu tertentu.
6. Permintaan summary menolak jika rentang tanggal tidak memiliki jurnal sama sekali (validasi graceful).
7. Setiap respons sukses selalu menyertakan atribut `disclaimer` medis resmi.
8. Driver switch: Sistem dapat beralih antar driver (Mock, Gemini, OpenAI) secara dinamis tanpa error.
9. Isolasi Multi-Tenant: Jurnal milik user lain tidak dianalisis dalam ringkasan periodik.

---

## 5. Tahapan Eksekusi

```
[Tahap 1: Konfigurasi & Driver Foundation]
  ├── Buat branch: feature/ai-assistant-integration
  ├── Buat berkas config/ai.php
  ├── Update .env.example
  ├── AiDriverInterface.php (polish, deepeningPrompts, periodicSummary)
  ├── MockAiDriver.php, GeminiAiDriver.php, OpenAiDriver.php, ClaudeAiDriver.php
  └── AiManager.php (Resolve provider dynamically)

[Tahap 2: Business Logic Service & Controller]
  ├── ReflectiveAiService.php (Prompt engineering & PII sanitization)
  ├── Form Requests: PolishDraftRequest, DeepeningPromptsRequest, PeriodicSummaryRequest
  ├── AiAssistantController.php
  └── routes/web.php

[Tahap 3: Automated Testing & Verifikasi]
  ├── tests/Feature/Ai/AiAssistantTest.php (9 skenario test)
  ├── php artisan test --compact (100% lulus)
  └── vendor/bin/pint --format agent
```
