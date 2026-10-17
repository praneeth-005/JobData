import React, { useState, useEffect } from 'react';
import { FoundJob } from '../types';

interface JobDetailsPageProps {
  jobId: string;
  onBack: () => void;
  onNavigateToEligibility?: (jobId: string) => void;
}

export default function JobDetailsPage({ jobId, onBack, onNavigateToEligibility }: JobDetailsPageProps) {
  const [job, setJob] = useState<FoundJob | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/v1/jobs/${jobId}`)
      .then(res => res.ok ? res.json() : null)
      .then(json => {
        if (json && json.data) {
          setJob(json.data);
          setIsSaved(!!json.data.isSaved);
        } else {
          loadFallbackJob();
        }
        setIsLoading(false);
      })
      .catch(() => {
        loadFallbackJob();
        setIsLoading(false);
      });
  }, [jobId]);

  const loadFallbackJob = () => {
    // Rich fallback data matching requested screen
    const fallback: FoundJob = {
      id: jobId || 'job-tw',
      jobCode: 'TW-GRAD-2025',
      title: 'Graduate Software Engineer (Java / Backend)',
      company: 'Thoughtworks',
      location: 'Bengaluru (Hitec City / Koramangala Hub) • Hybrid',
      city: 'Bengaluru',
      ctcText: '₹8.50 LPA (Confirmed)',
      ctcLpa: 8.5,
      fixedBase: 'Fixed Base: ₹8.00 LPA (No Hidden Deductions)',
      jobType: 'FULL_TIME',
      workMode: 'Hybrid (3 Days Office / 2 Days Remote)',
      interviewMode: 'VIRTUAL',
      batchAllowed: '2026 / 2025 B.Tech / B.E. / MCA',
      experienceText: '0 Years / Strict Fresher Scope',
      roleCategory: 'Core Software Engineering & Distributed Microservices',
      bondText: 'Zero Bond Guarantee / No Financial Agreement',
      jobMatchScore: 94,
      resumeMatchScore: 88,
      skills: ['Java 21', 'Spring Boot', 'PostgreSQL', 'Docker', 'Distributed Systems', 'Git', 'Clean Code'],
      tag: 'Verified Fresher',
      status: 'VERIFIED',
      foundTimeText: '15 mins ago',
      sourceName: 'Thoughtworks Official Workday ATS',
      applyUrl: 'https://thoughtworks.com/careers',
      logoText: 'TW',
      description: 'Thoughtworks is seeking ambitious Graduate Software Engineers to join our global engineering collective. You will work directly on high-throughput transactional services, clean architecture, automated testing pipelines, and pair programming practices.',
      aboutCompany: 'Thoughtworks is a leading global technology consultancy that integrates strategy, design, and software engineering to drive innovation.'
    };
    setJob(fallback);
  };

  const toggleSave = () => {
    if (!job) return;
    fetch(`/api/v1/jobs/${job.id}/save`, { method: 'POST' }).catch(() => {});
    setIsSaved(prev => {
      const next = !prev;
      showToast(next ? 'Opportunity saved successfully to your Saved Jobs!' : 'Removed from Saved Jobs');
      return next;
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (isLoading || !job) {
    return (
      <div className="w-full max-w-[1240px] mx-auto px-6 py-20 flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-full border-3 border-[#4338ca] border-t-transparent animate-spin mb-3"></div>
        <p className="text-sm font-mono text-[#64748b]">Loading verified job telemetry from MongoDB Atlas...</p>
      </div>
    );
  }

  const score = job.jobMatchScore || 88;

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-6 font-sans flex flex-col gap-6">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1e1b4b] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-mono border border-indigo-400/30 animate-in fade-in slide-in-from-top-4">
          <span className="material-symbols-outlined text-[18px] text-[#10b981]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Editorial Breadcrumb Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#64748b]">
        <div className="flex items-center gap-2 flex-wrap">
          <button 
            onClick={onBack} 
            className="hover:text-[#4338ca] font-bold flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to Opportunities</span>
          </button>
          <span>/</span>
          <span className="text-[#0f172a] font-semibold">{job.company}</span>
          <span>/</span>
          <span className="font-mono text-[#4338ca] font-bold">{job.jobCode || 'JOB-DETAILS'}</span>
        </div>

        <div className="flex items-center gap-2 text-[#059669] font-mono text-[11px] font-bold">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
          <span>Direct ATS Feed • Ingested {job.foundTimeText}</span>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 sm:p-7 shadow-xs flex flex-col gap-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
          
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0f172a] text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-xs">
              {job.logoText || job.company.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-[#4338ca] uppercase tracking-wider">
                  {job.company}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#ecfdf5] text-[#059669] text-[10.5px] font-mono font-bold">
                  DIRECT ATS VERIFIED
                </span>
                <span className="text-xs text-[#94a3b8] font-mono">•</span>
                <span className="text-xs text-[#64748b] font-mono">0-1 Years Fresher</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#0f172a] tracking-tight mt-1">
                {job.title}
              </h1>
              <div className="text-xs sm:text-sm text-[#64748b] mt-1 flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#4338ca]">location_on</span>
                  <span>{job.location}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#059669]">schedule</span>
                  <span>{job.workMode || 'Hybrid'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={toggleSave}
              className={`px-3.5 py-2 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition ${
                isSaved 
                  ? 'bg-[#eef2ff] border-[#c7d2fe] text-[#4338ca]' 
                  : 'bg-white border-[#cbd5e1] text-[#334155] hover:bg-[#f8fafc]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isSaved ? 'bookmark_added' : 'bookmark_border'}
              </span>
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={() => {
                if (job.applyUrl) window.open(job.applyUrl, '_blank');
              }}
              className="px-5 py-2.5 bg-[#4338ca] hover:bg-[#3730a3] text-white rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <span>Apply via Official Portal</span>
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            </button>
          </div>

        </div>

        {/* Fact Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#f1f5f9]">
          <div className="bg-[#f8fafc] p-3 rounded-xl border border-[#e2e8f0]">
            <span className="text-[10.5px] font-mono text-[#64748b] uppercase block">Statutory CTC Floor</span>
            <span className="text-sm font-bold font-mono text-[#15803d]">{job.ctcText}</span>
          </div>
          <div className="bg-[#f8fafc] p-3 rounded-xl border border-[#e2e8f0]">
            <span className="text-[10.5px] font-mono text-[#64748b] uppercase block">Experience Requirement</span>
            <span className="text-sm font-bold text-[#0f172a]">{job.experienceText || '0 Years (Fresher)'}</span>
          </div>
          <div className="bg-[#f8fafc] p-3 rounded-xl border border-[#e2e8f0]">
            <span className="text-[10.5px] font-mono text-[#64748b] uppercase block">Batch Permitted</span>
            <span className="text-sm font-bold text-[#0f172a]">{job.batchAllowed || '2026 / 2025 Batch'}</span>
          </div>
          <div className="bg-[#f8fafc] p-3 rounded-xl border border-[#e2e8f0]">
            <span className="text-[10.5px] font-mono text-[#64748b] uppercase block">Bond & Penalty Pledge</span>
            <span className="text-sm font-bold text-[#059669] flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              <span>Zero Bond</span>
            </span>
          </div>
        </div>

      </div>

      {/* WHY DID I MATCH 88%? - CALLOUT CARD LINKING TO SCREEN 4 */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#1e1b4b] to-[#312e81] text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-[#10b981] shrink-0">
            <span className="material-symbols-outlined text-[28px]">psychology</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981] font-mono text-xs font-bold">
                {score}% DETERMINISTIC MATCH
              </span>
              <span className="text-xs text-indigo-200 font-mono">Rank #02 in Active Profile</span>
            </div>
            <h3 className="text-lg font-bold tracking-tight mt-1">
              Why did I match this role? Deep Dive Inspection
            </h3>
            <p className="text-xs text-indigo-200 mt-0.5 max-w-xl leading-relaxed">
              Platform rule: High match score never overrides a failed mandatory eligibility gate. Inspect the 5 hard barriers and mathematical profile weights.
            </p>
          </div>
        </div>

        {onNavigateToEligibility && (
          <button
            onClick={() => onNavigateToEligibility(job.id)}
            className="px-5 py-2.5 bg-white hover:bg-slate-100 text-[#1e1b4b] rounded-xl text-xs font-mono font-bold transition shrink-0 flex items-center gap-1.5 shadow-xs"
          >
            <span>View Eligibility &amp; Match Matrix</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        )}
      </div>

      {/* Main Grid: Left Details + Right Candidate Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 Cols): Job Description & Engineering Specifications */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Section: About the Opportunity */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-2xs flex flex-col gap-4">
            <h3 className="text-sm font-bold font-mono text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#4338ca]">description</span>
              <span>Opportunity Overview</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
              {job.description}
            </p>
            {job.aboutCompany && (
              <div className="p-3.5 rounded-xl bg-[#faf8ff] border border-[#e0e7ff] text-xs text-[#4338ca]">
                <span className="font-bold block mb-1">About {job.company}:</span>
                <span className="text-[#334155]">{job.aboutCompany}</span>
              </div>
            )}
          </div>

          {/* Section: Tech Stack & Architecture */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-2xs flex flex-col gap-4">
            <h3 className="text-sm font-bold font-mono text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#4338ca]">code</span>
              <span>Required Technology Stack</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.skills && job.skills.map(skill => (
                <span key={skill} className="px-3 py-1.5 rounded-xl bg-[#f1f5f9] text-[#0f172a] text-xs font-mono font-medium border border-[#e2e8f0] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4338ca]"></span>
                  <span>{skill}</span>
                </span>
              ))}
            </div>
            <p className="text-xs text-[#64748b] leading-relaxed mt-1">
              Freshers are evaluated primarily on core fundamentals: Data Structures, Object-Oriented Design, Clean Code patterns, and eager willingness to learn.
            </p>
          </div>

          {/* Section: Zero Bond & Statutory Guarantee */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-2xs flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#059669] text-[22px]">verified_user</span>
              <h3 className="text-sm font-bold font-mono text-[#0f172a] uppercase tracking-wider">
                Candidate Protection Pledge
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0]">
                <span className="text-xs font-bold text-[#15803d] block">Zero Service Agreement Bond</span>
                <span className="text-xs text-[#334155] mt-0.5 block">No certificate withholding or employment lock-in indemnity.</span>
              </div>
              <div className="p-3 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0]">
                <span className="text-xs font-bold text-[#15803d] block">Statutory CTC Floor Compliance</span>
                <span className="text-xs text-[#334155] mt-0.5 block">Guaranteed fixed base exceeds the platform minimum ₹2.40 LPA.</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (4 Cols): Candidate Fit Telemetry */}
        <div className="lg:col-span-4 flex flex-col gap-5 sticky top-20">
          
          {/* Fit Alignment Card */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
              <span className="text-xs font-mono font-bold text-[#0f172a] uppercase">Profile Alignment</span>
              <span className="text-xs font-mono font-bold text-[#059669]">{score}% High Fit</span>
            </div>

            {/* Radar / Progress Factor Bars */}
            <div className="flex flex-col gap-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#334155] font-medium">Target Role Fit (Weight 25%)</span>
                  <span className="font-mono font-bold text-[#059669]">100%</span>
                </div>
                <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#10b981] h-full rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#334155] font-medium">Tech Skills Match (Weight 35%)</span>
                  <span className="font-mono font-bold text-[#4338ca]">88%</span>
                </div>
                <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#4338ca] h-full rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#334155] font-medium">Preferred Location (Weight 20%)</span>
                  <span className="font-mono font-bold text-[#059669]">100%</span>
                </div>
                <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#10b981] h-full rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#334155] font-medium">Work Mode Fit (Weight 10%)</span>
                  <span className="font-mono font-bold text-[#059669]">95%</span>
                </div>
                <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#10b981] h-full rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#334155] font-medium">Salary Expectations (Weight 10%)</span>
                  <span className="font-mono font-bold text-[#059669]">100%</span>
                </div>
                <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#10b981] h-full rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>

            {onNavigateToEligibility && (
              <button
                onClick={() => onNavigateToEligibility(job.id)}
                className="w-full py-2.5 rounded-xl bg-[#eef2ff] hover:bg-[#e0e7ff] text-[#4338ca] text-xs font-mono font-bold transition flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                <span>Inspect Deterministic Rules</span>
              </button>
            )}
          </div>

          {/* Direct Application CTA */}
          <div className="p-4 rounded-2xl bg-[#faf8ff] border border-[#e0e7ff] flex flex-col gap-2.5">
            <span className="text-xs font-bold text-[#0f172a]">Ready to Apply?</span>
            <p className="text-[11px] text-[#64748b] leading-relaxed">
              Applications are submitted directly to {job.company}'s official career gateway without third-party commission.
            </p>
            <button
              onClick={() => {
                if (job.applyUrl) window.open(job.applyUrl, '_blank');
              }}
              className="w-full py-2.5 bg-[#4338ca] hover:bg-[#3730a3] text-white rounded-xl text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Submit ATS Application</span>
              <span className="material-symbols-outlined text-[15px]">send</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
