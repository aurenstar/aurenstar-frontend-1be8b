import React, { useState } from 'react';
import {
  LayoutDashboard,
  Compass,
  Library,
  FileCheck2,
  FileText,
  TrendingUp,
  Settings,
  Bell,
  Menu,
  X,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Search,
} from 'lucide-react';
import {
  INITIAL_OPPORTUNITIES,
  INITIAL_CONTENT_ITEMS,
  INITIAL_REVIEW_ARTICLE,
  INITIAL_PUBLISHED_PAGES,
  OpportunityItem,
  OpportunityStatus,
  ContentItem,
  ReviewArticle,
  PublishedPageItem,
} from '../../data/dictionaryMockData';
import { DictionaryOverviewView } from '../../pages/dictionary/DictionaryOverviewView';
import { DictionaryOpportunitiesView } from '../../pages/dictionary/DictionaryOpportunitiesView';
import { DictionaryContentLibraryView } from '../../pages/dictionary/DictionaryContentLibraryView';
import { DictionaryQualityReviewView } from '../../pages/dictionary/DictionaryQualityReviewView';
import { DictionaryPublishedPagesView } from '../../pages/dictionary/DictionaryPublishedPagesView';
import { DictionaryPerformanceView } from '../../pages/dictionary/DictionaryPerformanceView';
import { DictionarySettingsView } from '../../pages/dictionary/DictionarySettingsView';

export type DictionarySection =
  | 'overview'
  | 'opportunities'
  | 'content-library'
  | 'quality-review'
  | 'published-pages'
  | 'performance'
  | 'settings';

interface DictionaryLayoutProps {
  onBackToPublicSite: () => void;
}

