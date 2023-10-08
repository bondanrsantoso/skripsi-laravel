<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectPurpose extends Model
{
    use HasFactory;

    protected $fillable = [
        "description",
        "consideration",
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, "project_id", "id");
    }
}
