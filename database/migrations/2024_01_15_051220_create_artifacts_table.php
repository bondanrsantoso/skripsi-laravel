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
        Schema::create('artifacts', function (Blueprint $table) {
            $table->id();
            $table->string("filename");
            $table->text("path");
            $table->text("url");
            $table->string("mime_type");
            $table->longText("text_content")->nullable();
            $table->foreignId("owner_id")->nullable()->constrained(table: "users")->nullOnDelete()->cascadeOnUpdate();
            $table->boolean("is_public")->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('artifacts');
    }
};
