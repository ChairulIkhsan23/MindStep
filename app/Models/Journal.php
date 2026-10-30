<?php

namespace App\Models;

use Carbon\Carbon;
use Database\Factories\JournalFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable([
    'user_id',
    'title',
    'entry_type',
    'template_name',
    'content',
    'entry_date',
    'is_draft',
    'mood_score',
    'ai_summary',
])]
class Journal extends Model
{
    /** @use HasFactory<JournalFactory> */
    use HasFactory;

    public const array TEMPLATES = [
        'daily_reflection' => [
            'name' => 'Refleksi Harian',
            'prompts' => [
                'Apa momen atau pencapaian terbaikmu hari ini?',
                'Tantangan apa yang kamu hadapi dan bagaimana caramu meresponnya?',
                'Apa satu hal yang ingin kamu tingkatkan besok?',
            ],
        ],
        'gratitude' => [
            'name' => 'Rasa Syukur',
            'prompts' => [
                'Tiga hal kecil yang kamu syukuri hari ini.',
                'Siapa sosok yang kamu hargai keberadaannya hari ini dan mengapa?',
            ],
        ],
        'problem_solving' => [
            'name' => 'Penguraian Masalah',
            'prompts' => [
                'Apa masalah spesifik yang sedang menguras energimu?',
                'Fakta nyata apa yang ada (pisahkan dari ketakutan/asumsi)?',
                'Apa satu tindakan kecil yang berada di bawah kendalimu saat ini?',
            ],
        ],
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'entry_date' => 'date',
            'is_draft' => 'boolean',
            'mood_score' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(JournalTemplate::class, 'template_name', 'slug');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }

    public function moodLog(): HasOne
    {
        return $this->hasOne(MoodLog::class);
    }

    public function setEntryDateAttribute($value): void
    {
        $this->attributes['entry_date'] = Carbon::parse($value)->toDateString();
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_draft', false);
    }

    public function scopeDrafts(Builder $query): Builder
    {
        return $query->where('is_draft', true);
    }

    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (! $search) {
            return $query;
        }

        return $query->where(function (Builder $q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
                ->orWhere('content', 'like', "%{$search}%");
        });
    }

    /**
     * @param  array<string, mixed>  $filters
     */
    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['search'] ?? null, fn (Builder $q, $search) => $q->search($search))
            ->when(isset($filters['mood_score']) && $filters['mood_score'] !== '', fn (Builder $q) => $q->where('mood_score', $filters['mood_score']))
            ->when($filters['entry_type'] ?? null, fn (Builder $q, $type) => $q->where('entry_type', $type))
            ->when($filters['start_date'] ?? null, fn (Builder $q, $start) => $q->whereDate('entry_date', '>=', $start))
            ->when($filters['end_date'] ?? null, fn (Builder $q, $end) => $q->whereDate('entry_date', '<=', $end))
            ->when(($filters['status'] ?? null) === 'published', fn (Builder $q) => $q->published())
            ->when(($filters['status'] ?? null) === 'draft', fn (Builder $q) => $q->drafts())
            ->when($filters['tag'] ?? null, function (Builder $q, $tagSlug) {
                $q->whereHas('tags', fn (Builder $tagQuery) => $tagQuery->where('slug', $tagSlug));
            });
    }
}
