# Kontrak Data Page Props & Form Request — Mindstep Platform

> Status Dokumen: **Aktual** (Berdasarkan audit route, controller, form request, dan komponen React per 29 Oktober 2026)  
> Referensi Dokumen Terkait: [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md), [`docs/DATABASE_SCHEMA.md`](./DATABASE_SCHEMA.md), [`docs/DEVELOPMENT_GUIDE.md`](./DEVELOPMENT_GUIDE.md)

---

## A. Inventaris Route Aplikasi

Berikut adalah inventaris seluruh route web yang terdaftar secara aktual di `routes/web.php` dan `routes/auth.php`:

| Route Name | Method | URI | Controller / Action | Auth | Middleware | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *None* | `GET` | `/` | Closure (`routes/web.php:8`) | Tamu/Bebas | `web` | **Aktual** |
| `dashboard` | `GET` | `/dashboard` | Closure (`routes/web.php:17`) | Wajib | `web`, `auth`, `verified` | **Aktual** |
| `profile.edit` | `GET` | `/profile` | `ProfileController@edit` | Wajib | `web`, `auth` | **Aktual** |
| `profile.update` | `PATCH` | `/profile` | `ProfileController@update` | Wajib | `web`, `auth` | **Aktual** |
| `profile.destroy` | `DELETE` | `/profile` | `ProfileController@destroy` | Wajib | `web`, `auth` | **Aktual** |
| `register` | `GET` | `/register` | `Auth\RegisteredUserController@create` | Tamu | `web`, `guest` | **Aktual** |
| `register` (store) | `POST` | `/register` | `Auth\RegisteredUserController@store` | Tamu | `web`, `guest` | **Aktual** |
| `login` | `GET` | `/login` | `Auth\AuthenticatedSessionController@create` | Tamu | `web`, `guest` | **Aktual** |
| `login` (store) | `POST` | `/login` | `Auth\AuthenticatedSessionController@store` | Tamu | `web`, `guest` | **Aktual** |
| `logout` | `POST` | `/logout` | `Auth\AuthenticatedSessionController@destroy`| Wajib | `web`, `auth` | **Aktual** |
| `password.request` | `GET` | `/forgot-password` | `Auth\PasswordResetLinkController@create` | Tamu | `web`, `guest` | **Aktual** |
| `password.email` | `POST` | `/forgot-password` | `Auth\PasswordResetLinkController@store` | Tamu | `web`, `guest` | **Aktual** |
| `password.reset` | `GET` | `/reset-password/{token}` | `Auth\NewPasswordController@create` | Tamu | `web`, `guest` | **Aktual** |
| `password.store` | `POST` | `/reset-password` | `Auth\NewPasswordController@store` | Tamu | `web`, `guest` | **Aktual** |
| `password.confirm` | `GET` | `/confirm-password`| `Auth\ConfirmablePasswordController@show` | Wajib | `web`, `auth` | **Aktual** |
| `password.confirm` (store)| `POST` | `/confirm-password`| `Auth\ConfirmablePasswordController@store` | Wajib | `web`, `auth` | **Aktual** |
| `password.update` | `PUT` | `/password` | `Auth\PasswordController@update` | Wajib | `web`, `auth` | **Aktual** |
| `verification.notice` | `GET` | `/verify-email` | `Auth\EmailVerificationPromptController` | Wajib | `web`, `auth` | **Aktual** |
| `verification.verify` | `GET` | `/verify-email/{id}/{hash}` | `Auth\VerifyEmailController` | Wajib | `web`, `auth`, `signed`, `throttle:6,1` | **Aktual** |
| `verification.send` | `POST` | `/email/verification-notification` | `Auth\EmailVerificationNotificationController@store` | Wajib | `web`, `auth`, `throttle:6,1` | **Aktual** |

### Status Route Domain Habit & Jurnal
* `habits.*` (`index`, `store`, `update`, `destroy`, `log`): **Belum diimplementasikan**.
* `journals.*` (`index`, `create`, `store`, `edit`, `update`, `destroy`): **Belum diimplementasikan**.
* `mood-logs.*` (`store`): **Belum diimplementasikan**.
* `insights.*` (`index`): **Belum diimplementasikan**.

