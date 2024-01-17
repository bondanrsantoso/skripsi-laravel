<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\BoardCollaborator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BoardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render("Board/Dashboard", [
            "boards" => Board::whereRelation("users", "users.id", $request->user()->id)
                ->select(["boards.id", "title"])->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        try {
            /**
             * @var Board
             */
            $board = Board::create([
                "title" => "Tanpa Judul",
                "project_id" => null,
                "brief" => "Ini adalah penjelasan singkat"
            ]);

            $board->users()->sync([$request->user()->id => ["role" => BoardCollaborator::ROLE_EDITOR]]);

            return to_route("boards.edit", ["board" => $board->id]);
        } catch (\Throwable $th) {
            throw $th;
        }
        // return Inertia::render("Board/Edit", [
        //     "boards" => Board::select(["id", "title"])->get(),
        // ]);
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
    public function show(Board $board)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Board $board)
    {
        $board->load(["users"]);
        $board->append(["items", "is_editable"]);

        return Inertia::render("Board/Edit", [
            "board" => $board,
            "boards" => Board::whereRelation("users", "users.id", $request->user()->id)
                ->select(["boards.id", "title"])->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Board $board)
    {
        $valid = $request->validate([
            "title" => "nullable|string",
            "project_id" => "nullable|exists:projects,id",
            "brief" => "nullable|string",
            "users" => "sometimes|array",
            "users.*" => "sometimes|array:id,role",
            "users.*.id" => "sometimes|required|exists:users,id",
            "users.*.role" => "sometimes|nullable|integer|in:0,1,2",
        ]);

        try {
            DB::beginTransaction();
            if (!$request->filled("title")) {
                $valid["title"] = "";
            }

            $board->update($valid);

            if ($request->exists("users")) {
                $syncArray = [];
                foreach ($request->input("users", []) as $userData) {
                    $syncArray[$userData["id"]] = ["role" => $userData["role"]];
                }

                $board->users()->sync($syncArray);
            }
            DB::commit();
            if ($request->expectsJson()) {
                $board->load(["users"]);
                $board->append(["is_editable"]);
                return response()->json($board);
            }

            return to_route("boards.edit", ["board" => $board->id]);
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Board $board)
    {
        //
    }
}
