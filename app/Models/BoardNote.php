<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BoardNote extends Model
{
    use HasFactory;

    protected $fillable = [
        "content",
        "board_id",
        "order",
    ];

    protected $casts = [
        "board_id" => "integer",
        "order" => "integer",
    ];

    protected $attributes = [
        "content" => "",
        "order" => 0,
    ];

    protected $appends = [
        "type"
    ];

    public function type(): Attribute
    {
        return Attribute::make(get: fn ($_) => "text");
    }

    public function board(): BelongsTo
    {
        return $this->belongsTo(Board::class, "board_id", "id");
    }
}
