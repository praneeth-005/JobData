import React from 'react';
import { ArrowLeft, ExternalLink, ShieldCheck, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

interface Props {
  jobId: string;
  onBack: () => void;
}

export default function JobDetailsPage({ jobId, onBack }: Props) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-medium text-slate-secondary hover:text-primary transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Verified Openings
      </button>

      {/* Main Job Header Card */}
      <div className="p-6 bg-white border border-slate-border rounded-lg space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold font-mono bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
              VERIFIED FRESHER OPENING
            </span>
            <h1 className="text-xl font-bold text-slate-ink mt-2">Graduate Software Engineer (Backend)</h1>
            <div className="text-sm text-slate-secondary">Razorpay Software Pvt. Ltd. • Bengaluru, India (Hybrid)</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold font-mono text-slate-ink">₹14.00 LPA</div>
            <div className="text-xs text-emerald-700 font-medium">Verified Base CTC + Stocks</div>
          </div>
        </div>

        {/* Key Attributes Bar */}
        <div className="grid grid-cols-4 gap-4 p-3 bg-slate-50 border border-slate-border rounded-md text-xs font-mono">
          <div>
            <div className="text-slate-muted">EXPERIENCE</div>
            <div className="font-semibold text-slate-ink">0 Yrs (2024 / 2025)</div>
          </div>
          <div>
            <div className="text-slate-muted">WORKDAYS</div>
            <div className="font-semibold text-slate-ink">5 Days / Week</div>
          </div>
          <div>
            <div className="text-slate-muted">WORK MODE</div>
            <div className="font-semibold text-slate-ink">Hybrid (3 Office / 2 WFH)</div>
          </div>
          <div>
            <div className="text-slate-muted">INTERVIEW FORMAT</div>
            <div className="font-semibold text-slate-ink">3 Rounds - Virtual</div>
          </div>
        </div>
      </div>

      {/* DUAL SCORE SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Preference Fit (Job Match Score) */}
        <div className="p-5 bg-white border border-slate-border rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xs font-mono uppercase text-slate-muted">Preference Fit</div>
              <div className="text-lg font-bold text-slate-ink">Job Match Score</div>
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-700">92/100</div>
          </div>
          <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-secondary">Compensation Benchmark (&gt;₹2.4 LPA)</span>
              <span className="font-mono font-semibold text-emerald-700">100% Match</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-secondary">Geographic Location (Bengaluru)</span>
              <span className="font-mono font-semibold text-emerald-700">95% Match</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-secondary">Work Policy (Hybrid 5-day)</span>
              <span className="font-mono font-semibold text-emerald-700">85% Match</span>
            </div>
          </div>
        </div>

        {/* Qualification Fit (Resume Match Score) */}
        <div className="p-5 bg-white border border-slate-border rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xs font-mono uppercase text-slate-muted">Qualification Fit</div>
              <div className="text-lg font-bold text-slate-ink">Resume Match Score</div>
            </div>
            <div className="text-2xl font-bold font-mono text-primary">85/100</div>
          </div>
          <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-secondary">Hard Skill Relevance (Java, Go, SQL)</span>
              <span className="font-mono font-semibold text-primary">85% Match</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-secondary">Education Requirements (2024 Grad)</span>
              <span className="font-mono font-semibold text-primary">90% Match</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-secondary">Project Evidence Strength</span>
              <span className="font-mono font-semibold text-primary">75% Match</span>
            </div>
          </div>
        </div>
      </div>

      {/* EXPLAINABLE EVIDENCE BREAKDOWN */}
      <div className="p-6 bg-white border border-slate-border rounded-lg space-y-4">
        <h2 className="text-base font-bold text-slate-ink">Explainable Evidence Breakdown</h2>
        <p className="text-xs text-slate-secondary">
          Deep semantic comparison between target JD requirements and your master resume draft:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Strong Matches */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md">
            <div className="text-xs font-bold font-mono text-emerald-800 uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Strong Matches (4)
            </div>
            <ul className="mt-2 space-y-1 text-xs text-emerald-950">
              <li>• Core Java &amp; Collections (High)</li>
              <li>• REST API Architecture (High)</li>
              <li>• MySQL 8+ Optimization (Moderate)</li>
              <li>• Distributed Systems concepts (Fair)</li>
            </ul>
          </div>

          {/* Missing Prerequisites */}
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="text-xs font-bold font-mono text-red-800 uppercase flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5" /> Missing Prerequisites (2)
            </div>
            <ul className="mt-2 space-y-1 text-xs text-red-950">
              <li>• Apache Kafka (No direct mention)</li>
              <li>• Docker Production Deploy (Missing)</li>
            </ul>
          </div>

          {/* Weak Evidence */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
            <div className="text-xs font-bold font-mono text-amber-800 uppercase flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> Weak Evidence (1)
            </div>
            <ul className="mt-2 space-y-1 text-xs text-amber-950">
              <li>• Concurrency / Thread safety mentioned without project metrics</li>
            </ul>
          </div>
        </div>
      </div>

      {/* EPISTEMIC TRUTH MATRIX */}
      <div className="p-6 bg-white border border-slate-border rounded-lg space-y-3">
        <h2 className="text-base font-bold text-slate-ink">Epistemic Truth Matrix</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-2.5 bg-slate-50 border border-slate-border rounded">
            <div className="text-slate-muted">COMPENSATION</div>
            <div className="font-semibold text-slate-ink">₹14,00,000 INR Base</div>
            <span className="text-[10px] text-emerald-700 font-bold">✓ KNOWN FACT</span>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-border rounded">
            <div className="text-slate-muted">ELIGIBILITY</div>
            <div className="font-semibold text-slate-ink">2024 / 2025 Batches</div>
            <span className="text-[10px] text-emerald-700 font-bold">✓ KNOWN FACT</span>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-border rounded">
            <div className="text-slate-muted">WORKDAYS</div>
            <div className="font-semibold text-slate-ink">5 Days / Week</div>
            <span className="text-[10px] text-emerald-700 font-bold">✓ KNOWN FACT</span>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-border rounded">
            <div className="text-slate-muted">APPLICATION DEADLINE</div>
            <div className="font-semibold text-slate-ink">Nov 30, 2026</div>
            <span className="text-[10px] text-amber-700 font-bold">⚡ ESTIMATED</span>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-border rounded">
            <div className="text-slate-muted">INTERVIEW TIMELINE</div>
            <div className="font-semibold text-slate-ink">Assessment in 5 Days</div>
            <span className="text-[10px] text-slate-500 font-bold">? UNKNOWN</span>
          </div>
        </div>
      </div>
    </div>
  );
}
