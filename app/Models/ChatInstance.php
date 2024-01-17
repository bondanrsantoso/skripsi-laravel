<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChatInstance extends Model
{
    use HasFactory;

    protected $fillable = [
        "user_id",
        "title",
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, "user_id", "id");
    }

    public function messages(): HasMany
    {
        return $this->hasMany(ChatMessage::class, "instance_id", "id");
    }
}
