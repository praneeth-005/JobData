import React from 'react';
import { Search, MapPin, Building2, ExternalLink, Bookmark, CheckCircle2 } from 'lucide-react';

interface Props {
  onSelectJob: (jobId: string) => void;
}

export default function FindJobsPage({ onSelectJob }: Props) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-ink tracking-tight">Find Verified IT Jobs</h1>
        <p className="text-sm text-slate-secondary mt-1">
          Curated opportunities strictly matched with freshers, verified compensation, and direct application channels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Filter Rail */}
        <div className="p-4 bg-white border border-slate-border rounded-lg space-y-6 h-fit">
          <div className="flex justify-between items-center border-b border-slate-border pb-2">
            <span className="text-xs font-bold font-mono uppercase text-slate-ink">Filters</span>
            <span className="text-xs text-primary cursor-pointer hover:underline">Reset all</span>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-ink mb-2">JOB TYPE</div>
            <div className="space-y-1.5 text-xs text-slate-secondary">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-border text-primary" />
                <span>Full-Time (0 YOE)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-border text-primary" />
                <span>Paid Internship (&gt;₹5k)</span>
              </label>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-ink mb-2">INTERVIEW MODE</div>
            <div className="space-y-1.5 text-xs text-slate-secondary">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-border text-primary" />
                <span>Virtual / Online</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-border text-primary" />
                <span>Walk-in Drive</span>
              </label>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-ink mb-2">HUB LOCATION</div>
            <div className="space-y-1.5 text-xs text-slate-secondary">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-border text-primary" />
                <span>Hyderabad</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-border text-primary" />
                <span>Bengaluru</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-border text-primary" />
                <span>Pune</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-border text-primary" />
                <span>Remote - India</span>
              </label>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-ink mb-2">COMPENSATION</div>
            <div className="space-y-1.5 text-xs text-slate-secondary">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-border text-primary" />
                <span>₹3.5 - ₹5.0 LPA</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-border text-primary" />
                <span>₹5.0 - ₹12.0 LPA</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-border text-primary" />
                <span>₹12.0 LPA+</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Job Cards List */}
        <div className="md:col-span-3 space-y-4">
          {/* Card 1 */}
          <div className="p-5 bg-white border border-slate-border rounded-lg space-y-3 hover:border-slate-400 transition">
            <div className="flex items-start justify-between">
              <div>
                <h3 
                  onClick={() => onSelectJob('job-2')}
                  className="text-base font-bold text-slate-ink hover:text-primary cursor-pointer"
                >
                  Graduate Software Engineer (Backend)
                </h3>
                <div className="text-xs text-slate-secondary mt-0.5">
                  Razorpay • Bengaluru (Hybrid) • 0 Yrs (2024 / 2025)
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold font-mono text-slate-ink">₹14.0 LPA</div>
                <div className="text-xs text-slate-muted">Verified CTC</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {['Go / Golang', 'Java 17', 'Distributed Systems', 'Kafka', 'MySQL'].map(t => (
                <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[11px] font-mono">{t}</span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <span className="text-emerald-700 font-medium">✓ Remotes Verified • Direct Portal</span>
              <button 
                onClick={() => onSelectJob('job-2')}
                className="px-4 py-1.5 bg-primary text-white rounded text-xs font-medium hover:bg-primary-hover transition"
              >
                Apply on Razorpay
              </button>
            </div>
          </div>

          {/* Card 2: Walkin */}
          <div className="p-5 bg-white border border-slate-border rounded-lg space-y-3 hover:border-slate-400 transition">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold font-mono bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                  🔴 WALK-IN DRIVE
                </span>
                <h3 
                  onClick={() => onSelectJob('job-1')}
                  className="text-base font-bold text-slate-ink hover:text-primary cursor-pointer mt-1"
                >
                  Associate QA Automation Engineer
                </h3>
                <div className="text-xs text-slate-secondary">LTIMindtree • Hyderabad • Physical Drive: Oct 25</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold font-mono text-slate-ink">₹4.5 LPA</div>
                <div className="text-xs text-slate-muted">Standard Band</div>
              </div>
            </div>

            <div className="p-2 bg-slate-50 border border-slate-border rounded text-xs text-slate-secondary">
              📍 Mindspace SEZ, Madhapur, Hyderabad - 10:00 AM IST - Direct Entry
            </div>

            <div className="flex flex-wrap gap-1.5">
              {['Selenium', 'Java & OOP', 'TestNG', 'Postman', 'SQL'].map(t => (
                <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[11px] font-mono">{t}</span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <span className="text-slate-muted font-mono">55% Resume Match • Ref / Fees Not Required</span>
              <button 
                onClick={() => onSelectJob('job-1')}
                className="px-4 py-1.5 bg-primary text-white rounded text-xs font-medium hover:bg-primary-hover transition"
              >
                View Official Circular
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
