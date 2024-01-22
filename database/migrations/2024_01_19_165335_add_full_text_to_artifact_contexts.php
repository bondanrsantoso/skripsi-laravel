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
        Schema::table('artifact_contexts', function (Blueprint $table) {
            $table->fullText("value", "artifact_contexts_value_fulltext");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('artifact_contexts', function (Blueprint $table) {
            $table->dropFullText("artifact_contexts_value_fulltext");
        });
    }
};
