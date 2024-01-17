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
        Schema::create('board_artifacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId("board_id")->constrained(table: "boards");
            $table->foreignId("artifact_id")->constrained(table: "artifacts");
            $table->unsignedSmallInteger("order")->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('board_artifacts');
    }
};
