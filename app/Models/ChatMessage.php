<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    const ROLE_HUMAN = "human";
    const ROLE_AI = "ai";
    const ROLE_SYSTEM = "system";

    use HasFactory;
}
