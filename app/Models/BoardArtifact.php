<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BoardArtifact extends Model
{
    use HasFactory;

    protected $fillable = [
        "board_id",
        "artifact_id",
    ];

    protected $casts = [
        "board_id" => "integer",
        "artifact_id" => "integer",
    ];

    public function artifact(): BelongsTo
    {
        return $this->belongsTo(Artifact::class, "artifact_id", "id");
    }

    public function board(): BelongsTo
    {
        return $this->belongsTo(Board::class, "board_id", "id");
    }
}
