import React, { useState, useEffect } from 'react';
import { SavedJobItem, SavedJobsResponse } from '../types';
import TrackerSubNav, { TrackerTab } from '../components/TrackerSubNav';

interface SavedJobsPageProps {
  onOpenAddDrawerWithJob: (job: SavedJobItem) => void;
  onOpenAddDrawer: () => void;
  onNavigateTab: (tab: TrackerTab) => void;
  onNavigateToFindJobs?: () => void;
}

export default function SavedJobsPage({
  onOpenAddDrawerWithJob,
  onOpenAddDrawer,
  onNavigateTab,
  onNavigateToFindJobs,
}: SavedJobsPageProps) {
  const [data, setData] = useState<SavedJobsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'VERIFIED' | 'REVIEW' | 'CLOSED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'match' | 'ctc'>('recent');

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/tracker/saved-jobs?userId=user_arjun');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.warn('Failed to load saved jobs', e);
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
      if (sortBy === 'match') return b.matchScore - a.matchScore;
      if (sortBy === 'ctc') {
        const aNum = parseFloat(a.ctcText.replace(/[^0-9.]/g, '')) || 0;
        const bNum = parseFloat(b.ctcText.replace(/[^0-9.]/g, '')) || 0;
        return bNum - aNum;
      }
      return 0; // recent
    });

  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#1f1b17] font-sans antialiased pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Navigation SubBar */}
        <TrackerSubNav
          activeTab="SAVED_JOBS"
          onSelectTab={onNavigateTab}
          onOpenAddDrawer={onOpenAddDrawer}
          savedCount={data?.totalSavedCount || 5}
        />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#ffdbce] text-[#7e2c00] text-xs font-bold uppercase tracking-wider">
                Executive Saved Dossier
              </span>
              <span className="text-xs text-[#8a7269]">• 2026 Batch Verified</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#1f1b17] tracking-tight">
              Saved Jobs & Opportunities
            </h1>
            <p className="text-sm text-[#625d5b] max-w-2xl mt-1">
              Curated positions preserved for systematic tracking and targeted preparation. Convert any bookmark directly into an active pursuit record.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onNavigateToFindJobs && (
              <button
                onClick={onNavigateToFindJobs}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-white border border-[#ddc0b6] text-xs font-bold text-[#1f1b17] hover:bg-[#f6ece6] transition-all"
              >
                <span className="material-symbols-outlined text-[17px]">travel_explore</span>
                <span>Discover More Jobs</span>
              </button>
            )}
            <button
              onClick={onOpenAddDrawer}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#bc5424] hover:bg-[#9c3d0c] text-white text-xs font-bold shadow-md transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Add Application</span>
            </button>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-white rounded-xl p-3 mb-6 border border-[#f0e6e0] shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Filter Pills */}
          <div className="flex items-center p-1 bg-[#f6ece6] rounded-xl gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeFilter === 'ALL'
                  ? 'bg-white text-[#1f1b17] shadow-xs'
                  : 'text-[#625d5b] hover:text-[#1f1b17]'
              }`}
            >
              All Saved{' '}
              <span className="font-mono text-[11px] ml-1 text-[#8a7269]">
                {data?.totalSavedCount || 5}
              </span>
            </button>
            <button
              onClick={() => setActiveFilter('VERIFIED')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeFilter === 'VERIFIED'
                  ? 'bg-white text-[#00692e] shadow-xs'
                  : 'text-[#625d5b] hover:text-[#1f1b17]'
              }`}
            >
              Verified Eligible{' '}
              <span className="font-mono text-[11px] ml-1 text-[#00692e]">
                {data?.verifiedEligibleCount || 3}
              </span>
            </button>
            <button
              onClick={() => setActiveFilter('REVIEW')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeFilter === 'REVIEW'
                  ? 'bg-white text-[#9c3d0c] shadow-xs'
                  : 'text-[#625d5b] hover:text-[#1f1b17]'
              }`}
            >
              Needs Review{' '}
              <span className="font-mono text-[11px] ml-1 text-[#9c3d0c]">
                {data?.needsReviewCount || 1}
              </span>
            </button>
            <button
              onClick={() => setActiveFilter('CLOSED')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeFilter === 'CLOSED'
                  ? 'bg-white text-[#8a7269] shadow-xs'
                  : 'text-[#625d5b] hover:text-[#1f1b17]'
              }`}
            >
              Closed{' '}
              <span className="font-mono text-[11px] ml-1 text-[#8a7269]">
                {data?.closedCount || 1}
              </span>
            </button>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-[#8a7269]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search saved jobs..."
                className="w-full h-10 pl-9 pr-3.5 bg-[#fff8f5] text-xs rounded-lg border border-[#ddc0b6]/50 text-[#1f1b17] outline-none"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-10 px-3 bg-[#fff8f5] border border-[#ddc0b6]/50 rounded-lg text-xs font-semibold text-[#1f1b17] outline-none"
            >
              <option value="recent">Recently Saved</option>
              <option value="match">Highest Match %</option>
              <option value="ctc">Highest Package</option>
            </select>
          </div>
        </div>

        {/* Dossier List of Saved Jobs */}
        <div className="flex flex-col gap-4">
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-[#f0e6e0]">
              <span className="material-symbols-outlined text-[36px] text-[#8a7269]">bookmark_border</span>
              <h3 className="text-sm font-bold text-[#1f1b17] mt-2">No Saved Jobs Found</h3>
              <p className="text-xs text-[#625d5b] mt-1 max-w-sm mx-auto">
                No opportunities match your current filter. Bookmark jobs from the Find Jobs catalog to keep them ready here.
              </p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <article
                key={job.id}
                className="group relative bg-white rounded-xl p-6 sm:p-7 border border-[#f0e6e0] shadow-xs hover:shadow-md hover:border-[#bc5424]/40 transition-all flex flex-col gap-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-[#f6ece6] flex items-center justify-center text-[#9c3d0c] font-extrabold text-lg shrink-0 shadow-xs border border-[#ddc0b6]/30">
                      {job.logoText || job.company.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center flex-wrap gap-2 mb-1">
                        <span className="font-bold text-sm text-[#1f1b17]">{job.company}</span>
                        <span className="w-1 h-1 rounded-full bg-[#8a7269]/40"></span>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            job.verificationStatus === 'VERIFIED_ELIGIBLE'
                              ? 'bg-[#ecfdf5] text-[#00692e]'
                              : job.verificationStatus === 'NEEDS_REVIEW'
                              ? 'bg-[#ffdbce] text-[#7e2c00]'
                              : 'bg-[#f1f5f9] text-[#64748b]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[13px]">
                            {job.verificationStatus === 'VERIFIED_ELIGIBLE' ? 'check_circle' : 'help_outline'}
                          </span>
                          <span>
                            {job.verificationStatus === 'VERIFIED_ELIGIBLE'
                              ? '2026 Batch Verified'
                              : job.verificationStatus.replace('_', ' ')}
                          </span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#f6ece6] text-[#1f1b17] font-mono text-[11px] font-bold">
                          {job.matchScore}% Match
                        </span>
                        <span className="text-xs text-[#8a7269]">
                          • Saved {job.deadlineFormatted}
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-[#1f1b17] tracking-tight">
                        {job.title}
                      </h2>
                    </div>
                  </div>

                  {/* Top Right Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-start">
                    <button
                      onClick={() => handleUnsave(job.id)}
                      title="Remove from saved"
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-[#8a7269] hover:text-[#ba1a1a] hover:bg-[#ffdad6] transition-all"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </div>

                {/* Key Attributes Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 px-4 bg-[#fff8f5] rounded-xl border border-[#ddc0b6]/40 text-xs">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-[#8a7269] font-medium">Package (CTC)</span>
                    <span className="font-bold text-[#1f1b17]">{job.ctcText}</span>
                    <span className="text-[10px] text-[#00692e] font-semibold">2026 Direct Offer</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-[#8a7269] font-medium">Experience & Batch</span>
                    <span className="font-bold text-[#1f1b17]">{job.batchAllowed}</span>
                    <span className="text-[10px] text-[#625d5b]">Fresher Campus / Off-campus</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-[#8a7269] font-medium">Work Arrangement</span>
                    <span className="font-bold text-[#1f1b17]">{job.location}</span>
                    <span className="text-[10px] text-[#625d5b]">{job.workMode}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-[#8a7269] font-medium">Talent Gateway</span>
                    <span className="font-bold text-[#1f1b17]">Direct Portal Ingestion</span>
                    <span className="text-[10px] text-[#00692e] font-semibold">Verified Safe Link</span>
                  </div>
                </div>

                {/* Tags and Candidate Notes */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="flex items-center flex-wrap gap-1.5">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md bg-[#f6ece6] text-[#1f1b17] text-[11px] font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Call to action buttons */}
                  <div className="flex items-center gap-2.5">
                    {job.portalUrl && (
                      <a
                        href={job.portalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-lg bg-white border border-[#ddc0b6] text-xs font-semibold text-[#1f1b17] hover:bg-[#f6ece6] transition-all flex items-center gap-1"
                      >
                        <span>Official Portal</span>
                        <span className="material-symbols-outlined text-[14px]">north_east</span>
                      </a>
                    )}
                    <button
                      onClick={() => onOpenAddDrawerWithJob(job)}
                      className="px-4 py-2 rounded-lg bg-[#bc5424] hover:bg-[#9c3d0c] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">add_task</span>
                      <span>Track & Apply</span>
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
