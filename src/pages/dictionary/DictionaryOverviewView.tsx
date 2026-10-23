import React from 'react';
import {
  Sparkles,
  TrendingUp,
  FileCheck2,
  FileText,
  AlertCircle,
  Eye,
  CheckCircle2,
  ArrowRight,
  Clock,
  Compass,
  Layers,
} from 'lucide-react';
import {
  OpportunityItem,
  ContentItem,
  ReviewArticle,
  PublishedPageItem,
} from '../../data/dictionaryMockData';

interface DictionaryOverviewViewProps {
  opportunities: OpportunityItem[];
  contentItems: ContentItem[];
  reviewArticle: ReviewArticle;
  publishedPages: PublishedPageItem[];
  onNavigateSection: (section: string) => void;
  onOpenOpportunityDetail: (opp: OpportunityItem) => void;
  onQuickApproveOpportunity: (id: string) => void;
}

export const DictionaryOverviewView: React.FC<DictionaryOverviewViewProps> = ({
  opportunities,
  contentItems,
  publishedPages,
  onNavigateSection,
  onOpenOpportunityDetail,
  onQuickApproveOpportunity,
}) => {
  const totalOpps = opportunities.length;
  const oppsApproved = opportunities.filter((o) => o.status === 'Approved' || o.status === 'Writing').length;
  const pagesInProd = contentItems.filter((c) => c.status === 'Writing' || c.status === 'Draft').length;
  const publishedCount = publishedPages.length;
  const pagesReviewCount = contentItems.filter((c) => c.status === 'In Review').length;
  const organicClicksTotal = publishedPages.reduce((acc, p) => acc + p.clicks, 0);

  // Pipeline counts
  const pipelineSteps = [
    { label: 'Discovered', count: opportunities.filter((o) => o.status === 'Discovered').length },
    { label: 'Analyzing', count: opportunities.filter((o) => o.status === 'Analyzing').length },
    { label: 'Approved', count: opportunities.filter((o) => o.status === 'Approved').length },
    { label: 'Writing', count: contentItems.filter((c) => c.status === 'Writing').length },
    { label: 'Quality Review', count: contentItems.filter((c) => c.status === 'In Review').length },
    { label: 'Published', count: publishedCount },
  ];

  const recentOpps = opportunities.slice(0, 5);

  const recentActivities = [
    {
      id: 'act-1',
      title: 'AI Clustered 3 High-Demand Retrograde Queries',
      category: 'Keyword Intelligence',
      time: '18 minutes ago',
      author: 'Aurenstar AI Core',
    },
    {
      id: 'act-2',
      title: 'Review submitted for "Mercury Retrograde Meaning"',
      category: 'Editorial Pipeline',
      time: '1 hour ago',
      author: 'Elena Rossi',
    },
    {
      id: 'act-3',
      title: 'Published "Sun Sign vs Moon Sign Guide"',
      category: 'Search Indexing',
      time: '3 hours ago',
      author: 'System Publisher',
    },
    {
      id: 'act-4',
      title: 'Approved opportunity "What does Venus mean in astrology?"',
      category: 'SEO Strategy',
      time: '5 hours ago',
      author: 'Alex Reed',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner Notice - Clean Demo Indicator */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl text-xs text-emerald-900">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold">Interactive Prototype Environment</span>
          <span className="text-emerald-700/70">·</span>
          <span className="text-emerald-700">Demonstration data active for Aurenstar Dictionary SEO operations.</span>
        </div>
        <button
          onClick={() => onNavigateSection('opportunities')}
          className="font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer shrink-0"
        >
          <span>Explore 8 Opportunities</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 6 Metric Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Opportunities */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Opportunities</span>
            <Compass className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900 tracking-tight">{totalOpps}</div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
            <span>+3 new today</span>
            <span className="text-gray-400">· Demo</span>
          </div>
        </div>

        {/* Opportunities Approved */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Approved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900 tracking-tight">{oppsApproved}</div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
            <span>75% pass rate</span>
            <span className="text-gray-400">· Demo</span>
          </div>
        </div>

        {/* Pages in Production */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">In Production</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900 tracking-tight">{pagesInProd}</div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-gray-600 font-medium">
            <span>2 writing · 1 draft</span>
          </div>
        </div>

        {/* Published Pages */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Published Pages</span>
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900 tracking-tight">{publishedCount}</div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
            <span>100% indexed</span>
            <span className="text-gray-400">· Demo</span>
          </div>
        </div>

        {/* Pages Requiring Review */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Requires Review</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900 tracking-tight">{pagesReviewCount}</div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-amber-700 font-medium">
            <span>1 ready for sign-off</span>
          </div>
        </div>

        {/* Organic Clicks */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Organic Clicks</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {organicClicksTotal >= 1000 ? `${(organicClicksTotal / 1000).toFixed(1)}k` : organicClicksTotal}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
            <span>+18.4% this mo</span>
            <span className="text-gray-400">· Demo</span>
          </div>
        </div>
      </div>

      {/* Content Pipeline Visual Stepper */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">Content Pipeline</h2>
            <p className="text-xs text-gray-500">
              Live automated progression from query discovery to search indexing.
            </p>
          </div>
          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
            6 Active Stages
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {pipelineSteps.map((step, idx) => (
            <div
              key={step.label}
              className="p-3.5 rounded-xl border border-gray-200/80 bg-gray-50/60 flex flex-col justify-between hover:bg-white hover:border-emerald-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-gray-400">0{idx + 1}</span>
                <span className="text-base font-extrabold text-gray-900">{step.count}</span>
              </div>
              <span className="text-xs font-semibold text-gray-700">{step.label}</span>
              <div className="mt-2.5 w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-1 rounded-full transition-all"
                  style={{ width: `${Math.min(100, Math.max(15, step.count * 25))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Recent Opportunities Table + Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Recent Opportunities */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">Recent Opportunities</h2>
              <p className="text-xs text-gray-500">
                High-priority astrology search terms detected by AI seed scraper.
              </p>
            </div>
            <button
              onClick={() => onNavigateSection('opportunities')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                  <th className="py-3 px-4">Search Query</th>
                  <th className="py-3 px-3">Intent</th>
                  <th className="py-3 px-3">Demand</th>
                  <th className="py-3 px-3">Priority</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {recentOpps.map((opp) => (
                  <tr key={opp.id} className="hover:bg-emerald-50/20 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-gray-900">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate max-w-xs">{opp.query}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-gray-600">{opp.intent}</td>
                    <td className="py-3.5 px-3">
                      <span className="font-medium text-gray-800">{opp.demand}</span>
                      <span className="block text-[10px] text-gray-400">
                        {opp.searchVolume.toLocaleString()} /mo
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block font-semibold ${
                          opp.priority === 'High'
                            ? 'text-emerald-700'
                            : opp.priority === 'Medium'
                            ? 'text-amber-700'
                            : 'text-gray-600'
                        }`}
                      >
                        {opp.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-gray-700 font-medium">{opp.status}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => onOpenOpportunityDetail(opp)}
                          className="p-1.5 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {opp.status === 'Discovered' || opp.status === 'Analyzing' ? (
                          <button
                            onClick={() => onQuickApproveOpportunity(opp.id)}
                            className="px-2.5 py-1 text-[11px] font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer"
                          >
                            Approve
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (1 Col): Recent Activity */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">Recent Activity</h2>
              <Clock className="w-4 h-4 text-gray-400" />
            </div>

            <div className="space-y-4">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <FileCheck2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 leading-snug">
                      {act.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                      <span>{act.author}</span>
                      <span>·</span>
                      <span>{act.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={() => onNavigateSection('quality-review')}
              className="w-full py-2.5 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-bold text-gray-800 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              <span>Go to Quality Review Queue</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
