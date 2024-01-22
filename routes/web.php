<?php

use App\Http\Controllers\ArtifactContextController;
use App\Http\Controllers\ArtifactController;
use App\Http\Controllers\BoardController;
use App\Http\Controllers\BoardNoteController;
use App\Http\Controllers\ChatInstanceController;
use App\Http\Controllers\ChatMessageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return to_route("boards.index");
});


Route::middleware(['auth'])->prefix("/dashboard")->group(function () {
    Route::get('/', function (Request $request) {
        // $request->user()->load(['managedProjects', 'projects']);
        // return Inertia::render('Dashboard');
        return to_route("boards.index");
    })->name('dashboard');

    Route::resource("projects", ProjectController::class);

    Route::resource("boards", BoardController::class);
    Route::resource("boards.artifacts", ArtifactController::class)->middleware("upload:file,file_url,file_path");
    Route::resource("boards.board_notes", BoardNoteController::class)->only(["store", "update"])->middleware("upload:file,file_url");

    Route::resource("artifacts", ArtifactController::class)->middleware("upload:file,file_url,file_path");

    Route::resource("users", UserController::class);

    Route::resource("chat_instances", ChatInstanceController::class);
    Route::resource("chat_instances.chat_messages", ChatMessageController::class);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::resource("boards.artifact_contexts", ArtifactContextController::class);
Route::resource("boards.board_notes", BoardNoteController::class)->only(["index"]);
Route::resource("artifact_contexts", ArtifactContextController::class);
Route::resource("board_notes", BoardNoteController::class)->only(["index"]);


require __DIR__ . '/auth.php';
