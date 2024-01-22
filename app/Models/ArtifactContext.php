<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArtifactContext extends Model
{
    use HasFactory;

    protected $fillable = [
        "field",
        "value",
        "artifact_id",
    ];

    protected $casts = [
        "artifact_id" => "integer",
    ];

    public function artifact(): BelongsTo
    {
        return $this->belongsTo(Artifact::class, "artifact_id", "id");
    }

    public function value(): Attribute
    {
        return Attribute::make(get: fn ($value) => json_validate($value) ? json_decode($value) : $value);
    }
}
