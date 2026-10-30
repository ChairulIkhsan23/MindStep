<?php

namespace App\Models;

use Database\Factories\JournalTemplateFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'slug',
    'name',
    'description',
    'prompts',
    'is_active',
    'order',
])]
class JournalTemplate extends Model
{
    /** @use HasFactory<JournalTemplateFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'prompts' => 'array',
            'is_active' => 'boolean',
            'order' => 'integer',
        ];
    }

    public function journals(): HasMany
    {
        return $this->hasMany(Journal::class, 'template_name', 'slug');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('order')->orderBy('name');
    }
}
