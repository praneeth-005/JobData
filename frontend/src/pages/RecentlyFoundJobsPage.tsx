import React, { useState, useEffect } from 'react';
import { FoundJob, FoundJobSummary } from '../types';

interface RecentlyFoundJobsPageProps {
  onSelectJob: (jobId: string) => void;
  onNavigateToFindJobs: () => void;
  onNavigateToSources: () => void;
}

export default function RecentlyFoundJobsPage({
  onSelectJob,
  onNavigateToFindJobs,
  onNavigateToSources,
}: RecentlyFoundJobsPageProps) {
  const [jobs, setJobs] = useState<FoundJob[]>([]);
  const [summary, setSummary] = useState<FoundJobSummary>({
    allCount: 48,
    verifiedCount: 42,
    reviewCount: 6,
    filteredCount: 26,
    jobs: [],
  });

  const [activeTab, setActiveTab] = useState<'all' | 'verified' | 'review' | 'filtered'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [inspectJob, setInspectJob] = useState<FoundJob | null>(null);

  // Fetch Jobs from backend API
  const fetchJobs = () => {
    const params = new URLSearchParams();
    if (activeTab && activeTab !== 'all') params.set('tab', activeTab.toUpperCase());
    if (searchQuery) params.set('q', searchQuery);
    if (locationFilter) params.set('location', locationFilter);

    fetch(`/api/v1/found-jobs?${params.toString()}`, { credentials: 'include' })
      .then((res) => res.json())
      .then((json) => {
        if (json && json.data) {
          setSummary(json.data);
          setJobs(json.data.jobs || []);
        }
      })
      .catch(() => {
        // Fallback demo data
        const demo: FoundJob[] = [
          {
            id: 'job-tw-1',
            title: 'Graduate Software Engineer (Java / Backend)',
            company: 'Thoughtworks',
            location: 'Bengaluru • Hybrid',
            city: 'Bengaluru',
            ctcText: '₹8.5 LPA (Confirmed)',
            ctcLpa: 8.5,
            jobType: 'FULL_TIME',
            tag: 'Verified Fresher',
            status: 'VERIFIED',
            foundTimeText: '25 mins ago',
            sourceName: 'Thoughtworks Official Career Page',
            applyUrl: 'https://thoughtworks.com/careers',
            logoText: 'TW',
            isSaved: false,
          },
          {
            id: 'job-sw-1',
            title: 'Associate Software Engineer - 2026 / 2025 Batch',
            company: 'Swiggy',
            location: 'Bengaluru / Hyderabad • In-office',
            city: 'Bengaluru',
            ctcText: '₹6.0 LPA (Confirmed)',
            ctcLpa: 6.0,
            jobType: 'FULL_TIME',
            tag: 'Verified Fresher',
            status: 'VERIFIED',
            foundTimeText: '1 hour ago',
            sourceName: 'Swiggy Careers',
            applyUrl: 'https://swiggy.com/careers/engineering',
            logoText: 'SW',
            isSaved: true,
          },
          {
            id: 'job-zh-1',
            title: 'Junior Full-Stack Developer Intern',
            company: 'Zoho Corporation',
            location: 'Chennai • On-campus',
            city: 'Chennai',
            ctcText: '₹15,000 / month (Paid Internship)',
            ctcLpa: 1.8,
            jobType: 'INTERNSHIP',
            tag: 'Paid Internship',
            status: 'VERIFIED',
            foundTimeText: '2 hours ago',
            sourceName: 'Zoho Careers',
            applyUrl: 'https://zoho.com/careers',
            logoText: 'ZH',
            isSaved: false,
          },
          {
            id: 'job-tm-1',
            title: 'Frontend Developer Trainee',
            company: 'Tech Mahindra',
            location: 'Hyderabad • On-site',
            city: 'Hyderabad',
            ctcText: '₹3.6 LPA (Confirmed)',
            ctcLpa: 3.6,
            jobType: 'TRAINEE',
            tag: 'Review Details',
            status: 'REVIEW',
            foundTimeText: '4 hours ago',
            sourceName: 'Campus Portal',
            applyUrl: 'https://careers.techmahindra.com',
            logoText: 'TM',
            cautionNotice: 'Verification notice: Interview format not specified by company. Verify if remote test or on-premises round.',
            isSaved: false,
          },
          {
            id: 'job-inf-filtered',
            title: 'Senior Cloud Solutions Architect',
            company: 'Infosys Digital',
            location: 'Bengaluru • Hybrid',
            city: 'Bengaluru',
            ctcText: '₹24.0 LPA',
            ctcLpa: 24.0,
            jobType: 'FULL_TIME',
            tag: 'Excluded',
            status: 'FILTERED',
            foundTimeText: '5 hours ago',
            sourceName: 'Infosys Career Feed',
            applyUrl: 'https://infosys.com',
            logoText: 'INF',
            filterReason: 'Requires 3+ years experience. Non-fresher posting.',
            isSaved: false,
          },
        ];

        let filtered = demo;
        if (activeTab === 'verified') filtered = demo.filter((j) => j.status === 'VERIFIED');
        else if (activeTab === 'review') filtered = demo.filter((j) => j.status === 'REVIEW');
        else if (activeTab === 'filtered') filtered = demo.filter((j) => j.status === 'FILTERED');
        else filtered = demo.filter((j) => j.status !== 'FILTERED');

        setJobs(filtered);
      });
  };

  useEffect(() => {
    fetchJobs();
  }, [activeTab, searchQuery, locationFilter]);

  // Toggle Save Job
  const handleToggleSave = (job: FoundJob) => {
    fetch(`/api/v1/found-jobs/${job.id}/save`, {
      method: 'POST',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setJobs((prev) =>
            prev.map((j) => (j.id === job.id ? json.data : j))
          );
        }
      })
      .catch(() => {
        // Fallback toggle
        setJobs((prev) =>
          prev.map((j) => (j.id === job.id ? { ...j, isSaved: !j.isSaved } : j))
        );
      });
  };

  // Open All In Feed
  const handleOpenAllInFeed = () => {
    fetch('/api/v1/found-jobs/open-all-feed', {
      method: 'POST',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((json) => {
        setToastMessage(json?.data?.message || 'All verified jobs have been routed to your main feed.');
        setTimeout(() => setToastMessage(null), 4000);
      })
      .catch(() => {
        setToastMessage('All 42 verified jobs have been routed directly into your Recommended Feed.');
        setTimeout(() => setToastMessage(null), 4000);
      });
  };

  return (
    <div className="w-full flex flex-col antialiased">
      {/* Top Context Header Area */}
      <div className="px-4 sm:px-8 lg:px-12 pt-8 pb-8 bg-white border-b border-[#e2e8f0]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-1.5 max-w-2xl">
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#64748b] uppercase tracking-wider">
              <button onClick={onNavigateToSources} className="hover:text-[#4338ca] transition">Workspace</button>
              <span className="text-[#cbd5e1]">/</span>
              <button onClick={onNavigateToSources} className="hover:text-[#4338ca] transition">Job Sources</button>
              <span className="text-[#cbd5e1]">/</span>
              <span className="text-[#4338ca] font-semibold">Latest Found Jobs</span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-semibold text-[#0f172a] tracking-tight mt-1">
              Recently Found Jobs
            </h1>

            <p className="text-[#475569] text-base leading-relaxed">
              Review the newest verified opportunities collected from your sources before they enter your main recommendation feed.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleOpenAllInFeed}
              type="button"
              className="flex items-center gap-2 bg-[#4338ca] hover:bg-[#3730a3] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition shadow-xs active:scale-[0.98]"
            >
              <span>Open All in Main Feed</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#0f766e] text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 text-xs font-mono animate-fade-in">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Body */}
      <div className="px-4 sm:px-8 lg:px-12 py-8 max-w-6xl mx-auto w-full flex flex-col gap-8">
        
        {/* Filter Bar & Search Layer */}
        <div className="flex flex-col gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none" id="statusTabs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'all'
                  ? 'bg-[#eef2ff] text-[#4338ca]'
                  : 'text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a]'
              }`}
            >
              <span>All Found</span>
              <span className="font-mono text-[10px] bg-[#4338ca] text-white px-1.5 py-0.5 rounded-full">
                {summary.allCount || 48}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('verified')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'verified'
                  ? 'bg-[#eef2ff] text-[#4338ca]'
                  : 'text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a]'
              }`}
            >
              <span>Verified & Ready</span>
              <span className="font-mono text-[10px] bg-[#ecfdf5] text-[#0f766e] px-1.5 py-0.5 rounded-full">
                {summary.verifiedCount || 42}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('review')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'review'
                  ? 'bg-[#eef2ff] text-[#4338ca]'
                  : 'text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a]'
              }`}
            >
              <span>Needs Quick Review</span>
              <span className="font-mono text-[10px] bg-[#fffbeb] text-[#b45309] px-1.5 py-0.5 rounded-full">
                {summary.reviewCount || 6}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('filtered')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'filtered'
                  ? 'bg-[#eef2ff] text-[#4338ca]'
                  : 'text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a]'
              }`}
            >
              <span>Filtered Out</span>
              <span className="font-mono text-[10px] bg-[#f1f5f9] text-[#64748b] px-1.5 py-0.5 rounded-full">
                {summary.filteredCount || 26}
              </span>
            </button>
          </div>

          {/* Controls Row: Search + City Dropdown */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-8 relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b] text-[18px]">
                filter_list
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by title, company, or skill..."
                className="w-full h-11 pl-10 pr-4 rounded-lg bg-white border border-[#e2e8f0] text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#4338ca] shadow-2xs transition"
              />
            </div>

            <div className="md:col-span-4 relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b] text-[18px]">
                location_on
              </span>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full h-11 pl-10 pr-8 rounded-lg bg-white border border-[#e2e8f0] text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#4338ca] shadow-2xs appearance-none cursor-pointer transition font-medium"
              >
                <option value="">All Locations (Bengaluru, Hyderabad, Pune, Remote)</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Chennai">Chennai</option>
                <option value="Pune">Pune</option>
                <option value="Remote">Remote</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] pointer-events-none text-[18px]">
                expand_more
              </span>
            </div>
          </div>
        </div>

        {/* Active Pipeline Summary Pill */}
        <div className="bg-[#f8fafc] border border-[#e2e8f0] p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs text-[#475569]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0f766e]"></span>
            <span>
              Quality Engine ran <span className="font-mono font-semibold text-[#0f172a]">12 mins ago</span> across 8 active target portals
            </span>
          </div>

          <div className="flex items-center gap-4 font-mono">
            <span>Auto-accept confidence: <span className="text-[#0f766e] font-bold">96.4%</span></span>
            <span className="text-[#cbd5e1]">•</span>
            <span>Fresher-only filter: <span className="text-[#4338ca] font-bold">STRICT</span></span>
          </div>
        </div>

        {/* Job Cards Stream */}
        <div className="flex flex-col gap-4" id="jobCardsContainer">
          {jobs.length === 0 ? (
            <div className="py-16 text-center bg-white border border-[#e2e8f0] rounded-xl p-8 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#f1f5f9] mx-auto flex items-center justify-center text-[#94a3b8] mb-3">
                <span className="material-symbols-outlined text-[24px]">search_off</span>
              </div>
              <h3 className="text-base font-bold text-[#0f172a]">No jobs match your filter criteria</h3>
              <p className="text-xs text-[#64748b] mt-1">
                Try resetting search keywords or changing the city filter above.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setLocationFilter('');
                  setActiveTab('all');
                }}
                className="mt-3 px-4 py-1.5 rounded-lg bg-[#eef2ff] text-[#4338ca] text-xs font-semibold hover:bg-[#e0e7ff] transition"
              >
                Reset filters
              </button>
            </div>
          ) : (
            jobs.map((job) => {
              const isVerified = job.status === 'VERIFIED';
              const isReview = job.status === 'REVIEW';
              const isFiltered = job.status === 'FILTERED';

              return (
                <article
                  key={job.id}
                  className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-xs hover:shadow-md transition flex flex-col md:flex-row md:items-start justify-between gap-6 group"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-[#eef2ff] text-[#4338ca] flex items-center justify-center shrink-0 font-mono font-bold text-base">
                      {job.logoText || 'CO'}
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {isVerified && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#ecfdf5] text-[#0f766e] font-mono text-[11px] font-semibold uppercase">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                            <span>{job.tag || 'Verified Fresher'}</span>
                          </span>
                        )}

                        {isReview && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#fffbeb] text-[#b45309] font-mono text-[11px] font-semibold uppercase">
                            <span className="material-symbols-outlined text-[14px]">pending_actions</span>
                            <span>Review Details</span>
                          </span>
                        )}

                        {isFiltered && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#fef2f2] text-[#b91c1c] font-mono text-[11px] font-semibold uppercase">
                            <span className="material-symbols-outlined text-[14px]">block</span>
                            <span>Filtered Out</span>
                          </span>
                        )}

                        <span className="text-xs text-[#94a3b8] flex items-center gap-1 font-mono">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          <span>{job.foundTimeText || '25 mins ago'}</span>
                        </span>
                      </div>

                      <h2
                        onClick={() => onSelectJob(job.id)}
                        className="text-lg font-bold text-[#0f172a] tracking-tight group-hover:text-[#4338ca] transition cursor-pointer"
                      >
                        {job.title}
                      </h2>

                      <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-sm text-[#475569]">
                        <span className="font-semibold text-[#0f172a]">{job.company}</span>
                        <span className="text-[#cbd5e1]">•</span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px] text-[#64748b]">location_on</span>
                          <span>{job.location}</span>
                        </span>
                        <span className="text-[#cbd5e1]">•</span>
                        <span className="font-mono text-sm font-bold text-[#0f766e]">
                          {job.ctcText}
                        </span>
                      </div>

                      {/* Caution / Verification Notice */}
                      {job.cautionNotice && (
                        <div className="mt-2 p-3 bg-[#fffbeb] border border-[#fde68a] rounded-lg flex items-start gap-2 text-xs text-[#b45309]">
                          <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">info</span>
                          <span>{job.cautionNotice}</span>
                        </div>
                      )}

                      {/* Filter reason if filtered */}
                      {job.filterReason && (
                        <div className="mt-2 p-3 bg-[#fef2f2] border border-[#fecaca] rounded-lg flex items-start gap-2 text-xs text-[#b91c1c]">
                          <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">warning</span>
                          <span>Exclusion reason: {job.filterReason}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-[#f1f5f9] text-xs text-[#64748b]">
                        <span className="material-symbols-outlined text-[15px] text-[#0f766e]">domain_verification</span>
                        <span>Source:</span>
                        <span className="font-mono text-[#0f172a] font-medium">{job.sourceName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2 shrink-0 pt-2 md:pt-0">
                    {isReview ? (
                      <button
                        type="button"
                        onClick={() => setInspectJob(job)}
                        className="flex items-center gap-1.5 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#0f172a] px-4 py-2 rounded-lg text-xs font-semibold transition"
                      >
                        <span>Inspect Details</span>
                        <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                      </button>
                    ) : (
                      <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-[#4338ca] text-white hover:bg-[#3730a3] px-4 py-2 rounded-lg text-xs font-semibold transition shadow-xs"
                      >
                        <span>Apply on Company Site</span>
                        <span className="material-symbols-outlined text-[15px]">north_east</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => handleToggleSave(job)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        job.isSaved
                          ? 'text-[#4338ca] bg-[#eef2ff]'
                          : 'text-[#64748b] hover:text-[#0f172a] hover:bg-[#f8fafc]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {job.isSaved ? 'bookmark_added' : 'bookmark'}
                      </span>
                      <span>{job.isSaved ? 'Saved' : 'Save Job'}</span>
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Bottom Explainer Panel */}
        <section className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-6 flex flex-col md:flex-row items-start gap-6 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-[#eef2ff] text-[#4338ca] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">tune</span>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex flex-col gap-0.5">
              <span className="font-mono text-[10px] uppercase text-[#4338ca] font-bold">
                Candidate Protection Shield
              </span>
              <h3 className="text-lg font-bold text-[#0f172a] tracking-tight">
                Why was a job filtered out?
              </h3>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              We automatically remove listings that don't match your career goals: 
              <strong className="font-semibold text-[#0f172a]"> 14 roles</strong> were excluded because they required 2+ years of experience, 
              <strong className="font-semibold text-[#0f172a]"> 8 roles</strong> were non-technical BPO/call center jobs, and 
              <strong className="font-semibold text-[#0f172a]"> 4</strong> did not meet the <span className="font-mono font-semibold text-[#0f172a]">₹2.4 LPA</span> minimum salary rule.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white border border-[#e2e8f0] p-3 rounded-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0f766e] text-[18px]">check</span>
                <span className="text-xs text-[#0f172a] font-medium">0-1 Year Experience Only</span>
              </div>
              <div className="bg-white border border-[#e2e8f0] p-3 rounded-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0f766e] text-[18px]">check</span>
                <span className="text-xs text-[#0f172a] font-medium">Pure Engineering Tracks</span>
              </div>
              <div className="bg-white border border-[#e2e8f0] p-3 rounded-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0f766e] text-[18px]">check</span>
                <span className="text-xs text-[#0f172a] font-medium">Living Wage Guarantee (₹2.4L+)</span>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Inspect Review Drawer */}
      {inspectJob && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-[#e2e8f0] flex flex-col gap-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#fffbeb] text-[#b45309] font-mono font-bold flex items-center justify-center">
                  {inspectJob.logoText}
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#0f172a]">{inspectJob.title}</h3>
                  <span className="text-xs text-[#64748b]">{inspectJob.company} • {inspectJob.ctcText}</span>
                </div>
              </div>
              <button onClick={() => setInspectJob(null)} className="text-[#94a3b8] hover:text-[#0f172a]">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs text-[#475569]">
              <div className="p-3 bg-[#fffbeb] border border-[#fde68a] text-[#b45309] rounded-lg">
                <strong>Attention Required:</strong> {inspectJob.cautionNotice}
              </div>

              <div className="p-3 bg-[#f8fafc] rounded-lg flex flex-col gap-1.5">
                <span className="font-mono text-[10px] uppercase text-[#94a3b8]">Verification Checklist</span>
                <div className="flex items-center gap-2 text-[#0f766e]">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Direct HR Employer posting confirmed</span>
                </div>
                <div className="flex items-center gap-2 text-[#0f766e]">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Minimum compensation above ₹2.4 LPA verified</span>
                </div>
                <div className="flex items-center gap-2 text-[#b45309]">
                  <span className="material-symbols-outlined text-[16px]">help</span>
                  <span>Awaiting company update on test center venue</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setInspectJob(null)}
                className="px-4 py-2 text-xs font-semibold text-[#475569] hover:bg-[#f1f5f9] rounded-lg transition"
              >
                Dismiss
              </button>
              <a
                href={inspectJob.applyUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-[#4338ca] text-white rounded-lg text-xs font-semibold hover:bg-[#3730a3] transition"
              >
                Proceed to Company Portal
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
