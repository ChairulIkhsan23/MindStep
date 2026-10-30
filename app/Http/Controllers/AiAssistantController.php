<?php

namespace App\Http\Controllers;

use App\Http\Requests\Ai\DeepeningPromptsRequest;
use App\Http\Requests\Ai\PeriodicSummaryRequest;
use App\Http\Requests\Ai\PolishDraftRequest;
use App\Services\Ai\ReflectiveAiService;
use Illuminate\Http\JsonResponse;
use InvalidArgumentException;
use Throwable;

class AiAssistantController extends Controller
{
    public function __construct(
        protected ReflectiveAiService $aiService
    ) {}

    public function polish(PolishDraftRequest $request): JsonResponse
    {
        try {
            $user = $request->user();
            $result = $this->aiService->polish(
                user: $user,
                content: (string) $request->validated('content'),
                context: $request->validated('context')
            );

            return response()->json([
                'success' => true,
                'action' => 'polish',
                'data' => $result,
            ]);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function deepeningPrompts(DeepeningPromptsRequest $request): JsonResponse
    {
        try {
            $user = $request->user();
            $result = $this->aiService->deepeningPrompts(
                user: $user,
                content: (string) $request->validated('content'),
                context: $request->validated('context')
            );

            return response()->json([
                'success' => true,
                'action' => 'deepening_prompts',
                'data' => $result,
            ]);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function periodicSummary(PeriodicSummaryRequest $request): JsonResponse
    {
        try {
            $user = $request->user();
            $result = $this->aiService->periodicSummary(
                user: $user,
                startDate: (string) $request->validated('start_date'),
                endDate: (string) $request->validated('end_date')
            );

            return response()->json([
                'success' => true,
                'action' => 'periodic_summary',
                'data' => $result,
            ]);
        } catch (InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
