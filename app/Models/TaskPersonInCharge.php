<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskPersonInCharge extends Model
{
    use HasFactory;

    protected $fillable = [
        "user_id",
        "task_id"
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, "user_id", "id");
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class, "task_id", "id");
    }
}
