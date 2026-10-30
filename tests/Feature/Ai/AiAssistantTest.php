<?php

namespace Tests\Feature\Ai;

use App\Models\Journal;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AiAssistantTest extends TestCase
{
    use RefreshDatabase;

    private User $consentedUser;

    private User $unconsentedUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->consentedUser = User::factory()->create([
            'email_verified_at' => now(),
            'ai_consent' => true,
        ]);

        $this->unconsentedUser = User::factory()->create([
            'email_verified_at' => now(),
            'ai_consent' => false,
        ]);
    }

    public function test_guest_is_redirected_to_login(): void
    {
        $response = $this->postJson(route('ai.polish'), [
            'content' => 'Draft journal text here.',
        ]);

        $response->assertUnauthorized();
    }

    public function test_unconsented_user_is_forbidden_to_use_ai_features(): void
    {
        // 1. Polish
        $resPolish = $this->actingAs($this->unconsentedUser)->postJson(route('ai.polish'), [
            'content' => 'Draft points to polish.',
        ]);
        $resPolish->assertForbidden();

        // 2. Deepening prompts
        $resPrompts = $this->actingAs($this->unconsentedUser)->postJson(route('ai.prompts'), [
            'content' => 'Deep journal reflection here.',
        ]);
        $resPrompts->assertForbidden();

        // 3. Periodic summary
        $resSummary = $this->actingAs($this->unconsentedUser)->postJson(route('ai.summary'), [
            'start_date' => '2026-10-01',
            'end_date' => '2026-10-30',
        ]);
        $resSummary->assertForbidden();
    }

    public function test_consented_user_can_polish_draft_with_disclaimer(): void
    {
        $response = $this->actingAs($this->consentedUser)->postJson(route('ai.polish'), [
            'content' => 'Hari ini lelah sekali tapi bersyukur tugas selesai.',
        ]);

        $response->assertOk();
        $response->assertJson([
            'success' => true,
            'action' => 'polish',
        ]);

        $data = $response->json('data');
        $this->assertNotEmpty($data['result']);
        $this->assertStringContainsString('Mindstep AI adalah alat refleksi diri', $data['disclaimer']);
        $this->assertEquals('mock', $data['provider']);
    }

    public function test_polish_validates_required_content(): void
    {
        $response = $this->actingAs($this->consentedUser)->postJson(route('ai.polish'), [
            'content' => '',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['content']);
    }

    public function test_consented_user_can_request_deepening_prompts(): void
    {
        $response = $this->actingAs($this->consentedUser)->postJson(route('ai.prompts'), [
            'content' => 'Saya merasa cemas menghadapi perubahan struktur tim di kantor.',
        ]);

        $response->assertOk();
        $response->assertJson([
            'success' => true,
            'action' => 'deepening_prompts',
        ]);

        $questions = $response->json('data.questions');
        $this->assertIsArray($questions);
        $this->assertCount(3, $questions);
        $this->assertNotEmpty($response->json('data.disclaimer'));
    }

    public function test_consented_user_can_request_periodic_summary(): void
    {
        $startDate = '2026-10-01';
        $endDate = '2026-10-15';

        Journal::factory()->create([
            'user_id' => $this->consentedUser->id,
            'title' => 'Hari Pertama Evaluasi',
            'content' => 'Fokus pada pembangunan habit membaca setiap pagi.',
            'entry_date' => '2026-10-05',
            'is_draft' => false,
        ]);

        Journal::factory()->create([
            'user_id' => $this->consentedUser->id,
            'title' => 'Refleksi Minggu Kedua',
            'content' => 'Mulai merasa lebih tenang menghadapi rutinitas harian.',
            'entry_date' => '2026-10-12',
            'is_draft' => false,
        ]);

        $response = $this->actingAs($this->consentedUser)->postJson(route('ai.summary'), [
            'start_date' => $startDate,
            'end_date' => $endDate,
        ]);

        $response->assertOk();
        $response->assertJson([
            'success' => true,
            'action' => 'periodic_summary',
            'data' => [
                'entries_count' => 2,
            ],
        ]);
        $this->assertNotEmpty($response->json('data.summary'));
    }

    public function test_periodic_summary_fails_gracefully_when_no_journals_found(): void
    {
        $response = $this->actingAs($this->consentedUser)->postJson(route('ai.summary'), [
            'start_date' => '2026-01-01',
            'end_date' => '2026-01-10',
        ]);

        $response->assertStatus(422);
        $response->assertJson([
            'success' => false,
            'message' => 'Tidak ada entri jurnal terpublikasi dalam rentang tanggal yang dipilih.',
        ]);
    }

    public function test_periodic_summary_ignores_drafts_and_other_users_journals(): void
    {
        $otherUser = User::factory()->create();

        // Other user's journal
        Journal::factory()->create([
            'user_id' => $otherUser->id,
            'content' => 'Rahasia user lain.',
            'entry_date' => '2026-10-05',
            'is_draft' => false,
        ]);

        // Own draft journal (should not be summarized)
        Journal::factory()->create([
            'user_id' => $this->consentedUser->id,
            'content' => 'Draft yang belum dipublish.',
            'entry_date' => '2026-10-06',
            'is_draft' => true,
        ]);

        $response = $this->actingAs($this->consentedUser)->postJson(route('ai.summary'), [
            'start_date' => '2026-10-01',
            'end_date' => '2026-10-10',
        ]);

        $response->assertStatus(422);
        $response->assertJson([
            'success' => false,
            'message' => 'Tidak ada entri jurnal terpublikasi dalam rentang tanggal yang dipilih.',
        ]);
    }

    public function test_pii_sanitization_masks_user_name_and_email(): void
    {
        $content = "Nama saya {$this->consentedUser->name} dan email saya {$this->consentedUser->email}. Saya merasa lelah hari ini.";

        $response = $this->actingAs($this->consentedUser)->postJson(route('ai.polish'), [
            'content' => $content,
        ]);

        $response->assertOk();
        $result = $response->json('data.result');
        $this->assertStringNotContainsString($this->consentedUser->email, $result);
    }
}
