import React, { useState } from 'react';
import { EXACT_JOBS } from '../data/mockJobs';

interface FindJobsPageProps {
  onSelectJob: (jobId: string) => void;
}

export default function FindJobsPage({ onSelectJob }: FindJobsPageProps) {
  const [searchQuery, setSearchQuery] = useState('React, Go, QA Automation');
  const [jobTypes, setJobTypes] = useState<string[]>(['FULL_TIME', 'INTERNSHIP']);
  const [interviewModes, setInterviewModes] = useState<string[]>(['VIRTUAL']);
  const [locations, setLocations] = useState<string[]>(['Hyderabad', 'Bengaluru']);
  const [compensation, setCompensation] = useState<string[]>(['3.5-5', '5-12']);
  const [sortBy, setSortBy] = useState('Highest Resume Match');
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());

  const toggleCheck = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (list.includes(item)) setList(list.filter(x => x !== item));
    else setList([...list, item]);
  };

  const resetAll = () => {
    setJobTypes([]);
    setInterviewModes([]);
    setLocations([]);
    setCompensation([]);
    setSearchQuery('');
  };

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedJobs(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="w-full max-w-[1240px] mx-auto px-6 py-6 font-sans">
      
      {/* Top Header Section */}
      <div className="flex flex-col gap-1 mb-5">
        <div className="text-[11px] font-mono tracking-wider text-[#059669] font-bold uppercase flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
          <span>ZERO BOND GUARANTEE • 0 Years Exp • Verified CTC</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight">
              Find Verified IT Jobs
            </h1>
            <p className="text-xs text-[#64748b] mt-0.5">
              Curated opportunities strictly matched with freshers, verified compensation, and direct application channels.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white px-3.5 py-1.5 rounded-lg border border-[#e2e8f0] text-xs font-mono shrink-0 shadow-2xs">
            <div className="flex items-center gap-1.5 text-[#059669] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
              <span>34 Live Openings</span>
            </div>
            <div className="h-4 w-[1px] bg-[#e2e8f0]"></div>
            <span className="text-[#64748b]">Synced 3m ago</span>
          </div>
        </div>
      </div>

      {/* Big Search Input with Trending tags */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 mb-6 shadow-2xs flex flex-col gap-2.5">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined text-[18px] text-[#94a3b8] absolute left-3">
            search
          </span>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search roles, companies, tech stacks..."
            className="w-full h-10 pl-9 pr-20 bg-[#f8fafc] rounded-lg text-xs text-[#0f172a] placeholder-[#94a3b8] border border-[#e2e8f0] focus:outline-none focus:border-[#4338ca] font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-12 text-[#94a3b8] hover:text-[#0f172a] text-xs font-mono"
            >
              ✕
            </button>
          )}
          <kbd className="absolute right-3 text-[10px] font-mono bg-white border border-[#e2e8f0] text-[#64748b] px-1.5 py-0.5 rounded pointer-events-none">
            ⌘F
          </kbd>
        </div>

        {/* Trending tags row */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <span className="text-[11px] font-mono text-[#64748b] mr-1">Trending:</span>
          {['Spring Boot', 'Golang', 'SDET / QA', 'AWS', 'Next.js'].map(tag => (
            <button 
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="px-2.5 py-0.5 rounded-full bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#334155] text-[11px] font-mono transition"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header Bar */}
      <div className="flex items-center justify-between text-xs text-[#64748b] mb-4">
        <div className="font-medium">
          Showing 34 verified openings
        </div>
        <div className="flex items-center gap-1.5">
          <span>Sort by:</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent font-medium text-[#0f172a] focus:outline-none cursor-pointer"
          >
            <option>Highest Resume Match</option>
            <option>Highest CTC</option>
            <option>Recently Ingested</option>
          </select>
        </div>
      </div>

      {/* Main 2-Column Grid: Filter Rail (Left) + Cards (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Filter Rail (Cols 1-3.5) */}
        <aside className="lg:col-span-3 bg-white rounded-xl border border-[#e8eaf6] p-4 shadow-2xs flex flex-col gap-5 text-xs">
          
          <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
            <span className="font-bold text-[#0f172a] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#4338ca]">filter_alt</span>
              Filters
            </span>
            <button 
              onClick={resetAll}
              className="text-[#4338ca] hover:underline font-medium text-[11px]"
            >
              Reset all
            </button>
          </div>

          {/* Section: JOB TYPE */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10.5px] uppercase font-bold text-[#64748b] tracking-wider">
              JOB TYPE
            </span>
            <label className="flex items-center justify-between cursor-pointer select-none py-0.5">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={jobTypes.includes('FULL_TIME')}
                  onChange={() => toggleCheck(jobTypes, setJobTypes, 'FULL_TIME')}
                  className="rounded border-[#cbd5e1] text-[#4338ca] focus:ring-[#4338ca] h-3.5 w-3.5"
                />
                <span className="text-[#334155]">Full-Time FTE</span>
              </div>
              <span className="font-mono text-[10.5px] text-[#94a3b8]">31</span>
            </label>
            <label className="flex items-center justify-between cursor-pointer select-none py-0.5">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={jobTypes.includes('INTERNSHIP')}
                  onChange={() => toggleCheck(jobTypes, setJobTypes, 'INTERNSHIP')}
                  className="rounded border-[#cbd5e1] text-[#4338ca] focus:ring-[#4338ca] h-3.5 w-3.5"
                />
                <span className="text-[#334155]">Paid Internship &gt;₹5k</span>
              </div>
              <span className="font-mono text-[10.5px] text-[#94a3b8]">3</span>
            </label>
          </div>

          {/* Section: INTERVIEW MODE */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10.5px] uppercase font-bold text-[#64748b] tracking-wider">
              INTERVIEW MODE
            </span>
            <label className="flex items-center justify-between cursor-pointer select-none py-0.5">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={interviewModes.includes('VIRTUAL')}
                  onChange={() => toggleCheck(interviewModes, setInterviewModes, 'VIRTUAL')}
                  className="rounded border-[#cbd5e1] text-[#4338ca] focus:ring-[#4338ca] h-3.5 w-3.5"
                />
                <span className="text-[#334155]">Virtual / Online</span>
              </div>
              <span className="font-mono text-[10.5px] text-[#94a3b8]">28</span>
            </label>
            <label className="flex items-center justify-between cursor-pointer select-none py-0.5">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={interviewModes.includes('WALK_IN')}
                  onChange={() => toggleCheck(interviewModes, setInterviewModes, 'WALK_IN')}
                  className="rounded border-[#cbd5e1] text-[#4338ca] focus:ring-[#4338ca] h-3.5 w-3.5"
                />
                <span className="text-[#334155]">Walk-in Drive</span>
              </div>
              <span className="font-mono text-[10.5px] text-[#94a3b8]">4</span>
            </label>
            <label className="flex items-center justify-between cursor-pointer select-none py-0.5">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={interviewModes.includes('HYBRID')}
                  onChange={() => toggleCheck(interviewModes, setInterviewModes, 'HYBRID')}
                  className="rounded border-[#cbd5e1] text-[#4338ca] focus:ring-[#4338ca] h-3.5 w-3.5"
                />
                <span className="text-[#334155]">Hybrid</span>
              </div>
              <span className="font-mono text-[10.5px] text-[#94a3b8]">2</span>
            </label>
          </div>

          {/* Section: HUB LOCATION */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10.5px] uppercase font-bold text-[#64748b] tracking-wider">
              HUB LOCATION
            </span>
            <label className="flex items-center justify-between cursor-pointer select-none py-0.5">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={locations.includes('Hyderabad')}
                  onChange={() => toggleCheck(locations, setLocations, 'Hyderabad')}
                  className="rounded border-[#cbd5e1] text-[#4338ca] focus:ring-[#4338ca] h-3.5 w-3.5"
                />
                <span className="text-[#334155]">Hyderabad</span>
              </div>
              <span className="font-mono text-[10.5px] text-[#94a3b8]">11</span>
            </label>
            <label className="flex items-center justify-between cursor-pointer select-none py-0.5">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={locations.includes('Bengaluru')}
                  onChange={() => toggleCheck(locations, setLocations, 'Bengaluru')}
                  className="rounded border-[#cbd5e1] text-[#4338ca] focus:ring-[#4338ca] h-3.5 w-3.5"
                />
                <span className="text-[#334155]">Bengaluru</span>
              </div>
              <span className="font-mono text-[10.5px] text-[#94a3b8]">9</span>
            </label>
            <label className="flex items-center justify-between cursor-pointer select-none py-0.5">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={locations.includes('Pune')}
                  onChange={() => toggleCheck(locations, setLocations, 'Pune')}
                  className="rounded border-[#cbd5e1] text-[#4338ca] focus:ring-[#4338ca] h-3.5 w-3.5"
                />
                <span className="text-[#334155]">Pune</span>
              </div>
              <span className="font-mono text-[10.5px] text-[#94a3b8]">5</span>
            </label>
            <label className="flex items-center justify-between cursor-pointer select-none py-0.5">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={locations.includes('Remote')}
                  onChange={() => toggleCheck(locations, setLocations, 'Remote')}
                  className="rounded border-[#cbd5e1] text-[#4338ca] focus:ring-[#4338ca] h-3.5 w-3.5"
                />
                <span className="text-[#334155]">Remote</span>
              </div>
              <span className="font-mono text-[10.5px] text-[#059669] font-bold">WFH</span>
            </label>
          </div>

          {/* Section: COMPENSATION */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10.5px] uppercase font-bold text-[#64748b] tracking-wider">
              COMPENSATION
            </span>
            <label className="flex items-center justify-between cursor-pointer select-none py-0.5">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={compensation.includes('3.5-5')}
                  onChange={() => toggleCheck(compensation, setCompensation, '3.5-5')}
                  className="rounded border-[#cbd5e1] text-[#4338ca] focus:ring-[#4338ca] h-3.5 w-3.5"
                />
                <span className="text-[#334155]">₹3.5 - ₹5.0 LPA</span>
              </div>
              <span className="font-mono text-[10.5px] text-[#94a3b8]">14</span>
            </label>
            <label className="flex items-center justify-between cursor-pointer select-none py-0.5">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={compensation.includes('5-12')}
                  onChange={() => toggleCheck(compensation, setCompensation, '5-12')}
                  className="rounded border-[#cbd5e1] text-[#4338ca] focus:ring-[#4338ca] h-3.5 w-3.5"
                />
                <span className="text-[#334155]">₹5.0 - ₹12.0 LPA</span>
              </div>
              <span className="font-mono text-[10.5px] text-[#94a3b8]">7</span>
            </label>
            <label className="flex items-center justify-between cursor-pointer select-none py-0.5">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={compensation.includes('12+')}
                  onChange={() => toggleCheck(compensation, setCompensation, '12+')}
                  className="rounded border-[#cbd5e1] text-[#4338ca] focus:ring-[#4338ca] h-3.5 w-3.5"
                />
                <span className="text-[#334155]">₹12.0 LPA+</span>
              </div>
              <span className="font-mono text-[10.5px] text-[#94a3b8]">3</span>
            </label>
          </div>

        </aside>

        {/* Right Cards List (Cols 4-12) */}
        <main className="lg:col-span-9 flex flex-col gap-4">
          
          {/* CARD 1: Razorpay */}
          <div 
            onClick={() => onSelectJob('job-rzp')}
            className="bg-white rounded-xl border border-[#e8eaf6] hover:border-[#c7d2fe] p-5 shadow-2xs transition cursor-pointer flex flex-col gap-3 group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-[#eef2ff] text-[#4338ca] flex items-center justify-center font-bold text-base shrink-0">
                  R
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-[#0f172a] group-hover:text-[#4338ca] transition truncate">
                      Graduate Software Engineer (Backend)
                    </h3>
                    <span className="bg-[#ecfdf5] text-[#059669] text-[10.5px] font-mono font-semibold px-2 py-0.5 rounded">
                      94% Match
                    </span>
                  </div>
                  <div className="text-xs text-[#64748b] mt-0.5 font-medium">
                    Razorpay • Bengaluru (Hybrid) • 0 Yrs (2024 / 2025)
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0">
                <span className="text-lg font-bold font-mono text-[#0f172a]">₹14.0 <span className="text-xs font-normal text-[#64748b]">LPA</span></span>
                <span className="text-[10px] font-mono text-[#64748b]">Verified CTC</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {['Go / Golang', 'Java 17', 'Distributed Systems', 'Kafka', 'MySQL'].map(t => (
                <span key={t} className="bg-[#f8fafc] border border-[#e2e8f0] text-[#475569] text-[11px] font-mono px-2 py-0.5 rounded">
                  {t}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-[#f1f5f9] text-xs">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#059669] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                <span>Zero-Fee Verified • Direct Portal</span>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => toggleSave('job-rzp', e)}
                  className="p-1.5 text-[#94a3b8] hover:text-[#0f172a] rounded"
                >
                  <span className="material-symbols-outlined text-[17px]">
                    {savedJobs.has('job-rzp') ? 'bookmark' : 'bookmark_border'}
                  </span>
                </button>
                <a 
                  href="https://razorpay.com/careers"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="h-7 px-3.5 bg-[#4338ca] hover:bg-[#3730a3] text-white rounded-md text-xs font-semibold flex items-center gap-1 transition"
                >
                  <span>Apply on Razorpay</span>
                  <span className="material-symbols-outlined text-[13px]">north_east</span>
                </a>
              </div>
            </div>
          </div>

          {/* CARD 2: LTIMindtree Walk-in */}
          <div 
            onClick={() => onSelectJob('job-lti')}
            className="bg-white rounded-xl border border-[#e8eaf6] hover:border-[#c7d2fe] p-5 shadow-2xs transition cursor-pointer flex flex-col gap-3 group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-[#312e81] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  LTI
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-[#0f172a] group-hover:text-[#4338ca] transition truncate">
                      Associate QA Automation Engineer
                    </h3>
                    <span className="bg-[#fef2f2] text-[#dc2626] text-[10.5px] font-mono font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626] animate-pulse"></span>
                      WALK-IN DRIVE
                    </span>
                  </div>
                  <div className="text-xs text-[#64748b] mt-0.5 font-medium">
                    LTIMindtree • Hyderabad • Physical Drive: Mar 18
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0">
                <span className="text-lg font-bold font-mono text-[#0f172a]">₹4.5 <span className="text-xs font-normal text-[#64748b]">LPA</span></span>
                <span className="text-[10px] font-mono text-[#64748b]">Standard Band</span>
              </div>
            </div>

            {/* Venue Highlight Box */}
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] p-2.5 rounded-lg flex items-center gap-2 text-xs text-[#166534]">
              <span className="material-symbols-outlined text-[16px]">calendar_month</span>
              <span className="font-medium">Venue: Mindspace SEZ, Madhapur, Hyderabad • 10:00 AM IST • Direct Entry</span>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {['Selenium', 'Java & OOP', 'TestNG', 'Postman', 'SQL'].map(t => (
                <span key={t} className="bg-[#f8fafc] border border-[#e2e8f0] text-[#475569] text-[11px] font-mono px-2 py-0.5 rounded">
                  {t}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-[#f1f5f9] text-xs">
              <div className="text-[11px] font-mono text-[#64748b]">
                • 88% Resume Match • Hall Pass Not Required
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => toggleSave('job-lti', e)}
                  className="p-1.5 text-[#94a3b8] hover:text-[#0f172a] rounded"
                >
                  <span className="material-symbols-outlined text-[17px]">
                    {savedJobs.has('job-lti') ? 'bookmark' : 'bookmark_border'}
                  </span>
                </button>
                <a 
                  href="https://ltimindtree.com/careers"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="h-7 px-3.5 bg-[#4338ca] hover:bg-[#3730a3] text-white rounded-md text-xs font-semibold flex items-center gap-1 transition"
                >
                  <span>View Official Circular</span>
                  <span className="material-symbols-outlined text-[13px]">north_east</span>
                </a>
              </div>
            </div>
          </div>

          {/* CARD 3: Swiggy Intern */}
          <div 
            onClick={() => onSelectJob('job-swiggy')}
            className="bg-white rounded-xl border border-[#e8eaf6] hover:border-[#c7d2fe] p-5 shadow-2xs transition cursor-pointer flex flex-col gap-3 group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-[#ffedd5] text-[#ea580c] flex items-center justify-center font-bold text-base shrink-0">
                  S
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-[#0f172a] group-hover:text-[#4338ca] transition truncate">
                      Frontend Engineering Intern
                    </h3>
                    <span className="bg-[#ecfdf5] text-[#059669] text-[10.5px] font-mono font-semibold px-2 py-0.5 rounded">
                      82% Match
                    </span>
                    <span className="bg-[#eff6ff] text-[#2563eb] text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded">
                      PPO AVAILABLE
                    </span>
                  </div>
                  <div className="text-xs text-[#64748b] mt-0.5 font-medium">
                    Swiggy • Remote (India) • 6 Months Full-Time
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0">
                <span className="text-lg font-bold font-mono text-[#0f172a]">₹35,000 <span className="text-xs font-normal text-[#64748b]">/mo</span></span>
                <span className="text-[10px] font-mono text-[#64748b]">₹11.0L PPO CTC</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {['React 18', 'Next.js', 'Tailwind CSS', 'Redux Toolkit'].map(t => (
                <span key={t} className="bg-[#f8fafc] border border-[#e2e8f0] text-[#475569] text-[11px] font-mono px-2 py-0.5 rounded">
                  {t}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-[#f1f5f9] text-xs">
              <div className="text-[11px] font-mono text-[#059669] font-medium">
                • Greenhouse Direct • Closes in 4 days
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => toggleSave('job-swiggy', e)}
                  className="p-1.5 text-[#94a3b8] hover:text-[#0f172a] rounded"
                >
                  <span className="material-symbols-outlined text-[17px]">
                    {savedJobs.has('job-swiggy') ? 'bookmark' : 'bookmark_border'}
                  </span>
                </button>
                <a 
                  href="https://swiggy.com/careers"
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

          {/* CARD 4: IndirechLabs Python */}
          <div 
            onClick={() => onSelectJob('job-indirech')}
            className="bg-white rounded-xl border border-[#e8eaf6] hover:border-[#c7d2fe] p-5 shadow-2xs transition cursor-pointer flex flex-col gap-3 group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-[#f1f5f9] text-[#475569] flex items-center justify-center font-bold text-xs shrink-0">
                  IT
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-[#0f172a] group-hover:text-[#4338ca] transition truncate">
                      Junior Python / Django Developer
                    </h3>
                    <span className="bg-[#ecfdf5] text-[#059669] text-[10.5px] font-mono font-semibold px-2 py-0.5 rounded">
                      76% Match
                    </span>
                  </div>
                  <div className="text-xs text-[#64748b] mt-0.5 font-medium">
                    IndirechLabs • Pune (Viman Nagar) • On-site
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0">
                <span className="text-lg font-bold font-mono text-[#0f172a]">₹3.6 - 4.2 <span className="text-xs font-normal text-[#64748b]">LPA</span></span>
                <span className="text-[10px] font-mono text-[#64748b]">Estimated</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {['Python 3.11', 'Django REST', 'PostgreSQL', 'Git'].map(t => (
                <span key={t} className="bg-[#f8fafc] border border-[#e2e8f0] text-[#475569] text-[11px] font-mono px-2 py-0.5 rounded">
                  {t}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-[#f1f5f9] text-xs">
              <div className="text-[11px] font-mono text-[#64748b]">
                Aggregator Listing • Free Application
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => toggleSave('job-indirech', e)}
                  className="p-1.5 text-[#94a3b8] hover:text-[#0f172a] rounded"
                >
                  <span className="material-symbols-outlined text-[17px]">
                    {savedJobs.has('job-indirech') ? 'bookmark' : 'bookmark_border'}
                  </span>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onSelectJob('job-indirech'); }}
                  className="h-7 px-3 bg-[#f8fafc] hover:bg-[#f1f5f9] text-[#334155] border border-[#e2e8f0] rounded-md text-xs font-semibold flex items-center gap-1 transition"
                >
                  <span>View Listing</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Pagination Row */}
          <div className="flex items-center justify-between text-xs text-[#64748b] pt-3 px-1">
            <span>Page 1 of 3 (34 jobs shown)</span>
            <div className="flex items-center gap-1">
              <button disabled className="h-7 w-7 rounded bg-[#f1f5f9] text-[#94a3b8] flex items-center justify-center font-mono">
                &lt;
              </button>
              <button className="h-7 w-7 rounded bg-[#4338ca] text-white flex items-center justify-center font-mono font-bold">
                1
              </button>
              <button className="h-7 w-7 rounded bg-white hover:bg-[#f1f5f9] text-[#334155] flex items-center justify-center font-mono">
                2
              </button>
              <button className="h-7 w-7 rounded bg-white hover:bg-[#f1f5f9] text-[#334155] flex items-center justify-center font-mono">
                3
              </button>
              <button className="h-7 w-7 rounded bg-white hover:bg-[#f1f5f9] text-[#334155] flex items-center justify-center font-mono">
                &gt;
              </button>
            </div>
          </div>

          {/* Anti-Exploitation Guarantee Footer Banner */}
          <div className="p-3.5 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl flex items-center justify-between flex-wrap gap-2 text-xs text-[#166534] mt-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#059669]">verified_user</span>
              <span><strong>Anti-Exploitation Guarantee:</strong> 100% verified zero-deposit policy and fresher-specific compensation floor.</span>
            </div>
            <a 
              href="#protocol" 
              onClick={(e) => { e.preventDefault(); alert("JobMate Anti-Exploitation Protocol:\n1. Strict 0 YOE Gate\n2. Minimum ₹2.4 LPA floor\n3. Zero bond guarantee\n4. Direct official portals only."); }}
              className="text-[#059669] hover:underline font-semibold flex items-center gap-1"
            >
              <span>Protocol Guidelines</span>
              <span>→</span>
            </a>
          </div>

        </main>
      </div>

    </div>
  );
}