---

## B. Kontrak Per Halaman (Page Props)

Data global yang selalu disuntikkan ke seluruh halaman melalui `HandleInertiaRequests.php`:

```typescript
// resources/js/types/index.d.ts (Kondisi Aktual)
export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    // GAP: timezone, theme, ai_consent belum ada di tipe ini
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
};
```

---

### 1. Halaman: `Welcome`
* **File Komponen**: `resources/js/Pages/Welcome.tsx`
* **Route**: `GET /`
* **Controller/Action**: Closure `routes/web.php:8`
* **Payload Props**:
  ```typescript
  interface WelcomeProps {
      canLogin: boolean;
      canRegister: boolean;
      laravelVersion: string;
      phpVersion: string;
  }
  ```
* **Keterangan**: Halaman pendaratan publik dengan status ketersediaan auth route.

---

### 2. Halaman: `Dashboard`
* **File Komponen**: `resources/js/Pages/Dashboard.tsx`
* **Route**: `GET /dashboard` (Route Name: `dashboard`)
* **Controller/Action**: Closure `routes/web.php:17`
* **Payload Props Aktual**:
  ```typescript
  // Tidak ada props data domain khusus yang diteruskan selain shared auth props
  type DashboardProps = PageProps;
  ```
* **Status**: Masih berupa boilerplate Breeze ("You're logged in!").
* **Target Kontrak Rekomendasi (Sesuai PRD Modul 1)**:
  ```typescript
  interface DashboardTargetProps extends PageProps {
      todayDate: string; // ISO date format YYYY-MM-DD
      actionableHabits: Array<{
          id: number;
          name: string;
          measurement_type: 'boolean' | 'quantitative' | 'duration';
          target_value: number;
          unit: string | null;
          color: string;
          today_log?: {
              id: number;
              actual_value: number;
              status: 'not_completed' | 'partial' | 'completed' | 'rest_day';
          } | null;
      }>;
      todayMoodLog: {
          id: number;
          mood_score: number;
          emotions: string[];
          note: string | null;
      } | null;
      activeStreak: number;
      weeklyCompletionRate: number;
      recentDraftJournal?: {
          id: number;
          title: string | null;
          updated_at: string;
      } | null;
  }
  ```

---

### 3. Halaman: `Profile/Edit`
* **File Komponen**: `resources/js/Pages/Profile/Edit.tsx`
* **Route**: `GET /profile` (Route Name: `profile.edit`)
* **Controller/Action**: `ProfileController@edit`
* **Payload Props Aktual**:
  ```typescript
  interface ProfileEditProps extends PageProps {
      mustVerifyEmail: boolean;
      status?: string; // Flash session status
  }
  ```
* **Komponen Konsumen**:
  * `UpdateProfileInformationForm.tsx`: Menggunakan `useForm({ name: user.name, email: user.email })`.
  * `UpdatePasswordForm.tsx`: Menggunakan `useForm({ current_password: '', password: '', password_confirmation: '' })`.
  * `DeleteUserForm.tsx`: Menggunakan `useForm({ password: '' })`.

---

### 4. Halaman Autentikasi (`Pages/Auth/*`)

| File Komponen | Route Name | Props Spesifik Halaman |
| :--- | :--- | :--- |
| `Auth/Login.tsx` | `login` | `{ canResetPassword?: boolean, status?: string }` |
| `Auth/Register.tsx` | `register` | `{}` (Hanya shared props) |
| `Auth/ForgotPassword.tsx` | `password.request` | `{ status?: string }` |
| `Auth/ResetPassword.tsx` | `password.reset` | `{ token: string, email: string }` |
| `Auth/VerifyEmail.tsx` | `verification.notice` | `{ status?: string }` |
| `Auth/ConfirmPassword.tsx`| `password.confirm` | `{}` |

---

## C. Kontrak Form Request

### 1. Form Request: `ProfileUpdateRequest`
* **Target Route**: `PATCH /profile` (`profile.update`)
* **Form Handler**: `resources/js/Pages/Profile/Partials/UpdateProfileInformationForm.tsx`
* **Payload Input**:
  | Field | Tipe | Wajib/Opsional | Aturan Validasi Backend | Keterangan |
  | :--- | :--- | :--- | :--- | :--- |
  | `name` | `string` | Wajib | `['required', 'string', 'max:255']` | Nama lengkap |
  | `email` | `string` | Wajib | `['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique('users')->ignore($id)]` | Email unik |
