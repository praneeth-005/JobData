import React, { useState, useEffect } from 'react';
import { ApplicationStage, JobApplication, SavedJobItem } from '../types';

interface ApplicationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (app: JobApplication) => void;
  savedJobs?: SavedJobItem[];
  prefillJob?: SavedJobItem | null;
  editingApplication?: JobApplication | null;
}

export default function ApplicationDrawer({
  isOpen,
  onClose,
  onSaved,
  savedJobs = [],
  prefillJob = null,
  editingApplication = null,
}: ApplicationDrawerProps) {
  const [sourceMode, setSourceMode] = useState<'prefill' | 'manual'>('prefill');
  const [selectedSavedJobId, setSelectedSavedJobId] = useState<string>('');

  // Form Fields
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [portalUrl, setPortalUrl] = useState('');
  const [ctcText, setCtcText] = useState('₹12.0 - ₹16.0 LPA');
  const [location, setLocation] = useState('Bengaluru');
  const [workMode, setWorkMode] = useState('Hybrid');
  const [stage, setStage] = useState<ApplicationStage>('APPLIED');
  const [resumeVersion, setResumeVersion] = useState('v2.1 (Full-Stack Backend Master)');
  const [recruiterContact, setRecruiterContact] = useState('');
  const [notes, setNotes] = useState('');
  const [nextActionTitle, setNextActionTitle] = useState('Awaiting Initial Review & Screening');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form state
  useEffect(() => {
    if (editingApplication) {
      setSourceMode('manual');
      setCompany(editingApplication.company);
      setTitle(editingApplication.title);
      setPortalUrl(editingApplication.portalUrl || '');
      setCtcText(editingApplication.ctcText);
      setLocation(editingApplication.location);
      setWorkMode(editingApplication.workMode);
      setStage(editingApplication.stage);
      setResumeVersion(editingApplication.resumeVersionLabel || 'v2.1 (Full-Stack Backend Master)');
      setRecruiterContact(editingApplication.recruiterContact || '');
      setNotes(editingApplication.notes || '');
      setNextActionTitle(editingApplication.nextActionTitle || 'Awaiting Initial Review & Screening');
    } else if (prefillJob) {
      setSourceMode('prefill');
      setSelectedSavedJobId(prefillJob.id);
      applyJobToFields(prefillJob);
    } else if (savedJobs.length > 0) {
      setSelectedSavedJobId(savedJobs[0].id);
      applyJobToFields(savedJobs[0]);
    } else {
      setSourceMode('manual');
      setCompany('Thoughtworks');
      setTitle('Graduate Software Engineer (Java / Backend)');
      setPortalUrl('https://thoughtworks.greenhouse.io/jobs/482910');
      setCtcText('₹8.5 LPA');
      setLocation('Bengaluru');
      setWorkMode('Hybrid (2 days/wk)');
      setStage('APPLIED');
    }
  }, [editingApplication, prefillJob, isOpen]);

  const applyJobToFields = (job: SavedJobItem) => {
    setCompany(job.company);
    setTitle(job.title);
    setPortalUrl(job.portalUrl || `https://careers.${job.company.toLowerCase().replace(/\s+/g, '')}.com`);
    setCtcText(job.ctcText);
    setLocation(job.location);
    setWorkMode(job.workMode);
    setRecruiterContact(`careers@${job.company.toLowerCase().replace(/\s+/g, '')}.com`);
    setNotes(`Saved from 2026 Batch Verified Portal. Match score: ${job.matchScore}%.`);
  };

  const handleSavedJobChange = (jobId: string) => {
    setSelectedSavedJobId(jobId);
    const found = savedJobs.find((j) => j.id === jobId || j.jobId === jobId);
    if (found) {
      applyJobToFields(found);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !title.trim()) return;

    setIsSubmitting(true);
    const payload = {
      jobId: selectedSavedJobId || `job_${Date.now()}`,
      company: company.trim(),
      title: title.trim(),
      logoText: company.substring(0, Math.min(2, company.length)).toUpperCase(),
      ctcText: ctcText.trim(),
      ctcLpa: parseFloat(ctcText.replace(/[^0-9.]/g, '')) || 12.0,
      location: location.trim(),
      workMode: workMode.trim(),
      batchAllowed: '2026 Batch',
      stage,
      resumeVersionId: resumeVersion.includes('v2.1') ? 'res_v21' : 'res_v20',
      resumeVersionLabel: resumeVersion.split(' ')[0],
      portalUrl: portalUrl.trim(),
      recruiterContact: recruiterContact.trim(),
      notes: notes.trim(),
    };

    try {
      let resultApp: JobApplication;
      if (editingApplication) {
        const res = await fetch(`/api/v1/tracker/applications/${editingApplication.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...payload,
            statusLabel: getStageLabel(stage),
            nextActionTitle,
          }),
        });
        if (res.ok) {
          resultApp = await res.json();
        } else {
          resultApp = {
            ...editingApplication,
            ...payload,
            stage,
            statusLabel: getStageLabel(stage),
            nextActionTitle,
          };
        }
      } else {
        const res = await fetch('/api/v1/tracker/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          resultApp = await res.json();
        } else {
          resultApp = {
            id: `app_${Date.now().toString().slice(-6)}`,
            userId: 'user_arjun',
            jobId: payload.jobId,
            company: payload.company,
            title: payload.title,
            logoText: payload.logoText,
            ctcText: payload.ctcText,
            ctcLpa: payload.ctcLpa,
            location: payload.location,
            workMode: payload.workMode,
            batchAllowed: '2026 Batch',
            stage,
            statusLabel: getStageLabel(stage),
            nextActionTitle,
            appliedDateFormatted: 'Today',
            portalUrl: payload.portalUrl,
            recruiterContact: payload.recruiterContact,
            notes: payload.notes,
            matchScore: 94,
            timeline: [
              {
                id: 'tl_1',
                title: 'Application Submitted',
                subtitle: 'Direct Portal Ingestion',
                description: 'Verified enterprise tracking created with Master Resume v2.1',
                dateFormatted: 'Today',
                completed: true,
                active: false,
                icon: 'send',
              },
            ],
          };
        }
      }

      onSaved(resultApp);
      onClose();
    } catch (err) {
      console.error('Error saving application:', err);
      onSaved({
        id: editingApplication ? editingApplication.id : `app_${Date.now().toString().slice(-6)}`,
        userId: 'user_arjun',
        jobId: selectedSavedJobId || `job_${Date.now()}`,
        company,
        title,
        logoText: company.substring(0, 2).toUpperCase(),
        ctcText,
        ctcLpa: 12.0,
        location,
        workMode,
        batchAllowed: '2026 Batch',
        stage,
        statusLabel: getStageLabel(stage),
        nextActionTitle,
        appliedDateFormatted: 'Today',
        matchScore: 92,
        timeline: [],
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStageLabel = (st: ApplicationStage): string => {
    switch (st) {
      case 'APPLIED':
        return 'Applied / Submitted';
      case 'UNDER_REVIEW':
        return 'Under Review & ATS Screening';
      case 'ASSESSMENT_SCHEDULED':
        return 'Online Assessment Scheduled';
      case 'TECHNICAL_INTERVIEW':
        return 'Technical Interview Round 2';
      case 'FINAL_ROUND':
        return 'Executive Final Round';
      case 'OFFER_EXTENDED':
        return 'Offer Letter Extended';
      case 'REJECTED':
        return 'Application Inactive';
      case 'ARCHIVED':
        return 'Archived Pursuit';
      default:
        return 'Tracked';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <div className="relative w-full max-w-[640px] bg-white shadow-2xl flex flex-col h-full z-10 border-l border-[#e2e8f0]">
        {/* Header */}
        <div className="px-6 sm:px-8 pt-7 pb-5 bg-white border-b border-[#f1f5f9] flex items-start justify-between shrink-0">
          <div className="flex flex-col gap-1 pr-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#eef2ff] text-[#4338ca] text-[11px] font-bold tracking-wider uppercase">
                Application Record
              </span>
              <span className="text-xs text-[#64748b] font-medium">• Strict 2026 Batch Sync</span>
            </div>
            <h2 className="text-2xl font-bold text-[#0f172a] tracking-tight">
              {editingApplication ? 'Edit Application Details' : 'Add New Application'}
            </h2>
            <p className="text-xs text-[#475569]">
              Track an opportunity from external submission to offer letter with verified audit trail.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close drawer"
            className="w-9 h-9 -mr-2 -mt-1 rounded-full flex items-center justify-center text-[#64748b] hover:text-[#0f172a] hover:bg-[#f8fafc] transition-all"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
          {/* Source Mode Selector */}
          {!editingApplication && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                Source Mode
              </span>
              <div className="grid grid-cols-2 p-1 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                <button
                  type="button"
                  onClick={() => setSourceMode('prefill')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    sourceMode === 'prefill'
                      ? 'bg-white shadow-xs text-[#4338ca]'
                      : 'text-[#64748b] hover:text-[#0f172a]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px]">bookmark_added</span>
                  <span>Pre-fill from Saved Jobs</span>
                  <span className="ml-1 text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-[#059669]/10 text-[#059669] font-bold">
                    Recommended
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setSourceMode('manual')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    sourceMode === 'manual'
                      ? 'bg-white shadow-xs text-[#4338ca]'
                      : 'text-[#64748b] hover:text-[#0f172a]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px]">edit_note</span>
                  <span>Enter Manually</span>
                </button>
              </div>
            </div>
          )}

          {/* Pre-fill Selector Card */}
          {sourceMode === 'prefill' && !editingApplication && savedJobs.length > 0 && (
            <div className="rounded-xl bg-[#f8fafc] p-4 border border-[#e2e8f0] shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#059669] text-[17px]">verified</span>
                  <span className="text-xs font-bold text-[#059669] uppercase tracking-wider">
                    Linked to Verified Listing
                  </span>
                </div>
                <span className="text-[11px] text-[#64748b]">
                  {savedJobs.length} opportunities saved
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#475569]">Choose Saved Job Listing:</label>
                <select
                  value={selectedSavedJobId}
                  onChange={(e) => handleSavedJobChange(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-[#e2e8f0] rounded-lg text-xs font-semibold text-[#0f172a] outline-none focus:ring-2 focus:ring-[#4338ca]/20"
                >
                  {savedJobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.company} — {j.title} ({j.ctcText} • {j.batchAllowed})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Core Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#0f172a]">
                Company Name <span className="text-[#4338ca]">*</span>
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Google India, Thoughtworks"
                className="h-11 px-3.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-xs font-medium text-[#0f172a] outline-none focus:bg-white focus:ring-2 focus:ring-[#4338ca]/20 focus:border-[#4338ca]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#0f172a]">
                Job Title / Role <span className="text-[#4338ca]">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Graduate Software Engineer"
                className="h-11 px-3.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-xs font-medium text-[#0f172a] outline-none focus:bg-white focus:ring-2 focus:ring-[#4338ca]/20 focus:border-[#4338ca]"
              />
            </div>
          </div>

          {/* URL */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#0f172a]">Application / Portal URL</label>
              {portalUrl && (
                <a
                  href={portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#4338ca] hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Test Link</span>
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </a>
              )}
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-3 text-[#64748b] text-[17px]">
                link
              </span>
              <input
                type="url"
                value={portalUrl}
                onChange={(e) => setPortalUrl(e.target.value)}
                placeholder="https://careers.company.com/jobs/..."
                className="w-full h-11 pl-9 pr-3.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-xs font-medium text-[#0f172a] outline-none focus:bg-white focus:ring-2 focus:ring-[#4338ca]/20 focus:border-[#4338ca]"
              />
            </div>
          </div>

          {/* Stage Selector Chips */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#0f172a]">Current Application Stage</label>
              <span className="text-[11px] font-semibold text-[#4338ca]">
                {getStageLabel(stage)}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'APPLIED' as ApplicationStage, label: 'Applied', icon: 'send' },
                { id: 'UNDER_REVIEW' as ApplicationStage, label: 'In Review', icon: 'rule' },
                { id: 'TECHNICAL_INTERVIEW' as ApplicationStage, label: 'Interview', icon: 'videocam' },
                { id: 'OFFER_EXTENDED' as ApplicationStage, label: 'Offer', icon: 'stars' },
              ].map((st) => {
                const isSelected = stage === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setStage(st.id)}
                    className={`py-2.5 px-3 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-white border-[#4338ca] text-[#4338ca] shadow-xs ring-2 ring-[#4338ca]/20'
                        : 'bg-[#f8fafc] border-[#e2e8f0] text-[#64748b] hover:bg-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{st.icon}</span>
                    <span>{st.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Compensation, Work Mode, & Batch Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#0f172a]">CTC Package</label>
              <input
                type="text"
                value={ctcText}
                onChange={(e) => setCtcText(e.target.value)}
                placeholder="₹12.0 - ₹15.0 LPA"
                className="h-10 px-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-xs text-[#0f172a] outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#0f172a]">Work Arrangement</label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
                className="h-10 px-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-xs text-[#0f172a] outline-none"
              >
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#0f172a]">Batch Eligibility</label>
              <div className="h-10 px-3 rounded-lg bg-[#ecfdf5] border border-[#a7f3d0] flex items-center justify-between text-xs font-bold text-[#065f46]">
                <span>2026 Batch</span>
                <span className="material-symbols-outlined text-[16px]">verified</span>
              </div>
            </div>
          </div>

          {/* Linked Resume Version */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#0f172a]">
              Submitted Resume Version
            </label>
            <select
              value={resumeVersion}
              onChange={(e) => setResumeVersion(e.target.value)}
              className="h-10 px-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-xs font-medium text-[#0f172a] outline-none focus:ring-2 focus:ring-[#4338ca]/20"
            >
              <option value="v2.1 (Full-Stack Backend Master)">
                Master Resume v2.1 — Full-Stack & Systems (ATS Score 94)
              </option>
              <option value="v2.0 (Core Systems & Microservices)">
                Master Resume v2.0 — Core Systems & Concurrency (ATS Score 87)
              </option>
              <option value="v1.0 (Initial Fresher Draft)">
                Master Resume v1.0 — Initial Fresher Draft (ATS Score 76)
              </option>
            </select>
          </div>

          {/* Recruiter / Contact */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#0f172a]">
              Recruiter / Point of Contact
            </label>
            <input
              type="text"
              value={recruiterContact}
              onChange={(e) => setRecruiterContact(e.target.value)}
              placeholder="e.g. shreya.recruitment@thoughtworks.com"
              className="h-10 px-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-xs text-[#0f172a] outline-none"
            />
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#0f172a]">Pursuit Notes & Prep Strategy</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add interview round takeaways, referrals, or follow-up timelines..."
              className="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-xs text-[#0f172a] outline-none resize-none"
            />
          </div>
        </form>

        {/* Sticky Drawer Footer */}
        <div className="px-6 sm:px-8 py-4 bg-white border-t border-[#f1f5f9] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg text-xs font-semibold text-[#64748b] hover:bg-[#f8fafc] transition-all"
          >
            Discard
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !company || !title}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#4338ca] hover:bg-[#3730a3] disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {isSubmitting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Saving Record...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[17px]">check</span>
                <span>{editingApplication ? 'Update Pursuit' : 'Save & Track Pursuit'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
