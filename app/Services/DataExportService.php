<?php

namespace App\Services;

use App\Models\Habit;
use App\Models\HabitLog;
use App\Models\Journal;
use App\Models\MoodLog;
use App\Models\User;
use Carbon\Carbon;
use ZipArchive;

class DataExportService
{
    /**
     * @return array<string, mixed>
     */
    public function getExportDataArray(User $user): array
    {
        $timezone = $user->timezone ?? config('app.timezone', 'UTC');

        $habits = Habit::where('user_id', $user->id)
            ->orderBy('id')
            ->get();

        $habitLogs = HabitLog::where('user_id', $user->id)
            ->with('habit:id,name')
            ->orderBy('log_date')
            ->orderBy('id')
            ->get();

        $moodLogs = MoodLog::where('user_id', $user->id)
            ->with('journal:id,title')
            ->orderBy('log_date')
            ->orderBy('id')
            ->get();

        $journals = Journal::where('user_id', $user->id)
            ->with('tags:id,name,slug')
            ->orderBy('entry_date')
            ->orderBy('id')
            ->get();

        return [
            'metadata' => [
                'export_version' => '1.0',
                'exported_at' => Carbon::now($timezone)->toIso8601String(),
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'timezone' => $user->timezone,
                    'theme' => $user->theme,
                    'ai_consent' => (bool) $user->ai_consent,
                    'created_at' => $user->created_at?->toIso8601String(),
                ],
            ],
            'habits' => $habits->map(fn (Habit $h) => [
                'id' => $h->id,
                'name' => $h->name,
                'description' => $h->description,
                'measurement_type' => $h->measurement_type,
                'target_value' => (float) $h->target_value,
                'unit' => $h->unit,
                'frequency_type' => $h->frequency_type,
                'scheduled_days' => $h->scheduled_days,
                'weekly_target_days' => $h->weekly_target_days,
                'start_date' => $h->start_date?->toDateString(),
                'end_date' => $h->end_date?->toDateString(),
                'color' => $h->color,
                'icon' => $h->icon,
                'is_archived' => (bool) $h->is_archived,
                'created_at' => $h->created_at?->toIso8601String(),
            ])->all(),
            'habit_logs' => $habitLogs->map(fn (HabitLog $l) => [
                'id' => $l->id,
                'habit_id' => $l->habit_id,
                'habit_name' => $l->habit?->name,
                'log_date' => $l->log_date?->toDateString(),
                'actual_value' => (float) $l->actual_value,
                'status' => $l->status,
                'notes' => $l->notes,
                'created_at' => $l->created_at?->toIso8601String(),
            ])->all(),
            'mood_logs' => $moodLogs->map(fn (MoodLog $m) => [
                'id' => $m->id,
                'log_date' => $m->log_date?->toDateString(),
                'mood_score' => $m->mood_score,
                'emotions' => $m->emotions ?? [],
                'note' => $m->note,
                'journal_id' => $m->journal_id,
                'journal_title' => $m->journal?->title,
                'created_at' => $m->created_at?->toIso8601String(),
            ])->all(),
            'journals' => $journals->map(fn (Journal $j) => [
                'id' => $j->id,
                'title' => $j->title,
                'entry_type' => $j->entry_type,
                'template_name' => $j->template_name,
                'content' => $j->content,
                'entry_date' => $j->entry_date?->toDateString(),
                'is_draft' => (bool) $j->is_draft,
                'mood_score' => $j->mood_score,
                'tags' => $j->tags->pluck('name')->all(),
                'ai_summary' => $j->ai_summary,
                'created_at' => $j->created_at?->toIso8601String(),
            ])->all(),
        ];
    }

    public function generateJson(User $user): string
    {
        $data = $this->getExportDataArray($user);

        return (string) json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    public function generateCsvZip(User $user): string
    {
        $data = $this->getExportDataArray($user);

        $tempZipPath = tempnam(sys_get_temp_dir(), 'mindstep_export_').'.zip';
        $zip = new ZipArchive;

        if ($zip->open($tempZipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            throw new \RuntimeException('Gagal membuat berkas arsip zip untuk ekspor.');
        }

        // 1. habits.csv
        $habitsCsv = $this->createCsvString(
            ['ID', 'Name', 'Description', 'Measurement Type', 'Target Value', 'Unit', 'Frequency Type', 'Scheduled Days', 'Weekly Target Days', 'Start Date', 'End Date', 'Color', 'Icon', 'Is Archived', 'Created At'],
            array_map(fn ($h) => [
                $h['id'],
                $h['name'],
                $h['description'],
                $h['measurement_type'],
                $h['target_value'],
                $h['unit'],
                $h['frequency_type'],
                is_array($h['scheduled_days']) ? implode(',', $h['scheduled_days']) : '',
                $h['weekly_target_days'],
                $h['start_date'],
                $h['end_date'],
                $h['color'],
                $h['icon'],
                $h['is_archived'] ? 'Yes' : 'No',
                $h['created_at'],
            ], $data['habits'])
        );
        $zip->addFromString('habits.csv', $habitsCsv);

        // 2. habit_logs.csv
        $habitLogsCsv = $this->createCsvString(
            ['ID', 'Habit ID', 'Habit Name', 'Log Date', 'Actual Value', 'Status', 'Notes', 'Created At'],
            array_map(fn ($l) => [
                $l['id'],
                $l['habit_id'],
                $l['habit_name'],
                $l['log_date'],
                $l['actual_value'],
                $l['status'],
                $l['notes'],
                $l['created_at'],
            ], $data['habit_logs'])
        );
        $zip->addFromString('habit_logs.csv', $habitLogsCsv);

        // 3. mood_logs.csv
        $moodLogsCsv = $this->createCsvString(
            ['ID', 'Log Date', 'Mood Score', 'Emotions', 'Note', 'Journal ID', 'Journal Title', 'Created At'],
            array_map(fn ($m) => [
                $m['id'],
                $m['log_date'],
                $m['mood_score'],
                implode(', ', $m['emotions']),
                $m['note'],
                $m['journal_id'],
                $m['journal_title'],
                $m['created_at'],
            ], $data['mood_logs'])
        );
        $zip->addFromString('mood_logs.csv', $moodLogsCsv);

        // 4. journals.csv
        $journalsCsv = $this->createCsvString(
            ['ID', 'Title', 'Entry Type', 'Template Name', 'Content', 'Entry Date', 'Is Draft', 'Mood Score', 'Tags', 'AI Summary', 'Created At'],
            array_map(fn ($j) => [
                $j['id'],
                $j['title'],
                $j['entry_type'],
                $j['template_name'],
                $j['content'],
                $j['entry_date'],
                $j['is_draft'] ? 'Yes' : 'No',
                $j['mood_score'],
                implode(', ', $j['tags']),
                $j['ai_summary'],
                $j['created_at'],
            ], $data['journals'])
        );
        $zip->addFromString('journals.csv', $journalsCsv);

        $zip->close();

        return $tempZipPath;
    }

    /**
     * @param  array<string>  $headers
     * @param  array<int, array<mixed>>  $rows
     */
    private function createCsvString(array $headers, array $rows): string
    {
        $handle = fopen('php://temp', 'r+');
        if ($handle === false) {
            return '';
        }

        // Add UTF-8 BOM for Excel compatibility
        fwrite($handle, "\xEF\xBB\xBF");

        fputcsv($handle, $headers);

        foreach ($rows as $row) {
            fputcsv($handle, $row);
        }

        rewind($handle);
        $csvContent = (string) stream_get_contents($handle);
        fclose($handle);

        return $csvContent;
    }
}
