import React from 'react';
import { ArrowUpRight, Calendar, MapPin, Building, ShieldCheck, Clock, ExternalLink } from 'lucide-react';

interface Props {
  onSelectJob: (jobId: string) => void;
}

export default function DashboardPage({ onSelectJob }: Props) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Greeting Banner */}
      <div>
        <h1 className="text-2xl font-bold text-slate-ink tracking-tight">Good morning, Arjun</h1>
        <p className="text-sm text-slate-secondary mt-1">
          18 fresher-verified opportunities match your master resume and non-negotiables today.
        </p>
      </div>

      {/* Top 4 Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-border rounded-lg">
          <div className="text-xs text-slate-muted font-medium uppercase font-mono">Qualified Roles</div>
          <div className="text-2xl font-bold font-mono text-slate-ink mt-1">18</div>
          <div className="mt-2 text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded inline-block">
            100% Verified Fresher
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-border rounded-lg">
          <div className="text-xs text-slate-muted font-medium uppercase font-mono">High Match (&gt;80%)</div>
          <div className="text-2xl font-bold font-mono text-primary mt-1">7</div>
          <div className="mt-2 text-[11px] font-mono text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded inline-block">
            Priority Fit
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-border rounded-lg">
          <div className="text-xs text-slate-muted font-medium uppercase font-mono">Walk-in Drives</div>
          <div className="text-2xl font-bold font-mono text-amber-700 mt-1">3</div>
          <div className="mt-2 text-[11px] font-mono text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded inline-block">
            Within 48h Window
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-border rounded-lg">
          <div className="text-xs text-slate-muted font-medium uppercase font-mono">Pipeline Tracking</div>
          <div className="text-2xl font-bold font-mono text-slate-ink mt-1">12</div>
          <div className="mt-2 text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded inline-block">
            3 Active Interviews
          </div>
        </div>
      </div>

      {/* Two Column Layout: Priority Feed + Right Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Priority Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-border pb-3">
            <div className="flex items-center gap-4">
              <button className="text-sm font-semibold text-primary border-b-2 border-primary pb-2">Top Matches (7)</button>
              <button className="text-sm text-slate-muted pb-2 hover:text-slate-ink">Physical Walk-ins (3)</button>
              <button className="text-sm text-slate-muted pb-2 hover:text-slate-ink">All Verified (18)</button>
            </div>
            <span className="text-xs text-slate-muted font-mono">Floor: &gt;= ₹2.4 LPA</span>
          </div>

          {/* Job Card 1: ThoughtWorks Walk-in */}
          <div className="p-5 bg-white border border-slate-border rounded-lg space-y-3 hover:border-slate-400 transition">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold font-mono bg-red-100 text-red-800 border border-red-200 px-2 py-0.5 rounded">
                  🔴 WALK-IN DRIVE • OCT 25
                </span>
                <h3 
                  onClick={() => onSelectJob('job-1')}
                  className="text-base font-bold text-slate-ink hover:text-primary cursor-pointer mt-1"
                >
                  Junior Software Engineer (Graduate Track)
                </h3>
                <div className="text-xs text-slate-secondary">ThoughtWorks Technologies • Hyderabad Hitec City Campus</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold font-mono text-slate-ink">₹8.5 LPA</div>
                <div className="text-xs text-emerald-700 font-mono font-semibold">92% Match</div>
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-border rounded text-xs text-slate-secondary">
              📍 <strong>Venue:</strong> Carry 2 hardcopy resumes &amp; Gov ID. Ascendas IT Park, 4th Flr, Madhapur, Hyderabad.
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {['B.Tech/MCA 2024', '0 Yrs Exp', 'Java', 'Data Structures', 'Clean Code'].map(t => (
                <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[11px] font-mono">{t}</span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-muted">Verified via Thoughtworks Portal</span>
              <button 
                onClick={() => onSelectJob('job-1')}
                className="px-3 py-1.5 bg-primary text-white rounded text-xs font-medium hover:bg-primary-hover transition"
              >
                Mark Attending / View Details
              </button>
            </div>
          </div>

          {/* Job Card 2: Razorpay Full-time */}
          <div className="p-5 bg-white border border-slate-border rounded-lg space-y-3 hover:border-slate-400 transition">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold font-mono bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                  VERIFIED FRESHER OPENING
                </span>
                <h3 
                  onClick={() => onSelectJob('job-2')}
                  className="text-base font-bold text-slate-ink hover:text-primary cursor-pointer mt-1"
                >
                  Graduate Software Engineer (Backend)
                </h3>
                <div className="text-xs text-slate-secondary">Razorpay Software Pvt. Ltd. • Bengaluru (Hybrid)</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold font-mono text-slate-ink">₹14.0 LPA</div>
                <div className="text-xs text-emerald-700 font-mono font-semibold">85% Match</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {['Go / Golang', 'Java 17', 'Distributed Systems', 'Kafka', 'MySQL'].map(t => (
                <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[11px] font-mono">{t}</span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-muted">Verified Direct Portal • 5 Days Work Week</span>
              <button 
                onClick={() => onSelectJob('job-2')}
                className="px-3 py-1.5 bg-primary text-white rounded text-xs font-medium hover:bg-primary-hover transition"
              >
                Analyze with My Resume
              </button>
            </div>
          </div>
        </div>

        {/* Right Rail: Portal Radar & Pipeline */}
        <div className="space-y-6">
          {/* Active Portal Radar */}
          <div className="p-4 bg-white border border-slate-border rounded-lg">
            <div className="flex items-center justify-between border-b border-slate-border pb-2">
              <span className="text-xs font-bold text-slate-ink uppercase font-mono">Active Portal Radar</span>
              <span className="text-xs text-primary font-medium cursor-pointer">+ Add</span>
            </div>
            <div className="mt-3 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-ink">Zoho Corporation</div>
                  <div className="text-slate-muted text-[11px]">Fresher QA &amp; SDET Track</div>
                </div>
                <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-amber-100 text-amber-800">Polling</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-ink">TCS Digital / Prime</div>
                  <div className="text-slate-muted text-[11px]">Target: ₹7.0 - 9.0 LPA</div>
                </div>
                <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-emerald-100 text-emerald-800">Window Open</span>
              </div>
            </div>
          </div>

          {/* Resume Gaps */}
          <div className="p-4 bg-white border border-slate-border rounded-lg">
            <div className="text-xs font-bold text-slate-ink uppercase font-mono">Resume High-Demand Gaps</div>
            <p className="text-xs text-slate-muted mt-1">Missing from your current master draft for &gt;₹8 LPA roles:</p>
            <div className="mt-3 space-y-2">
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-secondary">
                  <span>Docker &amp; Containers</span>
                  <span>62% demand</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1">
                  <div className="bg-primary h-1.5 rounded-full w-[62%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-secondary">
                  <span>PostgreSQL Indexing</span>
                  <span>41% demand</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1">
                  <div className="bg-primary h-1.5 rounded-full w-[41%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
