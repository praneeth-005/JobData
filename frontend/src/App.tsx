import React, { useState } from 'react';
import { 
  Compass, 
  Briefcase, 
  FileText, 
  Building2, 
  Bell, 
  Sliders, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Search, 
  ExternalLink, 
  Bookmark, 
  ArrowRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import DashboardPage from './pages/DashboardPage';
import FindJobsPage from './pages/FindJobsPage';
import JobDetailsPage from './pages/JobDetailsPage';

export type ActiveScreen = 'DASHBOARD' | 'FIND_JOBS' | 'JOB_DETAILS';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('DASHBOARD');
  const [selectedJobId, setSelectedJobId] = useState<string>('job-1');

  const navigateToJob = (jobId: string) => {
    setSelectedJobId(jobId);
    setActiveScreen('JOB_DETAILS');
  };

  return (
    <div className="min-h-screen flex bg-canvas text-slate-ink font-sans">
      {/* Left Sidebar */}
      <aside className="w-64 border-r border-slate-border bg-white flex flex-col justify-between shrink-0">
        <div>
          {/* Brand */}
          <div className="p-5 border-b border-slate-border flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg">
              IT
            </div>
            <div>
              <div className="font-semibold text-sm tracking-tight text-slate-ink">IT Career Partner</div>
              <div className="text-[11px] font-mono text-slate-muted">ENG | IND v1.0</div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="p-3 space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold tracking-wider text-slate-muted uppercase font-mono">
              Discovery
            </div>
            <button 
              onClick={() => setActiveScreen('DASHBOARD')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${
                activeScreen === 'DASHBOARD' ? 'bg-primary text-white' : 'text-slate-secondary hover:bg-slate-100'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Dashboard</span>
              <span className="ml-auto text-[10px] font-mono bg-white/20 px-1.5 py-0.5 rounded">LIVE</span>
            </button>

            <button 
              onClick={() => setActiveScreen('FIND_JOBS')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${
                activeScreen === 'FIND_JOBS' ? 'bg-primary text-white' : 'text-slate-secondary hover:bg-slate-100'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Find Verified Jobs</span>
              <span className="ml-auto text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">18</span>
            </button>

            <div className="pt-4 px-3 py-2 text-[11px] font-bold tracking-wider text-slate-muted uppercase font-mono">
              Intelligence
            </div>
            <button 
              onClick={() => setActiveScreen('JOB_DETAILS')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${
                activeScreen === 'JOB_DETAILS' ? 'bg-primary text-white' : 'text-slate-secondary hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Job Details & AI Match</span>
              <span className="ml-auto text-[10px] font-mono bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold">Preview</span>
            </button>
          </div>
        </div>

        {/* User Badge */}
        <div className="p-4 border-t border-slate-border bg-slate-50 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
            AR
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-semibold text-slate-ink truncate">Arjun Rao</div>
            <div className="text-[11px] font-mono text-slate-muted">2024 Grad • Floor: ≥2.4 LPA</div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-border bg-white px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 w-96">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-muted" />
              <input 
                type="text" 
                placeholder="Search roles, companies, tech stacks... (Cmd+K)" 
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-border rounded-md focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              Crawlers Active • Zero Bond
            </span>
            <button className="px-3.5 py-1.5 rounded-md bg-primary text-white text-xs font-medium hover:bg-primary-hover transition">
              Upload Master Resume
            </button>
          </div>
        </header>

        {/* View Router */}
        <main className="flex-1 overflow-y-auto p-8">
          {activeScreen === 'DASHBOARD' && <DashboardPage onSelectJob={navigateToJob} />}
          {activeScreen === 'FIND_JOBS' && <FindJobsPage onSelectJob={navigateToJob} />}
          {activeScreen === 'JOB_DETAILS' && <JobDetailsPage jobId={selectedJobId} onBack={() => setActiveScreen('FIND_JOBS')} />}
        </main>
      </div>
    </div>
  );
}
