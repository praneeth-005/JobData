import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ProfileOverviewPageProps {
  profile: UserProfile;
  onNavigateToEditProfile: () => void;
  onNavigateToPreferences: () => void;
  onNavigateToDashboard?: () => void;
}

export default function ProfileOverviewPage({
  profile,
  onNavigateToEditProfile,
  onNavigateToPreferences,
}: ProfileOverviewPageProps) {
  const [showTour, setShowTour] = useState(false);

  // Dynamic initials
  const initials = profile.fullName
    ? profile.fullName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'AR';

  // Calculate dynamic completion percentage
  const hasPhone = Boolean(profile.phone && profile.phone.trim().length > 4);
  const hasSkills = profile.skills && profile.skills.length >= 5;
  const hasPreferences = profile.targetRoles && profile.targetRoles.length > 0;
  
  let completedSections = 1; // Education defaults to verified
  if (hasPhone) completedSections++;
  if (hasSkills) completedSections++;
  if (hasPreferences) completedSections++;
  
  const completionPercentage = Math.round((completedSections / 4) * 100);
  const circumference = 2 * Math.PI * 42; // r=42
  const strokeDashoffset = circumference - (circumference * completionPercentage) / 100;

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in">
      
      {/* Top Editorial Header & Breadcrumb Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#f1f5f9] pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#64748b]">
            <span className="hover:text-[#4338ca] cursor-pointer">Overview</span>
            <span className="material-symbols-outlined text-[13px]">chevron_right</span>
            <span className="text-[#4338ca] font-bold">Profile Calibration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0f172a] tracking-tight">
            Welcome to your career journey
          </h1>
          <p className="text-sm text-[#64748b] max-w-2xl leading-relaxed">
            Complete your profile so our deterministic ATS and verified executive curators can match you with verified, zero-bond fresher opportunities.
          </p>
        </div>

        {/* Live Advisory Status Pill */}
        <div className="flex items-center gap-2.5 bg-white border border-[#e2e8f0] px-4 py-2 rounded-full shadow-xs self-start md:self-auto">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10b981]"></span>
          </span>
          <span className="text-xs text-[#0f172a] font-medium">Session: Cohort 2025 Allocation</span>
          <span className="font-mono text-[11px] font-bold text-[#059669] px-2 py-0.5 bg-[#ecfdf5] border border-[#a7f3d0] rounded">
            ACTIVE
          </span>
        </div>
      </div>

      {/* Editorial Hero: Split Bento (Tactile Credential Card + Calibration Gauge) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Floating Tactile Candidate Credential Card (5 cols) */}
        <div className="lg:col-span-5 relative group">
          <div className="absolute -inset-1 bg-gradient-to-br from-[#4338ca]/15 to-[#3b82f6]/10 rounded-2xl blur-md transition duration-500 opacity-70 group-hover:opacity-100"></div>
          <div className="relative h-full bg-white border border-[#e2e8f0] rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-sm overflow-hidden">
            
            {/* Tactile Geometric Aura */}
            <div className="absolute top-0 right-0 w-60 h-60 bg-[#eef2ff] rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

            <div className="relative z-10 space-y-6">
              <div className="flex items-start justify-between">
                
                {/* Tier Monogram Badge */}
                <div className="relative">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#4338ca] to-[#312e81] flex items-center justify-center text-white font-serif text-2xl sm:text-3xl font-bold shadow-md transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                    {initials}
                  </div>
                  <div className="absolute -bottom-1.5 -right-1.5 bg-[#059669] text-white rounded-full p-1 shadow-sm flex items-center justify-center" title="Identity Verified">
                    <span className="material-symbols-outlined text-[15px]">verified</span>
                  </div>
                </div>

                {/* Verification Tag */}
                <div className="flex flex-col items-end">
                  <span className="px-2.5 py-1 rounded bg-[#f1f5f9] text-[#334155] font-mono text-[11px] font-bold tracking-wider uppercase">
                    Engineering Tier 1
                  </span>
                  <span className="font-mono text-[11px] text-[#64748b] mt-1">ID: #EXP-99201</span>
                </div>
              </div>

              {/* Identity Block */}
              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a]">{profile.fullName || 'Arjun Rao'}</h2>
                <p className="text-xs sm:text-sm text-[#475569] font-medium">
                  {profile.targetTrack ? `${profile.targetTrack} Engineer` : 'Aspiring Distributed Systems & Backend Engineer'}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f8fafc] border border-[#e2e8f0] text-[#334155] text-xs font-medium">
                    <span className="material-symbols-outlined text-[14px] text-[#059669]">school</span>
                    {profile.degree || 'B.Tech CSE'} • {profile.graduationYear || '2025'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f8fafc] border border-[#e2e8f0] text-[#334155] text-xs font-medium">
                    <span className="material-symbols-outlined text-[14px] text-[#4338ca]">location_on</span>
                    Bengaluru, IN
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Micro Visual: Academic Stamp */}
            <div className="relative z-10 pt-4 mt-6 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] flex items-center justify-center text-[#059669]">
                  <span className="material-symbols-outlined text-[17px]">verified_user</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0f172a]">Academic Credentials</p>
                  <p className="text-[11px] text-[#64748b]">{profile.collegeName || 'RV College of Engineering, Bengaluru'}</p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-[#059669] bg-[#ecfdf5] px-2 py-0.5 rounded border border-[#a7f3d0]">
                VERIFIED
              </span>
            </div>

          </div>
        </div>

        {/* Right: Profile Completion & Calibration Hub (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#e2e8f0] rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col justify-between">
          <div>
            {/* Header and Progress Metric Indicator */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#f1f5f9]">
              <div className="space-y-1">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#4338ca]">
                  Calibration Engine
                </span>
                <h3 className="text-xl font-bold text-[#0f172a]">{completionPercentage}% Profile Calibration</h3>
                <p className="text-xs text-[#64748b] leading-relaxed">
                  Complete remaining sections to activate automated walk-in drive allocation & AI match breakdown.
                </p>
              </div>

              {/* Inline SVG Gauge */}
              <div className="relative w-22 h-22 sm:w-24 sm:h-24 flex-shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="text-[#f1f5f9]"
                    cx="50"
                    cy="50"
                    fill="transparent"
                    r="42"
                    stroke="currentColor"
                    strokeWidth="8"
                  />
                  <circle
                    className="text-[#4338ca] transition-all duration-700 ease-out"
                    cx="50"
                    cy="50"
                    fill="transparent"
                    r="42"
                    stroke="currentColor"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    strokeWidth="8"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-lg font-mono font-bold text-[#0f172a]">{completionPercentage}%</span>
                </div>
              </div>
            </div>

            {/* Interactive Checklist */}
            <div className="space-y-2.5 pt-4">
              
              {/* Item 1: Personal Info */}
              <div 
                onClick={onNavigateToEditProfile}
                className="group flex items-center justify-between p-3.5 rounded-xl bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#e2e8f0] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    hasPhone ? 'bg-[#ecfdf5] text-[#059669]' : 'bg-[#fef2f2] text-[#dc2626]'
                  }`}>
                    <span className="material-symbols-outlined text-[17px]">
                      {hasPhone ? 'check' : 'priority_high'}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0f172a]">Personal Information</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        hasPhone ? 'bg-[#ecfdf5] text-[#059669]' : 'bg-[#fef2f2] text-[#dc2626]'
                      }`}>
                        {hasPhone ? 'Completed' : 'Phone Required'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748b]">
                      {hasPhone ? `Contact: +91 ${profile.phone}` : 'Missing contact number for recruiter SMS alert'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[#4338ca] text-xs font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>{hasPhone ? 'View' : 'Update'}</span>
                  <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                </div>
              </div>

              {/* Item 2: Education (Completed) */}
              <div 
                onClick={onNavigateToEditProfile}
                className="group flex items-center justify-between p-3.5 rounded-xl bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#e2e8f0] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#ecfdf5] text-[#059669] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[17px]">school</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0f172a]">Education Credentials</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#ecfdf5] text-[#059669]">
                        Verified
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748b]">
                      {profile.degree || 'B.Tech CSE'}, {profile.collegeName || 'RV College of Engineering'} ({profile.graduationYear || '2025'})
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[#059669] text-xs font-semibold">
                  <span className="material-symbols-outlined text-[16px]">task_alt</span>
                  <span>Verified</span>
                </div>
              </div>

              {/* Item 3: Technical Skills */}
              <div 
                onClick={onNavigateToEditProfile}
                className="group flex items-center justify-between p-3.5 rounded-xl bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#e2e8f0] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#eef2ff] text-[#4338ca] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[17px]">build</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0f172a]">Technical Skills Inventory</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#eef2ff] text-[#4338ca]">
                        {profile.skills?.length || 5} Stack Competencies
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748b]">
                      Calibrated across Java, Spring Boot, PostgreSQL, and Git
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[#4338ca] text-xs font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>Manage</span>
                  <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                </div>
              </div>

              {/* Item 4: Job Preferences */}
              <div 
                onClick={onNavigateToPreferences}
                className="group flex items-center justify-between p-3.5 rounded-xl bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#e2e8f0] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#fffbeb] text-[#d97706] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[17px]">tune</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0f172a]">Job Preferences</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#fffbeb] text-[#b45309]">
                        &gt; ₹2.40 LPA Floor
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748b]">
                      4 Target Roles • Bengaluru, Hyderabad • Online virtual rounds favored
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[#4338ca] text-xs font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>Configure</span>
                  <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                </div>
              </div>

            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-[#f1f5f9] mt-6">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button 
                onClick={onNavigateToEditProfile}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#4338ca] hover:bg-[#3730a3] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition"
              >
                <span>Continue Setup</span>
                <span className="material-symbols-outlined text-[16px]">east</span>
              </button>
              <button 
                onClick={() => setShowTour(true)}
                className="w-full sm:w-auto px-4 py-2.5 bg-white border border-[#e2e8f0] hover:bg-[#f8fafc] text-[#334155] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <span className="material-symbols-outlined text-[16px]">explore</span>
                <span>Quick Tour</span>
              </button>
            </div>
            <span className="text-[11px] text-[#94a3b8] font-mono">
              Estimated completion: ~4 mins
            </span>
          </div>

        </div>

      </div>

      {/* Section Heading for Detailed Summary */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="text-xl font-bold text-[#0f172a] tracking-tight">Structured Profile Summary</h2>
          <p className="text-xs text-[#64748b]">Inspect and fine-tune your verified technical credentials.</p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[#64748b] font-mono text-xs">
          <span className="material-symbols-outlined text-[16px] text-[#059669]">lock</span>
          <span>256-BIT ENCRYPTED ADVISORY ARCHIVE</span>
        </div>
      </div>

      {/* 4-Card Structured Profile Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Personal Information */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#eef2ff] text-[#4338ca] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                </div>
                <h3 className="font-bold text-base text-[#0f172a]">Personal Information</h3>
              </div>
              <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold ${
                hasPhone ? 'bg-[#ecfdf5] text-[#059669]' : 'bg-[#fef2f2] text-[#dc2626]'
              }`}>
                {hasPhone ? 'Complete' : 'Incomplete'}
              </span>
            </div>

            <div className="space-y-2.5 pt-1 text-xs">
              <div className="flex flex-col p-3 bg-[#f8fafc] rounded-lg">
                <span className="font-mono text-[10px] uppercase text-[#94a3b8]">Display Name</span>
                <span className="font-semibold text-[#0f172a] mt-0.5">{profile.fullName || 'Arjun Rao'}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-[#f8fafc] rounded-lg">
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] uppercase text-[#94a3b8]">Primary Email</span>
                  <span className="font-semibold text-[#0f172a] mt-0.5">{profile.email || 'arjun@college.edu'}</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#ecfdf5] text-[#059669] font-mono text-[11px] font-bold">
                  <span className="material-symbols-outlined text-[13px]">check_circle</span> Verified
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#f8fafc] rounded-lg">
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] uppercase text-[#94a3b8]">Contact Phone</span>
                  <span className={`font-semibold mt-0.5 ${hasPhone ? 'text-[#0f172a]' : 'text-[#dc2626] italic'}`}>
                    {hasPhone ? `+91 ${profile.phone}` : 'Not set'}
                  </span>
                </div>
                <button 
                  onClick={onNavigateToEditProfile}
                  className="font-mono text-xs text-[#4338ca] font-bold hover:underline"
                >
                  {hasPhone ? 'Change' : 'Add Number'}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-[#f1f5f9] flex items-center justify-between text-xs">
            <span className="text-[#64748b]">Used for walk-in alerts & SMS shortlists</span>
            <button 
              onClick={onNavigateToEditProfile}
              className="inline-flex items-center gap-1 text-[#4338ca] font-semibold hover:underline"
            >
              <span>Edit details</span>
              <span className="material-symbols-outlined text-[15px]">edit</span>
            </button>
          </div>
        </div>

        {/* Card 2: Education */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#ecfdf5] text-[#059669] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">school</span>
                </div>
                <h3 className="font-bold text-base text-[#0f172a]">Education</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#ecfdf5] text-[#059669]">
                Completed
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
              <div className="flex flex-col p-3 bg-[#f8fafc] rounded-lg sm:col-span-2">
                <span className="font-mono text-[10px] uppercase text-[#94a3b8]">Qualification & Major</span>
                <span className="font-semibold text-[#0f172a] mt-0.5">
                  {profile.degree || 'B.Tech in Computer Science & Engineering'}
                </span>
              </div>
              <div className="flex flex-col p-3 bg-[#f8fafc] rounded-lg">
                <span className="font-mono text-[10px] uppercase text-[#94a3b8]">Institution</span>
                <span className="font-semibold text-[#0f172a] mt-0.5 truncate">
                  {profile.collegeName || 'RV College of Engineering'}
                </span>
              </div>
              <div className="flex flex-col p-3 bg-[#f8fafc] rounded-lg">
                <span className="font-mono text-[10px] uppercase text-[#94a3b8]">Class of</span>
                <span className="font-semibold text-[#0f172a] mt-0.5">
                  {profile.graduationYear || '2025'} (Final Year)
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#f8fafc] rounded-lg sm:col-span-2">
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] uppercase text-[#94a3b8]">Cumulative Grade</span>
                  <span className="text-base font-bold text-[#0f172a] font-mono mt-0.5">
                    {profile.cgpa || '8.4'} <span className="text-xs text-[#64748b] font-normal">/ 10.0 CGPA</span>
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] text-[#059669] font-mono text-[11px] font-bold">
                  Top 15% Percentile
                </span>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-[#f1f5f9] flex items-center justify-between text-xs">
            <span className="text-[#64748b]">Transcript sync active via Registrar</span>
            <button 
              onClick={onNavigateToEditProfile}
              className="inline-flex items-center gap-1 text-[#4338ca] font-semibold hover:underline"
            >
              <span>Edit education</span>
              <span className="material-symbols-outlined text-[15px]">edit</span>
            </button>
          </div>
        </div>

        {/* Card 3: Technical Skills */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#eef2ff] text-[#4338ca] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">terminal</span>
                </div>
                <h3 className="font-bold text-base text-[#0f172a]">Technical Skills</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#eef2ff] text-[#4338ca]">
                {profile.skills?.length || 5} Added
              </span>
            </div>

            <p className="text-xs text-[#64748b] leading-relaxed">
              Verified proficiencies evaluate code architecture match with hiring manager requirements.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {(profile.skills && profile.skills.length > 0 ? profile.skills : ['Java', 'Spring Boot', 'PostgreSQL', 'React', 'Git']).map((skill) => (
                <div key={skill} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f1f5f9] text-[#0f172a] text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4338ca]"></span>
                  <span>{skill}</span>
                  <span className="material-symbols-outlined text-[14px] text-[#059669]">verified</span>
                </div>
              ))}
              <button 
                onClick={onNavigateToEditProfile}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#eef2ff] hover:bg-[#e0e7ff] text-[#4338ca] text-xs font-semibold transition"
              >
                <span className="material-symbols-outlined text-[15px]">add</span>
                <span>Add more skills</span>
              </button>
            </div>

            <div className="p-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg flex items-center justify-between text-xs">
              <span className="text-[#64748b]">Recommended:</span>
              <div className="flex gap-2 font-mono text-[11px]">
                <span onClick={onNavigateToEditProfile} className="cursor-pointer text-[#4338ca] hover:underline font-semibold">+ Docker</span>
                <span onClick={onNavigateToEditProfile} className="cursor-pointer text-[#4338ca] hover:underline font-semibold">+ Kafka</span>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-[#f1f5f9] flex items-center justify-between text-xs">
            <span className="text-[#64748b]">Calibrated for Tier 1 Enterprise stacks</span>
            <button 
              onClick={onNavigateToEditProfile}
              className="inline-flex items-center gap-1 text-[#4338ca] font-semibold hover:underline"
            >
              <span>Manage skills</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Card 4: Job Preferences */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#fffbeb] text-[#d97706] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">tune</span>
                </div>
                <h3 className="font-bold text-base text-[#0f172a]">Job Preferences</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#ecfdf5] text-[#059669]">
                Active Filters
              </span>
            </div>

            <div className="space-y-2.5 pt-1 text-xs">
              <div className="p-3 bg-[#f8fafc] rounded-lg space-y-1.5">
                <span className="font-mono text-[10px] uppercase text-[#94a3b8]">Target Roles</span>
                <div className="flex flex-wrap gap-1.5">
                  {(profile.targetRoles && profile.targetRoles.length > 0 ? profile.targetRoles : ['Backend Developer', 'Software Engineer', 'Java Developer']).map((role) => (
                    <span key={role} className="px-2 py-0.5 rounded bg-white border border-[#e2e8f0] text-[#0f172a] font-medium text-[11px]">
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#f8fafc] rounded-lg">
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] uppercase text-[#94a3b8]">Salary Floor (Mandatory)</span>
                  <span className="font-bold text-[#0f172a] font-mono mt-0.5">
                    &gt; ₹{profile.salaryFloorLpa || '2.40'} LPA Mandatory
                  </span>
                </div>
                <span className="material-symbols-outlined text-[18px] text-[#059669]">check_circle</span>
              </div>

              <div className="p-3 bg-[#f8fafc] rounded-lg space-y-1">
                <span className="font-mono text-[10px] uppercase text-[#94a3b8]">Preferred Locations</span>
                <div className="flex flex-wrap items-center gap-2 text-[#0f172a] font-medium text-xs">
                  <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#4338ca]"></span>Bengaluru</span>
                  <span className="text-[#cbd5e1]">•</span>
                  <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#4338ca]"></span>Hyderabad</span>
                  <span className="text-[#cbd5e1]">•</span>
                  <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>Remote</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-[#f1f5f9] flex items-center justify-between text-xs">
            <span className="text-[#64748b]">Hard statutory floor applied to all feeds</span>
            <button 
              onClick={onNavigateToPreferences}
              className="inline-flex items-center gap-1 text-[#4338ca] font-semibold hover:underline"
            >
              <span>Configure preferences</span>
              <span className="material-symbols-outlined text-[15px]">tune</span>
            </button>
          </div>
        </div>

      </div>

      {/* Editorial Assurance Footer Strip */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#eef2ff] text-[#4338ca] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">psychology</span>
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#0f172a]">Executive Advisory Calibration</h4>
            <p className="text-xs text-[#64748b] leading-relaxed">
              Our placement curators personally evaluate validated candidates once profile completeness surpasses 80%.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 font-mono text-[11px] text-[#94a3b8]">
          <span>LAST UPDATED: TODAY, 14:32 IST</span>
        </div>
      </div>

      {/* Modal: Quick Tour */}
      {showTour && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#e2e8f0] p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[22px] text-[#4338ca]">explore</span>
                <h3 className="font-bold text-base text-[#0f172a]">Platform Calibration Tour</h3>
              </div>
              <button onClick={() => setShowTour(false)} className="text-[#94a3b8] hover:text-[#0f172a]">
                ✕
              </button>
            </div>
            
            <div className="space-y-3 text-xs text-[#334155] leading-relaxed">
              <div className="p-3 bg-[#eef2ff] rounded-xl flex gap-3">
                <span className="material-symbols-outlined text-[20px] text-[#4338ca] shrink-0">verified</span>
                <div>
                  <span className="font-bold text-[#0f172a] block">1. Verified Academic Credentials</span>
                  Your graduation year and degree allow employers to pre-screen without needing repeated document submissions.
                </div>
              </div>
              <div className="p-3 bg-[#ecfdf5] rounded-xl flex gap-3">
                <span className="material-symbols-outlined text-[20px] text-[#059669] shrink-0">lock</span>
                <div>
                  <span className="font-bold text-[#0f172a] block">2. Mandatory Statutory Floor (&gt; ₹2.4 LPA)</span>
                  We automatically suppress unpaid internships and predatory sub-minimum wage job postings before you even see them.
                </div>
              </div>
              <div className="p-3 bg-[#f8fafc] rounded-xl flex gap-3">
                <span className="material-symbols-outlined text-[20px] text-[#4338ca] shrink-0">speed</span>
                <div>
                  <span className="font-bold text-[#0f172a] block">3. Deterministic ATS Scoring</span>
                  Adding at least 5 technical tags enables high-signal matching with hiring pipelines across Bangalore, Hyderabad, and Pune.
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                onClick={() => setShowTour(false)}
                className="px-5 py-2 bg-[#4338ca] hover:bg-[#3730a3] text-white rounded-lg text-xs font-semibold"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
