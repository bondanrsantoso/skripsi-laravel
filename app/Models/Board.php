<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Auth;

class Board extends Model
{
    use HasFactory;

    protected $fillable = [
        "title",
        "project_id",
        "brief",
    ];

    public function itemCount(): Attribute
    {
        $board = $this;
        return Attribute::make(get: function ($_, $attributes) use ($board) {
            return $board->artifacts()->count();
        });
    }

    public function isEditable(): Attribute
    {
        $board = $this;
        return Attribute::make(get: function ($_) use ($board) {
            if (!Auth::check()) {
                return false;
            }

            return $board->users()
                ->wherePivot("role", BoardCollaborator::ROLE_EDITOR)
                ->where("users.id", Auth::user()->id)
                ->first() !== null;
        });
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,
            "board_collaborators",
            "board_id",
            "user_id",
            "id",
            "id"
        )->withPivot(["role"])
            ->orderByPivot("role", "desc");
    }

    public function artifacts(): BelongsToMany
    {
        return $this->belongsToMany(
            Artifact::class,
            "board_artifacts",
            "board_id",
            "artifact_id",
            "id",
            "id"
        )->withPivot(["order"])->orderByPivot("order", "asc")->with(["owner"]);
    }

    public function notes(): HasMany
    {
        return $this->hasMany(BoardNote::class, "board_id", "id");
    }

    public function items(): Attribute
    {
        $board = $this;
        return Attribute::make(get: function ($_, $__) use ($board) {
            $items = collect([]);

            $notes = $board->notes()->orderBy("order", "asc")->get();
            $artifacts = $board->artifacts()->get()->map(function ($a) {
                $a->order = $a->pivot->order ?? 0;

                return $a;
            });

            $items = $items->concat($notes)->concat($artifacts)->sortBy("order");

            return $items->values();
        });
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class, "board_id", "id");
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, "project_id", "id");
    }
}
