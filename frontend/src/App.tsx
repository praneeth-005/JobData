import React, { useState, useEffect } from 'react';
import DashboardPage from './pages/DashboardPage';
import FindJobsPage from './pages/FindJobsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ProfileOverviewPage from './pages/ProfileOverviewPage';
import EditProfilePage from './pages/EditProfilePage';
import JobPreferencesPage from './pages/JobPreferencesPage';
import JobSourcesPage from './pages/JobSourcesPage';
import CheckJobsPage from './pages/CheckJobsPage';
import RecentlyFoundJobsPage from './pages/RecentlyFoundJobsPage';
import { UserProfile } from './types';

export type Screen = 
  | 'OVERVIEW' 
  | 'FIND_JOBS' 
  | 'JOB_DETAILS' 
  | 'MY_PROFILE' 
  | 'EDIT_PROFILE' 
  | 'JOB_PREFERENCES' 
  | 'JOB_SOURCES'
  | 'CHECK_JOBS'
  | 'RECENTLY_FOUND'
  | 'SIGN_IN' 
  | 'SIGN_UP';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('OVERVIEW');
  const [selectedJobId, setSelectedJobId] = useState<string>('job-rzp');
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  // Discovery navigation state
  const [scanCompany, setScanCompany] = useState<string | undefined>(undefined);
  const [scanSourceId, setScanSourceId] = useState<string | undefined>(undefined);

  // Candidate Profile State (synchronized with MongoDB Atlas)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: 'Arjun Rao',
    email: 'arjun@college.edu',
    emailVerified: true,
    graduationYear: '2025',
    degree: 'B.Tech / B.E.',
    specialization: 'Computer Science & Engineering',
    collegeName: 'RV College of Engineering, Bengaluru',
    phone: '98452 11094',
    cgpa: '8.4',
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'React', 'Git'],
    targetRoles: ['Backend Developer', 'Software Engineer', 'Java Developer', 'QA / Test Automation Engineer'],
    preferredLocations: ['Bengaluru', 'Hyderabad', 'Pune'],
    workModes: ['Hybrid', 'On-site'],
    employmentTypes: ['Full-time Direct Hire', 'Paid Technical Internships'],
    interviewPreference: 'online',
    workingDaysPreference: '5_days',
    salaryFloorLpa: 2.4,
  });

  // Fetch initial profile from MongoDB Atlas if available
  useEffect(() => {
    fetch('/api/v1/auth/profile', { credentials: 'include' })
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((json) => {
        if (json && json.data) {
          setUserProfile((prev) => ({
            ...prev,
            ...json.data,
            skills: json.data.skills?.length > 0 ? json.data.skills : prev.skills,
            targetRoles: json.data.targetRoles?.length > 0 ? json.data.targetRoles : prev.targetRoles,
            preferredLocations: json.data.preferredLocations?.length > 0 ? json.data.preferredLocations : prev.preferredLocations,
          }));
        }
      })
      .catch(() => {
        // Fallback to local default state
      });
  }, []);

  const navigateToJob = (jobId: string) => {
    setSelectedJobId(jobId);
    setActiveScreen('JOB_DETAILS');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartScanForCompany = (compName?: string, srcId?: string) => {
    setScanCompany(compName);
    setScanSourceId(srcId);
    setActiveScreen('CHECK_JOBS');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadMessage('Parsing master resume against 18 fresher specifications...');
      setTimeout(() => {
        setUploadMessage('✓ Master Resume (Arjun_Rao_2025.pdf) analyzed! 14 verified skills synced.');
        setTimeout(() => {
          setUploadMessage(null);
          setIsResumeModalOpen(false);
        }, 1800);
      }, 1000);
    }
  };

  // Standalone Auth views render without chrome
  if (activeScreen === 'SIGN_IN') {
    return (
      <SignInPage 
        onSignInSuccess={(user) => {
          setUserProfile((prev) => ({
            ...prev,
            fullName: user.name,
            email: user.email,
          }));
          setActiveScreen('OVERVIEW');
        }}
        onNavigateToSignUp={() => setActiveScreen('SIGN_UP')}
      />
    );
  }

  if (activeScreen === 'SIGN_UP') {
    return (
      <SignUpPage 
        onSignUpSuccess={(user) => {
          setUserProfile((prev) => ({
            ...prev,
            fullName: user.name,
            email: user.email,
          }));
          setActiveScreen('OVERVIEW');
        }}
        onNavigateToSignIn={() => setActiveScreen('SIGN_IN')}
      />
    );
  }

  const initials = userProfile.fullName
    ? userProfile.fullName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'AR';

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#0f172a] font-sans flex flex-col antialiased">
      
      {/* Sidebar (Fixed on Left, 240px wide on desktop; drawer on mobile) */}
      <aside className={`fixed left-0 top-0 h-screen w-60 bg-white border-r border-[#e8eaf6] z-50 flex flex-col justify-between shadow-xs transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        
        <div className="flex flex-col flex-1 min-h-0">
          
          {/* Logo Brand Header */}
          <div className="h-14 px-4 flex items-center justify-between border-b border-[#f1f5f9]">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveScreen('OVERVIEW')}>
              <div className="w-8 h-8 rounded-lg bg-[#4338ca] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                IT
              </div>
              <div>
                <div className="text-[13px] font-bold text-[#0f172a] tracking-tight leading-tight">
                  IT Career Partner
                </div>
                <div className="text-[10px] font-mono text-[#94a3b8] uppercase">
                  IND FRESHER v1.0
                </div>
              </div>
            </div>

            {/* Mobile close toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden text-[#94a3b8] hover:text-[#0f172a]"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Nav Items List */}
          <div className="p-3 flex flex-col gap-4 overflow-y-auto flex-1 text-xs font-medium text-[#64748b]">
            
            {/* Group: DISCOVERY */}
            <div className="flex flex-col gap-1">
              <span className="px-2.5 text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] font-bold">
                DISCOVERY
              </span>

              <button 
                onClick={() => { setActiveScreen('OVERVIEW'); setIsMobileMenuOpen(false); }}
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

              <button 
                onClick={() => { setActiveScreen('FIND_JOBS'); setIsMobileMenuOpen(false); }}
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
            </div>

            {/* Group: CONTINUOUS DISCOVERY (Stitch Interfaces) */}
            <div className="flex flex-col gap-1">
              <span className="px-2.5 text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] font-bold">
                SOURCES & DISCOVERY
              </span>

              {/* Interface 1: Job Sources */}
              <button 
                onClick={() => { setActiveScreen('JOB_SOURCES'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition ${
                  activeScreen === 'JOB_SOURCES'
                    ? 'bg-[#eef2ff] text-[#4338ca] font-bold'
                    : 'hover:bg-[#f8fafc] text-[#334155]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px]">hub</span>
                  <span>Job Sources</span>
                </div>
                <span className="text-[10px] font-mono bg-[#ecfdf5] text-[#0f766e] font-bold px-1.5 py-0.5 rounded">
                  14 Portals
                </span>
              </button>

              {/* Interface 2: Check for Jobs */}
              <button 
                onClick={() => { setActiveScreen('CHECK_JOBS'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition ${
                  activeScreen === 'CHECK_JOBS'
                    ? 'bg-[#eef2ff] text-[#4338ca] font-bold'
                    : 'hover:bg-[#f8fafc] text-[#334155]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px]">sync</span>
                  <span>Check for Jobs</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#0f766e] animate-pulse"></span>
              </button>

              {/* Interface 3: Recently Found */}
              <button 
                onClick={() => { setActiveScreen('RECENTLY_FOUND'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition ${
                  activeScreen === 'RECENTLY_FOUND'
                    ? 'bg-[#eef2ff] text-[#4338ca] font-bold'
                    : 'hover:bg-[#f8fafc] text-[#334155]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px]">auto_awesome</span>
                  <span>Recently Found</span>
                </div>
                <span className="text-[10px] font-mono bg-[#eef2ff] text-[#4338ca] font-bold px-1.5 py-0.5 rounded">
                  48 New
                </span>
              </button>
            </div>

            {/* Group: PROFILE & PREFERENCES */}
            <div className="flex flex-col gap-1">
              <span className="px-2.5 text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] font-bold">
                CANDIDATE CALIBRATION
              </span>

              {/* Profile Overview */}
              <button 
                onClick={() => { setActiveScreen('MY_PROFILE'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition ${
                  activeScreen === 'MY_PROFILE'
                    ? 'bg-[#eef2ff] text-[#4338ca] font-bold'
                    : 'hover:bg-[#f8fafc] text-[#334155]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px]">badge</span>
                  <span>Profile Overview</span>
                </div>
                <span className="text-[10px] font-mono bg-[#ecfdf5] text-[#0f766e] font-bold px-1.5 py-0.5 rounded">
                  Tier 1
                </span>
              </button>

              {/* Edit Profile */}
              <button 
                onClick={() => { setActiveScreen('EDIT_PROFILE'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition ${
                  activeScreen === 'EDIT_PROFILE'
                    ? 'bg-[#eef2ff] text-[#4338ca] font-bold'
                    : 'hover:bg-[#f8fafc] text-[#334155]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px]">edit_square</span>
                  <span>Edit Credentials</span>
                </div>
                <span className="text-[10px] font-mono text-[#64748b]">
                  {userProfile.skills?.length || 5} Stack
                </span>
              </button>

              {/* Job Preferences */}
              <button 
                onClick={() => { setActiveScreen('JOB_PREFERENCES'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition ${
                  activeScreen === 'JOB_PREFERENCES'
                    ? 'bg-[#eef2ff] text-[#4338ca] font-bold'
                    : 'hover:bg-[#f8fafc] text-[#334155]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px]">tune</span>
                  <span>Job Preferences</span>
                </div>
                <span className="text-[10px] font-mono bg-[#fffbeb] text-[#b45309] font-bold px-1.5 py-0.5 rounded">
                  &gt; ₹2.4L
                </span>
              </button>
            </div>

            {/* Group: INTELLIGENCE */}
            <div className="flex flex-col gap-1">
              <span className="px-2.5 text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] font-bold">
                INTELLIGENCE
              </span>

              <button 
                onClick={() => { setIsResumeModalOpen(true); setIsMobileMenuOpen(false); }}
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

              <button 
                onClick={() => { setActiveScreen('JOB_DETAILS'); setIsMobileMenuOpen(false); }}
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
            </div>

          </div>

          {/* Footer Candidate Status Bar */}
          <div className="p-3 border-t border-[#f1f5f9] bg-[#faf8ff]">
            <div className="p-2.5 rounded-lg bg-white border border-[#e2e8f0] flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
                <span className="text-[11px] font-bold font-mono text-[#059669]">READY TO RELOCATE</span>
              </div>
              <span className="text-[10px] font-mono text-[#64748b]">IND</span>
            </div>
          </div>

        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-60 flex flex-col min-h-screen">
        
        {/* Top Header Navigation */}
        <header className="h-14 bg-white/95 backdrop-blur-md border-b border-[#e8eaf6] sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-1.5 text-[#64748b] hover:text-[#0f172a] rounded-lg"
            >
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-[#64748b]">
              <span>/</span>
              <span className="font-bold text-[#0f172a]">
                {activeScreen === 'OVERVIEW' && 'Executive Workspace'}
                {activeScreen === 'FIND_JOBS' && 'Verified Opportunities'}
                {activeScreen === 'JOB_DETAILS' && 'Job Architecture & Fit'}
                {activeScreen === 'MY_PROFILE' && 'Candidate Overview'}
                {activeScreen === 'EDIT_PROFILE' && 'Edit Profile'}
                {activeScreen === 'JOB_PREFERENCES' && 'Role & Target Calibration'}
                {activeScreen === 'JOB_SOURCES' && 'Monitored Career Portals'}
                {activeScreen === 'CHECK_JOBS' && 'Check for New Jobs'}
                {activeScreen === 'RECENTLY_FOUND' && 'Recently Discovered'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            
            {/* Quick Upload Action */}
            <button 
              onClick={() => setIsResumeModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#334155] rounded-md text-xs font-mono font-medium transition"
            >
              <span className="material-symbols-outlined text-[16px] text-[#4338ca]">upload</span>
              <span>Upload Resume</span>
            </button>

            {/* Notification Bell */}
            <button 
              onClick={() => setIsNotificationOpen(true)}
              className="relative p-1.5 text-[#64748b] hover:text-[#0f172a] rounded-lg"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#dc2626]"></span>
            </button>

            {/* Avatar Pill */}
            <div 
              onClick={() => setActiveScreen('MY_PROFILE')}
              title="Click to view candidate profile"
              className="w-8 h-8 rounded-full bg-[#4338ca] text-white font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs hover:ring-2 hover:ring-[#4338ca]/30 transition"
            >
              {initials}
            </div>

          </div>

        </header>

        {/* Dynamic View Router */}
        <main className="flex-1 bg-[#faf8ff]">
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

          {/* Stitch Interface: Job Sources */}
          {activeScreen === 'JOB_SOURCES' && (
            <JobSourcesPage 
              onNavigateToCheckJobs={handleStartScanForCompany}
              onNavigateToFeed={() => setActiveScreen('RECENTLY_FOUND')}
            />
          )}

          {/* Stitch Interface: Check for Jobs */}
          {activeScreen === 'CHECK_JOBS' && (
            <CheckJobsPage 
              initialCompanyName={scanCompany}
              initialSourceId={scanSourceId}
              onNavigateToFeed={() => setActiveScreen('RECENTLY_FOUND')}
              onNavigateToSources={() => setActiveScreen('JOB_SOURCES')}
            />
          )}

          {/* Stitch Interface: Recently Found Jobs */}
          {activeScreen === 'RECENTLY_FOUND' && (
            <RecentlyFoundJobsPage 
              onSelectJob={navigateToJob}
              onNavigateToFindJobs={() => setActiveScreen('FIND_JOBS')}
              onNavigateToSources={() => setActiveScreen('JOB_SOURCES')}
            />
          )}

          {/* Profile Overview */}
          {activeScreen === 'MY_PROFILE' && (
            <ProfileOverviewPage 
              profile={userProfile}
              onNavigateToEditProfile={() => setActiveScreen('EDIT_PROFILE')}
              onNavigateToPreferences={() => setActiveScreen('JOB_PREFERENCES')}
              onNavigateToDashboard={() => setActiveScreen('OVERVIEW')}
            />
          )}

          {/* Edit Profile */}
          {activeScreen === 'EDIT_PROFILE' && (
            <EditProfilePage 
              profile={userProfile}
              onSaveSuccess={(updated) => {
                setUserProfile(updated);
                setActiveScreen('MY_PROFILE');
              }}
              onCancel={() => setActiveScreen('MY_PROFILE')}
            />
          )}

          {/* Job Preferences */}
          {activeScreen === 'JOB_PREFERENCES' && (
            <JobPreferencesPage 
              profile={userProfile}
              onSaveSuccess={(updated) => {
                setUserProfile(updated);
              }}
              onNavigateToOverview={() => setActiveScreen('MY_PROFILE')}
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
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-xs text-[#64748b] leading-relaxed">
              Upload your raw unembellished resume (PDF or DOCX). Our deterministic ATS parser will verify skills, calculate dual fit scores, and verify fresher eligibility.
            </p>

            <label className="border-2 border-dashed border-[#c7d2fe] hover:border-[#4338ca] bg-[#f8fafc] rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition">
              <span className="material-symbols-outlined text-4xl text-[#4338ca] mb-1">cloud_upload</span>
              <span className="text-xs font-bold text-[#0f172a]">Click or drag & drop resume file</span>
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
              <span>100% Privacy: Stored locally only, never sold to third parties.</span>
            </div>
          </div>
        </div>
      )}

      {/* Drawer: Notifications */}
      {isNotificationOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-sm h-full shadow-2xl border-l border-[#e2e8f0] flex flex-col justify-between p-5 animate-fade-in">
            <div>
              <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-[#4338ca]">notifications</span>
                  <h3 className="font-bold text-sm text-[#0f172a]">Operational Alerts (3)</h3>
                </div>
                <button onClick={() => setIsNotificationOpen(false)} className="text-[#94a3b8] hover:text-[#0f172a]">
                  <span className="material-symbols-outlined text-[20px]">close</span>
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
                    All 42 scrapers active across Indian IT hubs with 100% crawl validity.
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
