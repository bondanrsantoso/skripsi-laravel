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
        Schema::create('artifact_contexts', function (Blueprint $table) {
            $table->id();
            $table->string("field")->default("contextual_information");
            $table->text("value");
            $table->foreignId("artifact_id")->constrained(table: "artifacts")->cascadeOnDelete()->cascadeOnUpdate();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('artifact_contexts');
    }
};
