<?php

namespace App\Jobs;

use App\Models\Artifact;
use App\Models\Board;
use App\Models\User;
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
    const INDEX_DOC_VECTOR = "/indexer/indexDocumentVector";

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Artifact $artifact,
        private $board_id = null,
        private $user_id = null,
    ) {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $file = file_get_contents(Storage::path($this->artifact->path));

        $splitDocumentResponse = Http::timeout(240)->attach("file", $file, $this->artifact->filename)
            ->post(env("AI_BACKEND_BASEURL") . IndexDocument::INDEX_DOC_VECTOR, [
                "board_id" => $this->board_id,
                "user_id" => $this->user_id,
                "file_id" => $this->artifact->id,
            ]);

        $this->artifact->text_content = $splitDocumentResponse->json("parsed_text", null);
        $this->artifact->save();

        // foreach ($splitDocumentResponse->json("chunks", []) as $chunk) {
        //     $extractJob = (new ExtractContext($this->artifact, $chunk))
        //         ->onQueue("artifact_index");

        //     dispatch($extractJob);
        // }
    }
}
