<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BoardCollaborator extends Model
{
    const ROLE_VIEWER = 0;
    const ROLE_EDITOR = 1;
    const ROLE_REVIEWER = 2;

    const ROLE_LABELS = [
        "viewer",
        "editor",
        "reviewer",
    ];

    use HasFactory;
}
