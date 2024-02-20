<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, Board $board = null)
    {
        $statusLabels = Task::StatusLabels;
        $priorityLabels = Task::PriorityLabels;

        /**
         * @var User
         */
        $user = $request->user();
        $taskQuery = $board !== null ? $board->tasks() : Task::select(["*"]);

        if ($request->filled("search")) {
            $search = $request->input("search", "");

            $taskQuery->where(function ($q) use ($search) {
                $q->where("title", "like", "%{$search}%")
                    ->orWhere("description", "like", "%{$search}%")
                    ->orWhereRelation("assignee", "name", "like", "%{$search}%")
                    ->orWhereRelation("personInCharges", "name", "like", "%{$search}%");
            });
        }

        $tasks  = $taskQuery->get();

        return Inertia::render("Task/Index", [
            "statusLabels" => $statusLabels,
            "priorityLabels" => $priorityLabels,
            "boards" => $request->user()->boards()->select(["boards.id", "title"])->get(),
            "tasks" => $tasks,
            "activeBoard" => $board
        ]);
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
        if ($board) {
            $request->merge(["board_id" => $board->id]);
        }

        $request->merge(["created_by" => $request->user()->id]);

        $validationArr = [
            "title" => "required|string",
            "description" => "nullable|string",
            "status" => "sometimes|required|in:" . implode(",", [
                Task::PENDING,
                Task::ON_PROGRESS,
                Task::NEED_REVISION,
                Task::COMPLETED,
                Task::UNDER_REVIEW,
                Task::CANCELED,
            ]),
            "is_confirmed" => "sometimes|required|boolean",
            "created_by" => "required|exists:users,id",
            "priority" => "sometimes|required|in:" . implode(",", [
                Task::LOW,
                Task::MED,
                Task::HIGH,
            ]),
            "due_start" => "nullable|date",
            "due_end" => "nullable|date",
            "board_id" => "required|exists:boards,id",
            "assignee" => "nullable|array",
            "assignee.*" => "nullable|exists:users,id",
            "people_in_charge" => "nullable|array",
            "people_in_charge.*" => "nullable|exists:users,id",
        ];

        if ($request->filled("date_start")) {
            $validationArr["due_end"] .= "|after_or_equal:due_start";
        }
        $valid = $request->validate($validationArr);

        try {
            DB::beginTransaction();
            /**
             * @var Task
             */
            $task = Task::create($valid);

            $task->assignee()->sync($request->input("assignee", []));
            $task->peopleInCharge()->sync($request->input("people_in_charge", []));

            DB::commit();

            return to_route("boards.tasks.index", ["board" => $valid["board_id"]]);
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Board $board, Task $task)
    {
        $task->load(["owner", "assignee", "peopleInCharge"]);
        $task->append(["can_be_confirmed", "is_editable"]);

        return response()->json($task);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Board $board, Task $task)
    {
        if ($board) {
            $request->merge(["board_id" => $board->id]);
        }

        $request->merge(["created_by" => $request->user()->id]);

        $validationArr = [
            "title" => "sometimes|required|string",
            "description" => "sometimes|nullable|string",
            "status" => "sometimes|required|in:" . implode(",", [
                Task::PENDING,
                Task::ON_PROGRESS,
                Task::NEED_REVISION,
                Task::COMPLETED,
                Task::UNDER_REVIEW,
                Task::CANCELED,
            ]),
            "is_confirmed" => "sometimes|required|boolean",
            "created_by" => "sometimes|required|exists:users,id",
            "priority" => "sometimes|required|in:" . implode(",", [
                Task::LOW,
                Task::MED,
                Task::HIGH,
            ]),
            "due_start" => "sometimes|nullable|date",
            "due_end" => "sometimes|nullable|date|after_or_equal:due_start",
            "board_id" => "sometimes|required|exists:boards,id",
            "assignee" => "sometimes|nullable|array",
            "assignee.*" => "sometimes|nullable|exists:users,id",
            "people_in_charge" => "sometimes|nullable|array",
            "people_in_charge.*" => "sometimes|nullable|exists:users,id",
        ];
        $validator = Validator::make($request->all(), $validationArr);

        $valid = $request->validate($validationArr);

        try {
            DB::beginTransaction();

            $task->update($valid);

            $task->assignee()->sync($request->input("assignee", []));
            $task->peopleInCharge()->sync($request->input("people_in_charge", []));

            DB::commit();

            if ($request->expectsJson()) {
                return response()->json($task);
            }

            return to_route("boards.tasks.index", ["board" => $valid["board_id"]]);
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        //
    }
}
