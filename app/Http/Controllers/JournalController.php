<?php

namespace App\Http\Controllers;

use App\Http\Requests\Journal\StoreJournalRequest;
use App\Http\Requests\Journal\UpdateJournalRequest;
use App\Models\Journal;
use App\Models\JournalTemplate;
use App\Models\MoodLog;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class JournalController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $filters = $request->only([
            'search',
            'tag',
            'mood_score',
            'entry_type',
            'start_date',
            'end_date',
            'status',
        ]);

        $query = Journal::with(['tags', 'moodLog'])
            ->where('user_id', $user->id)
            ->filter($filters)
            ->orderBy('entry_date', 'desc')
            ->orderBy('created_at', 'desc');

        $draftCount = Journal::where('user_id', $user->id)->drafts()->count();

        $journals = $query->paginate(10)->withQueryString();

        $availableTags = Tag::availableFor($user->id)->orderBy('name')->get(['id', 'name', 'slug']);

        return Inertia::render('Journals/Index', [
            'journals' => $journals->through(fn (Journal $j) => $this->transformJournalSummary($j)),
            'filters' => $filters,
            'available_tags' => $availableTags,
            'draft_count' => $draftCount,
        ]);
    }

    public function create(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Journals/Create', [
            'templates' => JournalTemplate::active()->ordered()->get(['slug', 'name', 'description', 'prompts']),
            'available_tags' => Tag::availableFor($user->id)->orderBy('name')->get(['id', 'name', 'slug']),
            'available_emotions' => MoodLog::AVAILABLE_EMOTIONS,
        ]);
    }

    public function store(StoreJournalRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        $journal = DB::transaction(function () use ($user, $validated) {
            $journalData = [
                'title' => $validated['title'] ?? null,
                'entry_type' => $validated['entry_type'],
                'template_name' => $validated['entry_type'] === 'template' ? ($validated['template_name'] ?? null) : null,
                'content' => $validated['content'],
                'entry_date' => $validated['entry_date'],
                'is_draft' => $validated['is_draft'] ?? false,
                'mood_score' => $validated['mood_score'] ?? null,
            ];

            $journal = $user->journals()->create($journalData);

            $this->syncTags($journal, $user->id, $validated['tags'] ?? []);
            $this->syncMoodLog($journal, $user->id, $validated);

            return $journal;
        });

        $message = $journal->is_draft ? 'Draf jurnal berhasil disimpan.' : 'Jurnal berhasil diterbitkan.';

        return redirect()->route('journals.index')->with('success', $message);
    }

    public function show(Journal $journal): Response
    {
        Gate::authorize('view', $journal);

        $journal->load(['tags', 'moodLog']);

        return Inertia::render('Journals/Show', [
            'journal' => [
                'id' => $journal->id,
                'title' => $journal->title,
                'entry_type' => $journal->entry_type,
                'template_name' => $journal->template_name,
                'content' => $journal->content,
                'entry_date' => $journal->entry_date->toDateString(),
                'is_draft' => $journal->is_draft,
                'mood_score' => $journal->mood_score,
                'ai_summary' => $journal->ai_summary,
                'created_at' => $journal->created_at?->toIso8601String(),
                'tags' => $journal->tags->map(fn (Tag $t) => ['id' => $t->id, 'name' => $t->name, 'slug' => $t->slug]),
                'mood_log' => $journal->moodLog ? [
                    'id' => $journal->moodLog->id,
                    'mood_score' => $journal->moodLog->mood_score,
                    'emotions' => $journal->moodLog->emotions,
                    'note' => $journal->moodLog->note,
                ] : null,
            ],
        ]);
    }

    public function edit(Request $request, Journal $journal): Response
    {
        Gate::authorize('update', $journal);

        $user = $request->user();
        $journal->load(['tags', 'moodLog']);

        return Inertia::render('Journals/Edit', [
            'journal' => [
                'id' => $journal->id,
                'title' => $journal->title,
                'entry_type' => $journal->entry_type,
                'template_name' => $journal->template_name,
                'content' => $journal->content,
                'entry_date' => $journal->entry_date->toDateString(),
                'is_draft' => $journal->is_draft,
                'mood_score' => $journal->mood_score,
                'tags' => $journal->tags->pluck('name'),
                'emotions' => $journal->moodLog?->emotions ?? [],
            ],
            'templates' => JournalTemplate::active()->ordered()->get(['slug', 'name', 'description', 'prompts']),
            'available_tags' => Tag::availableFor($user->id)->orderBy('name')->get(['id', 'name', 'slug']),
            'available_emotions' => MoodLog::AVAILABLE_EMOTIONS,
        ]);
    }

    public function update(UpdateJournalRequest $request, Journal $journal): RedirectResponse
    {
        Gate::authorize('update', $journal);

        $user = $request->user();
        $validated = $request->validated();

        DB::transaction(function () use ($journal, $user, $validated) {
            $journalData = [
                'title' => $validated['title'] ?? $journal->title,
                'entry_type' => $validated['entry_type'] ?? $journal->entry_type,
                'template_name' => ($validated['entry_type'] ?? $journal->entry_type) === 'template'
                    ? ($validated['template_name'] ?? $journal->template_name)
                    : null,
                'content' => $validated['content'] ?? $journal->content,
                'entry_date' => $validated['entry_date'] ?? $journal->entry_date->toDateString(),
                'is_draft' => $validated['is_draft'] ?? $journal->is_draft,
                'mood_score' => array_key_exists('mood_score', $validated) ? $validated['mood_score'] : $journal->mood_score,
            ];

            $journal->update($journalData);

            if (array_key_exists('tags', $validated)) {
                $this->syncTags($journal, $user->id, $validated['tags'] ?? []);
            }

            $this->syncMoodLog($journal, $user->id, $validated);
        });

        $message = $journal->is_draft ? 'Draf jurnal berhasil diperbarui.' : 'Jurnal berhasil diperbarui.';

        return redirect()->route('journals.index')->with('success', $message);
    }

    public function destroy(Journal $journal): RedirectResponse
    {
        Gate::authorize('delete', $journal);

        $journal->delete();

        return redirect()->route('journals.index')->with('success', 'Jurnal berhasil dihapus.');
    }

    /**
     * @param  array<string>  $tagNames
     */
    private function syncTags(Journal $journal, int $userId, array $tagNames): void
    {
        $tagIds = [];

        foreach ($tagNames as $name) {
            $trimmed = trim($name);
            if ($trimmed === '') {
                continue;
            }

            $slug = Str::slug($trimmed);

            // Search for existing system tag or user tag
            $tag = Tag::where('slug', $slug)
                ->where(fn ($q) => $q->whereNull('user_id')->orWhere('user_id', $userId))
                ->first();

            if (! $tag) {
                $tag = Tag::create([
                    'user_id' => $userId,
                    'name' => $trimmed,
                    'slug' => $slug,
                ]);
            }

            $tagIds[] = $tag->id;
        }

        $journal->tags()->sync(array_unique($tagIds));
    }

    /**
     * @param  array<string, mixed>  $validated
     */
    private function syncMoodLog(Journal $journal, int $userId, array $validated): void
    {
        $moodScore = $validated['mood_score'] ?? null;
        $emotions = $validated['emotions'] ?? null;
        $entryDate = $validated['entry_date'] ?? $journal->entry_date->toDateString();

        if ($moodScore) {
            MoodLog::updateOrCreate(
                ['journal_id' => $journal->id],
                [
                    'user_id' => $userId,
                    'log_date' => $entryDate,
                    'mood_score' => $moodScore,
                    'emotions' => $emotions,
                    'note' => $journal->title ? "Refleksi: {$journal->title}" : null,
                ]
            );
        } else {
            // Remove attached mood log if mood score unset
            $journal->moodLog()->delete();
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function transformJournalSummary(Journal $journal): array
    {
        return [
            'id' => $journal->id,
            'title' => $journal->title,
            'entry_type' => $journal->entry_type,
            'template_name' => $journal->template_name,
            'excerpt' => Str::limit(strip_tags($journal->content), 140),
            'entry_date' => $journal->entry_date->toDateString(),
            'is_draft' => $journal->is_draft,
            'mood_score' => $journal->mood_score,
            'tags' => $journal->tags->map(fn (Tag $t) => [
                'id' => $t->id,
                'name' => $t->name,
                'slug' => $t->slug,
            ])->values(),
            'created_at' => $journal->created_at?->toIso8601String(),
        ];
    }
}
