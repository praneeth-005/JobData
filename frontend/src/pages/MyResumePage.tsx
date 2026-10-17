import React, { useState, useEffect } from 'react';
import ResumeSubNav, { ResumeTab } from '../components/ResumeSubNav';
import { ResumeOverview, ResumeVersion } from '../types';

interface MyResumePageProps {
  onNavigateToTab: (tab: ResumeTab) => void;
}

export default function MyResumePage({ onNavigateToTab }: MyResumePageProps) {
  const [overview, setOverview] = useState<ResumeOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRawText, setShowRawText] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    fetch('/api/v1/resumes/overview?userId=user_arjun', { credentials: 'include' })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Failed to load resume overview');
      })
      .then((data: ResumeOverview) => {
        setOverview(data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Overview fallback:', err);
        // Fallback default master demo
        setOverview({
          resume: {
            id: 'res_v21',
            userId: 'user_arjun',
            versionNumber: 21,
            versionLabel: 'v2.1',
            fileName: 'Arjun_Rao_Resume_v2.1.pdf',
            fileSizeBytes: 248832,
            fileSizeFormatted: '243.0 KB',
            sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            storagePath: 'user_arjun/v21_Arjun_Rao_Resume_v2.1.pdf',
            extractedCandidateName: 'Arjun Rao',
            extractedEmail: 'arjun.rao@example.com',
            extractedPhone: '+91 98765 43210',
            extractedDegree: 'B.Tech in Computer Science & Engineering',
            extractedGraduationBatch: '2026 Batch (Outgoing)',
            extractedCgpa: 8.65,
            extractedSkills: [
              'Java 21', 'Spring Boot', 'PostgreSQL', 'Apache Kafka', 'Docker',
              'Git', 'JUnit 5', 'Mockito', 'REST APIs', 'Microservices',
              'React', 'TypeScript', 'Tailwind CSS', 'Data Structures & Algorithms'
            ],
            extractedProjects: [
              {
                title: 'Distributed Microservices Order Engine',
                role: 'Lead Backend Developer',
                techStack: 'Java 21, Spring Boot 3.3, Apache Kafka, PostgreSQL, Docker',
                bulletPoints: [
                  'Architected event-driven microservices order pipeline processing 15,000+ RPS with sub-45ms latency and zero transaction drops.',
                  'Implemented distributed saga pattern with PostgreSQL and Kafka for zero data loss order state reconciliation.'
                ],
                projectUrl: 'https://github.com/arjunrao/order-engine',
                evidenceStrength: 'Lines 14-22'
              },
              {
                title: 'Campus Placement Gateway & Verified Job Board',
                role: 'Full Stack Engineer',
                techStack: 'React 18, TypeScript, Spring Boot, PostgreSQL, Tailwind CSS',
                bulletPoints: [
                  'Engineered secure applicant tracking platform onboarding 1,200+ students across 4 colleges with automated eligibility validation.',
                  'Built normalized relational schema with B-tree indexes, achieving 24ms P95 query response time.'
                ],
                projectUrl: 'https://github.com/arjunrao/campus-gateway',
                evidenceStrength: 'Lines 23-32'
              }
            ],
            atsScore: 91,
            overallScore: 93,
            status: 'READY',
            current: true,
            createdAt: new Date().toISOString()
          },
          totalSkillsCount: 14,
          totalProjectsCount: 2,
          matchingJobsCount: 4,
          peakMatchPercent: 94,
          topMatchingCompany: 'Thoughtworks',
          topSkills: ['Java 21', 'Spring Boot', 'PostgreSQL', 'Apache Kafka', 'Docker', 'Git', 'JUnit 5', 'Mockito'],
          projects: [],
          atsScore: 91,
          overallQualityScore: 93
        });
        setLoading(false);
      });
  }, []);

  const resume = overview?.resume;

  const handleDownload = () => {
    if (resume?.id) {
      window.open(`/api/v1/resumes/${resume.id}/download`, '_blank');
    }
  };

  const handleCopyHash = () => {
    if (resume?.sha256Hash) {
      navigator.clipboard.writeText(resume.sha256Hash);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-16">
      {/* Sub-Navigation for the 6 Resume Interfaces */}
      <ResumeSubNav
        activeTab="RESUME_HUB"
        onSelectTab={onNavigateToTab}
        versionLabel={resume?.versionLabel || 'v2.1'}
        atsScore={overview?.atsScore || 91}
      />

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#e2e8f0]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e0e7ff] text-[#4338ca] text-xs font-semibold mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4338ca]"></span>
            <span>Master Candidate Artifact</span>
            <span className="text-[#94a3b8]">/</span>
            <span className="font-mono text-[11px]">ID: AR-RES-2026-V2.1</span>
            <span className="text-[#94a3b8]">/</span>
            <span className="text-[#059669] font-bold">2026 Batch Verified</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
            My Resume Hub
          </h1>
          <p className="text-sm text-[#64748b] mt-1 max-w-2xl">
            Central repository for your active master resume. Parsed via private enclaved Apache Tika with verifiable line-by-line evidence, ATS compliance checks, and deterministic job matching.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateToTab('RESUME_UPLOAD')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#cbd5e1] bg-white text-[#334155] hover:bg-[#f8fafc] text-xs font-bold transition shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">file_upload</span>
            <span>Upload New Version</span>
          </button>

          <button
            onClick={() => onNavigateToTab('RESUME_MATCHING')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#eef2ff] text-[#4338ca] hover:bg-[#e0e7ff] text-xs font-bold transition"
          >
            <span className="material-symbols-outlined text-[18px]">join_inner</span>
            <span>Match to Jobs</span>
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#4338ca] text-white hover:bg-[#3730a3] text-xs font-bold transition shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Download Active PDF ({resume?.versionLabel || 'v2.1'})</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        
        {/* Left Column (8 cols): Master Resume Status & Rich Extraction */}
        <div className="lg:col-span-8 flex flex-col gap-6">

          {/* Master File Card */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs hover:shadow-md transition">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#f1f5f9]">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#eef2ff] flex items-center justify-center text-[#4338ca] shrink-0">
                  <span className="material-symbols-outlined text-[28px]">picture_as_pdf</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-[#0f172a]">{resume?.fileName || 'Arjun_Rao_Resume_v2.1.pdf'}</h2>
                    <span className="px-2 py-0.5 rounded-full bg-[#ecfdf5] text-[#059669] text-[11px] font-bold">
                      Active Master
                    </span>
                  </div>
                  <p className="text-xs text-[#64748b] mt-0.5">
                    {resume?.fileSizeFormatted || '243.0 KB'} • PDF/A Compliant • Private Local Storage Enclave
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="px-2.5 py-1 rounded bg-[#f1f5f9] font-mono text-xs font-bold text-[#475569]">
                  {resume?.versionLabel || 'v2.1'}
                </span>
                <button
                  onClick={() => onNavigateToTab('RESUME_VERSIONS')}
                  className="text-xs text-[#4338ca] hover:underline font-semibold flex items-center gap-1"
                >
                  <span>All Versions</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* SHA-256 and Storage path integrity */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-[#64748b]">
              <div className="flex items-center gap-2 truncate max-w-md">
                <span className="material-symbols-outlined text-[16px] text-[#059669]">verified_user</span>
                <span className="truncate">SHA-256: {resume?.sha256Hash || 'e3b0c44298fc...'}</span>
              </div>
              <button
                onClick={handleCopyHash}
                className="text-[#4338ca] hover:text-[#3730a3] text-xs font-sans font-semibold flex items-center gap-1 self-start sm:self-auto"
              >
                <span className="material-symbols-outlined text-[14px]">content_copy</span>
                <span>{copySuccess ? 'Copied Hash!' : 'Copy Hash'}</span>
              </button>
            </div>
          </div>

          {/* 4 Quick Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div 
              onClick={() => onNavigateToTab('RESUME_MATCHING')}
              className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs cursor-pointer hover:border-[#4338ca] transition group"
            >
              <div className="flex items-center justify-between text-[#64748b] text-xs">
                <span>Peak Match</span>
                <span className="material-symbols-outlined text-[#4338ca] text-[18px]">verified</span>
              </div>
              <div className="text-2xl font-black text-[#0f172a] mt-2 group-hover:text-[#4338ca] transition">
                {overview?.peakMatchPercent || 94}%
              </div>
              <div className="text-[11px] text-[#059669] font-medium mt-1 truncate">
                {overview?.topMatchingCompany || 'Thoughtworks'} (Tier 1)
              </div>
            </div>

            <div 
              onClick={() => onNavigateToTab('RESUME_ANALYSIS')}
              className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs cursor-pointer hover:border-[#4338ca] transition group"
            >
              <div className="flex items-center justify-between text-[#64748b] text-xs">
                <span>ATS Hygiene</span>
                <span className="material-symbols-outlined text-[#059669] text-[18px]">speed</span>
              </div>
              <div className="text-2xl font-black text-[#0f172a] mt-2 group-hover:text-[#059669] transition">
                {overview?.atsScore || 91}/100
              </div>
              <div className="text-[11px] text-[#64748b] font-medium mt-1">
                Proprietary ATS Pass
              </div>
            </div>

            <div 
              onClick={() => onNavigateToTab('RESUME_ANALYSIS')}
              className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs cursor-pointer hover:border-[#4338ca] transition group"
            >
              <div className="flex items-center justify-between text-[#64748b] text-xs">
                <span>Core Skills</span>
                <span className="material-symbols-outlined text-[#4338ca] text-[18px]">psychology</span>
              </div>
              <div className="text-2xl font-black text-[#0f172a] mt-2 group-hover:text-[#4338ca] transition">
                {overview?.totalSkillsCount || 14}
              </div>
              <div className="text-[11px] text-[#64748b] font-medium mt-1">
                Line Proof Verified
              </div>
            </div>

            <div 
              onClick={() => onNavigateToTab('RESUME_IMPROVEMENTS')}
              className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs cursor-pointer hover:border-[#4338ca] transition group"
            >
              <div className="flex items-center justify-between text-[#64748b] text-xs">
                <span>Improvements</span>
                <span className="material-symbols-outlined text-[#f59e0b] text-[18px]">auto_fix_high</span>
              </div>
              <div className="text-2xl font-black text-[#0f172a] mt-2 group-hover:text-[#f59e0b] transition">
                5 Ready
              </div>
              <div className="text-[11px] text-[#f59e0b] font-semibold mt-1">
                Google XYZ Formula
              </div>
            </div>

          </div>

          {/* Extracted Candidate Identity & Academic Standing */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#f1f5f9]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4338ca] text-[20px]">badge</span>
                <h3 className="text-sm font-bold text-[#0f172a] uppercase tracking-wider">
                  Verified Candidate Identity & Academic Standing
                </h3>
              </div>
              <span className="text-xs font-mono text-[#059669] font-bold bg-[#ecfdf5] px-2 py-0.5 rounded">
                2026 Batch Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 text-xs">
              <div>
                <span className="text-[#64748b]">Candidate Name</span>
                <p className="font-bold text-[#0f172a] text-sm mt-0.5">{resume?.extractedCandidateName || 'Arjun Rao'}</p>
              </div>
              <div>
                <span className="text-[#64748b]">Email Address</span>
                <p className="font-semibold text-[#0f172a] mt-0.5">{resume?.extractedEmail || 'arjun.rao@example.com'}</p>
              </div>
              <div>
                <span className="text-[#64748b]">Contact Phone</span>
                <p className="font-semibold text-[#0f172a] mt-0.5">{resume?.extractedPhone || '+91 98765 43210'}</p>
              </div>
              <div>
                <span className="text-[#64748b]">Academic Degree</span>
                <p className="font-semibold text-[#0f172a] mt-0.5">{resume?.extractedDegree || 'B.Tech in Computer Science'}</p>
              </div>
              <div>
                <span className="text-[#64748b]">Graduation Batch</span>
                <p className="font-bold text-[#4338ca] mt-0.5">{resume?.extractedGraduationBatch || '2026 Batch (Outgoing)'}</p>
              </div>
              <div>
                <span className="text-[#64748b]">Academic CGPA</span>
                <p className="font-bold text-[#059669] mt-0.5">{resume?.extractedCgpa || 8.65} / 10.0</p>
              </div>
            </div>
          </div>

          {/* Verified Technical Competencies */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#f1f5f9]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4338ca] text-[20px]">terminal</span>
                <h3 className="text-sm font-bold text-[#0f172a] uppercase tracking-wider">
                  Extracted Technical Competencies ({overview?.totalSkillsCount || 14})
                </h3>
              </div>
              <button
                onClick={() => onNavigateToTab('RESUME_ANALYSIS')}
                className="text-xs text-[#4338ca] hover:underline font-semibold"
              >
                View Evidence Lines →
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-4">
              {(overview?.topSkills || resume?.extractedSkills || []).map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-xs font-semibold text-[#334155]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Project Proof Highlights */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#f1f5f9]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4338ca] text-[20px]">deployed_code</span>
                <h3 className="text-sm font-bold text-[#0f172a] uppercase tracking-wider">
                  Verified Engineering Projects ({resume?.extractedProjects?.length || 2})
                </h3>
              </div>
              <button
                onClick={() => onNavigateToTab('RESUME_ANALYSIS')}
                className="text-xs text-[#4338ca] hover:underline font-semibold"
              >
                Full Project Audit →
              </button>
            </div>

            <div className="space-y-4 pt-4">
              {(resume?.extractedProjects || []).map((proj, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-[#faf8ff] border border-[#e0e7ff]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-[#0f172a]">{proj.title}</h4>
                      <p className="text-xs text-[#64748b] mt-0.5">{proj.role} • <span className="font-mono text-[#4338ca]">{proj.techStack}</span></p>
                    </div>
                    <span className="self-start sm:self-auto px-2 py-0.5 rounded bg-white border border-[#c7d2fe] text-[#4338ca] font-mono text-[11px] font-bold">
                      {proj.evidenceStrength || 'Lines 14-22'}
                    </span>
                  </div>

                  <ul className="mt-3 space-y-1.5 text-xs text-[#334155] list-disc list-inside">
                    {proj.bulletPoints.map((b, bIdx) => (
                      <li key={bIdx} className="leading-relaxed">{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Quick Navigation & Architecture Security */}
        <div className="lg:col-span-4 flex flex-col gap-6">

          {/* Quick Action Navigator */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 shadow-xs">
            <h3 className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-3">
              Resume Intelligence Tools
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => onNavigateToTab('RESUME_UPLOAD')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-[#f1f5f9] hover:bg-[#f8fafc] text-left transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#eef2ff] text-[#4338ca] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">file_upload</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0f172a] group-hover:text-[#4338ca]">Upload & Validation Center</div>
                    <div className="text-[11px] text-[#64748b]">MIME, magic bytes, SHA-256</div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[16px] text-[#94a3b8]">arrow_forward</span>
              </button>

              <button
                onClick={() => onNavigateToTab('RESUME_ANALYSIS')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-[#f1f5f9] hover:bg-[#f8fafc] text-left transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#ecfdf5] text-[#059669] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">analytics</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0f172a] group-hover:text-[#059669]">Analysis Overview</div>
                    <div className="text-[11px] text-[#64748b]">ATS 91, line-by-line evidence</div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[16px] text-[#94a3b8]">arrow_forward</span>
              </button>

              <button
                onClick={() => onNavigateToTab('RESUME_MATCHING')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-[#f1f5f9] hover:bg-[#f8fafc] text-left transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#faf5ff] text-[#9333ea] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">join_inner</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0f172a] group-hover:text-[#9333ea]">Resume-to-Job Matching</div>
                    <div className="text-[11px] text-[#64748b]">Thoughtworks (94%), Razorpay (91%)</div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[16px] text-[#94a3b8]">arrow_forward</span>
              </button>

              <button
                onClick={() => onNavigateToTab('RESUME_IMPROVEMENTS')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-[#f1f5f9] hover:bg-[#f8fafc] text-left transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#fffbeb] text-[#d97706] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0f172a] group-hover:text-[#d97706]">Actionable Improvements</div>
                    <div className="text-[11px] text-[#64748b]">5 XYZ formula rewrites ready</div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[16px] text-[#94a3b8]">arrow_forward</span>
              </button>

              <button
                onClick={() => onNavigateToTab('RESUME_VERSIONS')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-[#f1f5f9] hover:bg-[#f8fafc] text-left transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#f1f5f9] text-[#475569] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">history</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0f172a] group-hover:text-[#4338ca]">Version Control & Diffs</div>
                    <div className="text-[11px] text-[#64748b]">Track v1.0 → v2.0 → v2.1 deltas</div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[16px] text-[#94a3b8]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Private PDF Storage Architecture Security Card */}
          <div className="bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] rounded-xl p-5 text-white shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[#10b981] text-[20px]">lock</span>
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#93c5fd]">
                Private Storage Architecture
              </h3>
            </div>
            <p className="text-xs text-[#cbd5e1] leading-relaxed">
              Resumes are stored strictly under an enclaved directory path <span className="font-mono text-[#38bdf8]">./storage/resumes/&#123;userId&#125;/</span>.
              Files are never served via public static URLs. Access is strictly governed by authenticated Spring Boot controller byte streams with verified MIME headers.
            </p>

            <div className="mt-4 pt-3 border-t border-white/10 space-y-2 text-[11px]">
              <div className="flex items-center justify-between text-[#94a3b8]">
                <span>MIME Whitelist</span>
                <span className="font-mono text-[#10b981]">application/pdf</span>
              </div>
              <div className="flex items-center justify-between text-[#94a3b8]">
                <span>Magic Bytes Check</span>
                <span className="font-mono text-[#10b981]">%PDF- (0x255044462D)</span>
              </div>
              <div className="flex items-center justify-between text-[#94a3b8]">
                <span>Max Payload Ceiling</span>
                <span className="font-mono text-[#38bdf8]">5.0 MB</span>
              </div>
              <div className="flex items-center justify-between text-[#94a3b8]">
                <span>Database Sync</span>
                <span className="font-mono text-[#10b981]">MongoDB Atlas + In-Memory Fallback</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
