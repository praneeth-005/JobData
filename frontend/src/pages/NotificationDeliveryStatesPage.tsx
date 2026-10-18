import React, { useState } from 'react';
import NotificationsSubNav, { NotificationsTab } from '../components/NotificationsSubNav';

interface NotificationDeliveryStatesPageProps {
  onNavigateTab: (tab: NotificationsTab) => void;
  onNavigateToFindJobs?: () => void;
}

export default function NotificationDeliveryStatesPage({
  onNavigateTab,
  onNavigateToFindJobs,
}: NotificationDeliveryStatesPageProps) {
  // Retry state
  const [retryStatus, setRetryStatus] = useState<'IDLE' | 'RETRYING' | 'SUCCESS'>('IDLE');
  // Paused state toggle
  const [isPaused, setIsPaused] = useState(true);
  // Resend verification timer
  const [countdown, setCountdown] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRetrySmtp = () => {
    setRetryStatus('RETRYING');
    setTimeout(() => {
      setRetryStatus('SUCCESS');
      showToast('SMTP handshake acknowledged! Outbound message successfully delivered to inbox.');
      setTimeout(() => setRetryStatus('IDLE'), 4000);
    }, 1500);
  };

  const handleTogglePause = () => {
    setIsPaused((prev) => !prev);
    showToast(isPaused ? 'Job alert ingestion reactivated!' : 'Job alert ingestion stream paused.');
  };

  const handleResendVerification = () => {
    if (countdown !== null) return;
    setCountdown(45);
    showToast('Verification email resent to arjun.sharma2026@gmail.com.');
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
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
          activeTab="NOTIFICATION_STATES"
          onSelectTab={onNavigateTab}
        />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#eef2ff] text-[#4338ca] border border-[#c7d2fe]/60">
                System Resilience
              </span>
              <span className="text-xs font-mono font-bold text-[#475569]">
                Interactive Component Library
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">
              Notification States &amp; Delivery Feedback
            </h1>
            <p className="text-sm text-[#475569] mt-1 max-w-2xl font-normal">
              Explore edge-case system states, delivery bounce handshakes, alert pause controls, and verification prompts.
            </p>
          </div>
        </div>

        {/* State 1: Clean Empty State */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#64748b]">
              State 01: Zero Unread / Clean Caught-Up State
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-10 text-center flex flex-col items-center justify-center shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-[#ecfdf5] text-[#059669] flex items-center justify-center mb-4 border border-[#a7f3d0]">
              <span className="material-symbols-outlined text-[34px]">done_all</span>
            </div>
            <h2 className="text-lg font-bold text-[#0f172a]">You're all caught up!</h2>
            <p className="text-xs text-[#475569] mt-1.5 max-w-md leading-relaxed">
              All active job alerts, interview milestones, and follow-up prompts have been reviewed. Automated background crawlers continue monitoring direct career portals for 2026 batch freshers.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {onNavigateToFindJobs && (
                <button
                  onClick={onNavigateToFindJobs}
                  className="px-4 py-2 rounded-xl bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">travel_explore</span>
                  <span>Explore Job Catalog</span>
                </button>
              )}
              <button
                onClick={() => onNavigateTab('JOB_ALERTS')}
                className="px-4 py-2 rounded-xl border border-[#cbd5e1] hover:bg-[#f8fafc] text-[#0f172a] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">radar</span>
                <span>Manage Alert Rules</span>
              </button>
            </div>
          </div>
        </div>

        {/* State 2: Delivery Failure / Retry State */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#dc2626]">
              State 02: Outbound SMTP Delivery Failure &amp; Handshake Recovery
            </span>
          </div>

          <div className="bg-white rounded-2xl border-2 border-[#fecaca] p-6 sm:p-7 shadow-xs flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#fef2f2] text-[#dc2626] flex items-center justify-center font-extrabold text-base shrink-0 border border-[#fecaca]">
                  <span className="material-symbols-outlined text-[24px]">forward_to_inbox</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.2 rounded-full font-mono text-[10px] font-bold bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]">
                      BOUNCE DETECTED
                    </span>
                    <span className="text-xs text-[#64748b]">• Channel: Direct Email</span>
                  </div>
                  <h3 className="text-base font-bold text-[#0f172a]">
                    Email Delivery Failed: Thoughtworks SDE Job Alert
                  </h3>
                  <p className="text-xs text-[#dc2626] font-mono mt-1">
                    SMTP Error 554: Temporary connection handshake timeout with mx.google.com
                  </p>
                  <p className="text-xs text-[#475569] mt-1.5 leading-relaxed">
                    The in-app notification was delivered to your portal successfully. The outbound email dispatch to{' '}
                    <strong>arjun.sharma2026@gmail.com</strong> was queued for retry.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                <button
                  onClick={handleRetrySmtp}
                  disabled={retryStatus === 'RETRYING'}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                    retryStatus === 'SUCCESS'
                      ? 'bg-[#059669] text-white'
                      : retryStatus === 'RETRYING'
                      ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      : 'bg-[#4338ca] hover:bg-[#3730a3] text-white'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[16px] ${retryStatus === 'RETRYING' ? 'animate-spin' : ''}`}>
                    {retryStatus === 'SUCCESS' ? 'check_circle' : retryStatus === 'RETRYING' ? 'progress_activity' : 'replay'}
                  </span>
                  <span>
                    {retryStatus === 'SUCCESS'
                      ? 'Handshake Ack: Queued'
                      : retryStatus === 'RETRYING'
                      ? 'Re-attempting SMTP handshake...'
                      : 'Retry Email Dispatch'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* State 3: Alerts Paused State */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#d97706]">
              State 03: User-Suspended / Paused State
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-[#fed7aa] p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#fffbeb] text-[#d97706] flex items-center justify-center font-extrabold text-base shrink-0 border border-[#fde68a]">
                <span className="material-symbols-outlined text-[24px]">pause_circle</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.2 rounded-full font-mono text-[10px] font-bold bg-[#fffbeb] text-[#d97706] border border-[#fde68a]">
                    {isPaused ? 'ALERT INGESTION INACTIVE' : 'ACTIVE DISPATCH STREAM'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#0f172a]">
                  {isPaused ? 'Job Alerts Are Paused' : 'Job Alerts Are Active'}
                </h3>
                <p className="text-xs text-[#475569] mt-1 leading-relaxed max-w-xl">
                  {isPaused
                    ? 'Automated background emails and notification pings are temporarily suspended. Your tracked applications, saved jobs, and interview calendars remain fully active.'
                    : 'Automated crawlers are continuously screening verified 2026 Batch fresher openings across Workday, Greenhouse, and direct portals.'}
                </p>
              </div>
            </div>

            <button
              onClick={handleTogglePause}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs shrink-0 ${
                isPaused
                  ? 'bg-[#059669] hover:bg-[#047857] text-white'
                  : 'bg-[#d97706] hover:bg-[#b45309] text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isPaused ? 'play_arrow' : 'pause'}
              </span>
              <span>{isPaused ? 'Resume Job Alerts' : 'Pause Automation Stream'}</span>
            </button>
          </div>
        </div>

        {/* State 4: Channel Verification Pending */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#4338ca]">
              State 04: Delivery Channel Unverified
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-[#cbd5e1] p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#eef2ff] text-[#4338ca] flex items-center justify-center font-extrabold text-base shrink-0 border border-[#c7d2fe]">
                <span className="material-symbols-outlined text-[24px]">mark_email_unread</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.2 rounded-full font-mono text-[10px] font-bold bg-[#eef2ff] text-[#4338ca] border border-[#c7d2fe]">
                    ACTION REQUIRED
                  </span>
                  <span className="text-xs text-[#64748b]">• Security &amp; Compliance</span>
                </div>
                <h3 className="text-base font-bold text-[#0f172a]">
                  Direct Email Alerts Channel Unverified
                </h3>
                <p className="text-xs text-[#475569] mt-1 leading-relaxed max-w-xl">
                  Outbound email alerts to <strong>arjun.sharma2026@gmail.com</strong> cannot be dispatched until ownership confirmation is complete. Please click the verification link sent to your inbox.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleResendVerification}
                disabled={countdown !== null}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs ${
                  countdown !== null
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                    : 'bg-[#4338ca] hover:bg-[#3730a3] text-white cursor-pointer'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                <span>
                  {countdown !== null ? `Resend in ${countdown}s` : 'Resend Verification Email'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
