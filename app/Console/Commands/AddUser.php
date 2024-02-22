<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Laravel\Prompts\Output\ConsoleOutput;

class AddUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:add {email} {name?} {password?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Add new user, e.g. user:add [email] [name (optional)] [password (optional)]';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument("email");
        $name = $this->argument("name") ?? explode("@", $email)[0];
        $password = $this->argument("password") ?? "password";

        $con = new ConsoleOutput();

        $con->write("Inserting user {$name} ({$email})...");
        \App\Models\User::factory()->create([
            "email" => $email,
            "name" => $name,
            "password" => Hash::make($password)
        ]);
        $con->writeln("[DONE]");
    }
}
