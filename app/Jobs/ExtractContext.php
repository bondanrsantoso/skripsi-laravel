<?php

namespace App\Jobs;

use App\Models\Artifact;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ExtractContext implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    const EXTRACT_CONTEXT_ENDPOINT = "/indexer/extractContext";
    /**
     * Create a new job instance.
     */
    public function __construct(private Artifact $artifact, private string $text)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $contextExtractionResponse = Http::post(env("AI_BACKEND_BASEURL") . IndexDocument::EXTRACT_CONTEXT_ENDPOINT, [
                "text" => $this->text,
                "source_filename" => $this->artifact->filename,
                "uploader" => $this->artifact->owner->name,
            ]);

            foreach ($contextExtractionResponse->json() as $contextInfo) {
                $this->artifact->contexts()->create([
                    "field" => $contextInfo["field"],
                    "value" => is_array($contextInfo["value"]) ? json_encode($contextInfo["value"]) : $contextInfo["value"],
                ]);
            }
        } catch (\Throwable $th) {
            Log::error("Failed extracting context data from text");
        }
    }
}
