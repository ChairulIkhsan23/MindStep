<?php

namespace Database\Seeders;

use App\Models\JournalTemplate;
use Illuminate\Database\Seeder;

class JournalTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $templates = [
            [
                'slug' => 'daily_reflection',
                'name' => 'Refleksi Harian',
                'description' => 'Evaluasi pencapaian, respon terhadap tantangan, dan target perbaikan untuk esok hari.',
                'prompts' => [
                    'Apa momen atau pencapaian terbaikmu hari ini?',
                    'Tantangan apa yang kamu hadapi dan bagaimana caramu meresponnya?',
                    'Apa satu hal yang ingin kamu tingkatkan besok?',
                ],
                'is_active' => true,
                'order' => 1,
            ],
            [
                'slug' => 'gratitude',
                'name' => 'Rasa Syukur',
                'description' => 'Apresiasi hal-hal baik dan sosok bermakna yang memperkaya harimu.',
                'prompts' => [
                    'Tiga hal kecil yang kamu syukuri hari ini.',
                    'Siapa sosok yang kamu hargai keberadaannya hari ini dan mengapa?',
                ],
                'is_active' => true,
                'order' => 2,
            ],
            [
                'slug' => 'problem_solving',
                'name' => 'Penguraian Masalah',
                'description' => 'Membedah kecemasan menjadi fakta objektif dan satu aksi nyata di bawah kendalimu.',
                'prompts' => [
                    'Apa masalah spesifik yang sedang menguras energimu?',
                    'Fakta nyata apa yang ada (pisahkan dari ketakutan/asumsi)?',
                    'Apa satu tindakan kecil yang berada di bawah kendalimu saat ini?',
                ],
                'is_active' => true,
                'order' => 3,
            ],
        ];

        foreach ($templates as $template) {
            JournalTemplate::updateOrCreate(
                ['slug' => $template['slug']],
                $template
            );
        }
    }
}
