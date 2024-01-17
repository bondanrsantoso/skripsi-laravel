<?php

use App\Models\ChatMessage;
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
        Schema::create('chat_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId("instance_id")->constrained(table: "chat_instances")->cascadeOnDelete()->cascadeOnUpdate();
            $table->mediumText("content");
            $table->enum("role", [ChatMessage::ROLE_AI, ChatMessage::ROLE_HUMAN, ChatMessage::ROLE_SYSTEM]);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_messages');
    }
};
