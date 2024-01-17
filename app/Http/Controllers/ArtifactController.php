<?php

namespace App\Http\Controllers;

use App\Models\Artifact;
use App\Models\Board;
use Illuminate\Http\Request;

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
            "owner_id" => $request->user()->id,
            "mime_type" => $mime,
        ];

        if ($board !== null) {
            $artifact = $board->artifacts()->create($newArtifactData, [
                "order" => $request->input("order", $board->item_count)
            ]);
        } else {
            $artifact = Artifact::create($newArtifactData);
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
    public function show(Artifact $artifact)
    {
        //
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
