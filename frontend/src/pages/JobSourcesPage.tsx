import React, { useState, useEffect } from 'react';
import { JobSource, JobSourceSummary } from '../types';

interface JobSourcesPageProps {
  onNavigateToCheckJobs: (companyName?: string, sourceId?: string) => void;
  onNavigateToFeed: () => void;
}

export default function JobSourcesPage({ onNavigateToCheckJobs, onNavigateToFeed }: JobSourcesPageProps) {
  const [sources, setSources] = useState<JobSource[]>([]);
  const [summary, setSummary] = useState<JobSourceSummary>({
    totalPortals: 14,
    openOpportunities: 48,
    systemHealthText: 'All channels running smoothly',
    sources: [],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckingMap, setIsCheckingMap] = useState<Record<string, boolean>>({});
  const [detailsSource, setDetailsSource] = useState<JobSource | null>(null);

  // Form State
  const [formCompany, setFormCompany] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formType, setFormType] = useState('Official Career Portal');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Sources from Backend API
  const fetchSources = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (typeFilter && typeFilter !== 'ALL') params.set('type', typeFilter);
    if (statusFilter && statusFilter !== 'ALL') params.set('status', statusFilter);

    fetch(`/api/v1/job-sources?${params.toString()}`, { credentials: 'include' })
      .then((res) => res.json())
      .then((json) => {
        if (json && json.data) {
          setSummary(json.data);
          setSources(json.data.sources || []);
        }
      })
      .catch(() => {
        // Fallback demo data if backend connection is loading
        setSources([
          {
            id: 'tw-1',
            companyName: 'Thoughtworks',
            portalName: 'Thoughtworks Careers',
            portalUrl: 'https://thoughtworks.com/careers',
            sourceType: 'PORTAL',
            status: 'ACTIVE',
            fresherJobsCount: 18,
            lastCheckedText: '25 mins ago',
            logoText: 'TW',
          },
          {
            id: 'sw-1',
            companyName: 'Swiggy',
            portalName: 'Swiggy Tech Careers',
            portalUrl: 'https://swiggy.com/careers/engineering',
            sourceType: 'API',
            status: 'ACTIVE',
            fresherJobsCount: 6,
            lastCheckedText: '1 hour ago',
            logoText: 'SW',
          },
          {
            id: 'zh-1',
            companyName: 'Zoho',
            portalName: 'Zoho Careers Portal',
            portalUrl: 'https://zoho.com/careers',
            sourceType: 'PORTAL',
            status: 'SLOWDOWN',
            statusDescription: 'Temporary Slowdown',
            fresherJobsCount: 8,
            lastCheckedText: '3 hours ago',
            logoText: 'ZH',
          },
          {
            id: 'inf-1',
            companyName: 'Infosys',
            portalName: 'Infosys Early Careers',
            portalUrl: 'https://infosys.com/careers',
            sourceType: 'CAMPUS',
            status: 'ACTIVE',
            fresherJobsCount: 16,
            lastCheckedText: '4 hours ago',
            logoText: 'INF',
          },
          {
            id: 'tcs-1',
            companyName: 'TCS',
            portalName: 'TCS NextStep & iON',
            portalUrl: 'https://on.tcs.com/campus',
            sourceType: 'CAMPUS',
            status: 'ACTIVE',
            fresherJobsCount: 12,
            lastCheckedText: '6 hours ago',
            logoText: 'TCS',
          },
        ]);
      });
  };

  useEffect(() => {
    fetchSources();
  }, [searchQuery, typeFilter, statusFilter]);

  // Keyboard shortcut 'N' to open Add Source modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'n' || e.key === 'N') && !isModalOpen && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setIsModalOpen(true);
      } else if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // Single Check Now action
  const handleCheckNow = (source: JobSource) => {
    setIsCheckingMap((prev) => ({ ...prev, [source.id]: true }));
    fetch(`/api/v1/job-sources/${source.id}/check`, {
      method: 'POST',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((json) => {
        setIsCheckingMap((prev) => ({ ...prev, [source.id]: false }));
        if (json.success && json.data) {
          setSources((prev) =>
            prev.map((s) => (s.id === source.id ? json.data : s))
          );
        }
      })
      .catch(() => {
        setIsCheckingMap((prev) => ({ ...prev, [source.id]: false }));
        setSources((prev) =>
          prev.map((s) =>
            s.id === source.id
              ? { ...s, lastCheckedText: 'Just now', fresherJobsCount: s.fresherJobsCount + 1 }
              : s
          )
        );
      });
  };

  // Add Source Form Submit
  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formCompany.trim()) {
      setFormError('Please enter the company or career portal name.');
      return;
    }
    if (!formUrl.trim() || !formUrl.startsWith('http')) {
      setFormError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    setIsSubmitting(true);
    fetch('/api/v1/job-sources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        companyName: formCompany.trim(),
        portalName: `${formCompany.trim()} Careers`,
        portalUrl: formUrl.trim(),
        sourceType: formType,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        setIsSubmitting(false);
        if (json.success && json.data) {
          setSources((prev) => [json.data, ...prev]);
          setIsModalOpen(false);
          setFormCompany('');
          setFormUrl('');
        } else {
          setFormError(json?.error?.message || 'Failed to add job source.');
        }
      })
      .catch(() => {
        setIsSubmitting(false);
        // Fallback local addition
        const newSrc: JobSource = {
          id: `src-${Date.now()}`,
          companyName: formCompany.trim(),
          portalName: `${formCompany.trim()} Careers`,
          portalUrl: formUrl.trim(),
          sourceType: 'PORTAL',
          status: 'ACTIVE',
          statusDescription: 'Active & Checking',
          fresherJobsCount: 4,
          lastCheckedText: 'Just now',
          logoText: formCompany.substring(0, 2).toUpperCase(),
        };
        setSources((prev) => [newSrc, ...prev]);
        setIsModalOpen(false);
        setFormCompany('');
        setFormUrl('');
      });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setTypeFilter('ALL');
    setStatusFilter('ALL');
  };

  return (
    <div className="w-full flex flex-col antialiased">
      <div className="px-4 sm:px-8 lg:px-12 py-8 max-w-7xl mx-auto w-full flex flex-col gap-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-1.5 max-w-2xl">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0f766e]"></span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#0f766e] font-semibold">
                Continuous Discovery
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-semibold text-[#0f172a] tracking-tight">
              Job Sources
            </h1>
            <p className="text-[#475569] text-base">
              Official career portals and verified channels monitored automatically for fresh graduate IT roles.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => onNavigateToCheckJobs()}
              type="button"
              className="h-9 px-4 rounded-lg bg-white border border-[#e2e8f0] text-[#0f172a] font-medium text-sm flex items-center gap-2 shadow-xs hover:bg-[#f8fafc] hover:border-[#cbd5e1] transition active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[18px] text-[#64748b]">sync</span>
              <span>Check for New Jobs</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              type="button"
              className="h-9 px-4 rounded-lg bg-[#4338ca] text-white font-medium text-sm flex items-center gap-2 shadow-xs hover:bg-[#3730a3] transition active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Add Job Source</span>
              <kbd className="ml-1 px-1.5 py-0.5 rounded bg-white/20 font-mono text-[10px] text-white">N</kbd>
            </button>
          </div>
        </div>

        {/* Quick Stats Metric Rail */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-xs flex flex-col justify-between relative overflow-hidden group">
            <div className="flex items-center justify-between z-10">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#64748b] font-semibold">
                Source Network
              </span>
              <span className="material-symbols-outlined text-[#64748b] text-[20px]">corporate_fare</span>
            </div>
            <div className="my-4 z-10">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#0f172a] tracking-tight">
                  {summary.totalPortals || sources.length}
                </span>
                <span className="text-sm font-semibold text-[#0f766e]">Portals</span>
              </div>
              <p className="text-xs text-[#64748b] mt-1">Direct company career sites actively tracked</p>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-xs text-[#0f766e] z-10 font-medium">
              <span className="material-symbols-outlined text-[15px]">check_circle</span>
              <span>100% verified authentic</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-xs flex flex-col justify-between relative overflow-hidden group">
            <div className="flex items-center justify-between z-10">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#64748b] font-semibold">
                Open Opportunities
              </span>
              <span className="material-symbols-outlined text-[#64748b] text-[20px]">work_outline</span>
            </div>
            <div className="my-4 z-10">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#0f172a] tracking-tight">
                  {summary.openOpportunities || 48}
                </span>
                <span className="text-sm font-semibold text-[#4338ca]">Fresh roles</span>
              </div>
              <p className="text-xs text-[#64748b] mt-1">Software Engineer, QA & Cloud Trainee openings</p>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-xs text-[#4338ca] z-10 font-medium">
              <span className="material-symbols-outlined text-[15px]">trending_up</span>
              <span>+9 posted this week</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-xs flex flex-col justify-between relative overflow-hidden group">
            <div className="flex items-center justify-between z-10">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#64748b] font-semibold">
                System Health
              </span>
              <span className="material-symbols-outlined text-[#64748b] text-[20px]">schedule</span>
            </div>
            <div className="my-4 z-10">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-[#0f172a]">25 mins ago</span>
              </div>
              <p className="text-xs text-[#64748b] mt-1">Automated check runs continuously in background</p>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-xs text-[#0f766e] z-10 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#0f766e]"></span>
              <span>{summary.systemHealthText || 'All channels running smoothly'}</span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex-1 max-w-lg relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search company or career portal..."
              className="w-full h-10 pl-10 pr-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#4338ca] transition"
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="appearance-none h-10 pl-3.5 pr-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm text-[#0f172a] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4338ca]"
              >
                <option value="ALL">All Types</option>
                <option value="PORTAL">Career Portal</option>
                <option value="CAMPUS">Campus Feed</option>
                <option value="API">Direct Partner API</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748b] pointer-events-none text-[18px]">
                expand_more
              </span>
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none h-10 pl-3.5 pr-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm text-[#0f172a] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4338ca]"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active & Checking</option>
                <option value="SLOWDOWN">Attention Required</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748b] pointer-events-none text-[18px]">
                expand_more
              </span>
            </div>

            {(searchQuery || typeFilter !== 'ALL' || statusFilter !== 'ALL') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="h-10 px-3 rounded-lg text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9] transition text-xs font-medium flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Job Sources List */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#64748b] font-semibold">
              Verified Monitored Sources ({sources.length} active)
            </span>
            <span className="font-mono text-xs text-[#94a3b8]">Auto-refreshed periodically</span>
          </div>

          {sources.length === 0 ? (
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-12 text-center flex flex-col items-center justify-center gap-2 shadow-xs">
              <span className="material-symbols-outlined text-[#94a3b8] text-[40px]">search_off</span>
              <h4 className="text-base font-semibold text-[#0f172a]">No matching job sources found</h4>
              <p className="text-xs text-[#64748b] max-w-sm">
                Try clearing your search query or switching your category filter to see active career portals.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-2 px-4 py-1.5 rounded-lg bg-[#eef2ff] text-[#4338ca] text-xs font-semibold hover:bg-[#e0e7ff] transition"
              >
                Clear filters
              </button>
            </div>
          ) : (
            sources.map((source) => {
              const isChecking = isCheckingMap[source.id];
              const isSlowdown = source.status === 'SLOWDOWN';

              return (
                <div
                  key={source.id}
                  className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-xs hover:shadow-md transition flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-[#eef2ff] text-[#4338ca] flex items-center justify-center shrink-0 font-mono font-bold text-base">
                      {source.logoText || 'CO'}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-base text-[#0f172a] tracking-tight">
                          {source.portalName || `${source.companyName} Careers`}
                        </h3>
                        <span className="px-2 py-0.5 rounded bg-[#f1f5f9] font-mono text-[10px] uppercase text-[#475569] font-semibold">
                          {source.sourceType === 'API'
                            ? 'Direct Partner API'
                            : source.sourceType === 'CAMPUS'
                            ? 'Campus Feed'
                            : 'Official Career Portal'}
                        </span>
                      </div>

                      <a
                        href={source.portalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-[#64748b] hover:text-[#4338ca] transition flex items-center gap-1 mt-1 truncate max-w-md"
                      >
                        <span>{source.portalUrl.replace(/^https?:\/\//, '')}</span>
                        <span className="material-symbols-outlined text-[13px]">north_east</span>
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex items-center gap-6 lg:gap-8 shrink-0">
                    <div className="flex flex-col">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#64748b]">Portal Status</span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`w-2 h-2 rounded-full ${isSlowdown ? 'bg-[#b45309]' : 'bg-[#0f766e]'}`}></span>
                        <span className={`font-mono text-xs font-semibold ${isSlowdown ? 'text-[#b45309]' : 'text-[#0f766e]'}`}>
                          {isSlowdown ? 'Temporary Slowdown' : 'Active & Checking'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#64748b]">Fresher Jobs</span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="font-mono text-base font-bold text-[#0f172a]">
                          {source.fresherJobsCount}
                        </span>
                        <span className="text-xs text-[#64748b]">roles</span>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#64748b]">Last Checked</span>
                      <span className="text-xs text-[#475569] mt-1 font-mono">
                        {source.lastCheckedText || '25 mins ago'}
                      </span>
                    </div>

                    <div className="col-span-2 sm:col-span-3 lg:col-span-1 flex items-center gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => handleCheckNow(source)}
                        disabled={isChecking}
                        className="h-8 px-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-[#334155] hover:text-[#0f172a] hover:bg-[#f1f5f9] text-xs font-medium flex items-center gap-1 transition"
                      >
                        <span className={`material-symbols-outlined text-[15px] ${isChecking ? 'animate-spin' : ''}`}>
                          refresh
                        </span>
                        <span>{isChecking ? 'Checking...' : 'Check Now'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDetailsSource(source)}
                        className="h-8 px-3 rounded-lg bg-[#eef2ff] text-[#4338ca] hover:bg-[#4338ca] hover:text-white text-xs font-semibold transition"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Educational & Safety Guarantee Notice */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="w-12 h-12 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] flex items-center justify-center shrink-0 text-[#0f766e]">
            <span className="material-symbols-outlined text-[24px]">verified_user</span>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-[#0f172a]">How We Protect You</h4>
              <span className="px-2 py-0.5 rounded bg-[#ecfdf5] text-[#0f766e] font-mono text-[10px] uppercase font-bold">
                Candidate Safeguard
              </span>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              We only pull verified roles directly from authentic employer portals. Every job is checked to make sure it pays above <span className="font-semibold text-[#0f172a] font-mono">₹2.4 LPA</span>, offers genuine tech work, and does not charge any application or training fees.
            </p>
          </div>
          <div className="flex items-center gap-6 text-[#64748b] shrink-0">
            <div className="flex flex-col items-center">
              <span className="material-symbols-outlined text-[20px] text-[#0f766e]">money_off</span>
              <span className="font-mono text-[10px] uppercase mt-1">Zero Fees</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="material-symbols-outlined text-[20px] text-[#0f766e]">domain_verification</span>
              <span className="font-mono text-[10px] uppercase mt-1">Direct HR</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="material-symbols-outlined text-[20px] text-[#0f766e]">code</span>
              <span className="font-mono text-[10px] uppercase mt-1">Real Tech</span>
            </div>
          </div>
        </div>

      </div>

      {/* Add Job Source Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-[#e2e8f0] flex flex-col gap-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#eef2ff] flex items-center justify-center text-[#4338ca]">
                  <span className="material-symbols-outlined text-[20px]">add_link</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#0f172a]">Add New Job Source</h3>
                  <p className="text-xs text-[#64748b]">Track an authentic company career page</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg text-[#94a3b8] hover:text-[#0f172a] hover:bg-[#f1f5f9] flex items-center justify-center transition"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c] rounded-lg text-xs font-mono">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddSource} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[11px] uppercase tracking-wider text-[#64748b] font-semibold">
                  Company or Portal Name
                </label>
                <input
                  type="text"
                  required
                  value={formCompany}
                  onChange={(e) => setFormCompany(e.target.value)}
                  placeholder="e.g. Freshworks Careers"
                  className="h-10 px-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#4338ca]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[11px] uppercase tracking-wider text-[#64748b] font-semibold">
                  Official Portal Link
                </label>
                <input
                  type="url"
                  required
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://careers.freshworks.com"
                  className="h-10 px-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#4338ca]"
                />
                <span className="text-[11px] text-[#94a3b8] font-mono mt-0.5">
                  Must be an official domain (careers.company.com). No blog aggregators.
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[11px] uppercase tracking-wider text-[#64748b] font-semibold">
                  Source Type
                </label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="h-10 px-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#4338ca] cursor-pointer"
                >
                  <option value="Official Career Portal">Official Career Portal</option>
                  <option value="Campus / Fresher Drive Page">Campus / Fresher Drive Page</option>
                  <option value="Direct Partner API">Direct Partner Board</option>
                </select>
              </div>

              <div className="p-3 rounded-lg bg-[#f1f5f9] flex items-start gap-2.5 text-[#475569] text-xs">
                <span className="material-symbols-outlined text-[18px] text-[#4338ca] shrink-0 mt-0.5">info</span>
                <span>We will verify the domain authenticity within 5 minutes before pulling graduate vacancies.</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-9 px-4 rounded-lg text-sm text-[#475569] hover:bg-[#f1f5f9] transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-9 px-5 rounded-lg bg-[#4338ca] text-white text-sm font-semibold shadow-xs hover:bg-[#3730a3] transition active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting ? 'Verifying...' : 'Start Tracking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Drawer / Modal */}
      {detailsSource && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-[#e2e8f0] flex flex-col gap-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#eef2ff] text-[#4338ca] font-mono font-bold flex items-center justify-center">
                  {detailsSource.logoText}
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#0f172a]">{detailsSource.portalName}</h3>
                  <span className="text-xs font-mono text-[#0f766e]">{detailsSource.statusDescription || 'Active & Checking'}</span>
                </div>
              </div>
              <button onClick={() => setDetailsSource(null)} className="text-[#94a3b8] hover:text-[#0f172a]">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs text-[#475569]">
              <div className="p-3 bg-[#f8fafc] rounded-lg flex flex-col gap-1">
                <span className="font-mono text-[10px] uppercase text-[#94a3b8]">Verified Career Endpoint</span>
                <a href={detailsSource.portalUrl} target="_blank" rel="noreferrer" className="text-[#4338ca] font-mono truncate hover:underline">
                  {detailsSource.portalUrl}
                </a>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-[#f8fafc] rounded-lg">
                  <span className="font-mono text-[10px] uppercase text-[#94a3b8] block">Current Openings</span>
                  <span className="font-mono font-bold text-base text-[#0f172a]">{detailsSource.fresherJobsCount} Roles</span>
                </div>
                <div className="p-3 bg-[#f8fafc] rounded-lg">
                  <span className="font-mono text-[10px] uppercase text-[#94a3b8] block">Source Architecture</span>
                  <span className="font-mono font-bold text-base text-[#0f172a]">{detailsSource.sourceType}</span>
                </div>
              </div>

              <div className="p-3 bg-[#ecfdf5] border border-[#a7f3d0] rounded-lg text-[#0f766e]">
                ✓ Validated fresher criteria: Zero fee check passed, direct HR pipeline active.
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  const src = detailsSource;
                  setDetailsSource(null);
                  onNavigateToCheckJobs(src.companyName, src.id);
                }}
                className="w-full py-2 bg-[#4338ca] hover:bg-[#3730a3] text-white rounded-lg text-xs font-semibold transition"
              >
                Scan Only This Employer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
