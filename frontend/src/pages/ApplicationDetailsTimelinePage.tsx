import React, { useState, useEffect } from 'react';
import { ApplicationStage, JobApplication } from '../types';
import TrackerSubNav, { TrackerTab } from '../components/TrackerSubNav';

interface ApplicationDetailsTimelinePageProps {
  applicationId: string;
  onBack: () => void;
  onOpenEditDrawer: (app: JobApplication) => void;
  onNavigateTab: (tab: TrackerTab) => void;
  onNavigateToResumeAnalysis?: () => void;
}

export default function ApplicationDetailsTimelinePage({
  applicationId,
  onBack,
  onOpenEditDrawer,
  onNavigateTab,
  onNavigateToResumeAnalysis,
}: ApplicationDetailsTimelinePageProps) {
  const [app, setApp] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [notesText, setNotesText] = useState('');
  const [checklist, setChecklist] = useState([
    { id: 'c1', label: 'Review Java 21 Virtual Threads & Structured Concurrency', completed: true },
    { id: 'c2', label: 'Practice Low-Level Design (LLD) for Payment Gateway / Order Processing', completed: true },
    { id: 'c3', label: 'Review Master Resume v2.1 projects (Spring Boot, Kafka, Docker)', completed: true },
    { id: 'c4', label: 'Prepare questions for Lead Technologist about microservices architecture', completed: false },
  ]);
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/v1/tracker/applications/${applicationId}`);
        if (res.ok) {
          const data = await res.json();
          setApp(data);
          setNotesText(data.notes || '');
        }
      } catch (err) {
        console.warn('Failed to load application details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApp();
  }, [applicationId]);

  const toggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleSaveNotes = async () => {
    if (!app) return;
    setSavingNotes(true);
    try {
      await fetch(`/api/v1/tracker/applications/${app.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: notesText }),
      });
      setApp({ ...app, notes: notesText });
    } catch (err) {
      console.error('Failed to update notes', err);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleStageChange = async (newStage: ApplicationStage) => {
    if (!app) return;
    try {
      const res = await fetch(`/api/v1/tracker/applications/${app.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: newStage,
          statusLabel: newStage.replace('_', ' '),
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setApp(updated);
      }
    } catch (err) {
      console.error('Failed to update stage', err);
    }
  };

  if (!app && !loading) {
    return (
      <div className="min-h-screen bg-[#faf8ff] flex items-center justify-center p-6 text-center">
        <div>
          <h2 className="text-xl font-bold text-[#0f172a]">Application Not Found</h2>
          <p className="text-xs text-[#64748b] mt-1">ID: {applicationId}</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 rounded-lg bg-[#4338ca] text-white text-xs font-bold"
          >
            Back to Kanban Board
          </button>
        </div>
      </div>
    );
  }

  const currentApp = app || {
    id: applicationId,
    userId: 'user_arjun',
    jobId: 'job_tw',
    company: 'Thoughtworks',
    title: 'Graduate Software Engineer (Java / Backend)',
    logoText: 'TW',
    ctcText: '₹8.5 LPA Confirmed',
    ctcLpa: 8.5,
    location: 'Bengaluru',
    workMode: 'Hybrid (2 days/wk)',
    batchAllowed: '2026 Batch',
    stage: 'TECHNICAL_INTERVIEW' as ApplicationStage,
    statusLabel: 'Round 2 Technical Interview Scheduled',
    appliedDateFormatted: 'Oct 19, 2024',
    portalUrl: 'https://thoughtworks.greenhouse.io',
    recruiterContact: 'shreya.recruitment@thoughtworks.com',
    matchScore: 94,
    resumeVersionLabel: 'v2.1',
    timeline: [
      {
        id: 't1',
        title: 'Application Submitted',
        subtitle: 'Direct Greenhouse Portal Ingestion',
        description: 'Applied with Master Resume v2.1 targeting 2026 Batch Graduate Software Engineer role.',
        dateFormatted: 'Oct 19, 2024',
        completed: true,
        active: false,
        icon: 'send',
      },
      {
        id: 't2',
        title: 'ATS Screening Cleared',
        subtitle: 'Technical Keyword & Eligibility Verification',
        description: 'Automated 2026 batch eligibility confirmed. Matched skills: Java 21, Spring Boot, Microservices.',
        dateFormatted: 'Oct 21, 2024',
        completed: true,
        active: false,
        icon: 'verified',
      },
      {
        id: 't3',
        title: 'Online Technical Assessment (Passed)',
        subtitle: 'HackerEarth 90-min Coding Challenge',
        description: 'Score: 92/100 (Data Structures, Concurrency & SQL Optimization).',
        dateFormatted: 'Oct 24, 2024',
        completed: true,
        active: false,
        icon: 'terminal',
      },
      {
        id: 't4',
        title: 'Round 2 Technical Interview Scheduled',
        subtitle: 'Virtual Technical Round with Lead Technologist',
        description: 'Live pair programming on System Design and Concurrency. Google Meet session active.',
        dateFormatted: 'Oct 28, 2024 • 2:30 PM IST',
        completed: false,
        active: true,
        icon: 'videocam',
      },
      {
        id: 't5',
        title: 'Executive Cultural & Leadership Round',
        subtitle: 'Managing Director / Principal Consultant Round',
        description: 'Upcoming milestone following Round 2 clearance.',
        dateFormatted: 'Upcoming',
        completed: false,
        active: false,
        icon: 'people',
      },
      {
        id: 't6',
        title: 'Offer Decision & Letter Issuance',
        subtitle: 'Final CTC and Placement Confirmation',
        description: 'Final step in executive recruitment pathway.',
        dateFormatted: 'Target: Nov 05, 2024',
        completed: false,
        active: false,
        icon: 'stars',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#0f172a] font-sans antialiased pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Navigation SubBar */}
        <TrackerSubNav
          activeTab="APPLIED_KANBAN"
          onSelectTab={onNavigateTab}
          onOpenAddDrawer={() => onOpenEditDrawer(currentApp as any)}
        />

        {/* Back Link & Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-[#64748b]">
          <button
            onClick={onBack}
            className="flex items-center gap-1 hover:text-[#4338ca] transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to Kanban Board</span>
          </button>
          <span>/</span>
          <span className="text-[#0f172a]">{currentApp.company}</span>
          <span>/</span>
          <span className="text-[#4338ca]">Application Timeline</span>
        </div>

        {/* Company Header Card */}
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#e2e8f0] shadow-xs mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-xl bg-[#eef2ff] flex items-center justify-center text-[#4338ca] font-black text-2xl shadow-xs border border-[#c7d2fe]/50 shrink-0">
              {currentApp.logoText || currentApp.company.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center flex-wrap gap-2 mb-1.5">
                <span className="text-sm font-bold text-[#0f172a]">{currentApp.company}</span>
                <span className="w-1 h-1 rounded-full bg-[#cbd5e1]"></span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#ecfdf5] text-[#059669] text-[11px] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">verified</span>
                  <span>{currentApp.batchAllowed} Verified</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#eef2ff] text-[#4338ca] text-[11px] font-bold">
                  {currentApp.statusLabel || currentApp.stage}
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">
                {currentApp.title}
              </h1>
              <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-[#475569] mt-2">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                  <span>{currentApp.location} ({currentApp.workMode})</span>
                </span>
                <span className="flex items-center gap-1 font-bold text-[#0f172a]">
                  <span className="material-symbols-outlined text-[16px] text-[#059669]">payments</span>
                  <span>{currentApp.ctcText}</span>
                </span>
                <span className="flex items-center gap-1 text-[#64748b]">
                  <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                  <span>Applied {currentApp.appliedDateFormatted}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center flex-wrap gap-2.5">
            <button
              onClick={() => onOpenEditDrawer(currentApp as any)}
              className="px-4 py-2.5 rounded-lg bg-[#f8fafc] hover:bg-[#f1f5f9] text-xs font-bold text-[#0f172a] border border-[#e2e8f0] transition-all flex items-center gap-1.5 shadow-xs"
            >
              <span className="material-symbols-outlined text-[17px]">edit</span>
              <span>Edit Details</span>
            </button>
            <select
              value={currentApp.stage}
              onChange={(e) => handleStageChange(e.target.value as ApplicationStage)}
              className="h-10 px-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-xs font-bold text-[#4338ca] outline-none"
            >
              <option value="APPLIED">Stage: Applied</option>
              <option value="UNDER_REVIEW">Stage: Under Review</option>
              <option value="ASSESSMENT_SCHEDULED">Stage: Assessment Scheduled</option>
              <option value="TECHNICAL_INTERVIEW">Stage: Technical Interview</option>
              <option value="FINAL_ROUND">Stage: Final Round</option>
              <option value="OFFER_EXTENDED">Stage: Offer Extended</option>
              <option value="ARCHIVED">Stage: Archived</option>
            </select>
            {currentApp.portalUrl && (
              <a
                href={currentApp.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-lg bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
              >
                <span>Portal</span>
                <span className="material-symbols-outlined text-[15px]">open_in_new</span>
              </a>
            )}
          </div>
        </div>

        {/* 2-Column Split: 70% Left / 30% Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Timeline & Candidate Preparation (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Timeline Section */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#e2e8f0] shadow-xs flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
                    Verified Audit Trail
                  </span>
                  <h2 className="text-xl font-extrabold text-[#0f172a] tracking-tight">
                    Application Progress Timeline
                  </h2>
                  <p className="text-xs text-[#475569] mt-0.5">
                    Chronological milestone progress for this active pursuit.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-[#eef2ff] text-xs font-mono font-bold text-[#4338ca]">
                    Round 2 Active
                  </span>
                </div>
              </div>

              {/* Vertical Timeline Steps */}
              <div className="relative pl-6 sm:pl-8 flex flex-col gap-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#f1f5f9]">
                {currentApp.timeline.map((step) => {
                  const isCompleted = step.completed;
                  const isActive = step.active;

                  return (
                    <div key={step.id} className="relative flex flex-col gap-2">
                      {/* Checkpoint Dot */}
                      <div
                        className={`absolute -left-6 sm:-left-8 top-1 w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center ring-4 ring-white shadow-xs z-10 ${
                          isCompleted
                            ? 'bg-[#059669] text-white'
                            : isActive
                            ? 'bg-[#4338ca] text-white animate-pulse'
                            : 'bg-[#f1f5f9] text-[#64748b]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          {isCompleted ? 'check' : step.icon || 'circle'}
                        </span>
                      </div>

                      {/* Step Card */}
                      <div
                        className={`rounded-xl p-4 sm:p-5 border transition-all ${
                          isActive
                            ? 'bg-[#faf8ff] border-[#4338ca]/40 shadow-xs'
                            : 'bg-white border-[#e2e8f0]'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-[#0f172a]">{step.title}</h3>
                            {isActive && (
                              <span className="px-2 py-0.5 rounded-full bg-[#eef2ff] text-[#4338ca] text-[10px] font-bold uppercase tracking-wider">
                                Current
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-xs text-[#64748b]">
                            {step.dateFormatted}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-[#64748b] mb-1">
                          {step.subtitle}
                        </div>
                        <p className="text-xs text-[#475569] leading-relaxed">{step.description}</p>

                        {/* Meeting session callout if interview */}
                        {isActive && step.title.toLowerCase().includes('interview') && (
                          <div className="mt-4 p-3 bg-white rounded-lg border border-[#c7d2fe] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-[#eef2ff] flex items-center justify-center text-[#4338ca]">
                                <span className="material-symbols-outlined text-[18px]">videocam</span>
                              </div>
                              <div>
                                <div className="text-xs font-bold text-[#0f172a]">
                                  Google Meet Session Active
                                </div>
                                <div className="text-[11px] font-mono text-[#64748b]">
                                  meet.google.com/zkw-xsqe-rba
                                </div>
                              </div>
                            </div>
                            <a
                              href="https://meet.google.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-md bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold flex items-center gap-1 self-start sm:self-auto shadow-xs"
                            >
                              <span>Join Session</span>
                              <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Preparation Checklist Card */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#e2e8f0] shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#0f172a]">
                    Candidate Preparation Checklist
                  </h3>
                  <p className="text-xs text-[#475569]">
                    Targeted round review tasks to maximize interview outcome.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-[#059669]">
                  {checklist.filter((c) => c.completed).length} / {checklist.length} Completed
                </span>
              </div>

              <div className="space-y-2.5 pt-2">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklist(item.id)}
                    className="flex items-center gap-3 p-3 rounded-lg border border-[#e2e8f0] hover:bg-[#f8fafc] transition-colors cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => {}}
                      className="w-4 h-4 text-[#4338ca] rounded border-[#cbd5e1] focus:ring-[#4338ca]"
                    />
                    <span
                      className={`text-xs ${
                        item.completed ? 'line-through text-[#64748b]' : 'text-[#0f172a] font-medium'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Metadata & Notes (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Opportunity Dossier Card */}
            <div className="bg-white rounded-xl p-6 border border-[#e2e8f0] shadow-xs flex flex-col gap-4">
              <h3 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                Opportunity Metadata
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                  <span className="text-[#64748b]">Application ID</span>
                  <span className="font-mono font-bold text-[#0f172a]">{currentApp.id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                  <span className="text-[#64748b]">Match Score</span>
                  <span className="font-mono font-bold text-[#059669]">
                    {currentApp.matchScore}% ATS Verified
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                  <span className="text-[#64748b]">Eligible Batch</span>
                  <span className="font-bold text-[#0f172a]">{currentApp.batchAllowed}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                  <span className="text-[#64748b]">Compensation</span>
                  <span className="font-bold text-[#0f172a]">{currentApp.ctcText}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#64748b]">Work Arrangement</span>
                  <span className="font-medium text-[#0f172a]">{currentApp.workMode}</span>
                </div>
              </div>
            </div>

            {/* Resume Submitted Card */}
            <div className="bg-white rounded-xl p-6 border border-[#e2e8f0] shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                  Submitted Resume
                </span>
                <span className="px-2 py-0.5 rounded bg-[#ecfdf5] text-[#059669] text-[10px] font-mono font-bold">
                  ATS Score 94
                </span>
              </div>
              <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] flex items-center gap-3">
                <span className="material-symbols-outlined text-[#4338ca] text-[24px]">
                  description
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-[#0f172a] truncate">
                    Master Resume {currentApp.resumeVersionLabel || 'v2.1'}
                  </div>
                  <div className="text-[10px] text-[#64748b]">
                    Full-Stack & Systems • PDF Storage
                  </div>
                </div>
              </div>
              {onNavigateToResumeAnalysis && (
                <button
                  onClick={onNavigateToResumeAnalysis}
                  className="w-full py-2 rounded-lg bg-[#eef2ff] hover:bg-[#c7d2fe]/50 text-xs font-bold text-[#4338ca] transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[15px]">analytics</span>
                  <span>Inspect Resume Analysis</span>
                </button>
              )}
            </div>

            {/* Recruiter Contact Card */}
            <div className="bg-white rounded-xl p-6 border border-[#e2e8f0] shadow-xs flex flex-col gap-3">
              <span className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                Recruiter Contact
              </span>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#eef2ff] flex items-center justify-center text-[#4338ca] font-bold text-xs">
                  HR
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-[#0f172a] truncate">
                    {currentApp.recruiterContact || 'careers@thoughtworks.com'}
                  </div>
                  <div className="text-[10px] text-[#64748b]">University Recruiting Lead</div>
                </div>
              </div>
              {currentApp.recruiterContact && (
                <a
                  href={`mailto:${currentApp.recruiterContact}?subject=Interview Inquiry: ${encodeURIComponent(
                    currentApp.title
                  )}`}
                  className="w-full py-2 rounded-lg border border-[#e2e8f0] text-xs font-semibold text-[#0f172a] hover:bg-[#f8fafc] transition-all flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[15px]">email</span>
                  <span>Email Recruiter</span>
                </a>
              )}
            </div>

            {/* Private Notes Card */}
            <div className="bg-white rounded-xl p-6 border border-[#e2e8f0] shadow-xs flex flex-col gap-3">
              <span className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                Pursuit Notes
              </span>
              <textarea
                rows={4}
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="Private candidate observations, technical round tips, salary expectations..."
                className="p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-xs text-[#0f172a] outline-none focus:bg-white focus:ring-2 focus:ring-[#4338ca]/20 resize-none"
              />
              <button
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="w-full py-2 rounded-lg bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-xs"
              >
                {savingNotes ? <span>Saving...</span> : <span>Save Notes</span>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
