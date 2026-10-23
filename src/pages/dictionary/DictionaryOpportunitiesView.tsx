import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Eye,
  X,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
} from 'lucide-react';
import { OpportunityItem, OpportunityPriority, OpportunityStatus, SearchIntent } from '../../data/dictionaryMockData';

interface DictionaryOpportunitiesViewProps {
  opportunities: OpportunityItem[];
  selectedOppDetail: OpportunityItem | null;
  onOpenOpportunityDetail: (opp: OpportunityItem) => void;
  onCloseOpportunityDetail: () => void;
  onUpdateOpportunityStatus: (id: string, newStatus: OpportunityStatus) => void;
}

export const DictionaryOpportunitiesView: React.FC<DictionaryOpportunitiesViewProps> = ({
  opportunities,
  selectedOppDetail,
  onOpenOpportunityDetail,
  onCloseOpportunityDetail,
  onUpdateOpportunityStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OpportunityStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | OpportunityPriority>('all');
  const [intentFilter, setIntentFilter] = useState<'all' | SearchIntent>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'volume' | 'score'>('priority');

  const filteredOpportunities = useMemo(() => {
    return opportunities
      .filter((opp) => {
        const matchesSearch =
          opp.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
          opp.aiRecommendation.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || opp.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || opp.priority === priorityFilter;
        const matchesIntent = intentFilter === 'all' || opp.intent === intentFilter;
        return matchesSearch && matchesStatus && matchesPriority && matchesIntent;
      })
      .sort((a, b) => {
        if (sortBy === 'volume') return b.searchVolume - a.searchVolume;
        if (sortBy === 'score') return b.aiScore - a.aiScore;
        // Priority high > medium > low
        const priorityOrder: Record<OpportunityPriority, number> = { High: 3, Medium: 2, Low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
  }, [opportunities, searchTerm, statusFilter, priorityFilter, intentFilter, sortBy]);

  return (
    <div className="space-y-6 animate-fadeIn relative">
      {/* Search and Filters Bar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search astrology queries, intent or AI notes..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none cursor-pointer"
            >
              <option value="priority">Priority (High to Low)</option>
              <option value="volume">Search Volume</option>
              <option value="score">AI Potential Score</option>
            </select>
          </div>
        </div>

        {/* Filter Pills row */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100 text-xs">
          <div className="flex items-center gap-1.5 text-gray-500 font-semibold mr-1">
            <Filter className="w-3.5 h-3.5 text-emerald-600" />
            <span>Filters:</span>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            {(['all', 'Discovered', 'Analyzing', 'Approved', 'Writing', 'Rejected'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {st === 'all' ? 'All Status' : st}
              </button>
            ))}
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            {(['all', 'High', 'Medium', 'Low'] as const).map((pr) => (
              <button
                key={pr}
                onClick={() => setPriorityFilter(pr)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  priorityFilter === pr
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {pr === 'all' ? 'All Priority' : `${pr}`}
              </button>
            ))}
          </div>

          {/* Reset Filters */}
          {(statusFilter !== 'all' || priorityFilter !== 'all' || intentFilter !== 'all' || searchTerm) && (
            <button
              onClick={() => {
                setStatusFilter('all');
                setPriorityFilter('all');
                setIntentFilter('all');
                setSearchTerm('');
              }}
              className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Opportunities Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>
            Showing <strong className="text-gray-900">{filteredOpportunities.length}</strong> of{' '}
            {opportunities.length} total keyword opportunities
          </span>
          <span className="text-[11px] text-gray-400">Click any row to open AI strategy analysis</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                <th className="py-3 px-4">Search Query</th>
                <th className="py-3 px-3">Intent</th>
                <th className="py-3 px-3">Est. Demand</th>
                <th className="py-3 px-3">Difficulty</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">AI Score</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Quick Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredOpportunities.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    No search opportunities found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredOpportunities.map((opp) => {
                  const isSelected = selectedOppDetail?.id === opp.id;
                  return (
                    <tr
                      key={opp.id}
                      onClick={() => onOpenOpportunityDetail(opp)}
                      className={`hover:bg-emerald-50/30 transition-colors cursor-pointer ${
                        isSelected ? 'bg-emerald-50/50' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-semibold text-gray-900">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="font-bold">{opp.query}</span>
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
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-700">{opp.difficulty}</span>
                          <div className="w-12 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                opp.difficulty < 35
                                  ? 'bg-emerald-500'
                                  : opp.difficulty < 50
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${opp.difficulty}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`font-bold ${
                            opp.priority === 'High'
                              ? 'text-emerald-700'
                              : opp.priority === 'Medium'
                              ? 'text-amber-700'
                              : 'text-gray-500'
                          }`}
                        >
                          {opp.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                          {opp.aiScore}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="text-gray-700 font-semibold">{opp.status}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => onOpenOpportunityDetail(opp)}
                            className="p-1.5 text-gray-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg cursor-pointer"
                            title="Inspect Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {opp.status !== 'Approved' && opp.status !== 'Writing' && (
                            <button
                              onClick={() => onUpdateOpportunityStatus(opp.id, 'Approved')}
                              className="px-2 py-1 text-[11px] font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg cursor-pointer"
                            >
                              Approve
                            </button>
                          )}
                          {opp.status !== 'Rejected' && (
                            <button
                              onClick={() => onUpdateOpportunityStatus(opp.id, 'Rejected')}
                              className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                              title="Reject Opportunity"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side Drawer with Full Opportunity Details */}
      {selectedOppDetail && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-gray-900/40 backdrop-blur-xs flex justify-end animate-fadeIn">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideLeft">
            {/* Drawer Header */}
            <div className="p-6 border-b border-gray-100 flex items-start justify-between bg-gray-50/50">
              <div>
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-emerald-700">
                  <Sparkles className="w-4 h-4" />
                  <span>AI OPPORTUNITY BRIEF</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-gray-500 font-normal">Score {selectedOppDetail.aiScore}/100</span>
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 leading-snug">
                  {selectedOppDetail.query}
                </h3>
              </div>
              <button
                onClick={onCloseOpportunityDetail}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 space-y-6 flex-1 text-xs">
              {/* Meta Grid */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200/80">
                <div>
                  <span className="block text-[11px] font-bold text-gray-400 uppercase">Search Intent</span>
                  <span className="font-bold text-gray-800">{selectedOppDetail.intent}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-gray-400 uppercase">Est. Monthly Demand</span>
                  <span className="font-bold text-gray-800">
                    {selectedOppDetail.searchVolume.toLocaleString()} searches ({selectedOppDetail.demand})
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-gray-400 uppercase">Data Source</span>
                  <span className="font-semibold text-gray-700">{selectedOppDetail.dataSource}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-gray-400 uppercase">Current Status</span>
                  <span className="font-bold text-emerald-800">{selectedOppDetail.status}</span>
                </div>
              </div>

              {/* AI Strategic Assessment */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Opportunity Evaluation & AI Reasoning</span>
                </h4>
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-emerald-950 leading-relaxed font-normal">
                  {selectedOppDetail.aiRecommendation}
                </div>
              </div>

              {/* Suggested Editorial Action */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Suggested Editorial Action</span>
                </h4>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 leading-relaxed font-normal">
                  {selectedOppDetail.suggestedAction}
                </div>
              </div>

              {/* Related Existing Pages */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Related Existing Pages (Internal Linking Seeds)
                </h4>
                <div className="space-y-1.5">
                  {selectedOppDetail.relatedPages.map((pg) => (
                    <div
                      key={pg}
                      className="p-2.5 rounded-lg border border-gray-200 bg-white flex items-center justify-between text-gray-700"
                    >
                      <span className="font-mono text-[11px]">{pg}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/80 space-y-2">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                Execute Decision (Demo State)
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    onUpdateOpportunityStatus(selectedOppDetail.id, 'Approved');
                    onCloseOpportunityDetail();
                  }}
                  className="py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve</span>
                </button>
                <button
                  onClick={() => {
                    onUpdateOpportunityStatus(selectedOppDetail.id, 'Analyzing');
                    onCloseOpportunityDetail();
                  }}
                  className="py-2.5 px-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>Analyze</span>
                </button>
                <button
                  onClick={() => {
                    onUpdateOpportunityStatus(selectedOppDetail.id, 'Rejected');
                    onCloseOpportunityDetail();
                  }}
                  className="py-2.5 px-3 rounded-xl bg-white border border-gray-200 hover:bg-rose-50 text-rose-700 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
