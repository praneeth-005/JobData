import React, { useState, useEffect } from 'react';
import { DiscoveryScan, JobSource } from '../types';

interface CheckJobsPageProps {
  initialCompanyName?: string;
  initialSourceId?: string;
  onNavigateToFeed: () => void;
  onNavigateToSources: () => void;
}

export default function CheckJobsPage({
  initialCompanyName,
  initialSourceId,
  onNavigateToFeed,
  onNavigateToSources,
}: CheckJobsPageProps) {
  const [scope, setScope] = useState<'ALL' | 'SINGLE'>(initialCompanyName ? 'SINGLE' : 'ALL');
  const [selectedCompany, setSelectedCompany] = useState<string>(initialCompanyName || 'Thoughtworks');
  const [scan, setScan] = useState<DiscoveryScan>({
    id: 'scan-current',
    scope: initialCompanyName ? 'SINGLE' : 'ALL',
    targetCompanyName: initialCompanyName,
    targetSourceId: initialSourceId,
    status: 'IN_PROGRESS',
    progressPercent: 65,
    currentStepIndex: 3,
    currentCheckDescription: 'Checking eligibility & salary requirements (≥ ₹2.4 LPA minimum)',
    postingsScanned: 72,
    fresherJobsFound: 34,
    filteredOut: 26,
    duplicatesIgnored: 12,
  });

  const [availableCompanies, setAvailableCompanies] = useState<JobSource[]>([]);
  const [isStopped, setIsStopped] = useState(false);
  const [simulatedProgress, setSimulatedProgress] = useState(65);

  // Fetch connected company sources for the dropdown
  useEffect(() => {
    fetch('/api/v1/job-sources', { credentials: 'include' })
      .then((res) => res.json())
      .then((json) => {
        if (json && json.data && json.data.sources) {
          setAvailableCompanies(json.data.sources);
        }
      })
      .catch(() => {
        // Fallback demo companies
        setAvailableCompanies([
          { id: '1', companyName: 'Thoughtworks', portalName: 'Thoughtworks', portalUrl: '', sourceType: 'PORTAL', status: 'ACTIVE', fresherJobsCount: 18, logoText: 'TW' },
          { id: '2', companyName: 'Swiggy', portalName: 'Swiggy', portalUrl: '', sourceType: 'API', status: 'ACTIVE', fresherJobsCount: 6, logoText: 'SW' },
          { id: '3', companyName: 'Zoho', portalName: 'Zoho', portalUrl: '', sourceType: 'PORTAL', status: 'SLOWDOWN', fresherJobsCount: 8, logoText: 'ZH' },
          { id: '4', companyName: 'Infosys', portalName: 'Infosys', portalUrl: '', sourceType: 'CAMPUS', status: 'ACTIVE', fresherJobsCount: 16, logoText: 'INF' },
          { id: '5', companyName: 'TCS', portalName: 'TCS', portalUrl: '', sourceType: 'CAMPUS', status: 'ACTIVE', fresherJobsCount: 12, logoText: 'TCS' },
        ]);
      });
  }, []);

  // Fetch or trigger scan on backend
  const triggerScan = (newScope: 'ALL' | 'SINGLE', compName?: string) => {
    setIsStopped(false);
    setSimulatedProgress(25);
    fetch('/api/v1/job-discovery/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        scope: newScope,
        targetCompanyName: newScope === 'SINGLE' ? (compName || selectedCompany) : undefined,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json && json.data) {
          setScan(json.data);
          setSimulatedProgress(json.data.progressPercent);
        }
      })
      .catch(() => {
        // local fallback
      });
  };

  // Simulate smooth progress animation if in progress
  useEffect(() => {
    if (isStopped || simulatedProgress >= 100) return;

    const interval = setInterval(() => {
      setSimulatedProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = prev + 5;
        if (next >= 100) {
          setScan((s) => ({
            ...s,
            status: 'COMPLETED',
            currentStepIndex: 4,
            currentCheckDescription: 'All verified fresher opportunities successfully added to your feed.',
          }));
        }
        return next;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isStopped, simulatedProgress]);

  const handleStopSearch = () => {
    setIsStopped(true);
    fetch(`/api/v1/job-discovery/scan/${scan.id}/stop`, {
      method: 'POST',
      credentials: 'include',
    }).catch(() => {});
  };

  const handleRestartScan = () => {
    triggerScan(scope, selectedCompany);
  };

  return (
    <div className="w-full flex flex-col antialiased">
      <div className="px-4 sm:px-8 lg:px-12 py-8 max-w-[1200px] w-full mx-auto flex flex-col gap-8">
        
        {/* Editorial Page Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-[#64748b]">
            <button onClick={onNavigateToSources} className="hover:text-[#4338ca] transition">Workspace</button>
            <span>/</span>
            <button onClick={onNavigateToSources} className="hover:text-[#4338ca] transition">Job Sources</button>
            <span>/</span>
            <span className="text-[#4338ca] font-bold">Check for New Jobs</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-1">
            <div>
              <h1 className="text-3xl lg:text-4xl font-semibold text-[#0f172a] tracking-tight">
                Check for New Jobs
              </h1>
              <p className="text-[#475569] text-base max-w-2xl mt-1 leading-relaxed">
                Scan your connected company portals to discover freshly verified fresher openings, early-career roles, and paid internships.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-[#f1f5f9] px-4 py-1.5 rounded-full self-start md:self-auto border border-[#e2e8f0]">
              <span className="w-2 h-2 rounded-full bg-[#0f766e] animate-pulse"></span>
              <span className="font-mono text-xs text-[#0f172a] font-medium">Auto-sync active · 2026 / 2025 Batch</span>
            </div>
          </div>
        </div>

        {/* Step 1: Source Selection Cards */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#64748b] font-bold">
              Step 01 — Choose Scope
            </span>
            <span className="text-xs text-[#0f766e] font-medium flex items-center gap-1 font-mono">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>14 Curated Fresher Engines</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="scope-selector">
            {/* Option A: All Sources */}
            <div
              onClick={() => {
                setScope('ALL');
                triggerScan('ALL');
              }}
              className={`relative flex flex-col p-6 rounded-xl bg-white shadow-xs hover:shadow-md cursor-pointer transition-all duration-200 border-2 ${
                scope === 'ALL'
                  ? 'border-[#4338ca] ring-2 ring-[#4338ca]/10'
                  : 'border-[#e2e8f0] opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#eef2ff] flex items-center justify-center text-[#4338ca]">
                    <span className="material-symbols-outlined text-[22px]">corporate_fare</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-[#0f172a]">All Sources (14 Companies)</span>
                      <span className="bg-[#ecfdf5] text-[#0f766e] font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    </div>
                    <p className="text-xs text-[#64748b] mt-0.5">
                      Scans all pre-vetted tech portals and startup career hubs in parallel.
                    </p>
                  </div>
                </div>

                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  scope === 'ALL' ? 'bg-[#4338ca] text-white' : 'bg-[#e2e8f0]'
                }`}>
                  {scope === 'ALL' && <span className="material-symbols-outlined text-[14px]">check</span>}
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-[#f1f5f9] flex items-center gap-2 flex-wrap font-mono text-[11px] text-[#64748b]">
                <span className="bg-[#f8fafc] border border-[#e2e8f0] px-2 py-0.5 rounded">Thoughtworks</span>
                <span className="bg-[#f8fafc] border border-[#e2e8f0] px-2 py-0.5 rounded">Zoho</span>
                <span className="bg-[#f8fafc] border border-[#e2e8f0] px-2 py-0.5 rounded">Swiggy</span>
                <span className="bg-[#f8fafc] border border-[#e2e8f0] px-2 py-0.5 rounded">Juspay</span>
                <span className="text-[#4338ca] font-semibold">+10 more</span>
              </div>
            </div>

            {/* Option B: Specific Company */}
            <div
              onClick={() => {
                setScope('SINGLE');
                triggerScan('SINGLE', selectedCompany);
              }}
              className={`relative flex flex-col p-6 rounded-xl bg-white shadow-xs hover:shadow-md cursor-pointer transition-all duration-200 border-2 ${
                scope === 'SINGLE'
                  ? 'border-[#4338ca] ring-2 ring-[#4338ca]/10'
                  : 'border-[#e2e8f0] opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#f1f5f9] flex items-center justify-center text-[#475569]">
                    <span className="material-symbols-outlined text-[22px]">domain</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#0f172a]">Single Employer Portal</span>
                    </div>
                    <p className="text-xs text-[#64748b] mt-0.5">
                      Focus your immediate scan on a preferred engineering team.
                    </p>
                  </div>
                </div>

                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  scope === 'SINGLE' ? 'bg-[#4338ca] text-white' : 'bg-[#e2e8f0]'
                }`}>
                  {scope === 'SINGLE' && <span className="material-symbols-outlined text-[14px]">check</span>}
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-[#f1f5f9] flex items-center justify-between">
                <select
                  value={selectedCompany}
                  onChange={(e) => {
                    setSelectedCompany(e.target.value);
                    if (scope === 'SINGLE') {
                      triggerScan('SINGLE', e.target.value);
                    }
                  }}
                  className="w-full h-8 px-2 bg-[#f8fafc] border border-[#e2e8f0] rounded text-xs font-mono text-[#0f172a] focus:outline-none focus:ring-1 focus:ring-[#4338ca] cursor-pointer"
                >
                  {availableCompanies.map((c) => (
                    <option key={c.id} value={c.companyName}>
                      {c.companyName} Careers ({c.fresherJobsCount} active openings)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Live Progress Card */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#64748b] font-bold">
              Step 02 — Discovery Progress
            </span>
            <div className="flex items-center gap-1.5 text-[#4338ca] font-mono text-xs font-semibold">
              <span className={`material-symbols-outlined text-[16px] ${!isStopped && simulatedProgress < 100 ? 'animate-spin' : ''}`}>
                sync
              </span>
              <span>
                {isStopped
                  ? 'Scan Paused'
                  : simulatedProgress >= 100
                  ? 'Sync Complete (100%)'
                  : `Sync in flight (${simulatedProgress}%)`}
              </span>
            </div>
          </div>

          <div className="relative bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-xs flex flex-col gap-6 overflow-hidden">
            {/* Gentle gradient aura */}
            <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-[#eef2ff] blur-3xl pointer-events-none"></div>

            {/* Progress Header & Bar */}
            <div className="flex flex-col gap-2 z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2.5">
                  <div className={`w-3 h-3 rounded-full ${
                    isStopped ? 'bg-[#b45309]' : simulatedProgress >= 100 ? 'bg-[#0f766e]' : 'bg-[#4338ca] animate-ping'
                  }`}></div>
                  <h2 className="font-bold text-base text-[#0f172a]">
                    {isStopped
                      ? 'Scanning paused'
                      : simulatedProgress >= 100
                      ? 'Discovery completed successfully!'
                      : 'Scanning in progress... (takes about 1-2 minutes)'}
                  </h2>
                </div>
                <span className="font-mono text-lg font-bold text-[#4338ca]">
                  {simulatedProgress}% complete
                </span>
              </div>

              <p className="text-xs text-[#475569] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#0f766e] text-[18px]">verified_user</span>
                <span>
                  Current check: <strong className="text-[#0f172a] font-medium">{scan.currentCheckDescription}</strong>
                </span>
              </p>

              {/* Smooth Progress Track */}
              <div className="w-full h-2.5 bg-[#f1f5f9] rounded-full overflow-hidden mt-1 p-0.5 border border-[#e2e8f0]">
                <div
                  className="h-full bg-[#4338ca] rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${simulatedProgress}%` }}
                ></div>
              </div>
            </div>

            {/* 4-Step Horizontal Journey Breadcrumb */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1 z-10">
              {/* Step 1 Done */}
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                <div className="w-6 h-6 rounded-full bg-[#0f766e] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#0f172a] leading-tight">Career Portals</span>
                  <span className="font-mono text-[#0f766e] text-[11px] mt-0.5">
                    Connected ({scope === 'SINGLE' ? '1/1' : '14/14'})
                  </span>
                </div>
              </div>

              {/* Step 2 Done */}
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                <div className="w-6 h-6 rounded-full bg-[#0f766e] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#0f172a] leading-tight">New Postings</span>
                  <span className="font-mono text-[#0f766e] text-[11px] mt-0.5">
                    Found {scope === 'SINGLE' ? '18' : '72'} recent roles
                  </span>
                </div>
              </div>

              {/* Step 3 In Progress / Done */}
              <div className={`flex items-start gap-2.5 p-3 rounded-lg border ${
                simulatedProgress >= 90
                  ? 'bg-[#f8fafc] border-[#e2e8f0]'
                  : 'bg-[#eef2ff] border-[#c7d2fe]'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  simulatedProgress >= 90 ? 'bg-[#0f766e] text-white' : 'bg-[#4338ca] text-white'
                }`}>
                  <span className={`material-symbols-outlined text-[14px] ${simulatedProgress < 90 && !isStopped ? 'animate-spin' : ''}`}>
                    {simulatedProgress >= 90 ? 'check' : 'refresh'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#4338ca] leading-tight">Fresher Criteria & Pay</span>
                  <span className="font-mono text-[#4338ca] text-[11px] mt-0.5">
                    Filtering out 2+ yrs reqs
                  </span>
                </div>
              </div>

              {/* Step 4 Up Next / Done */}
              <div className={`flex items-start gap-2.5 p-3 rounded-lg border ${
                simulatedProgress >= 100
                  ? 'bg-[#ecfdf5] border-[#a7f3d0]'
                  : 'bg-[#faf8ff] border-[#f1f5f9]'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  simulatedProgress >= 100 ? 'bg-[#0f766e] text-white' : 'bg-[#f1f5f9] text-[#94a3b8]'
                }`}>
                  <span className="material-symbols-outlined text-[14px]">
                    {simulatedProgress >= 100 ? 'check' : 'schedule'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#0f172a] leading-tight">Adding to Your Feed</span>
                  <span className="font-mono text-[#64748b] text-[11px] mt-0.5">
                    {simulatedProgress >= 100 ? 'Ready in Feed' : 'Ready in ∼40s'}
                  </span>
                </div>
              </div>
            </div>

            {/* Live Summary Counters (Clean Pill Boxes) */}
            <div className="flex flex-col gap-2 pt-1 z-10">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#64748b] font-bold">
                Real-Time Filtering Summary
              </span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Box 1 */}
                <div className="flex flex-col p-4 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] hover:bg-[#f1f5f9] transition">
                  <span className="font-mono text-2xl font-bold text-[#0f172a] leading-none">
                    {scope === 'SINGLE' ? '18' : '72'}
                  </span>
                  <span className="text-xs font-semibold text-[#475569] mt-2">Postings Scanned</span>
                  <span className="font-mono text-[#94a3b8] text-[11px] mt-1">
                    {scope === 'SINGLE' ? `At ${selectedCompany}` : 'Across all 14 portals'}
                  </span>
                </div>

                {/* Box 2 (Verified Highlight) */}
                <div className="flex flex-col p-4 rounded-lg bg-[#ecfdf5] border border-[#a7f3d0] hover:bg-[#d1fae5] transition">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-bold text-[#0f766e] leading-none">
                      {scope === 'SINGLE' ? '6' : '34'}
                    </span>
                    <span className="material-symbols-outlined text-[#0f766e] text-[16px]">stars</span>
                  </div>
                  <span className="text-xs font-bold text-[#0f766e] mt-2">Fresher Jobs Found</span>
                  <span className="font-mono text-[#0f766e] text-[11px] mt-1">0-1 yrs • Verified Pay</span>
                </div>

                {/* Box 3 */}
                <div className="flex flex-col p-4 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] hover:bg-[#f1f5f9] transition">
                  <span className="font-mono text-2xl font-bold text-[#64748b] leading-none">
                    {scope === 'SINGLE' ? '8' : '26'}
                  </span>
                  <span className="text-xs font-semibold text-[#475569] mt-2">Filtered Out</span>
                  <span className="font-mono text-[#94a3b8] text-[11px] mt-1">Non-tech or requires 2+ yrs</span>
                </div>

                {/* Box 4 */}
                <div className="flex flex-col p-4 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] hover:bg-[#f1f5f9] transition">
                  <span className="font-mono text-2xl font-bold text-[#94a3b8] leading-none">
                    {scope === 'SINGLE' ? '4' : '12'}
                  </span>
                  <span className="text-xs font-semibold text-[#475569] mt-2">Duplicates Ignored</span>
                  <span className="font-mono text-[#94a3b8] text-[11px] mt-1">Already in your database</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Friendly Activity Notification Bar & Action Buttons */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-[#e2e8f0] shadow-xs">
          <div className="flex items-center gap-3.5 max-w-2xl">
            <div className="w-10 h-10 rounded-full bg-[#eef2ff] flex items-center justify-center text-[#4338ca] shrink-0">
              <span className="material-symbols-outlined text-[20px]">mark_email_unread</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-[#0f172a]">Feel free to step away</span>
              <p className="text-xs text-[#64748b] mt-0.5 leading-relaxed">
                You don't need to keep this page open. We will notify you by email and through the bell notification banner as soon as newly verified opportunities are added to your feed.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end lg:self-auto">
            {isStopped ? (
              <button
                type="button"
                onClick={handleRestartScan}
                className="h-9 px-4 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] hover:bg-[#f1f5f9] text-[#0f172a] text-xs font-semibold transition flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px] text-[#0f766e]">play_arrow</span>
                <span>Resume Search</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStopSearch}
                className="h-9 px-4 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] hover:bg-[#f1f5f9] text-[#0f172a] text-xs font-semibold transition flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px] text-[#dc2626]">stop_circle</span>
                <span>Stop Search</span>
              </button>
            )}

            <button
              type="button"
              onClick={onNavigateToFeed}
              className="h-9 px-5 rounded-lg bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 active:scale-[0.98]"
            >
              <span>Go to Job Feed</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Student Reassurance Trust Banner */}
        <div className="flex flex-col gap-3 p-5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
          <div className="flex items-center gap-1.5 text-[#64748b] font-mono text-[11px] uppercase font-bold">
            <span className="material-symbols-outlined text-[15px] text-[#0f766e]">shield</span>
            <span>The IT Career Partner Fresher Pledge</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Reassurance 1 */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-[#e2e8f0] shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-[#ecfdf5] flex items-center justify-center text-[#0f766e] shrink-0">
                <span className="material-symbols-outlined text-[18px]">school</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs text-[#0f172a]">Strictly Fresher Roles</span>
                <span className="font-mono text-[#64748b] text-[10px]">0-1 Yrs Exp Only</span>
              </div>
            </div>

            {/* Reassurance 2 */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-[#e2e8f0] shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-[#ecfdf5] flex items-center justify-center text-[#0f766e] shrink-0">
                <span className="material-symbols-outlined text-[18px]">payments</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs text-[#0f172a]">Guaranteed Minimum Pay</span>
                <span className="font-mono text-[#64748b] text-[10px]">&gt; ₹2.4 LPA Verified</span>
              </div>
            </div>

            {/* Reassurance 3 */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-[#e2e8f0] shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-[#ecfdf5] flex items-center justify-center text-[#0f766e] shrink-0">
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs text-[#0f172a]">Zero Unpaid Work</span>
                <span className="font-mono text-[#64748b] text-[10px]">No unpaid internships</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
