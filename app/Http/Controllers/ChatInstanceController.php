<?php

namespace App\Http\Controllers;

use App\Models\ChatInstance;
use App\Models\User;
use Illuminate\Http\Request;

class ChatInstanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $valid = $request->validate([
            "page" => "sometimes|integer|min:1",
        ]);

        /**
         * @var User
         */
        $user = $request->user();
        $instances = $user->chats()->orderBy("updated_at", "desc")->paginate(10);

        return response()->json($instances);
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
    public function show(ChatInstance $chatInstance)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ChatInstance $chatInstance)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ChatInstance $chatInstance)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ChatInstance $chatInstance)
    {
        //
    }
}
