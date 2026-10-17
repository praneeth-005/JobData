import React, { useState } from 'react';
import DashboardPage from './pages/DashboardPage';
import FindJobsPage from './pages/FindJobsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';

export type Screen = 'OVERVIEW' | 'FIND_JOBS' | 'JOB_DETAILS' | 'SIGN_IN' | 'SIGN_UP';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('OVERVIEW');
  const [selectedJobId, setSelectedJobId] = useState<string>('job-rzp');
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const navigateToJob = (jobId: string) => {
    setSelectedJobId(jobId);
    setActiveScreen('JOB_DETAILS');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadMessage('Parsing master resume against 18 fresher specifications...');
      setTimeout(() => {
        setUploadMessage('✓ Master Resume (Arjun_Rao_2024.pdf) analyzed! 14 verified skills synced.');
        setTimeout(() => {
          setUploadMessage(null);
          setIsResumeModalOpen(false);
        }, 1800);
      }, 1000);
    }
  };

  // If in standalone Auth screens, render without the main dashboard shell chrome
  if (activeScreen === 'SIGN_IN') {
    return (
      <SignInPage 
        onSignInSuccess={() => setActiveScreen('OVERVIEW')}
        onNavigateToSignUp={() => setActiveScreen('SIGN_UP')}
      />
    );
  }

  if (activeScreen === 'SIGN_UP') {
    return (
      <SignUpPage 
        onSignUpSuccess={() => setActiveScreen('OVERVIEW')}
        onNavigateToSignIn={() => setActiveScreen('SIGN_IN')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#0f172a] font-sans flex flex-col">
      
      {/* Sidebar (Fixed on Left, 240px wide) */}
      <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-[#e8eaf6] z-50 flex flex-col justify-between shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
        
        <div className="flex flex-col flex-1 min-h-0">
          
          {/* Logo Brand Header */}
          <div className="h-14 px-4 flex items-center gap-2.5 border-b border-[#f1f5f9]">
            <div className="w-8 h-8 rounded-lg bg-[#4338ca] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              IT
            </div>
            <div>
              <div className="text-[13px] font-bold text-[#0f172a] tracking-tight leading-tight">
                IT Career Partner
              </div>
              <div className="text-[10px] font-mono text-[#94a3b8] uppercase">
                ENG | IND v1.0
              </div>
            </div>
          </div>

          {/* Nav items list */}
          <div className="p-3 flex flex-col gap-4 overflow-y-auto flex-1 text-xs font-medium text-[#64748b]">
            
            {/* Group: DISCOVERY */}
            <div className="flex flex-col gap-1">
              <span className="px-2.5 text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] font-bold">
                DISCOVERY
              </span>

              {/* Overview / Dashboard */}
              <button 
                onClick={() => setActiveScreen('OVERVIEW')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition ${
                  activeScreen === 'OVERVIEW'
                    ? 'bg-[#eef2ff] text-[#4338ca] font-bold'
                    : 'hover:bg-[#f8fafc] text-[#334155]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px]">grid_view</span>
                  <span>Overview</span>
                </div>
                {activeScreen === 'OVERVIEW' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4338ca]"></span>
                )}
              </button>

              {/* Find Jobs */}
              <button 
                onClick={() => setActiveScreen('FIND_JOBS')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition ${
                  activeScreen === 'FIND_JOBS'
                    ? 'bg-[#4338ca] text-white font-bold shadow-xs'
                    : 'hover:bg-[#f8fafc] text-[#334155]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px]">search</span>
                  <span>Find Jobs</span>
                </div>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  activeScreen === 'FIND_JOBS' ? 'bg-white/20 text-white' : 'bg-[#eef2ff] text-[#4338ca]'
                }`}>
                  34
                </span>
              </button>

              {/* Walk-in Radar */}
              <button 
                onClick={() => setActiveScreen('FIND_JOBS')}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left hover:bg-[#f8fafc] text-[#334155] transition"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px] text-[#dc2626]">radar</span>
                  <span>Walk-in Radar</span>
                </div>
                <span className="text-[10px] font-mono bg-[#fef2f2] text-[#dc2626] font-bold px-1.5 py-0.2 rounded">
                  LIVE
                </span>
              </button>

              {/* Top Matches */}
              <button 
                onClick={() => setActiveScreen('OVERVIEW')}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left hover:bg-[#f8fafc] text-[#334155] transition"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px] text-[#059669]">auto_awesome</span>
                  <span>Top Matches</span>
                </div>
                <span className="text-[10px] font-mono bg-[#ecfdf5] text-[#059669] font-bold px-1.5 py-0.2 rounded">
                  85%+
                </span>
              </button>
            </div>

            {/* Group: INTELLIGENCE */}
            <div className="flex flex-col gap-1">
              <span className="px-2.5 text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] font-bold">
                INTELLIGENCE
              </span>

              {/* Master Resume */}
              <button 
                onClick={() => setIsResumeModalOpen(true)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left hover:bg-[#f8fafc] text-[#334155] transition"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px]">description</span>
                  <span>Master Resume</span>
                </div>
                <span className="text-[10px] font-mono bg-[#ecfdf5] text-[#059669] font-bold px-1.5 py-0.2 rounded">
                  88%
                </span>
              </button>

              {/* Job Details & AI Match Breakdown (Screen 3) */}
              <button 
                onClick={() => setActiveScreen('JOB_DETAILS')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition ${
                  activeScreen === 'JOB_DETAILS'
                    ? 'bg-[#eef2ff] text-[#4338ca] font-bold'
                    : 'hover:bg-[#f8fafc] text-[#334155]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px]">psychology</span>
                  <span>AI Match Breakdown</span>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
              </button>

              {/* Monitored Portals */}
              <button 
                onClick={() => setActiveScreen('OVERVIEW')}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left hover:bg-[#f8fafc] text-[#334155] transition"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px]">domain</span>
                  <span>Monitored Portals</span>
                </div>
                <span className="text-[10px] font-mono bg-[#f1f5f9] px-1.5 py-0.2 rounded">
                  4
                </span>
              </button>
            </div>

            {/* Group: ACCESS & AUTH */}
            <div className="flex flex-col gap-1">
              <span className="px-2.5 text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] font-bold">
                ACCOUNT PORTAL
              </span>

              <button 
                onClick={() => setActiveScreen('SIGN_IN')}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left hover:bg-[#f8fafc] text-[#334155] transition"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px] text-[#4338ca]">login</span>
                  <span>Sign In</span>
                </div>
                <span className="text-[10px] font-mono text-[#4338ca] font-bold">Studio</span>
              </button>

              <button 
                onClick={() => setActiveScreen('SIGN_UP')}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left hover:bg-[#f8fafc] text-[#334155] transition"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px] text-[#059669]">person_add</span>
                  <span>Sign Up (Fresher)</span>
                </div>
                <span className="text-[10px] font-mono bg-[#ecfdf5] text-[#059669] font-bold px-1.5 py-0.2 rounded">New</span>
              </button>
            </div>

          </div>
        </div>

        {/* Profile Card at bottom of sidebar */}
        <div className="p-3 border-t border-[#f1f5f9] bg-[#f8fafc]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#4338ca] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                AR
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#0f172a] truncate">Arjun Rao</div>
                <div className="text-[10px] text-[#64748b] font-mono">2024 Grad</div>
              </div>
            </div>
            <button 
              onClick={() => setActiveScreen('SIGN_IN')}
              title="Switch account / Sign in"
              className="text-[#94a3b8] hover:text-[#4338ca]"
            >
              <span className="material-symbols-outlined text-[17px]">logout</span>
            </button>
          </div>

          <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#e2e8f0] text-[10px] font-mono">
            <span className="bg-white border border-[#e2e8f0] px-1.5 py-0.5 rounded text-[#334155]">
              Min ₹2.4 LPA
            </span>
            <span className="flex items-center gap-1 text-[#059669] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
              Sync: Active
            </span>
          </div>
        </div>

      </aside>

      {/* Main Column Offset by Sidebar (240px) */}
      <div className="pl-60 flex flex-col flex-1">
        
        {/* Top Navigation Bar (Fixed, 56px high) */}
        <header className="fixed top-0 left-60 right-0 h-14 bg-white/95 backdrop-blur-md border-b border-[#e8eaf6] z-40 flex items-center justify-between px-6 shadow-2xs">
          
          {/* Search Input with ⌘K */}
          <div 
            onClick={() => setActiveScreen('FIND_JOBS')}
            className="relative flex items-center w-full max-w-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-[#94a3b8] absolute left-3">
              search
            </span>
            <input 
              readOnly
              type="text"
              placeholder="Search roles, companies, tech stacks..."
              className="w-full h-9 pl-9 pr-12 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-xs placeholder-[#94a3b8] focus:outline-none cursor-pointer font-medium"
            />
            <kbd className="absolute right-2.5 text-[10px] font-mono bg-white border border-[#e2e8f0] text-[#64748b] px-1.5 py-0.5 rounded pointer-events-none">
              ⌘K
            </kbd>
          </div>

          {/* Right Action Widgets */}
          <div className="flex items-center gap-3">
            
            {/* Guarantee Pill */}
            <div className="hidden md:flex items-center gap-1.5 bg-[#ecfdf5] border border-[#a7f3d0] text-[#059669] px-2.5 py-1 rounded-full text-xs font-mono font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
              <span>Freshers: ≥₹2.4 LPA</span>
            </div>

            {/* Resume Upload Button */}
            <button 
              onClick={() => setIsResumeModalOpen(true)}
              className="h-8 px-3.5 bg-[#4338ca] hover:bg-[#3730a3] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
            >
              <span className="material-symbols-outlined text-[16px]">upload_file</span>
              <span className="hidden sm:inline">Upload Master Resume</span>
            </button>

            {/* Auth Portal Button */}
            <button 
              onClick={() => setActiveScreen('SIGN_IN')}
              className="h-8 px-3 bg-[#FAF8F5] border border-[#EDE6DE] hover:bg-[#f3ede4] text-[#191512] rounded-lg text-xs font-semibold flex items-center gap-1 transition"
            >
              <span className="material-symbols-outlined text-[15px]">login</span>
              <span>Sign In</span>
            </button>

            {/* Notification Bell */}
            <button 
              onClick={() => setIsNotificationOpen(true)}
              className="relative p-1.5 text-[#64748b] hover:text-[#0f172a] rounded-lg"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#dc2626]"></span>
            </button>

            {/* Avatar */}
            <div 
              onClick={() => setActiveScreen('SIGN_IN')}
              title="Click to switch account"
              className="w-8 h-8 rounded-full bg-[#0f172a] text-white font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs"
            >
              AR
            </div>

          </div>

        </header>

        {/* Dynamic View Router */}
        <main className="flex-1 pt-14 pb-12 bg-[#faf8ff]">
          {activeScreen === 'OVERVIEW' && (
            <DashboardPage 
              onSelectJob={navigateToJob} 
              onNavigateToFindJobs={() => setActiveScreen('FIND_JOBS')} 
            />
          )}

          {activeScreen === 'FIND_JOBS' && (
            <FindJobsPage onSelectJob={navigateToJob} />
          )}

          {activeScreen === 'JOB_DETAILS' && (
            <JobDetailsPage 
              jobId={selectedJobId} 
              onBack={() => setActiveScreen('FIND_JOBS')} 
            />
          )}
        </main>

      </div>

      {/* Interactive Modal: Upload Master Resume */}
      {isResumeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-[#e2e8f0] p-6 flex flex-col gap-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[22px] text-[#4338ca]">upload_file</span>
                <h3 className="font-bold text-base text-[#0f172a]">Master Resume Ingestion</h3>
              </div>
              <button onClick={() => setIsResumeModalOpen(false)} className="text-[#94a3b8] hover:text-[#0f172a]">
                ✕
              </button>
            </div>

            <p className="text-xs text-[#64748b] leading-relaxed">
              Upload your raw unembellished resume (PDF or DOCX). Our deterministic ATS parser will verify skills, calculate dual fit scores, and verify fresher eligibility.
            </p>

            <label className="border-2 border-dashed border-[#c7d2fe] hover:border-[#4338ca] bg-[#f8fafc] rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition">
              <span className="material-symbols-outlined text-4xl text-[#4338ca] mb-1">cloud_upload</span>
              <span className="text-xs font-bold text-[#0f172a]">Click or drag &amp; drop resume file</span>
              <span className="text-[11px] font-mono text-[#94a3b8] mt-1">PDF or DOCX up to 10MB</span>
              <input type="file" accept=".pdf,.docx,.doc" className="hidden" onChange={handleFileUpload} />
            </label>

            {uploadMessage && (
              <div className="p-2.5 bg-[#ecfdf5] border border-[#a7f3d0] text-[#059669] rounded-lg text-xs font-mono">
                {uploadMessage}
              </div>
            )}

            <div className="text-[11px] font-mono text-[#64748b] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-[#059669]">verified_user</span>
              <span>100% Privacy: Stored locally only, never sold to recruiters.</span>
            </div>
          </div>
        </div>
      )}

      {/* Drawer: Notifications */}
      {isNotificationOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-sm h-full shadow-2xl border-l border-[#e2e8f0] flex flex-col justify-between p-5">
            <div>
              <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-[#4338ca]">notifications</span>
                  <h3 className="font-bold text-sm text-[#0f172a]">Operational Alerts (3)</h3>
                </div>
                <button onClick={() => setIsNotificationOpen(false)} className="text-[#94a3b8] hover:text-[#0f172a]">
                  ✕
                </button>
              </div>

              <div className="flex flex-col gap-3 text-xs">
                <div className="p-3 bg-[#fef2f2] border border-[#fecaca] rounded-lg flex flex-col gap-1">
                  <div className="flex justify-between font-mono font-bold text-[#dc2626]">
                    <span>WALK-IN ALERT</span>
                    <span>15m ago</span>
                  </div>
                  <p className="text-[#334155]">
                    ThoughtWorks Hyderabad Walk-in Drive confirmed for March 15 at Ascendas IT Park.
                  </p>
                </div>

                <div className="p-3 bg-[#ecfdf5] border border-[#a7f3d0] rounded-lg flex flex-col gap-1">
                  <div className="flex justify-between font-mono font-bold text-[#059669]">
                    <span>NEW HIGH MATCH (94%)</span>
                    <span>1h ago</span>
                  </div>
                  <p className="text-[#334155]">
                    Razorpay Graduate Software Engineer (₹14.0 LPA) ingested via Greenhouse. Zero fees verified.
                  </p>
                </div>

                <div className="p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg flex flex-col gap-1">
                  <div className="flex justify-between font-mono font-bold text-[#64748b]">
                    <span>CRAWLER HEALTH</span>
                    <span>3h ago</span>
                  </div>
                  <p className="text-[#334155]">
                    All 42 scrapers active across Indian IT sectors with 100% crawl validity.
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsNotificationOpen(false)}
              className="w-full py-2 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#334155] rounded-lg text-xs font-semibold font-mono transition"
            >
              Close Alerts
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