* **Perilaku Berhasil**: Redirect HTTP 303 ke `profile.edit`.
* **Perilaku Gagal**: Redirect back dengan error bag di `errors.name` atau `errors.email`.

### 2. Form Request: `Auth\LoginRequest`
* **Target Route**: `POST /login` (`login`)
* **Form Handler**: `resources/js/Pages/Auth/Login.tsx`
* **Payload Input**:
  | Field | Tipe | Wajib/Opsional | Aturan Validasi Backend |
  | :--- | :--- | :--- | :--- |
  | `email` | `string` | Wajib | `['required', 'string', 'email']` |
  | `password` | `string` | Wajib | `['required', 'string']` |
  | `remember` | `boolean` | Opsional | `['boolean']` |
* **Rate Limiting**: Maksimal 5 percobaan gagal per menit (`RateLimiter::hit($throttleKey)`).

### 3. Akun Deletion Form (`profile.destroy`)
* **Target Route**: `DELETE /profile` (`profile.destroy`)
* **Payload Input**:
  | Field | Tipe | Wajib/Opsional | Aturan Validasi Backend |
  | :--- | :--- | :--- | :--- |
  | `password` | `string` | Wajib | `['required', 'current_password']` |
* **Perilaku**: Logout session, cascade delete `User`, invalidasi token, dan redirect ke `/`.

---

## D. Status dan Error Handling

Aplikasi tidak menggunakan envelope JSON generik REST API (`{ success: true, data: ... }`), melainkan mengikuti spesifikasi protokol Inertia:

1. **Validasi Gagal (HTTP 422 / Redirect 302/303)**:
   * Server membatalkan transaksi dan mengembalikan redirect ke halaman pemanggil disertai session flash error bag.
   * Inertia client secara otomatis menangkap error dan mengisinya ke properti `errors` pada hook `useForm`.
2. **Tidak Terautentikasi (HTTP 401 / Redirect 302)**:
   * Middleware `Authenticate` mengarahkan pengguna ke route `login`.
3. **Tidak Berwenang (HTTP 403 Forbidden)**:
   * Menampilkan layar error 403 standar Laravel jika pengguna mencoba memanipulasi resource yang bukan haknya.
4. **Resource Tidak Ditemukan (HTTP 404 Not Found)**:
   * Ditampilkan jika parameter ID pada model binding tidak ditemukan di database.
5. **Flash Messages**:
   * *Status Aktual*: Flash message baru dikonsumsi secara ad-hoc per halaman (contoh: `status` di `Profile/Edit.tsx`). Belum ada standar flash banner global di `HandleInertiaRequests.php`.

---

## E. Temuan Kesenjangan Kontrak (Contract Mismatches)

Berdasarkan audit komparatif antara backend, database, dan frontend:

1. **Kesenjangan Skema User di TypeScript (`resources/js/types/index.d.ts`)**:
   * Database `users` memiliki: `timezone`, `theme`, `ai_consent`.
   * Model `User.php` memiliki casts dan fillable untuk ketiga kolom tersebut.
   * Namun antarmuka TypeScript `User` di `resources/js/types/index.d.ts` belum mendeklarasikan `timezone?: string; theme?: string; ai_consent?: boolean;`.
2. **Kesenjangan Validasi Profil (`ProfileUpdateRequest.php`)**:
   * Halaman profil dan `ProfileUpdateRequest` belum menyediakan bidang untuk mengubah preferensi `timezone`, `theme`, atau `ai_consent`, sehingga pengguna belum memiliki sarana UI untuk mengatur preferensi tersebut.
3. **Ketiadaan Props Domain pada `Dashboard.tsx`**:
   * Route `/dashboard` pada `routes/web.php` me-render `Dashboard` tanpa menyuntikkan data habit, log, atau mood.
4. **Flash Notification Global**:
   * Belum tersedia objek `flash: { message?: string, type?: 'success' | 'error' }` pada `HandleInertiaRequests::share()`.
