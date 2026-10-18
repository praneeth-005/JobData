import React, { useState } from 'react';
import NotificationsSubNav, { NotificationsTab } from '../components/NotificationsSubNav';

interface ApplicationRemindersPageProps {
  onNavigateTab: (tab: NotificationsTab) => void;
  onNavigateToSchedule?: () => void;
  onNavigateToApplications?: (id?: string) => void;
}

export default function ApplicationRemindersPage({
  onNavigateTab,
  onNavigateToSchedule,
  onNavigateToApplications,
}: ApplicationRemindersPageProps) {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'URGENT' | 'INTERVIEWS'>('ALL');
  const [handledMap, setHandledMap] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyEmail = (company: string, role: string) => {
    const template = `Subject: Polite Follow-up: ${role} Application - Arjun Rao (2026 Batch)\n\nDear ${company} Hiring Team,\n\nI hope you are having a productive week.\n\nI am writing to respectfully follow up on my application for the ${role} position. Having completed the recent screening milestone, I remain extremely excited about the engineering challenges at ${company} and would welcome the opportunity to discuss how my hands-on backend background in Java, Spring Boot, and scalable system design aligns with your 2026 engineering cohort goals.\n\nPlease feel free to let me know if you require any additional work samples, repository links, or references.\n\nThank you for your time and consideration.\n\nWarm regards,\nArjun Rao\narjun.sharma2026@gmail.com | +91 98765 43210\nGitHub: github.com/arjun-rao-dev`;
    navigator.clipboard.writeText(template);
    showToast(`Executive email template for ${company} copied to clipboard! Ready to paste into Gmail.`);
  };

  const handleMarkHandled = (id: string) => {
    setHandledMap((prev) => ({ ...prev, [id]: true }));
    showToast('Reminder marked as resolved.');
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#0f172a] font-sans antialiased pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0f172a] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#334155] animate-in fade-in slide-in-from-bottom-2">
          <span className="material-symbols-outlined text-[#10b981] text-[20px]">check_circle</span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Navigation SubBar */}
        <NotificationsSubNav
          activeTab="APPLICATION_REMINDERS"
          onSelectTab={onNavigateTab}
          remindersCount={handledMap['juspay_followup'] ? 0 : 1}
        />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#eef2ff] text-[#4338ca] border border-[#c7d2fe]/60">
                Executive Precision
              </span>
              <span className="text-xs font-semibold text-[#475569] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
                Verified Milestones Only
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">
              Application Reminders
            </h1>
            <p className="text-sm text-[#475569] mt-1 max-w-2xl font-normal">
              Automated reminders generated strictly from your recorded interviews, assessments, and follow-up milestones.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'ALL' ? 'bg-[#4338ca] text-white shadow-xs' : 'bg-white border border-[#e2e8f0] text-[#475569]'
              }`}
            >
              All Active (4)
            </button>
            <button
              onClick={() => setActiveFilter('URGENT')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'URGENT' ? 'bg-[#dc2626] text-white shadow-xs' : 'bg-white border border-[#e2e8f0] text-[#dc2626]'
              }`}
            >
              Urgent (1)
            </button>
            <button
              onClick={() => setActiveFilter('INTERVIEWS')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'INTERVIEWS' ? 'bg-[#059669] text-white shadow-xs' : 'bg-white border border-[#e2e8f0] text-[#059669]'
              }`}
            >
              Interviews (1)
            </button>
          </div>
        </div>

        {/* Telemetry Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border border-[#e2e8f0] shadow-xs">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748b] font-bold">
              Upcoming Interviews
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-[#0f172a]">1</span>
              <span className="text-xs font-semibold text-[#059669]">Scheduled Round</span>
            </div>
            <p className="text-xs text-[#475569] mt-1 font-medium">
              Thoughtworks — Round 2 (Tomorrow 2:30 PM)
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-[#e2e8f0] shadow-xs">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748b] font-bold">
              Timed Assessments
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-[#0f172a]">1</span>
              <span className="text-xs font-semibold text-[#4338ca]">Active Window</span>
            </div>
            <p className="text-xs text-[#475569] mt-1 font-medium">
              Swiggy — HackerEarth (Closes in 48h)
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-[#e2e8f0] shadow-xs">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748b] font-bold">
              Recruiter Outreach
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-[#dc2626]">
                {handledMap['juspay_followup'] ? '0' : '1 Due'}
              </span>
              <span className="text-xs font-semibold text-[#d97706]">• Overdue</span>
            </div>
            <p className="text-xs text-[#475569] mt-1 font-medium">
              {handledMap['juspay_followup'] ? 'All follow-ups resolved' : 'Juspay overdue by 2 business days'}
            </p>
          </div>
        </div>

        {/* Section 1: Requires Immediate Attention (Overdue) */}
        {(!handledMap['juspay_followup'] && activeFilter !== 'INTERVIEWS') && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[20px] text-[#dc2626]">warning</span>
              <h2 className="text-base font-bold text-[#0f172a]">Requires Immediate Attention (Overdue)</h2>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]">
                1 Critical Action
              </span>
            </div>

            <div className="bg-white rounded-2xl border-2 border-[#fecaca] p-6 shadow-sm flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#fef2f2] text-[#dc2626] flex items-center justify-center font-extrabold text-base shrink-0 border border-[#fecaca]">
                    JP
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-[#0f172a]">Juspay Technologies</span>
                      <span className="text-xs text-[#64748b]">• Applied Oct 12, 2026</span>
                      <span className="px-2 py-0.2 rounded-full font-mono text-[10px] font-bold bg-[#ecfdf5] text-[#059669]">
                        2026 Batch
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-[#0f172a]">
                      Junior Java Backend Developer — Assessment Response Stalled
                    </h3>
                    <p className="text-xs text-[#dc2626] font-semibold mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">timer_off</span>
                      Follow-up was recommended on Oct 20 (now 2 business days overdue)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleMarkHandled('juspay_followup')}
                    className="px-3 py-1.5 rounded-lg border border-[#cbd5e1] hover:bg-[#f8fafc] text-[#475569] text-xs font-semibold transition-all cursor-pointer"
                  >
                    Mark Handled
                  </button>
                </div>
              </div>

              {/* Partner Advice Callout */}
              <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-xl p-3.5 text-xs text-[#92400e] flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#d97706] shrink-0 mt-0.5">lightbulb</span>
                <p className="leading-relaxed">
                  <strong>Partner Benchmark:</strong> Sending a polite follow-up inquiry at 7–10 business days post-assessment is proven to accelerate recruiter evaluation without appearing intrusive.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#f1f5f9]">
                {onNavigateToApplications && (
                  <button
                    onClick={() => onNavigateToApplications('app_jp_04')}
                    className="px-4 py-2 rounded-lg bg-white border border-[#cbd5e1] hover:bg-[#f8fafc] text-[#0f172a] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Open Application Details</span>
                    <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                  </button>
                )}
                <button
                  onClick={() => handleCopyEmail('Juspay', 'Junior Java Backend Developer')}
                  className="px-4 py-2 rounded-lg bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[15px]">content_copy</span>
                  <span>Copy Polite Email Template</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Upcoming This Week */}
        {activeFilter !== 'URGENT' && (
          <div className="mb-8 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#0f172a] flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#4338ca]">calendar_month</span>
                <span>Upcoming This Week</span>
              </h2>
              <span className="text-xs text-[#64748b] font-mono">2 Scheduled Deliverables</span>
            </div>

            {/* Upcoming Item 1: Interview */}
            <div className="bg-white rounded-xl p-5 border border-[#e2e8f0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#ecfdf5] text-[#059669] flex items-center justify-center font-extrabold text-base shrink-0 border border-[#a7f3d0]">
                  TW
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-[#0f172a]">Thoughtworks</span>
                    <span className="text-xs font-mono font-bold text-[#059669] bg-[#ecfdf5] px-2 py-0.2 rounded-full">
                      Interview Tomorrow • 2:30 PM IST
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-[#0f172a]">
                    Round 2 Technical Interview (System Architecture &amp; OOP Design)
                  </h3>
                  <p className="text-xs text-[#475569] mt-0.5">
                    Panel: Siddharth Sen (Lead Technologist) • 45 Mins Duration • Google Meet
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {onNavigateToSchedule && (
                  <button
                    onClick={onNavigateToSchedule}
                    className="px-4 py-2 rounded-lg bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">videocam</span>
                    <span>Join Meeting &amp; Prep</span>
                  </button>
                )}
              </div>
            </div>

            {/* Upcoming Item 2: Assessment */}
            <div className="bg-white rounded-xl p-5 border border-[#e2e8f0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#eef2ff] text-[#4338ca] flex items-center justify-center font-extrabold text-base shrink-0 border border-[#c7d2fe]">
                  SWG
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-[#0f172a]">Swiggy</span>
                    <span className="text-xs font-mono font-bold text-[#d97706] bg-[#fffbeb] px-2 py-0.2 rounded-full">
                      Assessment Window Closes in 48h
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-[#0f172a]">
                    HackerEarth 90-min Coding Challenge (Graph Algorithms &amp; Concurrency)
                  </h3>
                  <p className="text-xs text-[#475569] mt-0.5">
                    Window deadline: Oct 24, 11:59 PM IST • Full-Screen Proctoring
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => showToast('Opening assessment link in verified window...')}
                  className="px-4 py-2 rounded-lg bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Start Challenge</span>
                  <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Applications Under Tracking */}
        {activeFilter === 'ALL' && (
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-bold text-[#0f172a] flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#64748b]">hourglass_top</span>
              <span>Logged Applications Without Impending Milestones</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-5 border border-[#e2e8f0] shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ecfdf5] text-[#059669] flex items-center justify-center font-bold text-sm">
                    PP
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#0f172a]">PhonePe • SDE 1 Distributed Systems</h4>
                    <span className="text-[11px] text-[#059669] font-medium">Official Offer Extended • Review Acceptance Letter</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ecfdf5] text-[#059669]">OFFER</span>
              </div>

              <div className="bg-white rounded-xl p-5 border border-[#e2e8f0] shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f8fafc] text-[#475569] flex items-center justify-center font-bold text-sm">
                    ZH
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#0f172a]">Zoho Corporation • Member Technical Staff</h4>
                    <span className="text-[11px] text-[#64748b]">Application Ingested • Round 1 Assessment Scheduled</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#f1f5f9] text-[#475569]">APPLIED</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
