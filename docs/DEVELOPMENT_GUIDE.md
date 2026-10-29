# Panduan Pengembangan & Standar Pengkodean (Development Guide) — Mindstep Platform

> Status Dokumen: **Aktual** (Berdasarkan audit konfigurasi dependensi dan environment per 29 Oktober 2026)  
> Referensi Dokumen Terkait: [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md), [`docs/DATABASE_SCHEMA.md`](./DATABASE_SCHEMA.md), [`docs/PAGE_PROPS_SPEC.md`](./PAGE_PROPS_SPEC.md), [`docs/TESTING_GUIDE.md`](./TESTING_GUIDE.md)

---

## A. Prasyarat dan Lingkungan Pengembangan

Sebelum memulai pengembangan lokal, pastikan perangkat Anda telah memenuhi spesifikasi versi yang terverifikasi berikut:

| Perangkat Lunak / Dependensi | Versi Minimum | Versi Terverifikasi di Repositori | Keterangan |
| :--- | :--- | :--- | :--- |
| **PHP** | `^8.3` | `8.3.14` | Ekstensi wajib: `pdo`, `pdo_sqlite`, `pdo_mysql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `curl` |
| **Composer** | `^2.2` | `2.9.3` | Manajer paket dependensi PHP |
| **Node.js & npm** | Node `^18.0`, npm `^9.0` | Node LTS / npm | Ekosistem JavaScript / runtime bundling |
| **Laravel Framework** | `^13.0` | `13.39.0` | Core backend framework |
| **Database Server** | MySQL `>= 8.0` atau SQLite `>= 3.35` | MySQL (Local) / SQLite (Testing) | SQLite bawaan file atau MySQL server lokal |

---

## B. Panduan Setup Lokal Langkah demi Langkah

Ikuti langkah-langkah berikut untuk menyiapkan aplikasi dari repositori baru:

### 1. Kloning Repositori & Persiapan Environment
```bash
# Masuk ke direktori proyek
cd mindstep

# Salin konfigurasi environment dari berkas template
cp .env.example .env
```

### 2. Instal Dependensi Backend & Frontend
```bash
# Instal paket PHP via Composer
composer install

# Instal paket JavaScript/TypeScript via npm
# Catatan: Gunakan flag --legacy-peer-deps untuk resolusi peer dependensi Vite 8 dengan plugin React
npm install --legacy-peer-deps
```

### 3. Konfigurasi Kunci Aplikasi & Database
Generate encryption key Laravel:
```bash
php artisan key:generate
```

Pilih salah satu konfigurasi database pada berkas `.env`:

* **Opsi A: Menggunakan SQLite (Rekomendasi untuk kemudahan cepat)**:
  ```env
  DB_CONNECTION=sqlite
  DB_DATABASE=C:/Users/Pongo/Documents/Projects/mindstep/database/database.sqlite
  ```
  *(Pastikan berkas `database/database.sqlite` sudah dibuat via `touch database/database.sqlite` jika belum ada)*.

* **Opsi B: Menggunakan MySQL / MariaDB (Sesuai konfigurasi `.env` default)**:
  ```env
  DB_CONNECTION=mysql
  DB_HOST=127.0.0.1
  DB_PORT=3306
  DB_DATABASE=mindstep
  DB_USERNAME=root
  DB_PASSWORD=rahasia_anda
  ```
  *(Buat database kosong bernama `mindstep` terlebih dahulu pada MySQL instance Anda)*.

### 4. Eksekusi Migrasi & Data Seeding Awal
```bash
# Menjalankan migrasi seluruh tabel domain beserta seeder tag bawaan
php artisan migrate --seed
```

### 5. Menjalankan Server Pengembangan
Buka dua jendela terminal terpisah:

```bash
# Terminal 1: Menjalankan Backend Laravel
php artisan serve

# Terminal 2: Menjalankan Vite Dev Server (Hot Module Replacement)
npm run dev
```

Aplikasi siap diakses pada browser di: `http://localhost:8000`.

---

## C. Konvensi PHP dan Laravel

### 1. Standar Gaya Kode (Formatting & Linter)
* Repositori ini menerapkan standar PSR-12 yang ditegakkan secara ketat menggunakan **Laravel Pint**.
* Selalu jalankan pemformat kode sebelum melakukan commit:
  ```bash
  vendor/bin/pint --format agent
  ```

### 2. Deklarasi Tipe Data & PHP 8 Syntax
* Wajib menggunakan *explicit return type* dan parameter type hinting pada seluruh method controller, service, dan helper:
  ```php
  public function calculateCompletionRate(User $user, Carbon $startDate, Carbon $endDate): float
  {
      // ...
  }
  ```
* Gunakan PHP 8 Constructor Property Promotion:
  ```php
  public function __construct(
      protected HabitStreakService $streakService
  ) {}
  ```
* Gunakan PHP 8 Attributes pada Eloquent Model:
  ```php
  #[Fillable(['user_id', 'name', 'measurement_type', 'target_value'])]
  class Habit extends Model
  {
      // ...
  }
  ```

### 3. Validasi & Form Requests
* Hindari menulis aturan validasi inline di dalam Controller method. Selalu gunakan Form Request terpisah:
  ```bash
  php artisan make:request StoreHabitRequest --no-interaction
  ```
* Aturan validasi wajib mencakup batas keamanan kuantitatif (`numeric|gt:0`, `date`, `max:255`).

