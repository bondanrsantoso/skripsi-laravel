<?php

namespace App\Http\Controllers;

use App\Jobs\IndexDocument;
use App\Models\Artifact;
use App\Models\Board;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ArtifactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Board $board = null)
    {
        $valid = $request->validate([
            "file_url" => "required|string",
            "file_path" => "required|string",
            "file" => "required|file",
            "order" => "nullable|integer|min:0",
        ]);

        /**
         * @var Artifact
         */
        $artifact = null;

        $file = $request->file("file");
        $mime = $file->getMimeType();
        $filename = $file->getClientOriginalName() ?? $file->hashName();
        $newArtifactData = [
            "filename" => $filename,
            "url" => $request->input("file_url"),
            "path" => $request->input("file_path"),
            "owner_id" => $request->user()->id,
            "mime_type" => $mime,
        ];

        if (collect([
            Artifact::MIME_CSV,
            Artifact::MIME_JSON,
            Artifact::MIME_HTML,
            Artifact::MIME_XML,
            Artifact::MIME_TXT,
        ])->contains($mime)) {
            $newArtifactData["text_content"] =
                file_get_contents(Storage::path($request->input("file_path")));
        }

        if ($board !== null) {
            $artifact = $board->artifacts()->create($newArtifactData, [
                "order" => $request->input("order", $board->item_count)
            ]);
        } else {
            $artifact = Artifact::create($newArtifactData);
        }


        if (collect([
            Artifact::MIME_DOCX,
            Artifact::MIME_PDF,
            Artifact::MIME_CSV,
            Artifact::MIME_JSON,
            Artifact::MIME_PPTX,
            Artifact::MIME_HTML,
            Artifact::MIME_XML,
            Artifact::MIME_TXT,
        ])->contains($mime)) {
            $indexingJob = (new IndexDocument($artifact))
                ->onQueue("artifact_index");

            dispatch($indexingJob);
        }

        if ($request->expectsJson()) {
            $artifact->refresh();
            $artifact->load("owner");

            return response()->json($artifact);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Artifact $artifact)
    {
        $artifact->load(["contexts", "owner"]);

        return Inertia::render("Artifact/View", [
            "boards" => Board::whereRelation("users", "users.id", $request->user()->id)
                ->select(["boards.id", "title"])->get(),
            "artifact" => $artifact
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Artifact $artifact)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Artifact $artifact)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Artifact $artifact)
    {
        //
    }
}
