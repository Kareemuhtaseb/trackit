<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserOwnsResource
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        $parameters = $request->route()?->parameters() ?? [];

        foreach ($parameters as $parameter) {
            if ($parameter instanceof Model) {
                $userId = $parameter->getAttribute('user_id');

                if ($userId !== null && (int) $userId !== (int) $user->getKey()) {
                    abort(403);
                }
            }
        }

        return $next($request);
    }
}