### 4. Kueri Eloquent & Scoping Kepemilikan Data
* Seluruh kueri wajib terikat ke `user_id` sesi yang sedang aktif untuk mencegah IDOR:
  ```php
  // Benar: Terikat konteks auth user
  $habits = $request->user()->habits()->active()->get();

  // Salah: Membuka peluang akses silang antar-pengguna
  $habits = Habit::where('id', $id)->first();
  ```
* Operasi manipulasi tanggal pada database wajib menggunakan helper Eloquent `whereDate`:
  ```php
  $logs = HabitLog::where('user_id', $user->id)
      ->whereDate('log_date', $today)
      ->get();
  ```

### 5. Transaksi Database
* Operasi mutasi yang melibatkan lebih dari satu tabel (contoh: menyimpan entri jurnal sekaligus membuat mood log) wajib dibungkus dalam `DB::transaction`:
  ```php
  DB::transaction(function () use ($validated, $user) {
      $journal = $user->journals()->create($validated);
      if (!empty($validated['mood_score'])) {
          $user->moodLogs()->create([
              'journal_id' => $journal->id,
              'mood_score' => $validated['mood_score'],
              'log_date'   => $journal->entry_date,
          ]);
      }
  });
  ```

---

## D. Konvensi React dan TypeScript

### 1. Penamaan Berkas & Struktur Komponen
* **Halaman Inertia (`resources/js/Pages/`)**: Gunakan PascalCase sesuai nama route/domain (misal: `Dashboard.tsx`, `Habits/Index.tsx`, `Journals/Create.tsx`).
* **Komponen Bersama (`resources/js/Components/`)**: PascalCase (misal: `Modal.tsx`, `PrimaryButton.tsx`, `TextInput.tsx`).
* **Tipe Data (`resources/js/types/`)**: camelCase untuk berkas (`index.d.ts`), PascalCase untuk antarmuka (`interface HabitItem { ... }`).

### 2. TypeScript Strict Mode
* File `tsconfig.json` dikonfigurasi dengan `"strict": true`.
* Hindari penggunaan tipe `any`. Selalu definisikan antarmuka Props secara eksplisit:
  ```typescript
  import { PageProps } from '@/types';

  interface HabitCardProps {
      habit: {
          id: number;
          name: string;
          target_value: number;
          unit: string | null;
      };
      onCheckIn: (habitId: number) => void;
  }

  export default function HabitCard({ habit, onCheckIn }: HabitCardProps) {
      // ...
  }
  ```

### 3. Pengelolaan Form dengan Inertia `useForm`
* Seluruh form submission wajib menggunakan hook `useForm` dari `@inertiajs/react` agar terintegrasi dengan validasi server-side dan CSRF protection:
  ```typescript
  import { useForm } from '@inertiajs/react';

  const { data, setData, post, processing, errors, reset } = useForm({
      name: '',
      target_value: 1,
      measurement_type: 'boolean',
  });

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      post(route('habits.store'), {
          onSuccess: () => reset(),
      });
  };
  ```

### 4. Styling & Aksesibilitas Tailwind CSS
* Manfaatkan kelas responsif (`sm:`, `md:`, `lg:`) dan varian mode gelap (`dark:`).
* Pastikan seluruh elemen interaktif (tombol, input) memiliki target sentuh minimal 44x44 px pada layar sentuh.
* Selalu pasangkan elemen `<InputLabel htmlFor="id">` dengan `<TextInput id="id">` untuk keterbacaan screen reader.

---

## E. Git Workflow & Standar Kolaborasi

### 1. Strategi Branching
* `main`: Branch utama yang stabil dan siap produksi (*production-ready*).
* `feat/<nama-fitur>`: Branch pengembangan modul baru (misal: `feat/habit-crud`, `feat/journal-editor`).
* `fix/<nama-bug>`: Branch perbaikan kerusakan kode (misal: `fix/streak-calculation-timezone`).

### 2. Format Pesan Commit (Conventional Commits)
Setiap commit wajib mengikuti format terstandarisasi:
* `feat:` Penambahan fitur baru (misal: `feat: implement habit daily logging controller and upsert logic`).
* `fix:` Perbaikan bug (misal: `fix: prevent duplicate habit log on same date`).
* `refactor:` Restrukturisasi kode tanpa mengubah perilaku eksternal.
* `test:` Penambahan atau perbaikan unit/feature tests.
* `docs:` Pembaruan dokumentasi teknis atau PRD.
* `chore:` Pembaruan dependensi, konfigurasi build, atau tooling.

---

## F. Checklist Developer Sebelum Commit (Quality Gate)

Sebelum mengajukan pull request atau menggabungkan kode, verifikasi checklist berikut:

- [ ] **Kode Bersih**: Menjalankan `vendor/bin/pint --format agent` tanpa error style.
- [ ] **Type Check Lulus**: Menjalankan `npm run build` (yang mengeksekusi `tsc && vite build`) tanpa kesalahan tipe TypeScript.
- [ ] **Test Otomatis Lulus**: Menjalankan `php artisan test --compact` dan memastikan seluruh suite test berstatus hijau.
- [ ] **Isolasi Multi-Tenant Terjaga**: Memastikan setiap query model baru memfilter berdasarkan `user_id` atau menggunakan relasi user yang terautentikasi.
- [ ] **Idempotensi & Constraint DB**: Memastikan pencatatan log dilindungi dari duplikasi klik ganda.
- [ ] **Dokumentasi Terkini**: Memperbarui `docs/PAGE_PROPS_SPEC.md` atau `docs/DATABASE_SCHEMA.md` apabila terdapat perubahan skema tabel atau kontrak props Inertia.
