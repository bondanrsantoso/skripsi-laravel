<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\BoardNote;
use Illuminate\Http\Request;

class BoardNoteController extends Controller
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
    public function store(Request $request, Board $board)
    {
        $valid = $request->validate([
            "content" => "sometimes|required",
            "order" => "sometimes|required|integer|min:0",
        ]);

        $newNote = $board->notes()->create($valid ?? []);

        if ($request->expectsJson()) {

            return response()->json($newNote);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(BoardNote $boardNote)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BoardNote $boardNote)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Board $board, BoardNote $boardNote)
    {
        $valid = $request->validate([
            "content" => "sometimes|required",
            "order" => "sometimes|required|integer|min:0",
        ]);

        $boardNote->update($valid);

        if ($request->expectsJson()) {
            return response()->json($boardNote);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BoardNote $boardNote)
    {
        //
    }
}