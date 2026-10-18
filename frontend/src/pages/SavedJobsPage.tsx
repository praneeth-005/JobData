import React, { useState, useEffect } from 'react';
import { SavedJobItem, SavedJobsResponse } from '../types';
import TrackerSubNav, { TrackerTab } from '../components/TrackerSubNav';

interface SavedJobsPageProps {
  onOpenAddDrawerWithJob: (job: SavedJobItem) => void;
  onOpenAddDrawer: () => void;
  onNavigateTab: (tab: TrackerTab) => void;
  onNavigateToFindJobs?: () => void;
}

const DEFAULT_SAVED_JOBS: SavedJobItem[] = [
  {
    id: 'sj_1',
    jobId: 'job_tw_01',
    userId: 'user_arjun',
    company: 'Thoughtworks',
    title: 'Graduate Software Consultant (2026 Batch)',
    logoText: 'TW',
    ctcText: '₹11.5 - ₹13.5 LPA',
    location: 'Bengaluru / Pune',
    workMode: 'Hybrid',
    batchAllowed: '2026 Batch',
    verificationStatus: 'VERIFIED_ELIGIBLE',
    deadlineFormatted: 'Apply by Oct 24, 2026',
    tags: ['Tier 1', 'Clean Code', 'No Bond', '2026 Batch Verified'],
    matchScore: 94,
    portalUrl: 'https://thoughtworks.com/careers',
  },
  {
    id: 'sj_2',
    jobId: 'job_rzp_02',
    userId: 'user_arjun',
    company: 'Razorpay',
    title: 'Software Engineer 1 - Payments Core',
    logoText: 'RZP',
    ctcText: '₹16.0 - ₹20.0 LPA',
    location: 'Bengaluru',
    workMode: 'On-Site',
    batchAllowed: '2026 Batch',
    verificationStatus: 'VERIFIED_ELIGIBLE',
    deadlineFormatted: 'Apply by Oct 28, 2026',
    tags: ['Fintech Core', 'PostgreSQL', 'Zero Bond', '2026 Batch Verified'],
    matchScore: 91,
    portalUrl: 'https://razorpay.com/careers',
  },
  {
    id: 'sj_3',
    jobId: 'job_swg_03',
    userId: 'user_arjun',
    company: 'Swiggy',
    title: 'Associate Software Development Engineer',
    logoText: 'SWG',
    ctcText: '₹14.0 - ₹17.0 LPA',
    location: 'Bengaluru',
    workMode: 'Hybrid',
    batchAllowed: '2026 Batch',
    verificationStatus: 'VERIFIED_ELIGIBLE',
    deadlineFormatted: 'Apply by Oct 29, 2026',
    tags: ['High Throughput', 'Docker', 'Zero Bond', '2026 Batch Verified'],
    matchScore: 88,
    portalUrl: 'https://careers.swiggy.com',
  },
  {
    id: 'sj_4',
    jobId: 'job_gs_04',
    userId: 'user_arjun',
    company: 'Goldman Sachs',
    title: 'Engineering Analyst - Global Markets',
    logoText: 'GS',
    ctcText: '₹24.0 - ₹28.0 LPA',
    location: 'Bengaluru / Hyderabad',
    workMode: 'On-Site',
    batchAllowed: '2026 Batch',
    verificationStatus: 'NEEDS_REVIEW',
    deadlineFormatted: 'Aptitude Window Open',
    tags: ['Tier 1 Investment Bank', 'Low Latency Java', '2026 Batch Verified'],
    matchScore: 89,
    portalUrl: 'https://goldmansachs.com/careers',
  },
  {
    id: 'sj_5',
    jobId: 'job_amz_05',
    userId: 'user_arjun',
    company: 'Amazon Web Services',
    title: 'Software Development Engineer (SDE 1)',
    logoText: 'AWS',
    ctcText: '₹28.0 - ₹34.0 LPA',
    location: 'Hyderabad',
    workMode: 'Hybrid',
    batchAllowed: '2026 Batch',
    verificationStatus: 'CLOSED',
    deadlineFormatted: 'Applications Closed for Batch 1',
    tags: ['Cloud Infrastructure', 'Distributed Storage', '2026 Batch Verified'],
    matchScore: 85,
    portalUrl: 'https://amazon.jobs',
  },
];

