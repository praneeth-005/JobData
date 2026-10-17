import React, { useState } from 'react';
import { EXACT_JOBS } from '../data/mockJobs';

interface DashboardPageProps {
  onSelectJob: (jobId: string) => void;
  onNavigateToFindJobs?: () => void;
}

export default function DashboardPage({ onSelectJob, onNavigateToFindJobs }: DashboardPageProps) {
  const [selectedTab, setSelectedTab] = useState<'TOP_MATCHES' | 'WALK_IN' | 'ALL'>('TOP_MATCHES');
  const [attendingJobs, setAttendingJobs] = useState<Set<string>>(new Set());
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState(false);

  const handleSyncFeeds = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncToast(true);
      setTimeout(() => setSyncToast(false), 3000);
    }, 700);
  };

  const toggleAttending = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAttendingJobs(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="w-full max-w-[1240px] mx-auto px-6 py-6 font-sans">
      
      {/* Toast Alert */}
      {syncToast && (
        <div className="fixed top-20 right-8 z-50 bg-[#1e1b4b] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping"></span>
          <span>18 fresh opportunities synced from 42 active crawlers</span>
        </div>
      )}

      {/* Top Welcome Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="text-[11px] font-mono tracking-wider text-[#4338ca] font-semibold uppercase mb-1">
            CAREER ENGINE ACTIVE • INDIA IT SECTOR
          </div>
          <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight">
            Good morning, Arjun
          </h1>
          <p className="text-xs text-[#64748b] mt-0.5">
            18 fresher-verified opportunities match your master resume and non-negotiables today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleSyncFeeds}
            className="h-8 px-3.5 bg-white border border-[#e2e8f0] hover:bg-[#f8fafc] text-[#334155] rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-xs transition"
          >
            <span className={`material-symbols-outlined text-[15px] ${isSyncing ? 'animate-spin text-[#4338ca]' : ''}`}>sync</span>
            <span>Sync Feeds</span>
          </button>
          <button 
            onClick={() => onNavigateToFindJobs && onNavigateToFindJobs()}
            className="h-8 px-3 bg-white border border-[#e2e8f0] hover:bg-[#f8fafc] text-[#334155] rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-xs transition"
          >
            <span className="material-symbols-outlined text-[15px]">tune</span>
            <span>Preferences</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-7">
        
        {/* Metric 1: Qualified Roles */}
        <div className="bg-white p-4 rounded-xl border border-[#e8eaf6] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#64748b]">
            <span>Qualified Roles</span>
            <span className="material-symbols-outlined text-[18px] text-[#4338ca]">check_circle</span>
          </div>
          <div className="text-2xl font-bold font-mono text-[#0f172a] my-1">
            18
          </div>
          <div>
            <span className="inline-block bg-[#ecfdf5] text-[#059669] text-[10.5px] font-mono font-semibold px-2 py-0.5 rounded">
              100% Verified
            </span>
          </div>
        </div>

        {/* Metric 2: High Match */}
        <div className="bg-white p-4 rounded-xl border border-[#e8eaf6] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#64748b]">
            <span>High Match (&gt;80%)</span>
            <span className="material-symbols-outlined text-[18px] text-[#10b981]">share</span>
          </div>
          <div className="text-2xl font-bold font-mono text-[#0f172a] my-1">
            7
          </div>
          <div>
            <span className="inline-block bg-[#eef2ff] text-[#4338ca] text-[10.5px] font-mono font-semibold px-2 py-0.5 rounded">
              Priority Fit
            </span>
          </div>
        </div>

        {/* Metric 3: Walk-in Drives */}
        <div className="bg-white p-4 rounded-xl border border-[#e8eaf6] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#64748b]">
            <span>Walk-in Drives</span>
            <span className="material-symbols-outlined text-[18px] text-[#ef4444]">domain</span>
          </div>
          <div className="text-2xl font-bold font-mono text-[#ef4444] my-1">
            3
          </div>
          <div>
            <span className="inline-block bg-[#fef2f2] text-[#dc2626] text-[10.5px] font-mono font-semibold px-2 py-0.5 rounded">
              Within 48h
            </span>
          </div>
        </div>

        {/* Metric 4: Pipeline Tracking */}
        <div className="bg-white p-4 rounded-xl border border-[#e8eaf6] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#64748b]">
            <span>Pipeline Tracking</span>
            <span className="material-symbols-outlined text-[18px] text-[#64748b]">trending_up</span>
          </div>
          <div className="text-2xl font-bold font-mono text-[#0f172a] my-1">
            12
          </div>
          <div>
            <span className="inline-block bg-[#f1f5f9] text-[#475569] text-[10.5px] font-mono font-semibold px-2 py-0.5 rounded">
              3 Interviews
            </span>
          </div>
        </div>

      </div>

      {/* Filter Tabs Row */}
      <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3 mb-5 flex-wrap gap-2">
        <div className="flex items-center gap-6 text-xs font-semibold">
          <button 
            onClick={() => setSelectedTab('TOP_MATCHES')}
            className={`pb-1 transition border-b-2 ${
              selectedTab === 'TOP_MATCHES' 
                ? 'border-[#4338ca] text-[#4338ca]' 
                : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            Top Matches <span className="ml-1 text-[11px] font-mono bg-[#eef2ff] px-1.5 py-0.5 rounded">7</span>
          </button>
          
          <button 
            onClick={() => setSelectedTab('WALK_IN')}
            className={`pb-1 transition border-b-2 flex items-center gap-1.5 ${
              selectedTab === 'WALK_IN' 
                ? 'border-[#ef4444] text-[#ef4444]' 
                : 'border-transparent text-[#64748b] hover:text-[#ef4444]'
            }`}
          >
            Physical Walk-ins <span className="text-[11px] font-mono bg-[#fef2f2] text-[#dc2626] px-1.5 py-0.5 rounded">3</span>
          </button>

          <button 
            onClick={() => setSelectedTab('ALL')}
            className={`pb-1 transition border-b-2 ${
              selectedTab === 'ALL' 
                ? 'border-[#4338ca] text-[#4338ca]' 
                : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            All Verified <span className="ml-1 text-[11px] font-mono bg-[#f1f5f9] px-1.5 py-0.5 rounded">18</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-[#64748b]">
          Filtered: 0 Yrs Exp • ≥₹2.4L
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (Wide, 65% / 8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          {/* CARD 1: ThoughtWorks Walk-in */}
          <div 
            onClick={() => onSelectJob('job-tw')}
            className="bg-white rounded-xl border border-[#e8eaf6] hover:border-[#c7d2fe] p-5 shadow-xs transition cursor-pointer flex flex-col gap-3 group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-[#0f172a] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  TW
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#dc2626] font-semibold mb-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626] animate-pulse"></span>
                    <span>• WALK-IN DRIVE • March 15 • 09:00 AM</span>
                  </div>
                  <h3 className="text-base font-bold text-[#0f172a] group-hover:text-[#4338ca] transition truncate">
                    Junior Software Engineer (Graduate Track)
                  </h3>
                  <div className="text-xs text-[#64748b] mt-0.5 font-medium">
                    ThoughtWorks Technologies • Hyderabad (Hitec City Campus)
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0">
                <span className="text-lg font-bold font-mono text-[#0f172a]">₹8.5 <span className="text-xs font-normal text-[#64748b]">LPA</span></span>
                <span className="bg-[#e0f2fe] text-[#0284c7] text-[10.5px] font-mono font-semibold px-2 py-0.5 rounded mt-0.5">
                  92% Match
                </span>
              </div>
            </div>

            {/* Spec pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {['B.Tech/MCA 2024', '0 Yrs Exp', 'Java', 'Data Structures', 'Clean Code'].map(p => (
                <span key={p} className="bg-[#f8fafc] border border-[#e2e8f0] text-[#475569] text-[11px] font-mono px-2 py-0.5 rounded">
                  {p}
                </span>
              ))}
            </div>

            {/* Venue Highlight Box */}
            <div className="bg-[#f8fafc] border border-[#e2e8f0] p-2.5 rounded-lg flex items-center gap-2 text-xs text-[#334155]">
              <span className="material-symbols-outlined text-[16px] text-[#64748b]">work</span>
              <span className="font-medium">Carry 2 hardcopy resumes & Gov ID. Ascendas IT Park, 4th Flr.</span>
              <span className="ml-auto font-mono text-[11px] text-[#64748b]">Hitec City</span>
            </div>

            {/* Card Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-[#f1f5f9] text-xs">
              <span className="text-[11px] text-[#64748b]">
                Verified via Thoughtworks Portal
              </span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={(e) => { e.stopPropagation(); onSelectJob('job-tw'); }}
                  className="text-xs text-[#64748b] hover:text-[#0f172a] font-medium"
                >
                  Details
                </button>
                <button 
                  onClick={(e) => toggleAttending('job-tw', e)}
                  className={`h-7 px-3.5 rounded-md text-xs font-semibold transition ${
                    attendingJobs.has('job-tw')
                      ? 'bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]'
                      : 'bg-[#4338ca] hover:bg-[#3730a3] text-white'
                  }`}
                >
                  {attendingJobs.has('job-tw') ? '✓ Attending' : 'Mark Attending'}
                </button>
              </div>
            </div>
          </div>

          {/* CARD 2: Postman Frontend */}
          <div 
            onClick={() => onSelectJob('job-postman')}
            className="bg-white rounded-xl border border-[#e8eaf6] hover:border-[#c7d2fe] p-5 shadow-xs transition cursor-pointer flex flex-col gap-3 group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-[#ea580c] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  PM
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#059669] font-semibold mb-0.5">
                    <span>DIRECT ATS OPENING • Greenhouse • 1h ago</span>
                  </div>
                  <h3 className="text-base font-bold text-[#0f172a] group-hover:text-[#4338ca] transition truncate">
                    Associate Frontend Developer
                  </h3>
                  <div className="text-xs text-[#64748b] mt-0.5 font-medium">
                    Postman • Bengaluru (Hybrid: Indiranagar)
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0">
                <span className="text-lg font-bold font-mono text-[#0f172a]">₹7.2 <span className="text-xs font-normal text-[#64748b]">LPA</span></span>
                <span className="text-[#059669] text-[11px] font-mono font-semibold mt-0.5 flex items-center gap-0.5">
                  ✓ 86% Match
                </span>
              </div>
            </div>

            {/* Spec pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {['React 18', 'TypeScript', 'Tailwind', 'Web Performance'].map(p => (
                <span key={p} className="bg-[#f8fafc] border border-[#e2e8f0] text-[#475569] text-[11px] font-mono px-2 py-0.5 rounded">
                  {p}
                </span>
              ))}
            </div>

            <div className="text-xs text-[#64748b] font-mono">
              Virtual, 3-Round Process
            </div>

            {/* Card Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-[#f1f5f9] text-xs">
              <span className="text-[11px] text-[#64748b]">
                No referral required • Direct hiring
              </span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={(e) => { e.stopPropagation(); onSelectJob('job-postman'); }}
                  className="text-xs text-[#64748b] hover:text-[#0f172a] font-medium"
                >
                  Job Spec
                </button>
                <a 
                  href="https://postman.com/careers" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="h-7 px-3.5 bg-[#4338ca] hover:bg-[#3730a3] text-white rounded-md text-xs font-semibold flex items-center gap-1 transition"
                >
                  <span>Apply on Greenhouse</span>
                  <span className="material-symbols-outlined text-[13px]">north_east</span>
                </a>
              </div>
            </div>
          </div>

          {/* CARD 3: Persistent Systems */}
          <div 
            onClick={() => onSelectJob('job-persistent')}
            className="bg-white rounded-xl border border-[#e8eaf6] hover:border-[#c7d2fe] p-5 shadow-xs transition cursor-pointer flex flex-col gap-3 group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-[#2563eb] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  PS
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#2563eb] font-semibold mb-0.5">
                    <span className="bg-[#eff6ff] text-[#2563eb] px-1.5 py-0.5 rounded">VERIFIED CAMPUS CADRE</span>
                    <span>• Pune / Remote Initial</span>
                  </div>
                  <h3 className="text-base font-bold text-[#0f172a] group-hover:text-[#4338ca] transition truncate">
                    Junior Cloud & DevOps Trainee
                  </h3>
                  <div className="text-xs text-[#64748b] mt-0.5 font-medium">
                    Persistent Systems • 2024 Batch
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0">
                <span className="text-lg font-bold font-mono text-[#0f172a]">₹4.8 <span className="text-xs font-normal text-[#64748b]">LPA</span></span>
                <span className="text-[#64748b] text-[11px] font-mono font-medium mt-0.5">
                  78% Match
                </span>
              </div>
            </div>

            {/* Spec pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {['Linux', 'AWS Fundamentals', 'Bash', 'Git CI'].map(p => (
                <span key={p} className="bg-[#f8fafc] border border-[#e2e8f0] text-[#475569] text-[11px] font-mono px-2 py-0.5 rounded">
                  {p}
                </span>
              ))}
            </div>

            <div className="text-xs text-[#64748b] font-mono">
              Closes March 20, 2025
            </div>

            {/* Card Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-[#f1f5f9] text-xs">
              <span className="text-[11px] text-[#64748b]">
                Direct Technical Assessment
              </span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={(e) => { e.stopPropagation(); onSelectJob('job-persistent'); }}
                  className="text-xs text-[#64748b] hover:text-[#0f172a] font-medium"
                >
                  Syllabus
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onSelectJob('job-persistent'); }}
                  className="h-7 px-3.5 bg-[#4338ca] hover:bg-[#3730a3] text-white rounded-md text-xs font-semibold transition"
                >
                  Direct Apply
                </button>
              </div>
            </div>
          </div>

          {/* Showing pagination / explore text */}
          <div className="flex items-center justify-between text-xs text-[#64748b] pt-2 px-1">
            <span>Showing 3 of 18 qualifying fresher opportunities</span>
            <button 
              onClick={() => onNavigateToFindJobs && onNavigateToFindJobs()}
              className="text-[#4338ca] hover:underline font-medium flex items-center gap-1"
            >
              <span>View remaining 15 roles</span>
              <span>↓</span>
            </button>
          </div>

        </div>

        {/* Right Column (Narrow, 35% / 4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Widget 1: Active Portal Radar */}
          <div className="bg-white rounded-xl border border-[#e8eaf6] p-4 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0f172a]">
                <span className="material-symbols-outlined text-[17px] text-[#4338ca]">radar</span>
                <span>Active Portal Radar</span>
              </div>
              <button 
                onClick={() => alert("Added custom scraper alert for direct hiring portals.")}
                className="text-[11px] font-semibold text-[#4338ca] hover:underline"
              >
                + Add
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {/* Item 1 */}
              <div className="p-2.5 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0f172a]">Zoho Corporation</span>
                  <span className="bg-[#ecfdf5] text-[#059669] text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded">
                    Polling
                  </span>
                </div>
                <div className="text-[11px] text-[#64748b]">
                  Fresher QA & SDET Track • Checked 12m ago
                </div>
                <div className="text-[11px] font-mono text-[#0f172a] font-medium">
                  Target: ₹5.6 - ₹8.4 LPA
                </div>
              </div>

              {/* Item 2 */}
              <div className="p-2.5 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0f172a]">TCS Digital</span>
                  <span className="bg-[#eff6ff] text-[#2563eb] text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded">
                    Window Open
                  </span>
                </div>
                <div className="text-[11px] text-[#64748b]">
                  NQT 7.0 LPA Cadre • Hall ticket window active
                </div>
                <div className="text-[11px] font-mono text-[#0f172a] font-medium">
                  Target: ₹7.0 LPA
                </div>
              </div>
            </div>
          </div>

          {/* Widget 2: Active Pipeline */}
          <div className="bg-white rounded-xl border border-[#e8eaf6] p-4 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0f172a]">
                <span className="material-symbols-outlined text-[17px] text-[#64748b]">format_list_bulleted</span>
                <span>Active Pipeline</span>
              </div>
              <span className="text-[11px] font-mono text-[#64748b]">12 Tracked</span>
            </div>

            <div className="flex flex-col gap-2.5">
              {/* Item 1 */}
              <div className="flex items-start justify-between text-xs pb-2 border-b border-[#f1f5f9]">
                <div>
                  <div className="font-semibold text-[#0f172a]">Cognizant GenC</div>
                  <div className="text-[11px] text-[#64748b]">Technical Interview</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-[#0f172a]">₹6.75L</div>
                  <div className="text-[10.5px] font-mono text-[#2563eb]">Mar 12, 2 PM</div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-start justify-between text-xs pb-2 border-b border-[#f1f5f9]">
                <div>
                  <div className="font-semibold text-[#0f172a]">Juspay</div>
                  <div className="text-[11px] text-[#64748b]">Backend Intern → FTE</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-[#0f172a]">₹12.0L</div>
                  <div className="text-[10.5px] font-mono text-[#059669] font-semibold">Score: 285/300</div>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-start justify-between text-xs">
                <div>
                  <div className="font-semibold text-[#0f172a]">Accenture India</div>
                  <div className="text-[11px] text-[#64748b]">Assoc. Software Engineer</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-[#0f172a]">₹4.5L</div>
                  <div className="text-[10.5px] font-mono text-[#64748b]">Under Review</div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => alert("Pipeline Tracker: 12 applications under tracking across Workday, Greenhouse and Taleo.")}
              className="text-center text-xs font-semibold text-[#4338ca] hover:underline pt-1"
            >
              View all 12 tracked applications →
            </button>
          </div>

          {/* Widget 3: Resume High-Demand Gaps */}
          <div className="bg-[#f5f3ff] rounded-xl border border-[#ddd6fe] p-4 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#4338ca]">Resume High-Demand Gaps</span>
              <span className="text-[10.5px] font-mono text-[#4338ca] font-semibold bg-white px-1.5 py-0.5 rounded">
                88% Match
              </span>
            </div>

            <p className="text-[11.5px] text-[#475569] leading-relaxed">
              Top tags in verified &gt;₹6 LPA requisitions missing from your current draft:
            </p>

            <div className="flex flex-col gap-2.5">
              <div>
                <div className="flex justify-between text-[11.5px] text-[#334155] font-medium mb-1">
                  <span>Docker & Containers</span>
                  <span className="font-mono text-[11px]">62%</span>
                </div>
                <div className="w-full bg-white rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#4338ca] h-full rounded-full" style={{ width: '62%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11.5px] text-[#334155] font-medium mb-1">
                  <span>PostgreSQL Indexing</span>
                  <span className="font-mono text-[11px]">41%</span>
                </div>
                <div className="w-full bg-white rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#4338ca] h-full rounded-full" style={{ width: '41%' }}></div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => alert("Guided Project Blueprints:\n\n1. Dockerizing Microservices with Docker-Compose.\n2. PostgreSQL Index Execution Plan tuning with EXPLAIN ANALYZE.")}
              className="w-full h-8 bg-white hover:bg-[#faf5ff] text-[#4338ca] border border-[#c4b5fd] rounded-lg text-xs font-semibold transition"
            >
              Guided Project Blueprints
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
