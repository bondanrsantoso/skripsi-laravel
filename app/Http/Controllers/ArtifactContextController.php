<?php

namespace App\Http\Controllers;

use App\Models\Artifact;
use App\Models\ArtifactContext;
use App\Models\Board;
use Illuminate\Http\Request;

class ArtifactContextController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, Board $board = null)
    {
        if ($request->server("REMOTE_ADDR") !== "127.0.0.1") {
            abort(400);
        }

        $valid = $request->validate([
            "search" => "nullable|string"
        ]);

        $search = $request->input("search", "");

        $contextQuery = ArtifactContext::select(["*"]);
        if ($board !== null) {
            $contextQuery->whereRelation("artifact.boards", "boards.id", "=", $board->id);
        }

        if ($request->filled("search")) {
            $contextQuery->where(function ($q) use ($search) {
                $q->whereRaw("MATCH(value) AGAINST(?)", [$search])
                    ->orWhere("field", "like", "%{$search}%");
            });
        }

        $contexts = $contextQuery->with([
            "artifact:id,filename,owner_id" => ["owner:id,name,email"]
        ])
            ->select(["field", "value", "artifact_id"])
            ->take(5)
            ->get();

        // $artifacts = [];
        // $artifactIndex = [];
        // foreach ($contexts as $i => $context) {
        //     if (
        //         sizeof($artifactIndex) === 0 ||
        //         !isset($artifactIndex[$context->artifact_id])
        //     ) {
        //         // if there's no relevant artifact wrapper yet
        //         $artifact = $context->artifact()->select(["id", "filename", "url"])->first();
        //         $artifact->contexts = collect();

        //         $artifactIndex[$artifact->id] = $i;
        //         $artifacts[] = $artifact;
        //     }

        //     $artifacts[$artifactIndex[$context->artifact_id]]->contexts->push($context);
        // }

        // $relevantArtifacts = collect();

        return response()->json($contexts);
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ArtifactContext $artifactContext)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ArtifactContext $artifactContext)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ArtifactContext $artifactContext)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ArtifactContext $artifactContext)
    {
        //
    }
}
