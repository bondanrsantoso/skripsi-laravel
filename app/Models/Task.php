<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Auth;

class Task extends Model
{
    use HasFactory;

    const PENDING = 0;
    const ON_PROGRESS = 1;
    const UNDER_REVIEW = 2;
    const NEED_REVISION = 3;
    const COMPLETED = 4;
    const CANCELED = 5;

    const StatusLabels = [
        "Pending",
        "Sedang dikerjakan",
        "Review",
        "Revisi",
        "Selesai",
        "Batal",
    ];

    const LOW = 0;
    const MED = 1;
    const HIGH = 2;

    const PriorityLabels = [
        "Rendah",
        "Sedang",
        "Tinggi",
    ];

    protected $fillable = [
        "title",
        "description",
        "status",
        "is_confirmed",
        "created_by",
        "priority",
        "due_start",
        "due_end",
        "board_id",
    ];

    protected $appends = [
        "priority_label",
        "is_deletable",
        "is_editable",
        "can_be_confirmed",
    ];

    public function priorityLabel(): Attribute
    {
        return Attribute::make(
            get: fn ($_, $attributes) =>
            Task::PriorityLabels[$attributes['priority']]
        );
    }

    public function canBeConfirmed(): Attribute
    {
        $task = $this;
        return Attribute::make(get: function ($_) use ($task) {
            if (!Auth::check()) {
                return false;
            }

            if ($task->peopleInCharge()->count() === 0) {
                return $task->assignee()
                    ->where("users.id", Auth::user()->id)
                    ->first() !== null;
            }

            return $task->peopleInCharge()
                ->where("users.id", Auth::user()->id)
                ->first() !== null;
        });
    }

    public function isEditable(): Attribute
    {
        $task = $this;
        return Attribute::make(get: function ($_, $attributes) use ($task) {
            if (!Auth::check()) {
                return false;
            }
            if ($attributes["created_by"] === Auth::user()->id) {
                return true;
            }

            $isEditable = $task->assignee()
                ->where("users.id", Auth::user()->id)
                ->first() !== null || $task->peopleInCharge()
                ->where("users.id", Auth::user()->id)
                ->first() !== null;
            return $isEditable;
        });
    }

    public function isDeletable(): Attribute
    {
        $task = $this;
        return Attribute::make(get: function ($_, $attributes) use ($task) {
            if (!Auth::check()) {
                return false;
            }
            if ($attributes["created_by"] === Auth::user()->id) {
                return true;
            }

            return $task->peopleInCharge()
                ->where("users.id", Auth::user()->id)
                ->first() !== null;
        });
    }

    public function board(): BelongsTo
    {
        return $this->belongsTo(Board::class, "board_id", "id");
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, "created_by", "id");
    }

    public function assignee(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,
            "task_assignments",
            "task_id",
            "user_id",
            "id",
            "id"
        );
    }

    public function peopleInCharge(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,
            "task_person_in_charges",
            "task_id",
            "user_id",
            "id",
            "id"
        );
    }
}
