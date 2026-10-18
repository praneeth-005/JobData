import React, { useState, useEffect } from 'react';
import DashboardPage from './pages/DashboardPage';
import FindJobsPage from './pages/FindJobsPage';
import SearchFilterJobsPage from './pages/SearchFilterJobsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import EligibilityExplanationPage from './pages/EligibilityExplanationPage';
import StatesAndFeedbackLibraryPage from './pages/StatesAndFeedbackLibraryPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ProfileOverviewPage from './pages/ProfileOverviewPage';
import EditProfilePage from './pages/EditProfilePage';
import JobPreferencesPage from './pages/JobPreferencesPage';
import JobSourcesPage from './pages/JobSourcesPage';
import CheckJobsPage from './pages/CheckJobsPage';
import RecentlyFoundJobsPage from './pages/RecentlyFoundJobsPage';

// Stitch 6 Interfaces: Resume Intelligence
import MyResumePage from './pages/MyResumePage';
import ResumeUploadPage from './pages/ResumeUploadPage';
import ResumeAnalysisOverviewPage from './pages/ResumeAnalysisOverviewPage';
import ResumeJobMatchPage from './pages/ResumeJobMatchPage';
import ResumeImprovementsPage from './pages/ResumeImprovementsPage';
import ResumeHistoryVersionsPage from './pages/ResumeHistoryVersionsPage';

import { UserProfile } from './types';
import { ResumeTab } from './components/ResumeSubNav';
// Stitch 5 Interfaces: Application Tracker & Pursuit Suite
import ApplicationTrackerKanbanPage from './pages/ApplicationTrackerKanbanPage';
import SavedJobsPage from './pages/SavedJobsPage';
import ApplicationDetailsTimelinePage from './pages/ApplicationDetailsTimelinePage';
import UpcomingActivitiesSchedulePage from './pages/UpcomingActivitiesSchedulePage';
import ApplicationDrawer from './components/ApplicationDrawer';

// Stitch 6 Interfaces: Notifications & Alerts Suite
import NotificationCenterPage from './pages/NotificationCenterPage';
import JobAlertsPage from './pages/JobAlertsPage';
import ApplicationRemindersPage from './pages/ApplicationRemindersPage';
import NotificationPreferencesPage from './pages/NotificationPreferencesPage';
import NotificationDeliveryStatesPage from './pages/NotificationDeliveryStatesPage';
import NotificationBellDropdown from './components/NotificationBellDropdown';
import { NotificationsTab } from './components/NotificationsSubNav';
import { NotificationItem } from './types';
import { TrackerTab } from './components/TrackerSubNav';
import { JobApplication, SavedJobItem } from './types';


