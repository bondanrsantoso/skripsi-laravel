<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (!app()->isProduction() && env("APP_DEBUG", false)) {
            Schema::disableForeignKeyConstraints();
            DB::table("users")->truncate();
            Schema::enableForeignKeyConstraints();
        }

        try {
            DB::beginTransaction();
            \App\Models\User::factory(12)->create();

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }
}
