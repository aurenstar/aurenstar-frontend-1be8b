import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  LayoutGrid,
  Table as TableIcon,
  FileText,
  Clock,
  User,
  ArrowRight,
  Eye,
  X,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { ContentItem, EditorialStatus } from '../../data/dictionaryMockData';

interface DictionaryContentLibraryViewProps {
  contentItems: ContentItem[];
  onOpenQualityReviewForPage?: (contentId: string) => void;
}

export const DictionaryContentLibraryView: React.FC<DictionaryContentLibraryViewProps> = ({
  contentItems,
  onOpenQualityReviewForPage,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | EditorialStatus>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [inspectingItem, setInspectingItem] = useState<ContentItem | null>(null);

  const categories = ['all', 'Planets', 'Zodiac Signs', 'Houses', 'Transits', 'Aspects', 'Fundamentals'];

  const filteredItems = useMemo(() => {
    return contentItems.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.primaryKeyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.metaDescription.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [contentItems, searchTerm, categoryFilter, statusFilter]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Search, Filter & View Mode Bar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search content pages by title, target keyword or meta description..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>

          {/* View Toggle (Table vs Cards) */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'table' ? 'bg-white text-emerald-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'cards' ? 'bg-white text-emerald-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cards</span>
            </button>
          </div>
        </div>

        {/* Filter Rows */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100 text-xs">
          <div className="flex items-center gap-1.5 text-gray-500 font-semibold mr-1">
            <Filter className="w-3.5 h-3.5 text-emerald-600" />
            <span>Category:</span>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' ? 'All Categories' : cat}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs font-semibold text-gray-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1 text-xs font-bold text-gray-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Writing">Writing</option>
              <option value="In Review">In Review</option>
              <option value="Approved">Approved</option>
              <option value="Published">Published</option>
            </select>
          </div>
        </div>
      </div>

      {/* Render Table or Cards */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>
              Showing <strong className="text-gray-900">{filteredItems.length}</strong> content assets
            </span>
            <span className="text-[11px] text-gray-400">Click preview to inspect metadata & outline</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/80 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                  <th className="py-3 px-4">Page Title</th>
                  <th className="py-3 px-3">Primary Keyword</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">URL Slug</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Words</th>
                  <th className="py-3 px-3">Last Updated</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-500">
                      No content items found matching current filters.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-emerald-50/20 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-gray-900">
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate max-w-xs">{item.title}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-medium text-emerald-900">{item.primaryKeyword}</td>
                      <td className="py-3.5 px-3 text-gray-600">{item.category}</td>
                      <td className="py-3.5 px-3 font-mono text-[11px] text-gray-500 truncate max-w-[150px]">
                        {item.url}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`font-bold ${
                            item.status === 'Published'
                              ? 'text-emerald-700'
                              : item.status === 'In Review'
                              ? 'text-amber-700'
                              : item.status === 'Approved'
                              ? 'text-teal-700'
                              : 'text-gray-500'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-gray-600 font-semibold">{item.wordCount.toLocaleString()}</td>
                      <td className="py-3.5 px-3 text-gray-500 text-[11px]">{item.lastUpdated}</td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setInspectingItem(item)}
                          className="px-2.5 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Preview</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span className="font-semibold text-emerald-700">{item.category}</span>
                  <span className="font-bold text-gray-700">{item.status}</span>
                </div>

                <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2">{item.title}</h3>

                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                  {item.metaDescription}
                </p>

                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 text-[11px] space-y-1 mb-4 font-mono text-gray-600">
                  <div className="truncate">
                    <span className="text-gray-400">Keyword:</span> {item.primaryKeyword}
                  </div>
                  <div className="truncate">
                    <span className="text-gray-400">URL:</span> {item.url}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                <span>{item.wordCount} words · {item.readingTime}</span>
                <button
                  onClick={() => setInspectingItem(item)}
                  className="font-bold text-emerald-700 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                >
                  <span>Inspect</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inspect Item Drawer / Modal */}
      {inspectingItem && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-gray-900/40 backdrop-blur-xs flex justify-end animate-fadeIn">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideLeft">
            <div className="p-6 border-b border-gray-100 flex items-start justify-between bg-gray-50/50">
              <div>
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-emerald-700">
                  <BookOpen className="w-4 h-4" />
                  <span>CONTENT ASSET INSPECTOR</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-gray-500 font-normal">{inspectingItem.category}</span>
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 leading-snug">
                  {inspectingItem.title}
                </h3>
              </div>
              <button
                onClick={() => setInspectingItem(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 flex-1 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/80 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-bold uppercase text-[10px]">Status:</span>
                  <span className="font-bold text-emerald-800">{inspectingItem.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-bold uppercase text-[10px]">Author:</span>
                  <span className="font-semibold text-gray-700">{inspectingItem.assignedAuthor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-bold uppercase text-[10px]">Word Count:</span>
                  <span className="font-semibold text-gray-700">{inspectingItem.wordCount} words ({inspectingItem.readingTime})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-bold uppercase text-[10px]">Last Update:</span>
                  <span className="text-gray-600">{inspectingItem.lastUpdated}</span>
                </div>
              </div>

              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Target Keyword
                </span>
                <p className="font-bold text-gray-900 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-200/60">
                  {inspectingItem.primaryKeyword}
                </p>
              </div>

              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Meta Description (SERP Preview)
                </span>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200 leading-relaxed">
                  {inspectingItem.metaDescription}
                </p>
              </div>

              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Illustrative Canonical URL
                </span>
                <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-200 font-mono text-[11px] text-gray-600">
                  <span>https://aurenstar.com{inspectingItem.url}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                </div>
              </div>

              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Secondary Clustered Keywords
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {inspectingItem.secondaryKeywords.map((kw) => (
                    <span
                      key={kw}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-[11px] font-medium"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/80">
              <button
                onClick={() => setInspectingItem(null)}
                className="w-full py-2.5 px-4 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs cursor-pointer transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
