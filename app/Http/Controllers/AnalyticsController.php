<?php

namespace App\Http\Controllers;

use App\Services\AnalyticsAggregationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function __construct(
        protected AnalyticsAggregationService $analyticsService
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $rangeKey = $request->query('range', '7d');
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        $analyticsData = $this->analyticsService->getAnalytics(
            $user,
            $rangeKey,
            $startDate,
            $endDate
        );

        return Inertia::render('Analytics/Index', $analyticsData);
    }
}
