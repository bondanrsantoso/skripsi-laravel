<?php

namespace App\Observers;

use App\Models\Artifact;

class ArtifactObserver
{
    /**
     * Handle the Artifact "created" event.
     */
    public function created(Artifact $artifact): void
    {
        //
    }

    /**
     * Handle the Artifact "updated" event.
     */
    public function updated(Artifact $artifact): void
    {
        //
    }

    /**
     * Handle the Artifact "deleted" event.
     */
    public function deleted(Artifact $artifact): void
    {
        //
    }

    /**
     * Handle the Artifact "restored" event.
     */
    public function restored(Artifact $artifact): void
    {
        //
    }

    /**
     * Handle the Artifact "force deleted" event.
     */
    public function forceDeleted(Artifact $artifact): void
    {
        //
    }
}
