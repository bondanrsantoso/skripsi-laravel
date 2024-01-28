<?php

use App\Models\User;
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
        Schema::table('users', function (Blueprint $table) {
            $table->text("photo_url");
            $table->unsignedTinyInteger("role")->default(User::ROLE_USER);
            $table->string("job_title")->default("Pegawai");
            $table->foreignId("superior_id")->nullable()->constrained(table: "users")->nullOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn("photo_url");
            $table->dropColumn("role");
            $table->dropColumn("job_title")->default("Pegawai");
            $table->dropForeign("users_superior_id_foreign");
            $table->dropColumn("superior_id");
        });
    }
};
