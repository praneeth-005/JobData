import React, { useState } from 'react';

interface StatesAndFeedbackLibraryPageProps {
  onNavigateToFindJobs?: () => void;
  onNavigateToSources?: () => void;
}

export default function StatesAndFeedbackLibraryPage({ onNavigateToFindJobs, onNavigateToSources }: StatesAndFeedbackLibraryPageProps) {
  const [activeToast, setActiveToast] = useState<string | null>(null);
  const [dismissedBanners, setDismissedBanners] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'ALL' | 'EMPTY' | 'LOADING' | 'ERRORS' | 'BANNERS'>('ALL');
  const [mockProgress, setMockProgress] = useState(68);

  const triggerToast = (msg: string) => {
    setActiveToast(msg);
    setTimeout(() => setActiveToast(null), 3500);
  };

  const toggleDismiss = (id: string) => {
    setDismissedBanners(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const cycleProgress = () => {
    setMockProgress(prev => (prev >= 95 ? 30 : prev + 20));
    triggerToast('Simulated next pipeline evaluation pass!');
  };

  return (
    <div className="w-full max-w-[1340px] mx-auto px-4 sm:px-6 py-6 font-sans flex flex-col gap-8">
      
      {/* Toast Notification Showcase */}
      {activeToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#1e1b4b] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-mono border border-indigo-400/40 animate-in fade-in slide-in-from-top-4">
          <span className="material-symbols-outlined text-[20px] text-[#10b981]">verified</span>
          <span>{activeToast}</span>
        </div>
      )}

      {/* Header / Meta Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[#4338ca] text-xs font-mono font-bold uppercase tracking-widest">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>QUALITY ASSURANCE &amp; RESILIENCE ARCHITECTURE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0f172a] tracking-tight">
            State Library &amp; System Feedback
          </h1>
          <p className="text-xs sm:text-sm text-[#64748b] max-w-2xl leading-relaxed">
            Comprehensive collection of edge states, error boundaries, resilient recovery fallbacks, and real-time operational feedback tokens across the discovery lifecycle.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#e2e8f0] rounded-full text-xs font-mono text-[#0f172a] font-bold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
            <span>Deterministic Rule Engine: Online</span>
          </div>
          <button 
            onClick={cycleProgress}
            className="px-3.5 py-1.5 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#334155] rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">cached</span>
            <span>Cycle Test Mock</span>
          </button>
        </div>
      </div>

      {/* Segmented Filter Strip (Anchors) */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-[#e2e8f0] shadow-2xs">
        {[
          { id: 'ALL', label: 'All Showcase States', icon: 'grid_view' },
          { id: 'EMPTY', label: '01. Empty & Zero States', icon: 'filter_alt_off' },
          { id: 'LOADING', label: '02. Async & Shimmer Loads', icon: 'hourglass_top' },
          { id: 'ERRORS', label: '03. Resilient Error Handling', icon: 'gpp_maybe' },
          { id: 'BANNERS', label: '04. Inline Banners & Toasts', icon: 'notifications_active' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 ${
              activeTab === item.id 
                ? 'bg-[#4338ca] text-white shadow-xs' 
                : 'text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* SECTION 1: EMPTY SEARCH & ZERO STATES */}
      {(activeTab === 'ALL' || activeTab === 'EMPTY') && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#eef2ff] text-[#4338ca] font-mono text-xs font-bold">01</span>
              <h2 className="text-lg font-bold text-[#0f172a]">Empty Search &amp; Collection Scenarios</h2>
            </div>
            <span className="text-[11px] font-mono text-[#64748b] uppercase tracking-wider">Zero Yield Recovery</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Card A: No Results for Current Filters */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs flex flex-col justify-between relative overflow-hidden group">
              <div className="flex flex-col gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#fee2e2] text-[#dc2626] flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[32px]">filter_alt_off</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold">
                      0 Openings Matched
                    </span>
                    <span className="text-xs font-mono text-[#64748b]">Applied: 6 Criteria</span>
                  </div>
                  <h3 className="text-base font-bold text-[#0f172a]">No Results for Current Filters</h3>
                  <p className="text-xs text-[#64748b] leading-relaxed mt-1">
                    No eligible openings match all 6 selected filters. Specifically, the combination of <code className="px-1.5 py-0.5 bg-[#f1f5f9] rounded text-[#0f172a] font-mono text-[11px]">Remote Only</code>, <code className="px-1.5 py-0.5 bg-[#f1f5f9] rounded text-[#0f172a] font-mono text-[11px]">≥ ₹8.5 LPA</code>, and <code className="px-1.5 py-0.5 bg-[#f1f5f9] rounded text-[#0f172a] font-mono text-[11px]">Golang Lead</code> yielded no direct intersections. Try broadening location or salary threshold.
                  </p>
                </div>

                {/* Filter Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f1f5f9] text-[#334155] text-xs font-mono">
                    Role: Golang Lead
                    <span className="material-symbols-outlined text-[13px] text-[#94a3b8] hover:text-[#0f172a] cursor-pointer">close</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f1f5f9] text-[#334155] text-xs font-mono">
                    Salary: ≥ ₹8.5 LPA
                    <span className="material-symbols-outlined text-[13px] text-[#94a3b8] hover:text-[#0f172a] cursor-pointer">close</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f1f5f9] text-[#334155] text-xs font-mono">
                    Mode: Fully Remote
                    <span className="material-symbols-outlined text-[13px] text-[#94a3b8] hover:text-[#0f172a] cursor-pointer">close</span>
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-6">
                <button 
                  onClick={() => triggerToast('All search filters reset to defaults!')}
                  className="px-4 py-2 bg-[#4338ca] hover:bg-[#3730a3] text-white rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">refresh</span>
                  <span>Reset All Filters</span>
                </button>
                {onNavigateToFindJobs && (
                  <button 
                    onClick={onNavigateToFindJobs}
                    className="px-4 py-2 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#334155] rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5"
                  >
                    <span>View All 34 Verified Jobs</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                )}
              </div>
            </div>

            {/* Card B: No Collected Jobs Available (Daemon Idle) */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs flex flex-col justify-between relative overflow-hidden group">
              <div className="flex flex-col gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#f1f5f9] text-[#64748b] flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[32px]">dataset</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#f1f5f9] text-[#64748b] font-bold">
                      Daemon Idle
                    </span>
                    <span className="text-xs font-mono text-[#64748b]">Last executed 5h 14m ago</span>
                  </div>
                  <h3 className="text-base font-bold text-[#0f172a]">No Collected Jobs Available</h3>
                  <p className="text-xs text-[#64748b] leading-relaxed mt-1">
                    No active jobs in the local verified database for this sector category yet. Career Partner ingestion daemons poll configured ATS platforms, career boards, and verified direct channels every 6 hours with deterministic rule filtering.
                  </p>
                </div>

                {/* Daemon Schedule Details Box */}
                <div className="w-full bg-[#f8fafc] rounded-xl p-3.5 border border-[#e2e8f0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#4338ca] text-[20px]">schedule</span>
                    <div>
                      <span className="text-xs font-bold text-[#0f172a] block">Next Scheduled Ingestion Run</span>
                      <span className="text-[11px] text-[#64748b]">Queue #4: Thoughtworks, Razorpay, Zepto ATS feeds</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#4338ca] px-2.5 py-1 bg-white border border-[#cbd5e1] rounded-lg">
                    in 46 mins
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-6">
                {onNavigateToSources && (
                  <button 
                    onClick={onNavigateToSources}
                    className="px-4 py-2 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#334155] rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">hub</span>
                    <span>Check Job Sources</span>
                  </button>
                )}
                <button 
                  onClick={() => triggerToast('On-demand ingestion triggered across 6 enterprise portals!')}
                  className="px-4 py-2 bg-[#4338ca] hover:bg-[#3730a3] text-white rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                  <span>Run Ingestion Now</span>
                </button>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* SECTION 2: ASYNCHRONOUS PIPELINE & SHIMMER STATES */}
      {(activeTab === 'ALL' || activeTab === 'LOADING') && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#eef2ff] text-[#4338ca] font-mono text-xs font-bold">02</span>
              <h2 className="text-lg font-bold text-[#0f172a]">Asynchronous Pipeline &amp; Shimmer States</h2>
            </div>
            <span className="text-[11px] font-mono text-[#64748b] uppercase tracking-wider">Zero Jitter Layouts</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Card C: Searching & Scoring Background State */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs flex flex-col justify-between gap-5">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3 pb-2 border-b border-[#f1f5f9]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#eef2ff] text-[#4338ca] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#0f172a]">Searching &amp; Scoring Listings...</h3>
                      <span className="text-xs text-[#64748b]">Evaluating deterministic rule filters (42 of 142 records passed)</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#ecfdf5] text-[#059669] text-xs font-mono font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
                    <span>Pass 2 of 4 Active</span>
                  </span>
                </div>

                {/* Dynamic Progress Meter */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#64748b]">Rule evaluation: Experience tier &amp; CTC Floor</span>
                    <span className="font-bold text-[#4338ca]">{mockProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#f1f5f9] overflow-hidden">
                    <div 
                      className="bg-[#4338ca] h-full rounded-full transition-all duration-500"
                      style={{ width: `${mockProgress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Simulated Shimmer Skeleton Card 1 */}
                <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] animate-pulse flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#e2e8f0]"></div>
                      <div className="flex flex-col gap-1.5">
                        <div className="w-36 h-3.5 bg-[#cbd5e1] rounded"></div>
                        <div className="w-24 h-2.5 bg-[#e2e8f0] rounded"></div>
                      </div>
                    </div>
                    <div className="w-16 h-5 bg-[#e2e8f0] rounded-full"></div>
                  </div>
                  <div className="w-full h-2 bg-[#e2e8f0] rounded"></div>
                  <div className="w-4/5 h-2 bg-[#e2e8f0] rounded"></div>
                </div>

                {/* Simulated Shimmer Skeleton Card 2 */}
                <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] animate-pulse opacity-60 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#e2e8f0]"></div>
                      <div className="flex flex-col gap-1.5">
                        <div className="w-44 h-3.5 bg-[#cbd5e1] rounded"></div>
                        <div className="w-28 h-2.5 bg-[#e2e8f0] rounded"></div>
                      </div>
                    </div>
                    <div className="w-16 h-5 bg-[#e2e8f0] rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-[#64748b] pt-3 border-t border-[#f1f5f9]">
                <span>Worker: daemon-node-04b</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-[#10b981]">speed</span>
                  <span>214ms response rate</span>
                </span>
              </div>
            </div>

            {/* Card D: Asynchronously Loading Detailed Radar Chart */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs flex flex-col justify-between gap-5">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f9]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#eef2ff] text-[#4338ca] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">analytics</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#0f172a]">Job Details Loading</h3>
                      <span className="text-xs text-[#64748b]">Resolving ATS snapshot &amp; telemetry</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#f1f5f9] text-[#475569] font-mono text-xs">
                    ID: REQ-8902
                  </span>
                </div>

                {/* Radar Chart SVG Shimmer Animation */}
                <div className="p-5 bg-[#f8fafc] rounded-2xl border border-[#e2e8f0] flex flex-col sm:flex-row items-center gap-5">
                  <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
                    <svg className="w-28 h-28 animate-spin text-[#cbd5e1]" style={{ animationDuration: '10s' }} viewBox="0 0 100 100">
                      <polygon fill="none" points="50,10 90,40 75,85 25,85 10,40" stroke="currentColor" strokeDasharray="3 3" strokeWidth="1.5"></polygon>
                      <polygon fill="none" points="50,25 78,45 68,75 32,75 22,45" stroke="currentColor" strokeWidth="1.5"></polygon>
                      <polygon fill="rgba(67,56,202,0.15)" points="50,38 65,48 60,65 40,65 35,48" stroke="#4338ca" strokeWidth="1.5"></polygon>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px] text-[#4338ca] animate-pulse">radar</span>
                    </div>
                  </div>

                  <div className="flex-1 w-full flex flex-col gap-2.5 animate-pulse">
                    <div className="w-3/4 h-3.5 bg-[#cbd5e1] rounded"></div>
                    <div className="w-full h-2.5 bg-[#e2e8f0] rounded"></div>
                    <div className="w-5/6 h-2.5 bg-[#e2e8f0] rounded"></div>
                    <div className="flex items-center gap-2 pt-1">
                      <div className="w-16 h-5 bg-[#cbd5e1] rounded-full"></div>
                      <div className="w-20 h-5 bg-[#cbd5e1] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-[#64748b] pt-3 border-t border-[#f1f5f9]">
                <span className="flex items-center gap-1 text-[#059669]">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  <span>Encrypted candidate state buffer</span>
                </span>
                <span>Awaiting ATS payload...</span>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* SECTION 3: ERROR & FAILURE HANDLING (SAFE, NO STACK TRACES) */}
      {(activeTab === 'ALL' || activeTab === 'ERRORS') && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#eef2ff] text-[#4338ca] font-mono text-xs font-bold">03</span>
              <h2 className="text-lg font-bold text-[#0f172a]">Resilient Failure &amp; Quarantine Protocols</h2>
            </div>
            <span className="text-[11px] font-mono text-[#64748b] uppercase tracking-wider">Zero Stack Trace Leaks</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Card E: Backend Service Temporarily Unavailable */}
            <div className="bg-white rounded-2xl border border-red-200 p-6 shadow-xs flex flex-col justify-between gap-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-600"></div>

              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[28px]">cloud_off</span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-[#f1f5f9] font-mono text-xs text-[#64748b] font-bold">
                    ERR_SERVICE_DISCONNECTED
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-bold text-[#0f172a]">Backend Service Temporarily Unavailable</h3>
                  <p className="text-xs text-[#64748b] leading-relaxed">
                    Could not connect to job indexing daemon. Your saved jobs, rule settings, and active preferences are preserved safely in encrypted local storage.
                  </p>
                </div>

                {/* Safe Diagnostic Shield */}
                <div className="bg-[#f8fafc] rounded-xl p-3.5 border border-[#e2e8f0] flex flex-col gap-1.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#64748b]">Local Cache Integrity:</span>
                    <span className="text-[#059669] font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">check_circle</span>
                      <span>100% Intact (4 Saved Jobs)</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748b]">Cluster Gateway:</span>
                    <span className="text-[#0f172a]">ap-south-1.edge.partner</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748b]">Last Heartbeat:</span>
                    <span className="text-[#64748b]">3 minutes ago (TCP KeepAlive)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#f1f5f9]">
                <button 
                  onClick={() => triggerToast('Testing connection to MongoDB Atlas... Connection verified online!')}
                  className="px-4 py-2 bg-[#4338ca] hover:bg-[#3730a3] text-white rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">sync</span>
                  <span>Retry Connection</span>
                </button>
                <button 
                  onClick={() => triggerToast('Diagnostic report generated and submitted.')}
                  className="px-4 py-2 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#334155] rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">bug_report</span>
                  <span>Report Issue</span>
                </button>
              </div>
            </div>

            {/* Card F: Original Application Link Expired */}
            <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-xs flex flex-col justify-between gap-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500"></div>

              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[28px]">link_off</span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-[#f1f5f9] font-mono text-xs text-amber-700 font-bold">
                    HTTP 404 DETECTED
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-bold text-[#0f172a]">Original Application Link Expired</h3>
                  <p className="text-xs text-[#64748b] leading-relaxed">
                    The external Thoughtworks listing URL returned <code className="px-1 py-0.5 bg-[#f1f5f9] rounded text-[#0f172a] font-mono text-[11px]">HTTP 404 (Position Closed or Expired)</code>. This listing has been automatically quarantined from the active feed to safeguard your application pipeline.
                  </p>
                </div>

                {/* Quarantine Detail Card */}
                <div className="bg-[#f8fafc] rounded-xl p-3.5 border border-[#e2e8f0] flex flex-col gap-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#0f172a]">Thoughtworks — Graduate Software Engineer</span>
                    <span className="text-[#64748b] font-mono">Pune, India</span>
                  </div>
                  <p className="text-[11px] text-[#64748b] leading-relaxed">
                    Captured on Oct 21, 2024. Cache snapshot contains original qualifications, tech stack list, and verified salary range (₹8.5 LPA).
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#f1f5f9]">
                <button 
                  onClick={() => triggerToast('Opening verified historical cache snapshot...')}
                  className="px-4 py-2 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#334155] rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">history_edu</span>
                  <span>View Snapshot</span>
                </button>
                <button 
                  onClick={() => triggerToast('Quarantined listing removed from your pipeline.')}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
                  <span>Remove from Saved</span>
                </button>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* SECTION 4: INLINE FEEDBACK & NOTIFICATION BANNERS */}
      {(activeTab === 'ALL' || activeTab === 'BANNERS') && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#eef2ff] text-[#4338ca] font-mono text-xs font-bold">04</span>
              <h2 className="text-lg font-bold text-[#0f172a]">Inline Feedback &amp; Notification Banners</h2>
            </div>
            <span className="text-[11px] font-mono text-[#64748b] uppercase tracking-wider">Contextual Signals</span>
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs flex flex-col gap-4">
            <p className="text-xs text-[#64748b]">
              Standardized notification tokens used across candidate actions, automated validation runs, and system guardrails. Click any action to test dismissal or response.
            </p>

            <div className="flex flex-col gap-3">
              
              {/* 1. Success Toast / Banner */}
              {!dismissedBanners.has('b1') && (
                <div className="p-4 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#dcfce7] text-[#15803d] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">check_circle</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#15803d] block">Opportunity Saved Successfully</span>
                      <span className="text-xs text-[#166534]">
                        Job saved to your Saved Jobs collection (<strong>Thoughtworks — Graduate Software Engineer</strong>).
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                    <button onClick={() => triggerToast('Navigating to Saved Jobs collection...')} className="text-xs font-mono font-bold text-[#15803d] hover:underline">
                      View Saved Jobs
                    </button>
                    <button onClick={() => toggleDismiss('b1')} className="text-[#166534] hover:text-[#0f172a] p-1">
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 2. Warning / Duplicate Notification */}
              {!dismissedBanners.has('b2') && (
                <div className="p-4 rounded-xl bg-[#fffbeb] border border-[#fde68a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#fef3c7] text-[#b45309] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">bookmark</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#b45309] block">Already Saved in Profile</span>
                      <span className="text-xs text-[#92400e]">
                        You saved this opportunity on <strong>Oct 24, 2024 at 16:15 IST</strong>. Application status marked as <em>Drafting Cover Note</em>.
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                    <button onClick={() => triggerToast('Opening application tracker entry...')} className="px-3 py-1 rounded-lg bg-white border border-[#fcd34d] text-xs font-mono font-bold text-[#92400e]">
                      Manage Entry
                    </button>
                    <button onClick={() => toggleDismiss('b2')} className="text-[#92400e] hover:text-[#0f172a] p-1">
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 3. Manual Verification Banner */}
              {!dismissedBanners.has('b3') && (
                <div className="p-4 rounded-xl bg-[#faf8ff] border border-[#e0e7ff] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#eef2ff] text-[#4338ca] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">verified_user</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#4338ca]">Needs Manual Verification</span>
                        <span className="px-2 py-0.2 rounded-full bg-[#e0e7ff] text-[#4338ca] text-[10px] font-mono">Confidence: 62%</span>
                      </div>
                      <span className="text-xs text-[#334155]">
                        Automated verification confidence is low. Please inspect official company domain DNS and TLS certificate before submitting personal contact credentials.
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                    <button onClick={() => triggerToast('Domain DNS WHOIS & TLS certificate checked: 100% Valid.')} className="px-3 py-1 rounded-lg bg-white border border-[#cbd5e1] text-xs font-mono font-bold text-[#334155]">
                      Domain Audit
                    </button>
                    <button onClick={() => toggleDismiss('b3')} className="text-[#64748b] hover:text-[#0f172a] p-1">
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 4. Non-negotiable Hard Barrier Notification */}
              {!dismissedBanners.has('b4') && (
                <div className="p-4 rounded-xl bg-[#fee2e2]/60 border border-[#fecaca] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-red-100 text-[#dc2626] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">block</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#991b1b] block">Listing Blocked by Hard Criterion</span>
                      <span className="text-xs text-[#7f1d1d]">
                        Listing blocked: Annual CTC of <strong className="font-mono">₹2.1 LPA</strong> is strictly below the mandatory <strong className="font-mono">₹2.4 LPA</strong> fresher advisory floor configured in your Job Preferences.
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                    <button onClick={() => triggerToast('Salary floor preference is locked to statutory ₹2.40 LPA minimum.')} className="px-3 py-1 rounded-lg bg-white border border-[#fca5a5] text-xs font-mono font-bold text-[#991b1b]">
                      Modify Preferences
                    </button>
                    <button onClick={() => toggleDismiss('b4')} className="text-[#991b1b] hover:text-[#0f172a] p-1">
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                </div>
              )}

              {dismissedBanners.size > 0 && (
                <button 
                  onClick={() => setDismissedBanners(new Set())}
                  className="self-start text-xs font-mono text-[#4338ca] hover:underline font-bold mt-2"
                >
                  Restore All Dismissed Banners ({dismissedBanners.size})
                </button>
              )}

            </div>
          </div>
        </section>
      )}

    </div>
  );
}
