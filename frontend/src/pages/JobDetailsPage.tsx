import React, { useState } from 'react';

interface JobDetailsPageProps {
  jobId: string;
  onBack: () => void;
}

export default function JobDetailsPage({ jobId, onBack }: JobDetailsPageProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="w-full max-w-[1240px] mx-auto px-6 py-6 font-sans flex flex-col gap-5">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-20 right-8 z-50 bg-[#1e1b4b] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-mono">
          <span className="material-symbols-outlined text-[16px] text-[#10b981]">check_circle</span>
          <span>{toast}</span>
        </div>
      )}

      {/* Breadcrumb Navigation Bar */}
      <div className="flex items-center justify-between text-xs text-[#64748b]">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="hover:text-[#4338ca] font-medium flex items-center gap-1">
            <span>&lt; Find Jobs</span>
          </button>
          <span>/</span>
          <span className="text-[#0f172a] font-medium">Razorpay</span>
          <span>/</span>
          <span>RZP-2025-089</span>
        </div>

        <div className="flex items-center gap-1.5 text-[#059669] font-mono text-[11px] font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
          <span>Active &amp; Verified • Sync: 3m ago</span>
        </div>
      </div>

      {/* Hero Card */}
      <div className="bg-white rounded-xl border border-[#e8eaf6] p-6 shadow-2xs flex flex-col gap-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#0c2340] text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-xs">
              R
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-[#0f172a] tracking-tight">
                  Graduate Software Engineer (Backend)
                </h1>
                <span className="bg-[#ecfdf5] text-[#059669] text-[10.5px] font-mono font-semibold px-2 py-0.5 rounded">
                  CAMPUS DIRECT 2024
                </span>
              </div>
              <div className="text-sm font-semibold text-[#334155] mt-1">
                Razorpay Software Pvt. Ltd.
              </div>
              <div className="text-xs text-[#64748b] mt-0.5">
                Core Payments Transaction Processing Engine
              </div>
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-2 shrink-0">
            <div className="text-left md:text-right">
              <span className="text-2xl font-bold font-mono text-[#0f172a]">₹14.00 <span className="text-xs font-normal text-[#64748b]">LPA</span></span>
              <div className="text-[11px] font-mono text-[#64748b]">Fixed Base: ₹12.50 LPA</div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => { setIsSaved(!isSaved); showToast(isSaved ? 'Removed from saved' : 'Saved to your bookmarks'); }}
                className="h-8 px-3 rounded-lg border border-[#e2e8f0] hover:bg-[#f8fafc] text-xs font-medium text-[#334155] flex items-center gap-1.5 transition"
              >
                <span className="material-symbols-outlined text-[15px]">
                  {isSaved ? 'bookmark' : 'bookmark_border'}
                </span>
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>
              
              <button 
                onClick={() => window.print()}
                className="h-8 px-3 rounded-lg border border-[#e2e8f0] hover:bg-[#f8fafc] text-xs font-medium text-[#334155] flex items-center gap-1.5 transition"
              >
                <span className="material-symbols-outlined text-[15px]">print</span>
                <span>Print Spec</span>
              </button>

              <a 
                href="https://razorpay.com/careers"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 px-4 bg-[#4338ca] hover:bg-[#3730a3] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
              >
                <span>Apply on Portal</span>
                <span className="material-symbols-outlined text-[14px]">north_east</span>
              </a>
            </div>
          </div>

        </div>

        {/* 5-Cell Spec Strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-4 border-t border-[#f1f5f9] text-xs">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#94a3b8] block">ANNUAL CTC</span>
            <span className="font-bold text-[#0f172a] font-mono text-[12.5px]">₹14,00,000 / yr</span>
            <span className="text-[10.5px] text-[#059669] font-medium block">Guaranteed Base</span>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase text-[#94a3b8] block">ELIGIBILITY</span>
            <span className="font-bold text-[#0f172a] font-mono text-[12.5px]">Freshers (0 Yrs)</span>
            <span className="text-[10.5px] text-[#64748b] block">2024 / 2025 B.Tech / M.Tech</span>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase text-[#94a3b8] block">LOCATION</span>
            <span className="font-bold text-[#0f172a] text-[12.5px]">Bengaluru</span>
            <span className="text-[10.5px] text-[#64748b] block">Hybrid: 3 Days Office</span>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase text-[#94a3b8] block">INTERVIEW COST</span>
            <span className="font-bold text-[#059669] font-mono text-[12.5px]">₹0 (Zero Fees)</span>
            <span className="text-[10.5px] text-[#059669] block">Anti-Exploitation Verified</span>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase text-[#94a3b8] block">WORKING DAYS</span>
            <span className="font-bold text-[#0f172a] text-[12.5px]">5 Days / Week</span>
            <span className="text-[10.5px] text-[#64748b] block">General Day Shift</span>
          </div>
        </div>

      </div>

      {/* Dual-Score Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Score Card 1: PREFERENCE FIT */}
        <div className="bg-white rounded-xl border border-[#e8eaf6] p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748b] font-bold">
                PREFERENCE FIT
              </span>
              <span className="bg-[#ecfdf5] text-[#059669] text-[10.5px] font-mono font-bold px-2 py-0.5 rounded">
                HIGH SUITABILITY
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold font-mono text-[#0f172a]">92</span>
              <span className="text-xs font-mono text-[#64748b]">/ 100</span>
            </div>

            <div className="w-full bg-[#f1f5f9] rounded-full h-1.5 my-3 overflow-hidden">
              <div className="bg-[#059669] h-full rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2 text-xs">
            <div>
              <div className="flex justify-between font-medium text-[#334155] mb-0.5">
                <span>1. Compensation Benchmark</span>
                <span className="font-mono text-[#059669] font-bold">100%</span>
              </div>
              <p className="text-[11px] text-[#64748b]">
                Offers ₹14.0 LPA vs your minimum preference of ₹2.40 LPA.
              </p>
            </div>

            <div>
              <div className="flex justify-between font-medium text-[#334155] mb-0.5">
                <span>2. Geographic Match (BLR)</span>
                <span className="font-mono text-[#059669] font-bold">90%</span>
              </div>
              <p className="text-[11px] text-[#64748b]">
                Matches your primary preferred location. Hybrid 3-day policy fits preferences.
              </p>
            </div>

            <div>
              <div className="flex justify-between font-medium text-[#334155] mb-0.5">
                <span>3. Zero-Bond Guarantee</span>
                <span className="font-mono text-[#059669] font-bold">100% (PASSED)</span>
              </div>
              <p className="text-[11px] text-[#64748b]">
                Verified 0-cost onboarding with no exit bonds.
              </p>
            </div>
          </div>
        </div>

        {/* Score Card 2: QUALIFICATION FIT */}
        <div className="bg-white rounded-xl border border-[#e8eaf6] p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748b] font-bold">
                QUALIFICATION FIT
              </span>
              <span className="bg-[#eef2ff] text-[#4338ca] text-[10.5px] font-mono font-bold px-2 py-0.5 rounded">
                STRONG FIT
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold font-mono text-[#0f172a]">85</span>
              <span className="text-xs font-mono text-[#64748b]">/ 100</span>
            </div>

            <div className="w-full bg-[#f1f5f9] rounded-full h-1.5 my-3 overflow-hidden">
              <div className="bg-[#4338ca] h-full rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2 text-xs">
            <div>
              <div className="flex justify-between font-medium text-[#334155] mb-0.5">
                <span>1. Hard-Skill Syntax Alignment</span>
                <span className="font-mono text-[#4338ca] font-bold">88%</span>
              </div>
              <p className="text-[11px] text-[#64748b]">
                Java 17, Go, Spring Boot matches your Master Resume projects.
              </p>
            </div>

            <div>
              <div className="flex justify-between font-medium text-[#334155] mb-0.5">
                <span>2. Technical Coursework / Degree</span>
                <span className="font-mono text-[#4338ca] font-bold">High Priority</span>
              </div>
              <p className="text-[11px] text-[#64748b]">
                BE/B.Tech in CS/IT. Graduation 2024/2025 meets exact gate.
              </p>
            </div>

            <div>
              <div className="flex justify-between font-medium text-[#334155] mb-0.5">
                <span>3. Code Ownership Gap</span>
                <span className="font-mono text-[#dc2626] font-bold">Action Needed</span>
              </div>
              <p className="text-[11px] text-[#64748b]">
                Missing direct Kafka in production. Frame as messaging queues in projects.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Explainable Evidence Breakdown (3 Columns) */}
      <div className="bg-white rounded-xl border border-[#e8eaf6] p-6 shadow-2xs flex flex-col gap-4">
        <div>
          <h2 className="text-base font-bold text-[#0f172a]">
            Explainable Evidence Breakdown
          </h2>
          <p className="text-xs text-[#64748b] mt-0.5">
            Transparent review of how your Master Resume projects &amp; skills match Razorpay&apos;s direct JD requisites.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Column 1: STRONG MATCHES */}
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#166534]">STRONG MATCHES (4 Found)</span>
              <span className="text-[10.5px] font-mono font-bold text-[#166534] bg-white px-1.5 py-0.5 rounded">
                +45 pts impact
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="bg-white p-2.5 rounded-lg border border-[#bbf7d0] text-xs">
                <div className="flex justify-between font-bold text-[#0f172a]">
                  <span>Core Java &amp; OOP Purity</span>
                  <span className="text-[#166534] font-mono">+15</span>
                </div>
                <p className="text-[11px] text-[#64748b] mt-0.5">
                  Demonstrated via Student Portal &amp; E-Commerce API repos.
                </p>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-[#bbf7d0] text-xs">
                <div className="flex justify-between font-bold text-[#0f172a]">
                  <span>REST API Construction</span>
                  <span className="text-[#166534] font-mono">+12</span>
                </div>
                <p className="text-[11px] text-[#64748b] mt-0.5">
                  Clean endpoints with Spring Boot &amp; Swagger documentation.
                </p>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-[#bbf7d0] text-xs">
                <div className="flex justify-between font-bold text-[#0f172a]">
                  <span>MySQL &amp; Transactions</span>
                  <span className="text-[#166534] font-mono">+10</span>
                </div>
                <p className="text-[11px] text-[#64748b] mt-0.5">
                  ACID adherence verified in database capstone project.
                </p>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-[#bbf7d0] text-xs">
                <div className="flex justify-between font-bold text-[#0f172a]">
                  <span>Strict Fresher Eligibility</span>
                  <span className="text-[#166534] font-mono">+8</span>
                </div>
                <p className="text-[11px] text-[#64748b] mt-0.5">
                  2024 graduate batch satisfies recruitment criteria.
                </p>
              </div>
            </div>
          </div>

          {/* Column 2: MISSING / PREREQUISITES */}
          <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#991b1b]">MISSING / PREREQUISITES (2 Items)</span>
              <span className="text-[10.5px] font-mono font-bold text-[#991b1b] bg-white px-1.5 py-0.5 rounded">
                -15 pts
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="bg-white p-2.5 rounded-lg border border-[#fecaca] text-xs">
                <div className="flex justify-between font-bold text-[#0f172a]">
                  <span>Apache Kafka</span>
                  <span className="text-[#991b1b] font-mono">-10</span>
                </div>
                <p className="text-[11px] text-[#64748b] mt-0.5">
                  High frequency streaming mentioned in JD. Resume shows Celery/Redis but lacks Kafka.
                </p>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-[#fecaca] text-xs">
                <div className="flex justify-between font-bold text-[#0f172a]">
                  <span>Docker Production Specs</span>
                  <span className="text-[#991b1b] font-mono">-5</span>
                </div>
                <p className="text-[11px] text-[#64748b] mt-0.5">
                  Multi-stage Docker build files not explicitly present in highlighted repositories.
                </p>
              </div>
            </div>
          </div>

          {/* Column 3: WEAK EVIDENCE */}
          <div className="bg-[#fffbeb] border border-[#fde68a] rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#92400e]">WEAK EVIDENCE (1 Item)</span>
              <span className="text-[10.5px] font-mono font-bold text-[#92400e] bg-white px-1.5 py-0.5 rounded">
                -5 pts
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="bg-white p-2.5 rounded-lg border border-[#fde68a] text-xs">
                <div className="flex justify-between font-bold text-[#0f172a]">
                  <span>System Co-habitation</span>
                  <span className="text-[#92400e] font-mono">-5</span>
                </div>
                <p className="text-[11px] text-[#64748b] mt-0.5">
                  Microservices architecture mentioned, but candidate projects are modular monoliths.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Special Block: Honest Framing Guidance */}
        <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl p-4 flex flex-col gap-3 mt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#1e40af] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">psychology</span>
              Honest Framing Guidance (Zero-Hallucination Advice)
            </span>
            <span className="text-[11px] font-mono text-[#1e40af]">Ethical Interview Readiness</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded-lg border border-[#bfdbfe] text-xs flex flex-col justify-between gap-2">
              <div>
                <span className="font-bold text-[#0f172a] block mb-1">1. MESSAGING QUEUES</span>
                <p className="text-[11px] text-[#475569] leading-relaxed">
                  Frame RabbitMQ/Redis tasks as foundational event-driven principles. Do NOT claim 2+ years of Kafka.
                </p>
              </div>
              <span className="font-mono text-[10.5px] text-[#4338ca] font-semibold">
                Cite: Project 2 (Task Queue)
              </span>
            </div>

            <div className="bg-white p-3 rounded-lg border border-[#bfdbfe] text-xs flex flex-col justify-between gap-2">
              <div>
                <span className="font-bold text-[#0f172a] block mb-1">2. DATABASE TUNING</span>
                <p className="text-[11px] text-[#475569] leading-relaxed">
                  Emphasize your schema design and indexing in MySQL rather than distributed caching.
                </p>
              </div>
              <span className="font-mono text-[10.5px] text-[#4338ca] font-semibold">
                Cite: Project 1 (E-commerce)
              </span>
            </div>

            <div className="bg-white p-3 rounded-lg border border-[#bfdbfe] text-xs flex flex-col justify-between gap-2">
              <div>
                <span className="font-bold text-[#0f172a] block mb-1">3. DISTRIBUTED SYSTEMS</span>
                <p className="text-[11px] text-[#475569] leading-relaxed">
                  Highlight your academic concurrency and multithreading coursework honestly.
                </p>
              </div>
              <span className="font-mono text-[10.5px] text-[#4338ca] font-semibold">
                Cite: CS301 Operating Systems
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Epistemic Truth Matrix (6 Cards) */}
      <div className="bg-white rounded-xl border border-[#e8eaf6] p-6 shadow-2xs flex flex-col gap-4">
        <div>
          <h2 className="text-base font-bold text-[#0f172a]">
            Epistemic Truth Matrix
          </h2>
          <p className="text-xs text-[#64748b] mt-0.5">
            Strict distinction between validated facts from JD vs. inferences and unknown attributes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          
          {/* Card 1 */}
          <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] flex flex-col justify-between gap-2">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-[#64748b] font-bold">COMPENSATION</span>
                <span className="bg-[#ecfdf5] text-[#059669] text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded">
                  VALIDATED
                </span>
              </div>
              <div className="font-bold text-[#0f172a] text-[12.5px] mt-1">
                ₹14,00,000 INR Base + Bonuses
              </div>
            </div>
            <span className="text-[10px] text-[#94a3b8] font-mono">Explicitly stated in Greenhouse spec</span>
          </div>

          {/* Card 2 */}
          <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] flex flex-col justify-between gap-2">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-[#64748b] font-bold">INCENTIVE CYCLE</span>
                <span className="bg-[#ecfdf5] text-[#059669] text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded">
                  VALIDATED
                </span>
              </div>
              <div className="font-bold text-[#0f172a] text-[12.5px] mt-1">
                Semi-Annual Performance Revision
              </div>
            </div>
            <span className="text-[10px] text-[#94a3b8] font-mono">Confirmed from compensation schedule</span>
          </div>

          {/* Card 3 */}
          <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] flex flex-col justify-between gap-2">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-[#64748b] font-bold">WORK MODEL</span>
                <span className="bg-[#ecfdf5] text-[#059669] text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded">
                  VALIDATED
                </span>
              </div>
              <div className="font-bold text-[#0f172a] text-[12.5px] mt-1">
                Hybrid (3 Days Office / 2 WFH)
              </div>
            </div>
            <span className="text-[10px] text-[#94a3b8] font-mono">Stated in Bangalore office guidelines</span>
          </div>

          {/* Card 4 */}
          <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] flex flex-col justify-between gap-2">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-[#64748b] font-bold">LAST INGESTION DATE</span>
                <span className="bg-[#fffbeb] text-[#d97706] text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded">
                  3H FRESH
                </span>
              </div>
              <div className="font-bold text-[#0f172a] text-[12.5px] mt-1">
                March 15, 2025
              </div>
            </div>
            <span className="text-[10px] text-[#94a3b8] font-mono">Timestamp verified via ATS webhook</span>
          </div>

          {/* Card 5 */}
          <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] flex flex-col justify-between gap-2">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-[#64748b] font-bold">INTERVIEW PROCESS</span>
                <span className="bg-[#eff6ff] text-[#2563eb] text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded">
                  INFERRED
                </span>
              </div>
              <div className="font-bold text-[#0f172a] text-[12.5px] mt-1">
                Online Coding + 2 Tech + 1 Bar Raiser
              </div>
            </div>
            <span className="text-[10px] text-[#94a3b8] font-mono">Derived from historical 2024 graduate hiring</span>
          </div>

          {/* Card 6 */}
          <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] flex flex-col justify-between gap-2">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-[#64748b] font-bold">PROBATION PERIOD</span>
                <span className="bg-[#f1f5f9] text-[#64748b] text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded">
                  UNKNOWN
                </span>
              </div>
              <div className="font-bold text-[#0f172a] text-[12.5px] mt-1">
                Not Disclosed (Estimated 6 Mo)
              </div>
            </div>
            <span className="text-[10px] text-[#94a3b8] font-mono">Unspecified in public job description</span>
          </div>

        </div>
      </div>

      {/* Verified Job Specification */}
      <div className="bg-white rounded-xl border border-[#e8eaf6] p-6 shadow-2xs flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#0f172a]">
            Verified Job Specification
          </h2>
          <button 
            onClick={() => alert("Report submitted. Our automated parser will re-crawl this Greenhouse posting.")}
            className="text-xs text-[#4338ca] hover:underline font-medium"
          >
            Report Error / Re-check
          </button>
        </div>

        <div className="flex flex-col gap-4 text-xs text-[#334155] leading-relaxed">
          <div>
            <h3 className="font-bold text-[#0f172a] mb-1.5">ABOUT THE ROLE</h3>
            <p className="text-[#64748b]">
              As a Graduate Software Engineer in Razorpay, you will be part of the core engineering organisation responsible for building high-scale, resilient and fault-tolerant payment infrastructures that power millions of transactions daily across India and Southeast Asia.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[#0f172a] mb-1.5">PRIMARY RESPONSIBILITIES</h3>
            <ul className="space-y-1.5 text-[#64748b]">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[15px] text-[#4338ca] shrink-0 mt-0.5">check_circle</span>
                <span>Design, develop, test, deploy, maintain and enhance software solutions using Go, Java 17, and MySQL.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[15px] text-[#4338ca] shrink-0 mt-0.5">check_circle</span>
                <span>Contribute to production systems optimization, low latency REST APIs, and event streaming pipelines using Kafka.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[15px] text-[#4338ca] shrink-0 mt-0.5">check_circle</span>
                <span>Collaborate with senior software engineering leaders on technical design proposals, automated testing, and CI/CD pipelines.</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-[#0f172a] mb-1.5">ELIGIBILITY &amp; REQUIREMENTS</h3>
            <ul className="space-y-1.5 text-[#64748b]">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[15px] text-[#059669] shrink-0 mt-0.5">verified</span>
                <span>B.E. / B.Tech / M.Tech in Computer Science, Information Technology, or allied branches (Graduation in 2024 or 2025).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[15px] text-[#059669] shrink-0 mt-0.5">verified</span>
                <span>Strong foundational command on Core Java or Go, Object-Oriented Design, Relational DBs (MySQL/PostgreSQL), and Data Structures.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[15px] text-[#059669] shrink-0 mt-0.5">verified</span>
                <span>Zero previous full-time experience required (Strictly Freshers Cadre).</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Engine Footer note */}
        <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-[11px] font-mono text-[#94a3b8]">
          <span>Analyzed Against: Master Resume (Arjun_Rao_2024.pdf)</span>
          <span>Latency: 240 ms Engine</span>
        </div>
      </div>

    </div>
  );
}
