<?php

use App\Models\BoardCollaborator;
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
        Schema::create('board_collaborators', function (Blueprint $table) {
            $table->id();
            $table->foreignId("board_id")->constrained(table: "boards")->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId("user_id")->constrained(table: "users")->cascadeOnDelete()->cascadeOnUpdate();
            $table->tinyInteger("role")->default(BoardCollaborator::ROLE_VIEWER);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('board_collaborators');
    }
};
