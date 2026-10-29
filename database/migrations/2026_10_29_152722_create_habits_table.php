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
        Schema::create('habits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('measurement_type', 20)->default('boolean'); // boolean, quantitative, duration
            $table->decimal('target_value', 10, 2)->default(1);
            $table->string('unit', 50)->nullable();
            $table->string('frequency_type', 20)->default('daily'); // daily, specific_days, weekly_target
            $table->json('scheduled_days')->nullable(); // [1, 2, 3, 4, 5, 6, 7] (1 = Monday, 7 = Sunday)
            $table->unsignedTinyInteger('weekly_target_days')->nullable(); // e.g. 4
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->string('color', 30)->default('#4f46e5');
            $table->string('icon', 50)->nullable();
            $table->boolean('is_archived')->default(false);
            $table->timestamps();

            $table->index(['user_id', 'is_archived']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('habits');
    }
};