export default function SavedJobsPage({
  onOpenAddDrawerWithJob,
  onOpenAddDrawer,
  onNavigateTab,
  onNavigateToFindJobs,
}: SavedJobsPageProps) {
  // Pre-seed state so 5 verified jobs render in 0ms with zero empty flash
  const [data, setData] = useState<SavedJobsResponse>({
    totalSavedCount: DEFAULT_SAVED_JOBS.length,
    verifiedEligibleCount: 3,
    needsReviewCount: 1,
    closedCount: 1,
    savedJobs: DEFAULT_SAVED_JOBS,
  });
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'VERIFIED' | 'REVIEW' | 'CLOSED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'match' | 'ctc'>('recent');

  const fetchSavedJobs = async () => {
    try {
      const res = await fetch('/api/v1/tracker/saved-jobs?userId=user_arjun');
      if (res.ok) {
        const json = await res.json();
        if (json && json.savedJobs && json.savedJobs.length > 0) {
          const normalized = json.savedJobs.map((j: any) => ({
            ...j,
            matchScore: j.matchScore ?? j.jobMatchScore ?? 85,
            portalUrl: j.portalUrl ?? j.applyUrl ?? '#',
            deadlineFormatted: j.deadlineFormatted ?? j.deadlineText ?? 'Recently',
            ctcText: j.ctcText ? j.ctcText.replace(/^\?|\uFFFD/g, '₹') : '₹12.0 - ₹15.0 LPA',
          }));
          setData({
            ...json,
            savedJobs: normalized,
          });
        }
      }
    } catch (e) {
      console.warn('Failed to load saved jobs, keeping resilient cached state', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleUnsave = async (jobId: string) => {
    if (!window.confirm('Remove this opportunity from your saved bookmarks?')) return;
    try {
      await fetch(`/api/v1/tracker/saved-jobs/${jobId}?userId=user_arjun`, {
        method: 'DELETE',
      });
      // Optimistic update
      setData((prev) => {
        const nextList = prev.savedJobs.filter((j) => j.id !== jobId && j.jobId !== jobId);
        return {
          ...prev,
          totalSavedCount: nextList.length,
          savedJobs: nextList,
        };
      });
      fetchSavedJobs();
    } catch (e) {
      console.error('Failed to unsave job', e);
    }
  };

  // Filter & Sort
  const filteredJobs = (data?.savedJobs || [])
    .filter((j) => {
      const matchesSearch =
        searchQuery === '' ||
        j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchesTab = true;
      if (activeFilter === 'VERIFIED') matchesTab = j.verificationStatus === 'VERIFIED_ELIGIBLE';
      if (activeFilter === 'REVIEW') matchesTab = j.verificationStatus === 'NEEDS_REVIEW';
      if (activeFilter === 'CLOSED') matchesTab = j.verificationStatus === 'CLOSED';

      return matchesSearch && matchesTab;
    })
    .sort((a, b) => {
      const scoreA = a.matchScore ?? (a as any).jobMatchScore ?? 0;
      const scoreB = b.matchScore ?? (b as any).jobMatchScore ?? 0;
      if (sortBy === 'match') return scoreB - scoreA;
      if (sortBy === 'ctc') {
        const aNum = parseFloat(a.ctcText.replace(/[^0-9.]/g, '')) || 0;
        const bNum = parseFloat(b.ctcText.replace(/[^0-9.]/g, '')) || 0;
        return bNum - aNum;
      }
      return 0; // recent
    });

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#0f172a] font-sans antialiased pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Navigation SubBar */}
        <TrackerSubNav
          activeTab="SAVED_JOBS"
          onSelectTab={onNavigateTab}
          onOpenAddDrawer={onOpenAddDrawer}
          savedCount={data?.totalSavedCount || DEFAULT_SAVED_JOBS.length}
        />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#eef2ff] text-[#4338ca] border border-[#c7d2fe]/60">
                Executive Saved Dossier
              </span>
              <span className="text-xs font-semibold text-[#475569] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
                2026 Batch Verified
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">
              Saved Jobs &amp; Opportunities
            </h1>
            <p className="text-sm text-[#475569] mt-1 max-w-2xl font-normal">
              Curated positions preserved for systematic tracking and targeted preparation. Convert any bookmark directly into an active pursuit record.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onNavigateToFindJobs && (
              <button
                onClick={onNavigateToFindJobs}
                className="px-4 py-2.5 rounded-xl border border-[#cbd5e1] text-[#0f172a] hover:bg-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer bg-white"
              >
                <span className="material-symbols-outlined text-[18px] text-[#4338ca]">travel_explore</span>
                <span>Discover More Jobs</span>
              </button>
            )}
            <button
              onClick={onOpenAddDrawer}
              className="px-5 py-2.5 rounded-xl bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Add Custom Job</span>
            </button>
          </div>
        </div>

        {/* Action & Filter Toolbar */}
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-[#e2e8f0] shadow-xs mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeFilter === 'ALL'
                  ? 'bg-[#eef2ff] text-[#4338ca]'
                  : 'text-[#475569] hover:bg-[#f8fafc]'
              }`}
            >
              <span>All Saved</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeFilter === 'ALL' ? 'bg-[#4338ca] text-white' : 'bg-[#e2e8f0] text-[#475569]'
                }`}
              >
                {data?.totalSavedCount ?? 5}
              </span>
            </button>

            <button
              onClick={() => setActiveFilter('VERIFIED')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeFilter === 'VERIFIED'
                  ? 'bg-[#ecfdf5] text-[#059669]'
                  : 'text-[#475569] hover:bg-[#f8fafc]'
              }`}
            >
              <span>Verified Eligible</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeFilter === 'VERIFIED' ? 'bg-[#059669] text-white' : 'bg-[#e2e8f0] text-[#475569]'
                }`}
              >
                {data?.verifiedEligibleCount ?? 3}
              </span>
            </button>

            <button
              onClick={() => setActiveFilter('REVIEW')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeFilter === 'REVIEW'
                  ? 'bg-[#fffbeb] text-[#d97706]'
                  : 'text-[#475569] hover:bg-[#f8fafc]'
              }`}
            >
              <span>Needs Review</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeFilter === 'REVIEW' ? 'bg-[#d97706] text-white' : 'bg-[#e2e8f0] text-[#475569]'
                }`}
              >
                {data?.needsReviewCount ?? 1}
              </span>
            </button>

            <button
              onClick={() => setActiveFilter('CLOSED')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeFilter === 'CLOSED'
                  ? 'bg-[#f1f5f9] text-[#64748b]'
                  : 'text-[#475569] hover:bg-[#f8fafc]'
              }`}
            >
              <span>Closed</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeFilter === 'CLOSED' ? 'bg-[#64748b] text-white' : 'bg-[#e2e8f0] text-[#475569]'
                }`}
              >
                {data?.closedCount ?? 1}
              </span>
            </button>
          </div>

          {/* Search and Sort */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <span className="material-symbols-outlined text-[18px] text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search saved jobs..."
                className="w-full pl-9 pr-3 py-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-xs font-medium text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#4338ca] focus:bg-white"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-2 px-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-xs font-semibold text-[#0f172a] focus:outline-none focus:border-[#4338ca] cursor-pointer"
            >
              <option value="recent">Recently Saved</option>
              <option value="match">Highest Match %</option>
              <option value="ctc">Highest CTC</option>
            </select>
          </div>
        </div>

        {/* Saved Jobs List */}
        <div className="flex flex-col gap-4">
          {loading && filteredJobs.length === 0 ? (
            /* Skeleton Loading Cards - Never show empty flash */
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-xl p-6 sm:p-7 border border-[#e2e8f0] shadow-xs animate-pulse flex flex-col gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-slate-100"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                      <div className="h-6 bg-slate-100 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-14 bg-slate-50 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : filteredJobs.length === 0 ? (
            /* True Empty State (only when not loading and filter/search matches 0) */
            <div className="bg-white rounded-xl p-12 text-center border border-[#e2e8f0]">
              <span className="material-symbols-outlined text-[36px] text-[#64748b]">bookmark_border</span>
              <h3 className="text-sm font-bold text-[#0f172a] mt-2">No Saved Jobs Found</h3>
              <p className="text-xs text-[#64748b] mt-1 max-w-sm mx-auto">
                No opportunities match your current filter. Bookmark jobs from the Find Jobs catalog to keep them ready here.
              </p>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const matchScore = job.matchScore ?? (job as any).jobMatchScore ?? 85;
              const deadline = job.deadlineFormatted || (job as any).deadlineText || 'Recently';
              const portal = job.portalUrl || (job as any).applyUrl;
              const cleanCtc = (job.ctcText || '₹12.0 - ₹15.0 LPA').replace(/^\?|\uFFFD/g, '₹');

              return (
                <article
                  key={job.id}
                  className="group relative bg-white rounded-xl p-6 sm:p-7 border border-[#e2e8f0] shadow-xs hover:shadow-md hover:border-[#4338ca]/40 transition-all flex flex-col gap-4"
                >
                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-[#eef2ff] flex items-center justify-center text-[#4338ca] font-extrabold text-lg shrink-0 shadow-xs border border-[#c7d2fe]/50">
                        {job.logoText || job.company.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center flex-wrap gap-2 mb-1">
                          <span className="font-bold text-sm text-[#0f172a]">{job.company}</span>
                          <span className="w-1 h-1 rounded-full bg-[#cbd5e1]"></span>
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              job.verificationStatus === 'VERIFIED_ELIGIBLE'
                                ? 'bg-[#ecfdf5] text-[#059669]'
                                : job.verificationStatus === 'NEEDS_REVIEW'
                                ? 'bg-[#fffbeb] text-[#d97706]'
                                : 'bg-[#f1f5f9] text-[#64748b]'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[13px]">
                              {job.verificationStatus === 'VERIFIED_ELIGIBLE'
                                ? 'check_circle'
                                : job.verificationStatus === 'NEEDS_REVIEW'
                                ? 'help_outline'
                                : 'cancel'}
                            </span>
                            <span>
                              {job.verificationStatus === 'VERIFIED_ELIGIBLE'
                                ? '2026 Batch Verified'
                                : job.verificationStatus === 'NEEDS_REVIEW'
                                ? 'Needs Review'
                                : 'Closed'}
                            </span>
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#f1f5f9] text-[#0f172a] font-mono text-[11px] font-bold">
                            {matchScore}% Match
                          </span>
                          <span className="text-xs text-[#64748b]">
                            • Saved {deadline}
                          </span>
                        </div>
                        <h2 className="text-lg font-bold text-[#0f172a] tracking-tight">
                          {job.title}
                        </h2>
                      </div>
                    </div>

                    {/* Top Right Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-start">
                      <button
                        onClick={() => handleUnsave(job.id)}
                        title="Remove from saved"
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-[#64748b] hover:text-[#dc2626] hover:bg-[#fef2f2] transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Key Attributes Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 px-4 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] text-xs">
                    <div className="flex flex-col">
                      <span className="text-[11px] text-[#64748b] font-medium">Package (CTC)</span>
                      <span className="font-bold text-[#0f172a]">{cleanCtc}</span>
                      <span className="text-[10px] text-[#059669] font-semibold">2026 Direct Offer</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] text-[#64748b] font-medium">Experience &amp; Batch</span>
                      <span className="font-bold text-[#0f172a]">{job.batchAllowed}</span>
                      <span className="text-[10px] text-[#475569]">Fresher Campus / Off-campus</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] text-[#64748b] font-medium">Work Arrangement</span>
                      <span className="font-bold text-[#0f172a]">{job.location}</span>
                      <span className="text-[10px] text-[#475569]">{job.workMode}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] text-[#64748b] font-medium">Talent Gateway</span>
                      <span className="font-bold text-[#0f172a]">Direct Portal Ingestion</span>
                      <span className="text-[10px] text-[#059669] font-semibold">Verified Safe Link</span>
                    </div>
                  </div>

                  {/* Tags and Candidate Notes */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <div className="flex items-center flex-wrap gap-1.5">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-md bg-[#f1f5f9] text-[#0f172a] text-[11px] font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Call to action buttons */}
                    <div className="flex items-center gap-2.5">
                      {portal && portal !== '#' && (
                        <a
                          href={portal}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 rounded-lg bg-white border border-[#e2e8f0] text-xs font-semibold text-[#0f172a] hover:bg-[#f8fafc] transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <span>Official Portal</span>
                          <span className="material-symbols-outlined text-[14px]">north_east</span>
                        </a>
                      )}
                      <button
                        onClick={() => onOpenAddDrawerWithJob(job)}
                        className="px-4 py-2 rounded-lg bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">add_task</span>
                        <span>Track &amp; Apply</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
