<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $request->mergeIfMissing([
            // "fields" => ["*"],
            "orderBy" => [
                "name" => "asc",
            ],
            "pageSize" => 25,
        ]);

        $valid = $request->validate([
            "search" => "nullable|string",
            "orderBy" => "nullable|array:" . implode(",", [
                "name",
                "email",
                "created_at",
                "updated_at",
            ]),
            "orderBy.*" => "sometimes|nullable|in:asc,desc",
            "page" => "nullable|numeric|min:1",
            "pageSize" => "nullable|numeric|min:1",
        ]);

        $userQuery = User::select(["*"]);

        if ($request->filled("search")) {
            $search = $request->input("search");
            $userQuery->where(function ($q) use ($search) {
                return $q->where("name", "like", "%{$search}%")
                    ->orWhere("email", "like", "%{$search}%");
            });
        }

        foreach ($request->input("orderBy", []) as $column => $direction) {
            $userQuery->orderBy($column, $direction);
        }

        $users = $userQuery->paginate($request->input("pageSize"));

        if ($request->expectsJson()) {
            return response()->json($users);
        }

        // return Inertia::render("user/List", [
        //     "users" => $users,
        //     "search" => $request->input("search"),
        //     "orderBy" => $request->input("orderBy"),
        //     "pageSize" => $request->input("pageSize"),
        //     "page" => $request->input("page", 1),
        // ]);
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
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }
}
