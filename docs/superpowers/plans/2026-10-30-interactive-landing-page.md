# Interactive Hybrid Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun antarmuka Interactive Hybrid Landing Page (Welcome.tsx) untuk platform Mindstep yang modern, informatif, dan menyertakan live interactive micro-demo (habit + mood tracking playground di browser) dengan zero database overhead.

**Architecture:** Menggunakan komponen modular React 18, TypeScript, Tailwind CSS, dan Lucide Icons yang disatukan di `resources/js/Pages/Welcome.tsx`. Data auth diteruskan secara context-aware via props Inertia.js.

**Tech Stack:** Laravel 13, Inertia.js v2, React 18, TypeScript, Tailwind CSS, Lucide React, PHPUnit.

**Spec:** `docs/superpowers/specs/2026-10-30-interactive-landing-page-design.md`

## Global Constraints

- Halaman publik landing page pada rute `GET /` tidak boleh membutuhkan query database tambahan.
- Tombol navigasi dan CTA harus beradaptasi otomatis berdasarkan status `auth.user`.
- Interactive widget harus berjalan murni dengan client-side React state tanpa memanggil API database sebelum pendaftaran.
- Seluruh 152 automated backend tests yang sudah ada harus tetap 100% lulus.

---

### Task 1: Automated Feature Test untuk Landing Page

**Files:**
- Create: `tests/Feature/Landing/LandingPageTest.php`

**Interfaces:**
- Mengetes rute `GET /` via PHPUnit test runner.

- [ ] **Step 1: Tulis automated feature test untuk Landing Page**

```php
<?php

namespace Tests\Feature\Landing;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class LandingPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_landing_page_can_be_rendered(): void
    {
        $response = $this->get('/');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Welcome')
            ->has('canLogin')
            ->has('canRegister')
        );
    }

    public function test_landing_page_renders_guest_state(): void
    {
        $response = $this->get('/');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->where('auth.user', null)
        );
    }

    public function test_landing_page_renders_authenticated_state(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->where('auth.user.id', $user->id)
            ->where('auth.user.name', $user->name)
        );
    }
}
```

- [ ] **Step 2: Jalankan test untuk memverifikasi kondisi awal**

Run: `php artisan test --filter=LandingPageTest --compact`  
Expected: PASS (karena rute Welcome dasar sudah ada)

---

### Task 2: Modular Sub-Components untuk Landing Page

**Files:**
- Create: `resources/js/Components/Landing/LandingNavbar.tsx`
- Create: `resources/js/Components/Landing/HeroInteractiveWidget.tsx`
- Create: `resources/js/Components/Landing/ProblemSolutionGrid.tsx`
- Create: `resources/js/Components/Landing/FeaturesBentoGrid.tsx`
- Create: `resources/js/Components/Landing/AiAssistantSpotlight.tsx`
- Create: `resources/js/Components/Landing/DataPortabilityBanner.tsx`
- Create: `resources/js/Components/Landing/LandingFooter.tsx`

**Interfaces:**
- `LandingNavbar`: Menerima props `{ auth: { user: User | null } }` dan dark mode handler.
- `HeroInteractiveWidget`: State internal React untuk checklist dummy habit, mood score (1-5), emotion pills, dan instant feedback message.
- `AiAssistantSpotlight`: Menampilkan 3 pilar fitur AI reflektif + 3 batas etika.

- [ ] **Step 1: Buat `LandingNavbar.tsx`**
- [ ] **Step 2: Buat `HeroInteractiveWidget.tsx` dengan state interaktif**
- [ ] **Step 3: Buat `ProblemSolutionGrid.tsx`**
- [ ] **Step 4: Buat `FeaturesBentoGrid.tsx`**
- [ ] **Step 5: Buat `AiAssistantSpotlight.tsx`**
- [ ] **Step 6: Buat `DataPortabilityBanner.tsx`**
- [ ] **Step 7: Buat `LandingFooter.tsx`**

---

### Task 3: Integrasi Utuh di `resources/js/Pages/Welcome.tsx`

**Files:**
- Modify: `resources/js/Pages/Welcome.tsx`

**Interfaces:**
- Menggabungkan Navbar, Hero (dengan Interactive Widget), ProblemSolution, BentoGrid, AiSpotlight, DataPortability, dan Footer.
- Menerima props `PageProps<{ canLogin: boolean, canRegister: boolean, laravelVersion: string, phpVersion: string }>`.

- [ ] **Step 1: Tulis ulang `resources/js/Pages/Welcome.tsx` dengan layout bersih dan responsif**
- [ ] **Step 2: Pastikan styling konsisten pada tema terang dan gelap (Light & Dark Mode)**

---

### Task 4: Verifikasi Build & Pengujian Akhir

**Files:**
- Test: `tests/Feature/Landing/LandingPageTest.php`

- [ ] **Step 1: Jalankan typecheck TypeScript / frontend bundling**

Run: `npm run build`  
Expected: Build berhasil tanpa error tipe atau syntax.

- [ ] **Step 2: Jalankan test suite backend**

Run: `php artisan test --compact`  
Expected: Seluruh 155+ tests PASS.

- [ ] **Step 3: Format kode dengan Laravel Pint**

Run: `vendor/bin/pint --format agent`  
Expected: Clean.

- [ ] **Step 4: Buat commit git**

```bash
git add resources/js/ tests/Feature/Landing/ docs/
git commit -m "feat(landing): implement interactive hybrid landing page with client micro-demo"
```