export type Screen = 
  | 'OVERVIEW' 
  | 'FIND_JOBS' 
  | 'SEARCH_FILTER'
  | 'JOB_DETAILS' 
  | 'ELIGIBILITY_EXPLANATION'
  | 'STATES_FEEDBACK'
  | 'MY_PROFILE' 
  | 'EDIT_PROFILE' 
  | 'JOB_PREFERENCES' 
  | 'JOB_SOURCES'
  | 'CHECK_JOBS'
  | 'RECENTLY_FOUND'
  | 'APPLIED_KANBAN'
  | 'SAVED_JOBS'
  | 'APPLICATION_DETAILS'
  | 'SCHEDULE_HUB'
  | 'RESUME_HUB'
  | 'RESUME_UPLOAD'
  | 'RESUME_ANALYSIS'
  | 'RESUME_MATCHING'
  | 'RESUME_IMPROVEMENTS'
  | 'RESUME_VERSIONS'
  | 'SIGN_IN' 
  | 'SIGN_UP'
  | 'NOTIFICATION_CENTER'
  | 'JOB_ALERTS'
  | 'APPLICATION_REMINDERS'
  | 'NOTIFICATION_PREFERENCES'
  | 'NOTIFICATION_STATES';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('RESUME_HUB');
  const [selectedJobId, setSelectedJobId] = useState<string>('job-tw');
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  // Tracker Pursuit Suite State
  const [selectedApplicationId, setSelectedApplicationId] = useState<string>('app_tw_01');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerPrefillJob, setDrawerPrefillJob] = useState<SavedJobItem | null>(null);
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null);
  const [cachedSavedJobs, setCachedSavedJobs] = useState<SavedJobItem[]>([]);

  // Fetch saved jobs for prefill cache
  useEffect(() => {
    fetch('/api/v1/tracker/saved-jobs?userId=user_arjun')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.savedJobs) {
          setCachedSavedJobs(data.savedJobs);
        }
      })
      .catch(() => {});
  }, []);

  const handleTrackerTabNav = (tab: TrackerTab) => {
    setActiveScreen(tab as Screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Notification Suite State & Pre-seeded Caches (0ms instant load)
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(3);

  useEffect(() => {
    fetch('/api/v1/notifications?userId=user_arjun')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.notifications) {
          setNotifications(data.notifications);
          setUnreadNotificationsCount(data.unreadCount ?? 3);
        }
      })
      .catch(() => {});
  }, []);

  const handleNotificationTabNav = (tab: NotificationsTab) => {
    setActiveScreen(tab as Screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadNotificationsCount(0);
    try {
      await fetch('/api/v1/notifications/mark-all-read?userId=user_arjun', { method: 'POST' });
    } catch (e) {}
  };

  const handleMarkAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadNotificationsCount((prev) => Math.max(0, prev - 1));
    try {
      await fetch(`/api/v1/notifications/${id}/read?userId=user_arjun`, { method: 'POST' });
    } catch (e) {}
  };


  // Discovery navigation state
  const [scanCompany, setScanCompany] = useState<string | undefined>(undefined);
  const [scanSourceId, setScanSourceId] = useState<string | undefined>(undefined);

  // Candidate Profile State (synchronized with MongoDB Atlas)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: 'Arjun Rao',
    email: 'arjun.rao@example.com',
    emailVerified: true,
    graduationYear: '2026',
    degree: 'B.Tech / B.E.',
    specialization: 'Computer Science & Engineering',
    collegeName: 'RV College of Engineering, Bengaluru',
    phone: '+91 98765 43210',
    cgpa: '8.65',
    skills: ['Java 21', 'Spring Boot', 'PostgreSQL', 'Apache Kafka', 'Docker', 'Git', 'JUnit 5'],
    targetRoles: ['Backend Developer', 'Software Engineer', 'Java Consultant', 'Microservices Engineer'],
    preferredLocations: ['Bengaluru', 'Hyderabad', 'Pune'],
    workModes: ['Hybrid', 'On-site'],
    employmentTypes: ['Full-time Direct Hire', 'Paid Technical Internships'],
    interviewPreference: 'online',
    workingDaysPreference: '5_days',
    salaryFloorLpa: 8.5,
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

  const navigateToEligibility = (jobId: string) => {
    setSelectedJobId(jobId);
    setActiveScreen('ELIGIBILITY_EXPLANATION');
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
        setUploadMessage('✓ Master Resume (Arjun_Rao_Resume_v2.1.pdf) analyzed! 14 verified skills synced.');
        setTimeout(() => {
          setUploadMessage(null);
          setIsResumeModalOpen(false);
          setActiveScreen('RESUME_HUB');
        }, 1500);
      }, 1000);
    }
  };

  const handleResumeTabNav = (tab: ResumeTab) => {
    setActiveScreen(tab as Screen);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          setActiveScreen('RESUME_HUB');
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
          setActiveScreen('RESUME_HUB');
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
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveScreen('RESUME_HUB')}>
              <div className="w-8 h-8 rounded-lg bg-[#4338ca] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                IT
              </div>
              <div>
                <div className="text-[13px] font-bold text-[#0f172a] tracking-tight leading-tight">
                  IT Career Partner
                </div>
                <div className="text-[10px] font-mono text-[#059669] uppercase font-bold">
                  2026 FRESHER SUITE
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
            
            {/* Group: RESUME INTELLIGENCE (Stitch 6 Interfaces) */}
            <div className="flex flex-col gap-1">
              <span className="px-2.5 text-[10px] font-mono uppercase tracking-wider text-[#4338ca] font-extrabold flex items-center justify-between">
                <span>RESUME INTELLIGENCE</span>
                <span className="text-[9px] bg-[#eef2ff] px-1.5 py-0.2 rounded font-bold">STITCH 6</span>
              </span>

              {/* 1. My Resume Hub */}
              <button 
                onClick={() => { setActiveScreen('RESUME_HUB'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition ${
                  activeScreen === 'RESUME_HUB'
                    ? 'bg-[#4338ca] text-white font-bold shadow-xs'
                    : 'hover:bg-[#f8fafc] text-[#334155]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px]">description</span>
                  <span>My Resume Hub</span>
                </div>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                  activeScreen === 'RESUME_HUB' ? 'bg-white/20 text-white' : 'bg-[#ecfdf5] text-[#059669]'
                }`}>
                  v2.1 Active
                </span>
              </button>

              {/* 2. Upload & Validate */}
              <button 
                onClick={() => { setActiveScreen('RESUME_UPLOAD'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition ${
                  activeScreen === 'RESUME_UPLOAD'
                    ? 'bg-[#4338ca] text-white font-bold shadow-xs'
                    : 'hover:bg-[#f8fafc] text-[#334155]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px]">upload_file</span>
                  <span>Upload &amp; Validate</span>
                </div>
                <span className="text-[10px] font-mono text-[#64748b]">PDF &lt; 5MB</span>
              </button>

              {/* 3. Analysis Overview */}
              <button 
                onClick={() => { setActiveScreen('RESUME_ANALYSIS'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition ${
                  activeScreen === 'RESUME_ANALYSIS'
                    ? 'bg-[#4338ca] text-white font-bold shadow-xs'
                    : 'hover:bg-[#f8fafc] text-[#334155]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px]">analytics</span>
                  <span>Analysis Overview</span>
                </div>
                <span className="text-[10px] font-mono bg-[#ecfdf5] text-[#059669] font-bold px-1.5 py-0.5 rounded">
                  91 ATS
                </span>
              </button>

              {/* 4. Job Matching */}
              <button 
                onClick={() => { setActiveScreen('RESUME_MATCHING'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition ${
                  activeScreen === 'RESUME_MATCHING'
                    ? 'bg-[#4338ca] text-white font-bold shadow-xs'
                    : 'hover:bg-[#f8fafc] text-[#334155]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px]">join_inner</span>
                  <span>Job Matching</span>
                </div>
                <span className="text-[10px] font-mono bg-[#faf5ff] text-[#9333ea] font-bold px-1.5 py-0.5 rounded">
                  94% Peak
                </span>
              </button>

              {/* 5. Actionable Improvements */}
              <button 
                onClick={() => { setActiveScreen('RESUME_IMPROVEMENTS'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition ${
                  activeScreen === 'RESUME_IMPROVEMENTS'
                    ? 'bg-[#4338ca] text-white font-bold shadow-xs'
                    : 'hover:bg-[#f8fafc] text-[#334155]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px]">auto_fix_high</span>
                  <span>Improvements</span>
                </div>
                <span className="text-[10px] font-mono bg-[#fffbeb] text-[#d97706] font-bold px-1.5 py-0.5 rounded">
                  5 XYZ
                </span>
              </button>

              {/* 6. Version History & Diffs */}
              <button 
                onClick={() => { setActiveScreen('RESUME_VERSIONS'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition ${
                  activeScreen === 'RESUME_VERSIONS'
                    ? 'bg-[#4338ca] text-white font-bold shadow-xs'
                    : 'hover:bg-[#f8fafc] text-[#334155]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px]">history</span>
                  <span>Version History</span>
                </div>
                <span className="text-[10px] font-mono text-[#64748b]">3 Logs</span>
              </button>
            </div>

            {/* Group: DISCOVERY */}
            <div className="flex flex-col gap-1">
              <span className="px-2.5 text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] font-bold">
                DISCOVERY & FEED
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
              </button>

              <button 
                onClick={() => { setActiveScreen('FIND_JOBS'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition ${
                  activeScreen === 'FIND_JOBS'
                    ? 'bg-[#eef2ff] text-[#4338ca] font-bold'
                    : 'hover:bg-[#f8fafc] text-[#334155]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px]">work</span>
                  <span>Find Jobs</span>
                </div>
                <span className="text-[10px] font-mono bg-[#ecfdf5] text-[#059669] px-1.5 py-0.5 rounded font-bold">
                  2026 Live
                </span>
              </button>

              <button 
                onClick={() => { setActiveScreen('SEARCH_FILTER'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition ${
                  activeScreen === 'SEARCH_FILTER'
                    ? 'bg-[#eef2ff] text-[#4338ca] font-bold'
                    : 'hover:bg-[#f8fafc] text-[#334155]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px]">search_insights</span>
                  <span>Company Search</span>
                </div>
                <span className="text-[10px] font-mono bg-[#eef2ff] text-[#4338ca] font-bold px-1.5 py-0.5 rounded">
                  IT
                </span>
              </button>

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
                <span className="text-[10px] font-mono text-[#64748b]">12 Portals</span>
              </button>

              <button 
                onClick={() => { setActiveScreen('CHECK_JOBS'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition ${
                  activeScreen === 'CHECK_JOBS'
                    ? 'bg-[#eef2ff] text-[#4338ca] font-bold'
                    : 'hover:bg-[#f8fafc] text-[#334155]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px]">travel_explore</span>
                  <span>Check for Jobs</span>
                </div>
                <span className="text-[10px] font-mono bg-[#ecfdf5] text-[#059669] font-bold px-1.5 py-0.5 rounded">
                  Scan
                </span>
              </button>

              <button 
                onClick={() => { setActiveScreen('RECENTLY_FOUND'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition ${
                  activeScreen === 'RECENTLY_FOUND'
                    ? 'bg-[#eef2ff] text-[#4338ca] font-bold'
                    : 'hover:bg-[#f8fafc] text-[#334155]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px]">history_edu</span>
                  <span>Recently Found</span>
                </div>
                <span className="text-[10px] font-mono bg-[#eef2ff] text-[#4338ca] font-bold px-1.5 py-0.5 rounded">
                  Real-time
                </span>
              </button>
            </div>

            {/* Group: APPLICATION & FIT */}
            <div className="flex flex-col gap-1">
              <span className="px-2.5 text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] font-bold">
                FIT &amp; EVALUATION
              </span>

              <button 
                onClick={() => { setActiveScreen('JOB_DETAILS'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition ${
                  activeScreen === 'JOB_DETAILS'
                    ? 'bg-[#eef2ff] text-[#4338ca] font-bold'
                    : 'hover:bg-[#f8fafc] text-[#334155]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px]">info</span>
                  <span>Job Details</span>
                </div>
              </button>

              <button 
                onClick={() => { setActiveScreen('ELIGIBILITY_EXPLANATION'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition ${
                  activeScreen === 'ELIGIBILITY_EXPLANATION'
                    ? 'bg-[#eef2ff] text-[#4338ca] font-bold'
                    : 'hover:bg-[#f8fafc] text-[#334155]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px]">rule</span>
                  <span>Eligibility Matrix</span>
                </div>
              </button>

              <button 
                onClick={() => { setActiveScreen('STATES_FEEDBACK'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition ${
                  activeScreen === 'STATES_FEEDBACK'
                    ? 'bg-[#eef2ff] text-[#4338ca] font-bold'
                    : 'hover:bg-[#f8fafc] text-[#334155]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px]">layers</span>
                  <span>States &amp; Feedback</span>
                </div>
              </button>
            </div>

            
            {/* Group: APPLICATION PURSUIT SUITE (Stitch 5 Interfaces) */}
            <div className="flex flex-col gap-1">
              <span className="px-2.5 text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] font-bold">
                APPLICATION PURSUIT
              </span>

              <button 
                onClick={() => { setActiveScreen('APPLIED_KANBAN'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition ${
                  activeScreen === 'APPLIED_KANBAN' || activeScreen === 'APPLICATION_DETAILS'
                    ? 'bg-[#4338ca] text-white font-bold shadow-xs'
                    : 'hover:bg-[#f8fafc] text-[#334155]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px]">view_kanban</span>
                  <span>Kanban Tracker</span>
                </div>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                  activeScreen === 'APPLIED_KANBAN' || activeScreen === 'APPLICATION_DETAILS'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#eef2ff] text-[#4338ca]'
                }`}>
                  5 Active
                </span>
              </button>

              <button 
                onClick={() => { setActiveScreen('SAVED_JOBS'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition ${
                  activeScreen === 'SAVED_JOBS'
                    ? 'bg-[#4338ca] text-white font-bold shadow-xs'
                    : 'hover:bg-[#f8fafc] text-[#334155]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px]">bookmark</span>
                  <span>Saved Jobs</span>
                </div>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                  activeScreen === 'SAVED_JOBS'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#ecfdf5] text-[#059669]'
                }`}>
                  2026 Direct
                </span>
              </button>

              <button 
                onClick={() => { setActiveScreen('SCHEDULE_HUB'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition ${
                  activeScreen === 'SCHEDULE_HUB'
                    ? 'bg-[#4338ca] text-white font-bold shadow-xs'
                    : 'hover:bg-[#f8fafc] text-[#334155]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px]">calendar_month</span>
                  <span>Schedule Hub</span>
                </div>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                  activeScreen === 'SCHEDULE_HUB'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#fef3c7] text-[#92400e]'
                }`}>
                  Interviews
                </span>
              </button>
            </div>

            {/* Group: ALERTS & NOTIFICATIONS (Stitch 6 Interfaces) */}
            <div className="flex flex-col gap-1">
              <span className="px-2.5 text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] font-bold">
                ALERTS &amp; INTELLIGENCE
              </span>

              <button 
                onClick={() => { setActiveScreen('NOTIFICATION_CENTER'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition ${
                  activeScreen === 'NOTIFICATION_CENTER'
                    ? 'bg-[#4338ca] text-white font-bold shadow-xs'
                    : 'hover:bg-[#f8fafc] text-[#334155]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px]">notifications</span>
                  <span>Notification Center</span>
                </div>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                  activeScreen === 'NOTIFICATION_CENTER'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#4338ca] text-white'
                }`}>
                  {unreadNotificationsCount} New
                </span>
              </button>

              <button 
                onClick={() => { setActiveScreen('JOB_ALERTS'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition ${
                  activeScreen === 'JOB_ALERTS'
                    ? 'bg-[#4338ca] text-white font-bold shadow-xs'
                    : 'hover:bg-[#f8fafc] text-[#334155]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px]">radar</span>
                  <span>Job Alerts</span>
                </div>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                  activeScreen === 'JOB_ALERTS'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#ecfdf5] text-[#059669]'
                }`}>
                  Active
                </span>
              </button>

              <button 
                onClick={() => { setActiveScreen('APPLICATION_REMINDERS'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition ${
                  activeScreen === 'APPLICATION_REMINDERS'
                    ? 'bg-[#4338ca] text-white font-bold shadow-xs'
                    : 'hover:bg-[#f8fafc] text-[#334155]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px]">alarm</span>
                  <span>Reminders Hub</span>
                </div>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                  activeScreen === 'APPLICATION_REMINDERS'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#fffbeb] text-[#d97706]'
                }`}>
                  1 Overdue
                </span>
              </button>

              <button 
                onClick={() => { setActiveScreen('NOTIFICATION_PREFERENCES'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition ${
                  activeScreen === 'NOTIFICATION_PREFERENCES'
                    ? 'bg-[#4338ca] text-white font-bold shadow-xs'
                    : 'hover:bg-[#f8fafc] text-[#334155]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px]">settings_alert</span>
                  <span>Alert Preferences</span>
                </div>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                  activeScreen === 'NOTIFICATION_PREFERENCES'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#f1f5f9] text-[#64748b]'
                }`}>
                  Channels
                </span>
              </button>

              <button 
                onClick={() => { setActiveScreen('NOTIFICATION_STATES'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition ${
                  activeScreen === 'NOTIFICATION_STATES'
                    ? 'bg-[#4338ca] text-white font-bold shadow-xs'
                    : 'hover:bg-[#f8fafc] text-[#334155]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px]">sync_saved_locally</span>
                  <span>Delivery &amp; States</span>
                </div>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                  activeScreen === 'NOTIFICATION_STATES'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#ecfdf5] text-[#059669]'
                }`}>
                  Sync
                </span>
              </button>
            </div>

            {/* Group: CANDIDATE CALIBRATION */}
            <div className="flex flex-col gap-1">
              <span className="px-2.5 text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] font-bold">
                CANDIDATE CALIBRATION
              </span>

              <button 
                onClick={() => { setActiveScreen('MY_PROFILE'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition ${
                  activeScreen === 'MY_PROFILE'
                    ? 'bg-[#eef2ff] text-[#4338ca] font-bold'
                    : 'hover:bg-[#f8fafc] text-[#334155]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px]">account_circle</span>
                  <span>Profile Overview</span>
                </div>
                <span className="text-[10px] font-mono bg-[#ecfdf5] text-[#0f766e] font-bold px-1.5 py-0.5 rounded">
                  2026 Grad
                </span>
              </button>

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
              </button>

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
              </button>
            </div>

          </div>

          {/* User profile footer card in sidebar */}
          <div className="p-3 border-t border-[#f1f5f9] bg-[#faf8ff]">
            <div 
              onClick={() => setActiveScreen('RESUME_HUB')}
              className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-white cursor-pointer transition"
            >
              <div className="w-8 h-8 rounded-full bg-[#4338ca] text-white font-bold text-xs flex items-center justify-center shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-[#0f172a] truncate">
                  {userProfile.fullName || 'Arjun Rao'}
                </div>
                <div className="text-[10px] font-mono text-[#059669] truncate">
                  2026 Batch • Master v2.1
                </div>
              </div>
              <span className="material-symbols-outlined text-[16px] text-[#94a3b8]">open_in_new</span>
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
                {activeScreen === 'RESUME_HUB' && 'Executive Master Resume (v2.1)'}
                {activeScreen === 'RESUME_UPLOAD' && 'Upload & Validation Center'}
                {activeScreen === 'RESUME_ANALYSIS' && 'Resume Analysis Overview'}
                {activeScreen === 'RESUME_MATCHING' && 'Resume-to-Job Matching Engine'}
                {activeScreen === 'RESUME_IMPROVEMENTS' && 'Actionable Improvements (Google XYZ Formula)'}
                {activeScreen === 'RESUME_VERSIONS' && 'Analysis History & Version Control'}
                {activeScreen === 'OVERVIEW' && 'Executive Workspace'}
                {activeScreen === 'FIND_JOBS' && 'Verified Opportunities (Discovery)'}
                {activeScreen === 'SEARCH_FILTER' && 'Search & Filter Jobs (Company Search)'}
                {activeScreen === 'JOB_DETAILS' && 'Job Architecture & Fit'}
                {activeScreen === 'ELIGIBILITY_EXPLANATION' && 'Eligibility & Match Matrix'}
                {activeScreen === 'STATES_FEEDBACK' && 'State Library & System Feedback'}
                {activeScreen === 'MY_PROFILE' && 'Candidate Overview'}
                {activeScreen === 'EDIT_PROFILE' && 'Edit Profile'}
                {activeScreen === 'JOB_PREFERENCES' && 'Role & Target Calibration'}
                {activeScreen === 'JOB_SOURCES' && 'Monitored Career Portals'}
                {activeScreen === 'CHECK_JOBS' && 'Check for New Jobs'}
                {activeScreen === 'RECENTLY_FOUND' && 'Recently Discovered'}
                {activeScreen === 'NOTIFICATION_CENTER' && 'Notification & Alert Center'}
                {activeScreen === 'JOB_ALERTS' && 'Job Alerts & Real-Time Telemetry'}
                {activeScreen === 'APPLICATION_REMINDERS' && 'Application Reminders & Deadlines'}
                {activeScreen === 'NOTIFICATION_PREFERENCES' && 'Notification & Channel Preferences'}
                {activeScreen === 'NOTIFICATION_STATES' && 'Notification Delivery & System States'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            
            {/* Quick Master Resume Action */}
            <button 
              onClick={() => setActiveScreen('RESUME_HUB')}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#eef2ff] hover:bg-[#e0e7ff] text-[#4338ca] rounded-md text-xs font-mono font-bold transition"
            >
              <span className="material-symbols-outlined text-[16px]">description</span>
              <span>My Resume (v2.1)</span>
            </button>

            {/* Notification Bell Dropdown (Stitch Interface 2) */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-1.5 text-[#64748b] hover:text-[#0f172a] rounded-lg transition"
                title="Notifications & Alerts"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                {unreadNotificationsCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-[#4338ca] ring-2 ring-white absolute top-1.5 right-1.5"></span>
                )}
              </button>

              <NotificationBellDropdown
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
                notifications={notifications}
                unreadCount={unreadNotificationsCount}
                onMarkAllAsRead={handleMarkAllRead}
                onMarkAsRead={handleMarkAsRead}
                onNavigateToCenter={() => {
                  setIsNotificationOpen(false);
                  setActiveScreen('NOTIFICATION_CENTER');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateToPreferences={() => {
                  setIsNotificationOpen(false);
                  setActiveScreen('NOTIFICATION_PREFERENCES');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSelectJob={(jobId) => {
                  setIsNotificationOpen(false);
                  setSelectedJobId(jobId);
                  setActiveScreen('JOB_DETAILS');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateToSchedule={() => {
                  setIsNotificationOpen(false);
                  setActiveScreen('SCHEDULE_HUB');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onCopyEmailTemplate={() => {
                  const tpl = `Subject: Polite Follow-up: Software Engineer Application - Arjun Rao (2026 Batch)\n\nDear Juspay Recruiting Team,\n\nI hope you are having a productive week.\n\nI am writing to politely follow up regarding the status of my application for the Software Engineer position submitted 8 business days ago. As a 2026 graduate specializing in backend systems (Java / Spring Boot), I remain very enthusiastic about contributing to Juspay's payments architecture.\n\nThank you for your time and guidance.\n\nWarm regards,\nArjun Rao\narjun.sharma2026@gmail.com | +91 98765 43210`;
                  navigator.clipboard?.writeText(tpl);
                }}
              />
            </div>

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

          {/* Stitch 6 Interfaces: Resume Intelligence */}
          {activeScreen === 'RESUME_HUB' && (
            <div className="p-4 sm:p-8">
              <MyResumePage onNavigateToTab={handleResumeTabNav} />
            </div>
          )}

          {activeScreen === 'RESUME_UPLOAD' && (
            <div className="p-4 sm:p-8">
              <ResumeUploadPage onNavigateToTab={handleResumeTabNav} />
            </div>
          )}

          {activeScreen === 'RESUME_ANALYSIS' && (
            <div className="p-4 sm:p-8">
              <ResumeAnalysisOverviewPage onNavigateToTab={handleResumeTabNav} />
            </div>
          )}

          {activeScreen === 'RESUME_MATCHING' && (
            <div className="p-4 sm:p-8">
              <ResumeJobMatchPage 
                onNavigateToTab={handleResumeTabNav} 
                onApplyJob={(id) => { setSelectedJobId(id); setActiveScreen('JOB_DETAILS'); }}
              />
            </div>
          )}

          {activeScreen === 'RESUME_IMPROVEMENTS' && (
            <div className="p-4 sm:p-8">
              <ResumeImprovementsPage onNavigateToTab={handleResumeTabNav} />
            </div>
          )}

          {activeScreen === 'RESUME_VERSIONS' && (
            <div className="p-4 sm:p-8">
              <ResumeHistoryVersionsPage onNavigateToTab={handleResumeTabNav} />
            </div>
          )}

          
          {/* Stitch 6 Interfaces: Notifications & Alerts Suite */}
          {activeScreen === 'NOTIFICATION_CENTER' && (
            <NotificationCenterPage
              onNavigateTab={handleNotificationTabNav}
              onSelectJob={(id) => {
                setSelectedJobId(id);
                setActiveScreen('JOB_DETAILS');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateToSchedule={() => {
                setActiveScreen('SCHEDULE_HUB');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateToApplications={() => {
                setActiveScreen('APPLIED_KANBAN');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateToResumeAnalysis={() => {
                setActiveScreen('RESUME_ANALYSIS');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateToPreferences={() => {
                setActiveScreen('NOTIFICATION_PREFERENCES');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {activeScreen === 'JOB_ALERTS' && (
            <JobAlertsPage
              onNavigateTab={handleNotificationTabNav}
              onSelectJob={(id) => {
                setSelectedJobId(id);
                setActiveScreen('JOB_DETAILS');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {activeScreen === 'APPLICATION_REMINDERS' && (
            <ApplicationRemindersPage
              onNavigateTab={handleNotificationTabNav}
              onNavigateToSchedule={() => {
                setActiveScreen('SCHEDULE_HUB');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateToApplications={(id) => {
                if (id) setSelectedApplicationId(id);
                setActiveScreen('APPLIED_KANBAN');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {activeScreen === 'NOTIFICATION_PREFERENCES' && (
            <NotificationPreferencesPage
              onNavigateTab={handleNotificationTabNav}
            />
          )}

          {activeScreen === 'NOTIFICATION_STATES' && (
            <NotificationDeliveryStatesPage
              onNavigateTab={handleNotificationTabNav}
              onNavigateToFindJobs={() => {
                setActiveScreen('FIND_JOBS');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {/* Stitch 5 Interfaces: Application Pursuit Suite */}
          {activeScreen === 'APPLIED_KANBAN' && (
            <ApplicationTrackerKanbanPage
              onSelectApplication={(id) => {
                setSelectedApplicationId(id);
                setActiveScreen('APPLICATION_DETAILS');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenAddDrawer={() => {
                setDrawerPrefillJob(null);
                setEditingApplication(null);
                setIsDrawerOpen(true);
              }}
              onNavigateTab={handleTrackerTabNav}
            />
          )}

          {activeScreen === 'SAVED_JOBS' && (
            <SavedJobsPage
              onOpenAddDrawerWithJob={(job) => {
                setDrawerPrefillJob(job);
                setEditingApplication(null);
                setIsDrawerOpen(true);
              }}
              onOpenAddDrawer={() => {
                setDrawerPrefillJob(null);
                setEditingApplication(null);
                setIsDrawerOpen(true);
              }}
              onNavigateTab={handleTrackerTabNav}
              onNavigateToFindJobs={() => setActiveScreen('FIND_JOBS')}
            />
          )}

          {activeScreen === 'APPLICATION_DETAILS' && (
            <ApplicationDetailsTimelinePage
              applicationId={selectedApplicationId}
              onBack={() => {
                setActiveScreen('APPLIED_KANBAN');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenEditDrawer={(app) => {
                setEditingApplication(app);
                setIsDrawerOpen(true);
              }}
              onNavigateTab={handleTrackerTabNav}
              onNavigateToResumeAnalysis={() => setActiveScreen('RESUME_ANALYSIS')}
            />
          )}

          {activeScreen === 'SCHEDULE_HUB' && (
            <UpcomingActivitiesSchedulePage
              onOpenAddDrawer={() => {
                setDrawerPrefillJob(null);
                setEditingApplication(null);
                setIsDrawerOpen(true);
              }}
              onNavigateTab={handleTrackerTabNav}
            />
          )}

          {/* Existing App Pages */}
          {activeScreen === 'OVERVIEW' && (
            <DashboardPage 
              onSelectJob={navigateToJob} 
              onNavigateToFindJobs={() => setActiveScreen('FIND_JOBS')} 
            />
          )}

          {activeScreen === 'FIND_JOBS' && (
            <FindJobsPage 
              onSelectJob={navigateToJob} 
              onNavigateToSearchFilter={() => setActiveScreen('SEARCH_FILTER')}
              onNavigateToEligibility={navigateToEligibility}
            />
          )}

          {activeScreen === 'SEARCH_FILTER' && (
            <SearchFilterJobsPage 
              onSelectJob={navigateToJob}
              onNavigateToEligibility={navigateToEligibility}
            />
          )}

          {activeScreen === 'JOB_DETAILS' && (
            <JobDetailsPage 
              jobId={selectedJobId} 
              onBack={() => setActiveScreen('FIND_JOBS')} 
              onNavigateToEligibility={navigateToEligibility}
            />
          )}

          {activeScreen === 'ELIGIBILITY_EXPLANATION' && (
            <EligibilityExplanationPage 
              jobId={selectedJobId}
              onBack={() => setActiveScreen('JOB_DETAILS')}
              onSelectJob={navigateToJob}
            />
          )}

          {activeScreen === 'STATES_FEEDBACK' && (
            <StatesAndFeedbackLibraryPage 
              onNavigateToFindJobs={() => setActiveScreen('FIND_JOBS')}
              onNavigateToSources={() => setActiveScreen('JOB_SOURCES')}
            />
          )}

          {activeScreen === 'JOB_SOURCES' && (
            <JobSourcesPage 
              onNavigateToCheckJobs={handleStartScanForCompany}
              onNavigateToFeed={() => setActiveScreen('RECENTLY_FOUND')}
            />
          )}

          {activeScreen === 'CHECK_JOBS' && (
            <CheckJobsPage 
              initialCompanyName={scanCompany}
              initialSourceId={scanSourceId}
              onNavigateToFeed={() => setActiveScreen('RECENTLY_FOUND')}
              onNavigateToSources={() => setActiveScreen('JOB_SOURCES')}
            />
          )}

          {activeScreen === 'RECENTLY_FOUND' && (
            <RecentlyFoundJobsPage 
              onSelectJob={navigateToJob}
              onNavigateToFindJobs={() => setActiveScreen('FIND_JOBS')}
              onNavigateToSources={() => setActiveScreen('JOB_SOURCES')}
            />
          )}

          {activeScreen === 'MY_PROFILE' && (
            <ProfileOverviewPage 
              profile={userProfile}
              onNavigateToEditProfile={() => setActiveScreen('EDIT_PROFILE')}
              onNavigateToPreferences={() => setActiveScreen('JOB_PREFERENCES')}
              onNavigateToDashboard={() => setActiveScreen('RESUME_HUB')}
            />
          )}

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

      
      {/* Slide-over Drawer: Add & Edit Application Pursuit */}
      <ApplicationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSaved={(newApp) => {
          setIsDrawerOpen(false);
          setSelectedApplicationId(newApp.id);
          setActiveScreen('APPLICATION_DETAILS');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedJobs={cachedSavedJobs}
        prefillJob={drawerPrefillJob}
        editingApplication={editingApplication}
      />

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
              <span className="text-[11px] font-mono text-[#94a3b8] mt-1">PDF or DOCX up to 5MB</span>
              <input type="file" accept=".pdf,.docx,.doc" className="hidden" onChange={handleFileUpload} />
            </label>

            {uploadMessage && (
              <div className="p-2.5 bg-[#ecfdf5] border border-[#a7f3d0] text-[#059669] rounded-lg text-xs font-mono">
                {uploadMessage}
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-[#f1f5f9]">
              <button
                onClick={() => {
                  setIsResumeModalOpen(false);
                  setActiveScreen('RESUME_UPLOAD');
                }}
                className="text-xs font-bold text-[#4338ca] hover:underline"
              >
                Go to Advanced Validation Center →
              </button>
              <span className="text-[10px] font-mono text-[#059669] font-bold">Private Storage Enclave</span>
            </div>
          </div>
        </div>
      )}

      {/* Drawer: Notifications replaced by NotificationBellDropdown */}

    </div>
  );
}
