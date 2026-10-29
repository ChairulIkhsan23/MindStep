<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('habits', function (Blueprint $table) {
            $table->index(['user_id', 'is_archived', 'start_date'], 'habits_user_archive_start_index');
        });

        Schema::table('journals', function (Blueprint $table) {
            $table->index(['user_id', 'mood_score'], 'journals_user_mood_index');
        });

        Schema::table('journal_tag', function (Blueprint $table) {
            $table->index('tag_id', 'journal_tag_tag_id_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('habits', function (Blueprint $table) {
            $table->dropIndex('habits_user_archive_start_index');
        });

        Schema::table('journals', function (Blueprint $table) {
            $table->dropIndex('journals_user_mood_index');
        });

        Schema::table('journal_tag', function (Blueprint $table) {
            $table->dropIndex('journal_tag_tag_id_index');
        });
    }
};
