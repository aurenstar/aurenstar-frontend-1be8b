import React, { useState } from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  AlertCircle,
  Sparkles,
  ExternalLink,
  ChevronRight,
  BarChart3,
} from 'lucide-react';
import { PERFORMANCE_DATA, PerformanceSnapshot } from '../../data/dictionaryMockData';

export const DictionaryPerformanceView: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '28d' | '90d'>('28d');
  const [hoveredPoint, setHoveredPoint] = useState<{ date: string; clicks: number; impressions: number } | null>(null);

  const snapshot: PerformanceSnapshot = PERFORMANCE_DATA[selectedPeriod];

  // SVG Chart math calculation
  const maxClicks = Math.max(...snapshot.dailyPoints.map((p) => p.clicks)) * 1.15;
  const maxImpressions = Math.max(...snapshot.dailyPoints.map((p) => p.impressions)) * 1.15;
  const chartHeight = 220;
  const chartWidth = 720;
  const paddingX = 40;
  const paddingY = 25;

  const getCoordinates = (index: number, value: number, max: number) => {
    const x = paddingX + (index / (snapshot.dailyPoints.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (value / max) * (chartHeight - paddingY * 2);
    return { x, y };
  };

  // Generate SVG path strings
  const clicksPath = snapshot.dailyPoints
    .map((p, i) => {
      const { x, y } = getCoordinates(i, p.clicks, maxClicks);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const clicksAreaPath = `${clicksPath} L ${getCoordinates(snapshot.dailyPoints.length - 1, 0, maxClicks).x} ${
    chartHeight - paddingY
  } L ${getCoordinates(0, 0, maxClicks).x} ${chartHeight - paddingY} Z`;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Controls Bar with Period Selector */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/70">
              Search Performance Analytics
            </span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-500 font-medium">Demonstration telemetry</span>
          </div>
          <h2 className="text-lg font-extrabold text-gray-900">
            Organic Search Trajectory & Rank Distribution
          </h2>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl shrink-0">
          {(['7d', '28d', '90d'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedPeriod === period
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {period === '7d' ? '7 Days' : period === '28d' ? '28 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Summary Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Clicks */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
            Organic Clicks
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-gray-900">
              {snapshot.summary.totalClicks.toLocaleString()}
            </span>
            <span className="inline-flex items-center text-xs font-bold text-emerald-700">
              <ArrowUpRight className="w-4 h-4 mr-0.5" />
              +{snapshot.summary.clicksGrowth}%
            </span>
          </div>
          <span className="text-[11px] text-gray-400 block mt-2 font-medium">
            vs previous {snapshot.label.toLowerCase()}
          </span>
        </div>

        {/* Total Impressions */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
            Search Impressions
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-gray-900">
              {snapshot.summary.totalImpressions.toLocaleString()}
            </span>
            <span className="inline-flex items-center text-xs font-bold text-emerald-700">
              <ArrowUpRight className="w-4 h-4 mr-0.5" />
              +{snapshot.summary.impressionsGrowth}%
            </span>
          </div>
          <span className="text-[11px] text-gray-400 block mt-2 font-medium">
            vs previous {snapshot.label.toLowerCase()}
          </span>
        </div>

        {/* Average CTR */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
            Average Click-Through Rate
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-800">
              {snapshot.summary.avgCtr.toFixed(2)}%
            </span>
            <span className="inline-flex items-center text-xs font-bold text-emerald-700">
              <ArrowUpRight className="w-4 h-4 mr-0.5" />
              +{snapshot.summary.ctrGrowth}%
            </span>
          </div>
          <span className="text-[11px] text-gray-400 block mt-2 font-medium">
            Benchmark: 6.8% in health/spiritual
          </span>
        </div>

        {/* Average Position */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
            Average Rank Position
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-gray-900">
              #{snapshot.summary.avgPosition.toFixed(1)}
            </span>
            <span className="inline-flex items-center text-xs font-bold text-emerald-700">
              <ArrowUpRight className="w-4 h-4 mr-0.5" />
              {snapshot.summary.positionGrowth} ranks
            </span>
          </div>
          <span className="text-[11px] text-gray-400 block mt-2 font-medium">
            Weighted across all dictionary terms
          </span>
        </div>
      </div>

      {/* Main Interactive SVG Chart */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <span>Organic Clicks Over Time ({snapshot.label})</span>
            </h3>
            <p className="text-xs text-gray-500">
              Continuous trendline showing search demand capture during current period.
            </p>
          </div>

          {hoveredPoint && (
            <div className="text-xs bg-emerald-50 text-emerald-950 font-bold px-3 py-1 rounded-lg border border-emerald-200/80">
              {hoveredPoint.date}: {hoveredPoint.clicks.toLocaleString()} Clicks ({hoveredPoint.impressions.toLocaleString()} Impressions)
            </div>
          )}
        </div>

        {/* SVG Container */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto min-w-[580px] max-h-[260px] overflow-visible"
          >
            <defs>
              <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#059669" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
              return (
                <line
                  key={ratio}
                  x1={paddingX}
                  y1={y}
                  x2={chartWidth - paddingX}
                  y2={y}
                  stroke="#E5E7EB"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
              );
            })}

            {/* Shaded Area under curve */}
            <path d={clicksAreaPath} fill="url(#clicksGradient)" />

            {/* Main Click Curve Line */}
            <path d={clicksPath} fill="none" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" />

            {/* Data Points */}
            {snapshot.dailyPoints.map((point, index) => {
              const { x, y } = getCoordinates(index, point.clicks, maxClicks);
              const isHovered = hoveredPoint?.date === point.date;
              return (
                <g key={point.date} onMouseEnter={() => setHoveredPoint(point)} onMouseLeave={() => setHoveredPoint(null)}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 6 : 4}
                    fill={isHovered ? '#064E3B' : '#059669'}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="cursor-pointer transition-all"
                  />
                  {/* Date labels below */}
                  <text
                    x={x}
                    y={chartHeight - 6}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="600"
                    fill="#6B7280"
                  >
                    {point.date}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Two Columns: Top Performing Pages & Quick-Win Improvements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Pages */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Top Performing Dictionary Pages</h3>
              <span className="text-xs font-semibold text-gray-400">By Clicks</span>
            </div>

            <div className="space-y-3 text-xs">
              {snapshot.topPages.map((page, idx) => (
                <div key={idx} className="p-3 bg-gray-50/70 rounded-xl border border-gray-100 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-gray-900 truncate">{page.title}</span>
                    <span className="font-extrabold text-emerald-800 shrink-0">
                      {page.clicks.toLocaleString()} clicks
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono">
                    <span className="truncate">{page.url}</span>
                    <span className="font-semibold text-gray-700">Rank #{page.position.toFixed(1)} · {page.ctr}% CTR</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actionable Improvement Opportunities */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>SEO Improvement Opportunities</span>
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                High Impact
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              {snapshot.improvements.map((imp, idx) => (
                <div key={idx} className="p-3.5 bg-emerald-50/30 rounded-xl border border-emerald-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">{imp.title}</span>
                    <span className="font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md text-[11px]">
                      {imp.potentialClicks}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-snug">{imp.issue}</p>
                  <div className="p-2 bg-white rounded-lg border border-emerald-100 text-[11px] text-emerald-950 font-medium">
                    💡 <strong className="font-bold">Recommendation:</strong> {imp.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