export const DictionaryLayout: React.FC<DictionaryLayoutProps> = ({ onBackToPublicSite }) => {
  const [currentSection, setCurrentSection] = useState<DictionarySection>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Centralized interactive state
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>(INITIAL_OPPORTUNITIES);
  const [selectedOppDetail, setSelectedOppDetail] = useState<OpportunityItem | null>(null);
  const [contentItems, setContentItems] = useState<ContentItem[]>(INITIAL_CONTENT_ITEMS);
  const [reviewArticle, setReviewArticle] = useState<ReviewArticle>(INITIAL_REVIEW_ARTICLE);
  const [publishedPages, setPublishedPages] = useState<PublishedPageItem[]>(INITIAL_PUBLISHED_PAGES);

  // Status Handlers
  const handleUpdateOpportunityStatus = (id: string, newStatus: OpportunityStatus) => {
    setOpportunities((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    if (selectedOppDetail && selectedOppDetail.id === id) {
      setSelectedOppDetail((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleApproveArticle = (id: string) => {
    setReviewArticle((prev) => ({ ...prev, overallStatus: 'Approved' }));
    setContentItems((prev) =>
      prev.map((item) => (item.id === 'cnt-1' ? { ...item, status: 'Approved' } : item))
    );
  };

  const handleRequestChanges = (id: string, notes: string) => {
    setReviewArticle((prev) => ({ ...prev, overallStatus: 'Changes Requested' }));
    setContentItems((prev) =>
      prev.map((item) => (item.id === 'cnt-1' ? { ...item, status: 'Writing' } : item))
    );
  };

  const handleRejectArticle = (id: string) => {
    setReviewArticle((prev) => ({ ...prev, overallStatus: 'Needs Review' }));
  };

  // Nav metadata
  const navItems = [
    { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
    { id: 'opportunities' as const, label: 'Opportunities', icon: Compass, badge: opportunities.length },
    { id: 'content-library' as const, label: 'Content Library', icon: Library },
    { id: 'quality-review' as const, label: 'Quality Review', icon: FileCheck2, badge: '1' },
    { id: 'published-pages' as const, label: 'Published Pages', icon: FileText, badge: publishedPages.length },
    { id: 'performance' as const, label: 'Performance', icon: TrendingUp },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  const sectionMeta: Record<DictionarySection, { title: string; subtitle: string }> = {
    overview: {
      title: 'Aurenstar Dictionary — SEO Overview',
      subtitle: 'Real-time intelligence dashboard tracking keyword opportunities and editorial velocity.',
    },
    opportunities: {
      title: 'Search Opportunities Engine',
      subtitle: 'AI-clustered astrology queries prioritized by search volume and organic rank potential.',
    },
    'content-library': {
      title: 'Content Asset Library',
      subtitle: 'Central repository of all educational astrology pages, target keywords, and editorial status.',
    },
    'quality-review': {
      title: 'Pre-Publication Quality Gate',
      subtitle: 'Rigorous 6-point verification covering clarity, search intent, and SEO schema structure.',
    },
    'published-pages': {
      title: 'Published Dictionary Pages',
      subtitle: 'Live indexing health, CTR benchmarks, and organic click tracking across search engines.',
    },
    performance: {
      title: 'Organic Search Performance',
      subtitle: 'Trajectory charts, average position distribution, and high-impact improvement recommendations.',
    },
    settings: {
      title: 'Dictionary System Settings',
      subtitle: 'Manage editorial guidelines, SEO templates, publishing rules, and data pipeline integrations.',
    },
  };

  const notifications = [
    { id: 'n1', title: 'New query opportunity detected', time: '14 min ago', unread: true },
    { id: 'n2', title: '"Mercury Retrograde" draft passed 5/6 checks', time: '1 hour ago', unread: true },
    { id: 'n3', title: 'Simulated GSC indexing sync completed', time: '3 hours ago', unread: false },
  ];

  return (
    <div className="min-h-screen bg-[#C9E5FF] text-[#172B4D] flex flex-col antialiased">
      <div className="flex flex-1 relative overflow-hidden">
        {/* =========================================================================
            DESKTOP & MOBILE SIDEBAR (Fixed / Collapsible)
            ========================================================================= */}
        {/* Mobile backdrop */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs z-40 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        <aside
          className={`fixed top-0 bottom-0 left-0 w-64 bg-white border-r border-[#D9E8F8] z-50 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Top Brand Area */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-black text-lg shadow-xs">
                A
              </div>
              <div>
                <span className="font-extrabold text-sm text-gray-950 tracking-tight block">
                  Aurenstar
                </span>
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                  Dictionary AI
                </span>
              </div>
            </div>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="p-1 text-gray-400 hover:text-gray-700 lg:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-3 flex-1 overflow-y-auto space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Core Modules
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentSection(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                        isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Sidebar: Demo Status & Return Link */}
          <div className="p-4 border-t border-gray-100 space-y-3 bg-gray-50/50">
            {/* Demo Status Box */}
            <div className="p-3 rounded-xl bg-white border border-gray-200 text-xs shadow-2xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-gray-900 text-[11px] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>DEMO ENVIRONMENT</span>
                </span>
                <span className="text-[10px] font-mono text-gray-400">v1.4</span>
              </div>
              <p className="text-[11px] text-gray-500 leading-snug">
                Simulated AI SEO pipeline. No external DB or API active.
              </p>
            </div>

            {/* Back to Public Site */}
            <button
              onClick={onBackToPublicSite}
              className="w-full py-2 px-3 rounded-xl bg-white hover:bg-gray-100 border border-gray-200 text-xs font-bold text-gray-700 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-gray-500" />
              <span>Ver Site Público Aurenstar</span>
            </button>
          </div>
        </aside>

        {/* =========================================================================
            MAIN CONTENT AREA
            ========================================================================= */}
        <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
          {/* Main Top Header */}
          <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#D9E8F8] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 lg:hidden cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <h1 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight leading-tight">
                  {sectionMeta[currentSection].title}
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  {sectionMeta[currentSection].subtitle}
                </p>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-3">
              {/* Notifications Popover */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowProfileMenu(false);
                  }}
                  className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl relative cursor-pointer transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  <span className="w-2 h-2 rounded-full bg-emerald-600 absolute top-1.5 right-1.5" />
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 z-50 animate-slideDown">
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-100">
                      <span className="text-xs font-bold text-gray-900">Notifications (Demo)</span>
                      <span className="text-[10px] text-emerald-700 font-semibold cursor-pointer">
                        Mark all read
                      </span>
                    </div>
                    <div className="space-y-2.5 text-xs">
                      {notifications.map((n) => (
                        <div key={n.id} className="p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <p className="font-semibold text-gray-800 leading-snug">{n.title}</p>
                          <span className="text-[10px] text-gray-400 mt-0.5 block">{n.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar & Menu */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowProfileMenu(!showProfileMenu);
                    setShowNotifications(false);
                  }}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
                    AR
                  </div>
                  <div className="text-left hidden md:block">
                    <span className="block text-xs font-bold text-gray-900 leading-none">
                      Alex Reed
                    </span>
                    <span className="text-[10px] text-emerald-800 font-semibold">
                      SEO Lead
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 p-2 z-50 animate-slideDown text-xs font-semibold">
                    <div className="px-3 py-2 border-b border-gray-100 text-gray-500 font-normal">
                      Signed in as <strong className="text-gray-900 block font-bold">alex.reed@aurenstar.com</strong>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentSection('settings');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 cursor-pointer"
                    >
                      Workspace Settings
                    </button>
                    <button
                      onClick={onBackToPublicSite}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50 text-emerald-800 cursor-pointer"
                    >
                      Ver Site Público Aurenstar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Section Body */}
          <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
            {currentSection === 'overview' && (
              <DictionaryOverviewView
                opportunities={opportunities}
                contentItems={contentItems}
                reviewArticle={reviewArticle}
                publishedPages={publishedPages}
                onNavigateSection={(sec) => setCurrentSection(sec as DictionarySection)}
                onOpenOpportunityDetail={(opp) => {
                  setSelectedOppDetail(opp);
                  setCurrentSection('opportunities');
                }}
                onQuickApproveOpportunity={(id) => handleUpdateOpportunityStatus(id, 'Approved')}
              />
            )}

            {currentSection === 'opportunities' && (
              <DictionaryOpportunitiesView
                opportunities={opportunities}
                selectedOppDetail={selectedOppDetail}
                onOpenOpportunityDetail={setSelectedOppDetail}
                onCloseOpportunityDetail={() => setSelectedOppDetail(null)}
                onUpdateOpportunityStatus={handleUpdateOpportunityStatus}
              />
            )}

            {currentSection === 'content-library' && (
              <DictionaryContentLibraryView
                contentItems={contentItems}
                onOpenQualityReviewForPage={() => setCurrentSection('quality-review')}
              />
            )}

            {currentSection === 'quality-review' && (
              <DictionaryQualityReviewView
                article={reviewArticle}
                onApproveArticle={handleApproveArticle}
                onRequestChanges={handleRequestChanges}
                onRejectArticle={handleRejectArticle}
              />
            )}

            {currentSection === 'published-pages' && (
              <DictionaryPublishedPagesView publishedPages={publishedPages} />
            )}

            {currentSection === 'performance' && <DictionaryPerformanceView />}

            {currentSection === 'settings' && <DictionarySettingsView />}
          </main>
        </div>
      </div>
    </div>
  );
};
