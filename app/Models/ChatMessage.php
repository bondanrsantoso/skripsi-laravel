<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChatMessage extends Model
{
    const ROLE_HUMAN = "human";
    const ROLE_AI = "ai";
    const ROLE_SYSTEM = "system";

    use HasFactory;

    protected $fillable = [
        "instance_id",
        "content",
        "role",
    ];

    public function instance(): BelongsTo
    {
        return $this->belongsTo(ChatInstance::class, "instance_id", "id");
    }
}
