<?php

use App\Models\Task;
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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string("title");
            $table->text("description")->nullable();
            $table->unsignedTinyInteger("status")->default(Task::PENDING);
            $table->boolean("is_confirmed")->default(false);
            $table->unsignedTinyInteger("priority")->default(Task::LOW);
            $table->dateTime("due_start")->nullable();
            $table->dateTime("due_end")->nullable();
            $table->foreignId("created_by")->nullable()->constrained(table: "users")->nullOnDelete()->cascadeOnUpdate();
            $table->foreignId("board_id")->constrained(table: "boards")->cascadeOnDelete()->cascadeOnUpdate();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
