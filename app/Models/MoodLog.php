<?php

namespace App\Models;

use Carbon\Carbon;
use Database\Factories\MoodLogFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'user_id',
    'journal_id',
    'log_date',
    'mood_score',
    'emotions',
    'note',
])]
class MoodLog extends Model
{
    /** @use HasFactory<MoodLogFactory> */
    use HasFactory;

    public const array AVAILABLE_EMOTIONS = [
        'Senang',
        'Bersemangat',
        'Percaya Diri',
        'Bangga',
        'Penuh Energi',
        'Tenang',
        'Damai',
        'Bersyukur',
        'Santai',
        'Nyaman',
        'Cemas',
        'Takut',
        'Kewalahan',
        'Panik',
        'Gelisah',
        'Lelah',
        'Mengantuk',
        'Bosan',
        'Hampa',
        'Lesu',
        'Sedih',
        'Kecewa',
        'Marah',
        'Kesepian',
        'Iritabel',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'log_date' => 'date',
            'mood_score' => 'integer',
            'emotions' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function journal(): BelongsTo
    {
        return $this->belongsTo(Journal::class);
    }

    public function setLogDateAttribute($value): void
    {
        $this->attributes['log_date'] = Carbon::parse($value)->toDateString();
    }

    public function scopeForDate(Builder $query, string $date): Builder
    {
        return $query->whereDate('log_date', $date);
    }
}
