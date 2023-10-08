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
        try {
            Schema::create('project_teams', function (Blueprint $table) {
                $table->id();
                $table->foreignId("project_id")->constrained(table: 'projects')->cascadeOnUpdate()->cascadeOnDelete();
                $table->foreignId("user_id")->nullable()->constrained(table: 'users')->cascadeOnUpdate()->nullOnDelete();
                $table->string("name")->nullable()->comment("Filled for external collaborator");
                $table->string("position")->nullable();
                $table->boolean("external")->virtualAs("ISNULL(user_id)");
                $table->dateTime("expired_at");
                $table->timestamps();
            });
        } catch (\Throwable $th) {
            $this->down();
            throw $th;
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_teams');
    }
};
