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
            Schema::create('project_purposes', function (Blueprint $table) {
                $table->id();
                $table->foreignId("project_id")->constrained(table: "projects")->cascadeOnDelete()->cascadeOnUpdate();
                $table->text("description");
                $table->text("consideration")->nullable();
                $table->timestamps();

                // Add fulltext indices
                $table->fullText(["description", "consideration"], "project_purposes_fulltext");
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
        Schema::dropIfExists('project_purposes');
    }
};
