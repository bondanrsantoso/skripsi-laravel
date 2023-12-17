<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, User $user = null)
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
                "description",
                "start_date",
                "end_date",
                "client_name",
                "client_email",
                "client_phone",
                "budget",
            ]),
            "orderBy.*" => "sometimes|nullable|in:asc,desc",
            "page" => "nullable|numeric|min:1",
            "pageSize" => "nullable|numeric|min:1",
        ]);

        $projectQuery = Project::with("managers")->select(["*"]);

        if ($request->filled("search")) {
            $search = $request->input("search");
            $projectQuery->where(function ($q) use ($search) {
                return $q->where("name", $search);
            });
        }

        foreach ($request->input("orderBy", []) as $column => $direction) {
            $projectQuery->orderBy($column, $direction);
        }

        $projects = $projectQuery->paginate($request->input("pageSize"));

        if ($request->expectsJson()) {
            return response()->json($projects);
        }

        return Inertia::render("Project/Dashboard", [
            "projects" => $projects,
            "search" => $request->input("search"),
            "orderBy" => $request->input("orderBy"),
            "pageSize" => $request->input("pageSize"),
            "page" => $request->input("page", 1),
            "success" => session("success", null),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render("Project/Edit");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Sanitize array inputs
        foreach (["managers", "internal_members"] as $field) {
            $request->merge([
                $field => collect($request->input($field))
                    ->filter(fn ($d) => $d && $d["id"])
                    ->map(fn ($d) => $d["id"])
                    ->values()
                    ->all(),
            ]);
        }

        foreach ([
            "purposes",
            "objectives",
            "services",
            "deliverables",
            "requirements",
            "out_of_scopes",
        ] as $field) {
            $request->merge([
                $field => collect($request->input($field))
                    ->filter(fn ($d) => $d && $d["description"])
                    ->map(fn ($d) => ["description" => trim($d["description"])])
                    ->values()
                    ->all(),
            ]);
        }

        $valid = $request->validate([
            "name" => "required|string",
            "description" => "nullable|string",
            "start_date" => "nullable|date",
            "end_date" => "nullable|date|after_or_equal:start_date",
            "client_name" => "nullable|string",
            "client_email" => "nullable|email",
            "client_phone" => "nullable|string",
            "budget" => "nullable|numeric|min:0",
            "managers" => "nullable|array",
            "managers.*" => "nullable|exists:users,id",
            "internal_members" => "nullable|array",
            "internal_members.*" => "nullable|exists:users,id",
            // "external_members" => "nullable",
            "purposes" => "nullable|array",
            "purposes.*" => "nullable|array:description",
            "purposes.*.description" => "nullable|string",
            "objectives" => "nullable|array",
            "objectives.*" => "nullable|array:description",
            "objectives.*.description" => "nullable|string",
            "services" => "nullable|array",
            "services.*" => "nullable|array:description",
            "services.*.description" => "nullable|string",
            "deliverables" => "nullable|array",
            "deliverables.*" => "nullable|array:description",
            "deliverables.*.description" => "nullable|string",
            "requirements" => "nullable|array",
            "requirements.*" => "nullable|array:description",
            "requirements.*.description" => "nullable|string",
            "out_of_scopes" => "nullable|array",
            "out_of_scopes.*" => "nullable|array:description",
            "out_of_scopes.*.description" => "nullable|string",
        ]);

        try {
            DB::beginTransaction();

            /**
             * @var Project
             */
            $project = Project::create($valid);
            $project->managers()->sync($valid["managers"]);
            $project->internalMembers()->sync($valid["internal_members"]);

            /**
             * @var array<string, HasMany>
             */
            $fields = [
                "purposes" => $project->purposes(),
                "objectives" => $project->objectives(),
                "services" => $project->services(),
                "deliverables" => $project->deliverables(),
                "requirements" => $project->requirements(),
                "out_of_scopes" => $project->outOfScopes(),
            ];

            foreach ($fields as $field => $related) {
                foreach ($valid[$field] as $item) {
                    $related->create($item);
                }
            }

            DB::commit();

            if ($request->expectsJson()) {
                $project->load([
                    "purposes",
                    "objectives",
                    "services",
                    "deliverables",
                    "requirements",
                    "outOfScopes",
                    "managers",
                    "internalMembers"
                ]);

                return response()->json($project);
            }

            return to_route("projects.index")->with("success", "Proyek {$project->name} berhasil disimpan");
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Project $project)
    {
        $projects = Project::select(["id", "name"])->paginate(999999);
        $project->load([
            "purposes",
            "objectives",
            "services",
            "deliverables",
            "requirements",
            "outOfScopes",
            "managers",
            "internalMembers"
        ]);
        return Inertia::render("Project/Dashboard", [
            "projects" => $projects,
            "search" => $request->input("search"),
            "orderBy" => $request->input("orderBy"),
            "pageSize" => $request->input("pageSize"),
            "page" => $request->input("page", 1),
            "success" => session("success", null),
            "selectedProject" => $project,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        $project->load([
            "purposes",
            "objectives",
            "services",
            "deliverables",
            "requirements",
            "outOfScopes",
            "managers",
            "internalMembers"
        ]);
        return Inertia::render("Project/Edit", ["project" => $project]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        // Sanitize array inputs
        foreach (["managers", "internal_members"] as $field) {
            $request->merge([
                $field => collect($request->input($field))
                    ->filter(fn ($d) => $d && $d["id"])
                    ->map(fn ($d) => $d["id"])
                    ->values()
                    ->all(),
            ]);
        }

        foreach ([
            "purposes",
            "objectives",
            "services",
            "deliverables",
            "requirements",
            "out_of_scopes",
        ] as $field) {
            $request->merge([
                $field => collect($request->input($field))
                    ->filter(fn ($d) => $d && $d["description"])
                    ->map(fn ($d) => ["description" => trim($d["description"])])
                    ->values()
                    ->all(),
            ]);
        }

        $valid = $request->validate([
            "name" => "required|string",
            "description" => "nullable|string",
            "start_date" => "nullable|date",
            "end_date" => "nullable|date|after_or_equal:start_date",
            "client_name" => "nullable|string",
            "client_email" => "nullable|email",
            "client_phone" => "nullable|string",
            "budget" => "nullable|numeric|min:0",
            "managers" => "nullable|array",
            "managers.*" => "nullable|exists:users,id",
            "internal_members" => "nullable|array",
            "internal_members.*" => "nullable|exists:users,id",
            // "external_members" => "nullable",
            "purposes" => "nullable|array",
            "purposes.*" => "nullable|array:description",
            "purposes.*.description" => "nullable|string",
            "objectives" => "nullable|array",
            "objectives.*" => "nullable|array:description",
            "objectives.*.description" => "nullable|string",
            "services" => "nullable|array",
            "services.*" => "nullable|array:description",
            "services.*.description" => "nullable|string",
            "deliverables" => "nullable|array",
            "deliverables.*" => "nullable|array:description",
            "deliverables.*.description" => "nullable|string",
            "requirements" => "nullable|array",
            "requirements.*" => "nullable|array:description",
            "requirements.*.description" => "nullable|string",
            "out_of_scopes" => "nullable|array",
            "out_of_scopes.*" => "nullable|array:description",
            "out_of_scopes.*.description" => "nullable|string",
        ]);

        try {
            DB::beginTransaction();

            /**
             * @var Project
             */
            $project->update($valid);
            $project->managers()->sync($valid["managers"]);
            $project->internalMembers()->sync($valid["internal_members"]);

            /**
             * @var array<string, HasMany>
             */
            $fields = [
                "purposes" => $project->purposes(),
                "objectives" => $project->objectives(),
                "services" => $project->services(),
                "deliverables" => $project->deliverables(),
                "requirements" => $project->requirements(),
                "out_of_scopes" => $project->outOfScopes(),
            ];

            foreach ($fields as $field => $related) {
                $existing = $related->get()->all();
                $ids = [];

                foreach ($valid[$field] as $i => $item) {
                    if ($i < sizeof($existing)) {
                        $existing[$i]->update($item);

                        $ids[] = $existing[$i]->id;
                    } else {
                        $newItem = $related->create($item);
                        $ids[] = $newItem->id;
                    }
                }

                $related->whereNotIn("id", $ids)->delete();
            }

            DB::commit();

            if ($request->expectsJson()) {
                $project->load([
                    "purposes",
                    "objectives",
                    "services",
                    "deliverables",
                    "requirements",
                    "outOfScopes",
                    "managers",
                    "internalMembers"
                ]);

                return response()->json($project);
            }

            return to_route("projects.index")->with("success", "Proyek {$project->name} berhasil disimpan");
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        $project->delete();

        return to_route("projects.index")->with("success", "Proyek {$project->name} berhasil dihapus");
    }
}
