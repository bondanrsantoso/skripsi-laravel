<?php

namespace App\Http\Controllers;

use App\Models\ChatInstance;
use App\Models\ChatMessage;
use Illuminate\Http\Request;

class ChatMessageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, ChatInstance $chatInstance)
    {
        $valid = $request->validate([
            "last_id" => "sometimes|exists:chat_messages,id"
        ]);

        $messagesQuery = $chatInstance
            ->messages()
            ->take(10)
            ->orderBy("created_at", "desc");

        if ($request->filled("last_id")) {
            $lastMessage = $chatInstance->messages()->find($request->input("last_id"));
            $messagesQuery = $messagesQuery->where(function ($q) use ($lastMessage) {
                $q->where("created_at", "<=", $lastMessage->created_at)
                    ->where("id", "!=", $lastMessage->id);
            });
        }

        $messages = collect($messagesQuery->get())->reverse()->values();

        return response()->json($messages);
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
    public function store(Request $request, ChatInstance $chatInstance)
    {
        $request->mergeIfMissing([
            "role" => ChatMessage::ROLE_HUMAN,
        ]);

        $valid = $request->validate([
            "content" => "required|string",
            "role" => [
                "required",
                "in:" . join(",", [
                    ChatMessage::ROLE_AI,
                    ChatMessage::ROLE_HUMAN,
                    ChatMessage::ROLE_SYSTEM,
                ]),
            ],
        ]);

        $newMessage = $chatInstance->messages()->create($valid);

        return response()->json($newMessage);
    }

    /**
     * Display the specified resource.
     */
    public function show(ChatMessage $chatMessage)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ChatMessage $chatMessage)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ChatMessage $chatMessage)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ChatMessage $chatMessage)
    {
        //
    }
}
