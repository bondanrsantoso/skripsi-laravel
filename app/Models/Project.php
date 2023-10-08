<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        "name",
        "description",
        "start_date",
        "end_date",
        "client_name",
        "client_email",
        "client_phone",
        "budget",
    ];

    public function managers(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,
            "project_managers",
            "project_id",
            "user_id",
            "id",
            "id"
        );
    }

    public function purposes(): HasMany
    {
        return $this->hasMany(ProjectPurpose::class, "project_id", "id");
    }

    public function objectives(): HasMany
    {
        return $this->hasMany(ProjectObjective::class, "project_id", "id");
    }

    public function services(): HasMany
    {
        return $this->hasMany(ProjectService::class, "project_id", "id");
    }

    public function deliverables(): HasMany
    {
        return $this->hasMany(ProjectDeliverable::class, "project_id", "id");
    }

    public function requirements(): HasMany
    {
        return $this->hasMany(ProjectRequirement::class, "project_id", "id");
    }

    public function outOfScopes(): HasMany
    {
        return $this->hasMany(ProjectOutOfScope::class, "project_id", "id");
    }

    public function internalMembers(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,
            "project_teams",
            "project_id",
            "user_id",
            "id",
            "id"
        )->withPivot(["position", "expired_at"]);
    }

    public function externalMembers(): HasMany
    {
        return $this->hasMany(ProjectTeam::class, "project_id", "id")->where("external", true);
    }
}
