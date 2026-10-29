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
        Schema::create('journals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title')->nullable();
            $table->string('entry_type', 20)->default('freeform'); // freeform, template
            $table->string('template_name')->nullable();
            $table->longText('content');
            $table->date('entry_date');
            $table->boolean('is_draft')->default(false);
            $table->unsignedTinyInteger('mood_score')->nullable(); // 1 - 5
            $table->text('ai_summary')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'entry_date']);
            $table->index(['user_id', 'is_draft']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('journals');
    }
};
