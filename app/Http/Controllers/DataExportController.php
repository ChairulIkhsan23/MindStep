<?php

namespace App\Http\Controllers;

use App\Services\DataExportService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Response;

class DataExportController extends Controller
{
    public function __construct(
        protected DataExportService $exportService
    ) {}

    public function exportJson(Request $request): Response
    {
        $user = $request->user();
        $today = Carbon::now($user->timezone ?? 'UTC')->toDateString();
        $filename = "mindstep-export-{$user->id}-{$today}.json";

        $jsonContent = $this->exportService->generateJson($user);

        return response($jsonContent, 200, [
            'Content-Type' => 'application/json',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    public function exportCsv(Request $request): BinaryFileResponse
    {
        $user = $request->user();
        $today = Carbon::now($user->timezone ?? 'UTC')->toDateString();
        $filename = "mindstep-export-{$user->id}-{$today}.zip";

        $zipPath = $this->exportService->generateCsvZip($user);

        return response()->download($zipPath, $filename, [
            'Content-Type' => 'application/zip',
        ])->deleteFileAfterSend(true);
    }
}
