<?php

namespace Database\Seeders;

use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $defaultTags = [
            'Kuliah' => 'kuliah',
            'Pekerjaan' => 'pekerjaan',
            'Keluarga' => 'keluarga',
            'Pengembangan Diri' => 'pengembangan-diri',
            'Keuangan' => 'keuangan',
            'Kesehatan Pribadi' => 'kesehatan-pribadi',
        ];

        foreach ($defaultTags as $name => $slug) {
            Tag::firstOrCreate(
                ['slug' => $slug, 'user_id' => null],
                ['name' => $name]
            );
        }
    }
}
