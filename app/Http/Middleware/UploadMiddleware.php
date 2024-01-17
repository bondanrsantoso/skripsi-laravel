<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class UploadMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next, $inputField, $forwardField)
    {
        Log::info("Upload", [
            $inputField => $forwardField,
            "hasFile" => $request->hasFile($inputField),
            "file" => $request->file(),
        ]);

        if ($request->hasFile($inputField)) {
            $appEnv = app()->environment();

            $file = $request->file($inputField);
            $path = $file->storePubliclyAs("public/resource-{$appEnv}", "{$file->hashName()}.{$file->getClientOriginalExtension()}");

            $fileUrl = Storage::url($path);

            $request->merge([
                $forwardField => $fileUrl,
            ]);
        }
        return $next($request);
    }
}
