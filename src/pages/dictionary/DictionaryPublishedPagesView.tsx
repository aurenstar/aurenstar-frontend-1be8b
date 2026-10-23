import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';
import { PublishedPageItem, IndexingStatus } from '../../data/dictionaryMockData';

interface DictionaryPublishedPagesViewProps {
  publishedPages: PublishedPageItem[];
}

export const DictionaryPublishedPagesView: React.FC<DictionaryPublishedPagesViewProps> = ({
  publishedPages,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [indexFilter, setIndexFilter] = useState<'all' | IndexingStatus>('all');
  const [sortBy, setSortBy] = useState<'clicks' | 'impressions' | 'ctr' | 'position' | 'date'>('clicks');

  const filteredPages = useMemo(() => {
    return publishedPages
      .filter((pg) => {
        const matchesSearch =
          pg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pg.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pg.topQuery.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesIndex = indexFilter === 'all' || pg.indexingStatus === indexFilter;
        return matchesSearch && matchesIndex;
      })
      .sort((a, b) => {
        if (sortBy === 'impressions') return b.impressions - a.impressions;
        if (sortBy === 'ctr') return b.ctr - a.ctr;
        if (sortBy === 'position') return a.avgPosition - b.avgPosition; // lower is better
        if (sortBy === 'date') return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
        return b.clicks - a.clicks;
      });
  }, [publishedPages, searchTerm, indexFilter, sortBy]);

  const totalClicks = publishedPages.reduce((acc, p) => acc + p.clicks, 0);
  const totalImpressions = publishedPages.reduce((acc, p) => acc + p.impressions, 0);
  const avgCtr = (totalClicks / totalImpressions) * 100;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Demo Warning Disclaimer Notice */}
      <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-semibold text-gray-800">Demonstration Search Console Metrics:</span>
          <span>Numbers shown are illustrative mock telemetry for prototype interface review.</span>
        </div>
        <span className="text-[11px] font-mono text-gray-500">Live API not connected</span>
      </div>

      {/* Aggregate Overview Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Published</span>
          <span className="text-xl font-extrabold text-gray-900">{publishedPages.length}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Organic Clicks</span>
          <span className="text-xl font-extrabold text-emerald-800">{totalClicks.toLocaleString()}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Impressions</span>
          <span className="text-xl font-extrabold text-gray-900">{totalImpressions.toLocaleString()}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400">Average SERP CTR</span>
          <span className="text-xl font-extrabold text-emerald-800">{avgCtr.toFixed(2)}%</span>
        </div>
      </div>

      {/* Search, Filter & Sort Bar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search published pages by title, URL or primary search query..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort By:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none cursor-pointer"
            >
              <option value="clicks">Organic Clicks (High to Low)</option>
              <option value="impressions">Total Impressions</option>
              <option value="ctr">CTR %</option>
              <option value="position">Avg Position (Top Rank)</option>
              <option value="date">Publish Date (Recent)</option>
            </select>
          </div>
        </div>

        {/* Index Status Filter */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100 text-xs">
          <span className="text-gray-500 font-semibold mr-1">Indexing Status:</span>
          {(['all', 'Indexed', 'Crawled - Not Indexed', 'Submitted'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setIndexFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                indexFilter === st
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st === 'all' ? 'All Statuses' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Published Pages Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>
            Showing <strong className="text-gray-900">{filteredPages.length}</strong> of{' '}
            {publishedPages.length} live pages
          </span>
          <span className="text-[11px] text-gray-400">Updated hourly via simulated GSC sync</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                <th className="py-3 px-4">Page Title & Path</th>
                <th className="py-3 px-3">Top SERP Query</th>
                <th className="py-3 px-3">Indexing Status</th>
                <th className="py-3 px-3">Clicks</th>
                <th className="py-3 px-3">Impressions</th>
                <th className="py-3 px-3">CTR</th>
                <th className="py-3 px-3">Avg Position</th>
                <th className="py-3 px-3">Published</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPages.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    No published pages found.
                  </td>
                </tr>
              ) : (
                filteredPages.map((pg) => (
                  <tr key={pg.id} className="hover:bg-emerald-50/20 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-900 max-w-xs">
                      <div className="truncate">{pg.title}</div>
                      <div className="flex items-center gap-1 font-mono text-[11px] text-emerald-700 font-normal truncate mt-0.5">
                        <span>{pg.url}</span>
                        <ExternalLink className="w-3 h-3 text-gray-400 shrink-0" />
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-gray-700 font-medium">{pg.topQuery}</td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold text-[11px] ${
                          pg.indexingStatus === 'Indexed'
                            ? 'text-emerald-700'
                            : pg.indexingStatus === 'Submitted'
                            ? 'text-amber-700'
                            : 'text-rose-700'
                        }`}
                      >
                        {pg.indexingStatus === 'Indexed' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                        )}
                        <span>{pg.indexingStatus}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-extrabold text-gray-900">
                      {pg.clicks.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-gray-600 font-medium">
                      {pg.impressions.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-emerald-800">
                      {pg.ctr.toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-3 font-extrabold text-gray-900">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md ${
                          pg.avgPosition <= 3
                            ? 'bg-emerald-100 text-emerald-900'
                            : pg.avgPosition <= 10
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        #{pg.avgPosition.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-gray-500 text-[11px] whitespace-nowrap">
                      {pg.publishedDate}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
