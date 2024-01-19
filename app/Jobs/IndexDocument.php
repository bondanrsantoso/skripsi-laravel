<?php

namespace App\Jobs;

use App\Models\Artifact;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Storage;

class IndexDocument implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    const SPLIT_DOC_ENDPOINT = "/indexer/splitDocs";
    const EXTRACT_CONTEXT_ENDPOINT = "/indexer/extractContext";

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Artifact $artifact
    ) {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $file = file_get_contents(Storage::path($this->artifact->path));

        $splitDocumentResponse = Http::attach("file", $file, $this->artifact->filename)
            ->post(env("AI_BACKEND_BASEURL") . IndexDocument::SPLIT_DOC_ENDPOINT);

        $this->artifact->text_content = $splitDocumentResponse->json("parsed_text", null);
        $this->artifact->save();

        foreach ($splitDocumentResponse->json("chunks", []) as $chunk) {
            try {
                $contextExtractionResponse = Http::post(env("AI_BACKEND_BASEURL") . IndexDocument::EXTRACT_CONTEXT_ENDPOINT, [
                    "text" => $chunk
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
}
