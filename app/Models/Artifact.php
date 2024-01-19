<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Artifact extends Model
{
    use HasFactory;

    const MIME_PDF = 'application/pdf';
    const MIME_XLSX =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const MIME_XLS = 'application/vnd.ms-excel';
    const MIME_DOCX =
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    const MIME_DOC = 'application/msword';
    const MIME_PPTX =
    'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    const MIME_PPT = 'application/vnd.ms-powerpoint';
    const MIME_HTML = 'text/html';
    const MIME_XML = 'application/xml';
    const MIME_JSON = 'application/json';
    const MIME_CSV = 'text/csv';
    const MIME_TXT = 'text/plain';


    protected $fillable = [
        "filename",
        "url",
        "path",
        "mime_type",
        "text_content",
        "owner_id",
        "is_public",
    ];

    protected $casts = [
        "owner_id" => "integer",
        "is_public" => "boolean",
    ];

    protected $appends = [
        "type",
        // "filename",
    ];

    // protected $attributes = [
    //     "text_content"
    // ]

    public function type(): Attribute
    {
        return Attribute::make(get: fn ($_) => "file");
    }

    public function url(): Attribute
    {
        return Attribute::make(get: fn ($value) => url($value));
    }

    // public function filename(): Attribute
    // {
    //     return Attribute::make(
    //         get: fn ($value, $attributes) => array_reverse(explode('/', $attributes["url"]))[0]
    //     );
    // }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, "owner_id", "id");
    }

    public function contexts(): HasMany
    {
        return $this->hasMany(ArtifactContext::class, "artifact_id", "id");
    }

    public function boards(): BelongsToMany
    {
        return $this->belongsToMany(
            Board::class,
            "board_artifacts",
            "artifact_id",
            "board_id",
            "id",
            "id"
        );
    }
}
