<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectTeam extends Model
{
    use HasFactory;

    // protected $attributes = [
    //     "expired_at" => date("31 december"),
    // ];

    protected $fillable = [
        "user_id",
        "project_id",
        "name",
        "position",
        "expired_at",
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, "project_id", "id");
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, "user_id", "id");
    }
}
