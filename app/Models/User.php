<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    protected $appends = ["photo_url"];

    protected function photoUrl(): Attribute
    {
        return Attribute::make(
            get: function ($value, $attributes) {
                return "https://placehold.co/400x400/000000/FFF?text=" . strtoupper(substr($attributes["name"], 0, 1));
            }
        );
    }

    public function managedProjects(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,
            "project_managers",
            "user_id",
            "project_id",
            "id",
            "id"
        );
    }

    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,
            "project_teams",
            "user_id",
            "project_id",
            "id",
            "id"
        )->withPivot(["position", "expired_at"]);
    }

    public function boards(): BelongsToMany
    {
        return $this->belongsToMany(
            Board::class,
            "board_collaborators",
            "user_id",
            "board_id",
            "id",
            "id"
        );
    }

    public function chats(): HasMany
    {
        return $this->hasMany(ChatInstance::class, "user_id", "id");
    }
}
