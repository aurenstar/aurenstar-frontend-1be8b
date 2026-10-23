import React, { useState } from 'react';
import {
  Settings,
  Globe,
  FileText,
  Search,
  Send,
  Plug,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { INITIAL_SETTINGS } from '../../data/dictionaryMockData';

export const DictionarySettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'content' | 'seo' | 'publishing' | 'integrations'>('general');
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testModalIntegration, setTestModalIntegration] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Notice */}
      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-xs animate-slideDown">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Settings saved successfully in local prototype memory!</span>
          </div>
          <button onClick={() => setSaveSuccess(false)} className="text-emerald-700 font-bold cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap gap-1">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'general' ? 'bg-emerald-800 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>General</span>
        </button>

        <button
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'content' ? 'bg-emerald-800 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Content Preferences</span>
        </button>

        <button
          onClick={() => setActiveTab('seo')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'seo' ? 'bg-emerald-800 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>SEO Preferences</span>
        </button>

        <button
          onClick={() => setActiveTab('publishing')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'publishing' ? 'bg-emerald-800 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Publishing Rules</span>
        </button>

        <button
          onClick={() => setActiveTab('integrations')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'integrations' ? 'bg-emerald-800 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Plug className="w-4 h-4" />
          <span>Integrations (4)</span>
        </button>
      </div>

      {/* Main Settings Panel */}
      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6">
        {/* TAB 1: GENERAL */}
        {activeTab === 'general' && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">General Workspace Configuration</h3>
              <p className="text-xs text-gray-500">Core parameters for the Aurenstar Dictionary AI SEO system.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1.5">System Name</label>
                <input
                  type="text"
                  value={settings.general.systemName}
                  onChange={(e) =>
                    setSettings({ ...settings, general: { ...settings.general, systemName: e.target.value } })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-semibold focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Primary Dictionary Path</label>
                <input
                  type="text"
                  value={settings.general.primaryDomain}
                  onChange={(e) =>
                    setSettings({ ...settings, general: { ...settings.general, primaryDomain: e.target.value } })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-semibold focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Default Language</label>
                <select
                  value={settings.general.defaultLanguage}
                  onChange={(e) =>
                    setSettings({ ...settings, general: { ...settings.general, defaultLanguage: e.target.value } })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="English (US)">English (US)</option>
                  <option value="Portuguese (BR)">Portuguese (BR)</option>
                  <option value="Spanish (ES)">Spanish (ES)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Lead SEO Director</label>
                <input
                  type="text"
                  value={settings.general.contentDirector}
                  onChange={(e) =>
                    setSettings({ ...settings, general: { ...settings.general, contentDirector: e.target.value } })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-semibold focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CONTENT PREFERENCES */}
        {activeTab === 'content' && (
          <div className="space-y-5 animate-fadeIn text-xs">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">Content Preferences & Brand Guardrails</h3>
              <p className="text-xs text-gray-500">Quality rules and tone directives for all dictionary entries.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Tone of Voice Directive</label>
                <input
                  type="text"
                  value={settings.content.voiceTone}
                  onChange={(e) =>
                    setSettings({ ...settings, content: { ...settings.content, voiceTone: e.target.value } })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-semibold focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Target Word Count Length</label>
                <input
                  type="text"
                  value={settings.content.targetWordCount}
                  onChange={(e) =>
                    setSettings({ ...settings, content: { ...settings.content, targetWordCount: e.target.value } })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-semibold focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Anti-Jargon Enforcement</label>
                <textarea
                  value={settings.content.jargonPolicy}
                  onChange={(e) =>
                    setSettings({ ...settings, content: { ...settings.content, jargonPolicy: e.target.value } })
                  }
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-semibold focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                <input
                  type="checkbox"
                  id="chkFaq"
                  checked={settings.content.includeFaqSection}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      content: { ...settings.content, includeFaqSection: e.target.checked },
                    })
                  }
                  className="w-4 h-4 text-emerald-600 rounded-md cursor-pointer accent-emerald-600"
                />
                <label htmlFor="chkFaq" className="font-bold text-gray-800 cursor-pointer">
                  Automatically require a 3-question FAQ section for Featured Snippet capture
                </label>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SEO PREFERENCES */}
        {activeTab === 'seo' && (
          <div className="space-y-5 animate-fadeIn text-xs">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">SEO Schema & URL Architecture</h3>
              <p className="text-xs text-gray-500">Technical crawl and indexing specifications.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1.5">URL Slug Pattern</label>
                <input
                  type="text"
                  value={settings.seo.slugFormat}
                  onChange={(e) =>
                    setSettings({ ...settings, seo: { ...settings.seo, slugFormat: e.target.value } })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-mono font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Meta Title Template</label>
                <input
                  type="text"
                  value={settings.seo.metaTitlePattern}
                  onChange={(e) =>
                    setSettings({ ...settings, seo: { ...settings.seo, metaTitlePattern: e.target.value } })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Structured Data (JSON-LD Schemas)</label>
                <input
                  type="text"
                  value={settings.seo.autoSchemaTypes}
                  onChange={(e) =>
                    setSettings({ ...settings, seo: { ...settings.seo, autoSchemaTypes: e.target.value } })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-semibold focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PUBLISHING RULES */}
        {activeTab === 'publishing' && (
          <div className="space-y-5 animate-fadeIn text-xs">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">Publishing Governance</h3>
              <p className="text-xs text-gray-500">Safety thresholds and velocity controls.</p>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-center gap-3 p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200/80">
                <input
                  type="checkbox"
                  id="chkHuman"
                  checked={settings.publishing.requireHumanSignOff}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      publishing: { ...settings.publishing, requireHumanSignOff: e.target.checked },
                    })
                  }
                  className="w-4 h-4 text-emerald-600 rounded-md cursor-pointer accent-emerald-600"
                />
                <div>
                  <label htmlFor="chkHuman" className="font-bold text-emerald-950 block cursor-pointer">
                    Mandatory Human Review Gate (Recommended)
                  </label>
                  <span className="text-[11px] text-emerald-700">
                    No dictionary page can be published without an explicit passed checklist and editorial sign-off.
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Maximum Daily Publications</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={settings.publishing.maxDailyPublications}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      publishing: { ...settings.publishing, maxDailyPublications: Number(e.target.value) },
                    })
                  }
                  className="w-32 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-semibold focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: INTEGRATIONS */}
        {activeTab === 'integrations' && (
          <div className="space-y-5 animate-fadeIn text-xs">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">Service Integrations</h3>
              <p className="text-xs text-gray-500">
                Status of connected data pipelines and publishing endpoints (Demo Environment).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {settings.integrations.map((integ) => (
                <div
                  key={integ.id}
                  className="p-5 rounded-2xl border border-gray-200 bg-gray-50/40 hover:bg-white hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-sm text-gray-900">{integ.name}</h4>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${integ.badgeColor}`}>
                        {integ.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed mb-3">
                      {integ.description}
                    </p>
                    <div className="p-2 bg-white rounded-lg border border-gray-200 text-[11px] text-gray-500 space-y-1 font-mono">
                      <div>Account: {integ.connectedAccount}</div>
                      <div>Last Sync: {integ.lastSync}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setTestModalIntegration(integ.name)}
                    className="w-full py-2 px-3 rounded-xl bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 font-bold text-xs cursor-pointer transition-colors"
                  >
                    Test Connection (Simulate)
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save Bar */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">Settings persist in local prototype state</span>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>

      {/* Test Connection Demo Modal */}
      {testModalIntegration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl border border-gray-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
              <Plug className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-gray-900">
                {testModalIntegration}
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Demonstration check: In this front-end prototype stage, real third-party authentication and API webhooks are disabled.
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-semibold">
              ✓ Prototype connectivity simulation successful
            </div>
            <button
              type="button"
              onClick={() => setTestModalIntegration(null)}
              className="w-full py-2.5 px-4 rounded-xl bg-gray-900 text-white font-bold text-xs cursor-pointer hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
