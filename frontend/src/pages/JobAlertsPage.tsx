import React, { useState, useEffect } from 'react';
import NotificationsSubNav, { NotificationsTab } from '../components/NotificationsSubNav';

interface JobAlertsPageProps {
  onNavigateTab: (tab: NotificationsTab) => void;
  onSelectJob?: (jobId: string) => void;
}

export default function JobAlertsPage({ onNavigateTab, onSelectJob }: JobAlertsPageProps) {
  const [alertStatus, setAlertStatus] = useState<'ACTIVE' | 'PAUSED'>('ACTIVE');
  const [cadence, setCadence] = useState<'IMMEDIATE' | 'DAILY' | 'WEEKLY'>('IMMEDIATE');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTogglePause = async () => {
    setIsToggling(true);
    try {
      const res = await fetch('/api/v1/notifications/toggle-pause?userId=user_arjun', { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        setAlertStatus(json.alertStatus || (alertStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'));
        showToast(
          json.alertStatus === 'PAUSED'
            ? 'Job Alerts paused. Crawlers will suspend outbound alerts.'
            : 'Job Alerts reactivated! Live background ingestion resumed.'
        );
      }
    } catch (e) {
      setAlertStatus((prev) => (prev === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'));
      showToast(alertStatus === 'ACTIVE' ? 'Alerts paused (offline).' : 'Alerts resumed (offline).');
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#0f172a] font-sans antialiased pb-20">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0f172a] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#334155] animate-in fade-in slide-in-from-bottom-2">
          <span className="material-symbols-outlined text-[#10b981] text-[20px]">check_circle</span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Navigation SubBar */}
        <NotificationsSubNav
          activeTab="JOB_ALERTS"
          onSelectTab={onNavigateTab}
          alertStatus={alertStatus}
        />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#eef2ff] text-[#4338ca] border border-[#c7d2fe]/60">
                Automated Intelligence
              </span>
              <span className="text-xs font-mono font-bold text-[#059669] bg-[#ecfdf5] px-2 py-0.5 rounded-md border border-[#a7f3d0]">
                2026 Batch Guaranteed
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">
              Job Alerts Management
            </h1>
            <p className="text-sm text-[#475569] mt-1 max-w-2xl font-normal">
              Manage high-precision automated alerts for verified entry-level openings based on your profile criteria.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateTab('NOTIFICATION_PREFERENCES')}
              className="px-4 py-2.5 rounded-xl border border-[#cbd5e1] text-[#0f172a] hover:bg-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer bg-white"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              <span>Edit Filters</span>
            </button>
            <button
              onClick={handleTogglePause}
              disabled={isToggling}
              className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer ${
                alertStatus === 'ACTIVE'
                  ? 'bg-[#d97706] hover:bg-[#b45309]'
                  : 'bg-[#4338ca] hover:bg-[#3730a3]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {alertStatus === 'ACTIVE' ? 'pause_circle' : 'play_circle'}
              </span>
              <span>{alertStatus === 'ACTIVE' ? 'Pause Alerts Stream' : 'Reactivate Alerts'}</span>
            </button>
          </div>
        </div>

        {/* Engine Telemetry Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border border-[#e2e8f0] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748b] font-bold">
                Automated Crawler Engine
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2.5 h-2.5 rounded-full ${alertStatus === 'ACTIVE' ? 'bg-[#10b981] animate-pulse' : 'bg-[#d97706]'}`}></span>
                <span className="font-extrabold text-sm text-[#0f172a]">
                  {alertStatus === 'ACTIVE' ? 'Operational &amp; Scanning' : 'Paused by User'}
                </span>
              </div>
              <p className="text-[11px] text-[#64748b] mt-1">Runs every 4 hours across direct ATS links</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#eef2ff] flex items-center justify-center text-[#4338ca]">
              <span className="material-symbols-outlined text-[20px]">radar</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-[#e2e8f0] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748b] font-bold">
                Last Alert Dispatched
              </span>
              <div className="font-extrabold text-sm text-[#0f172a] mt-1">
                Thoughtworks • ₹11.5 - ₹13.5 LPA
              </div>
              <p className="text-[11px] text-[#059669] font-medium mt-1">18 mins ago • 94% match match score</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#ecfdf5] flex items-center justify-center text-[#059669]">
              <span className="material-symbols-outlined text-[20px]">outgoing_mail</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-[#e2e8f0] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748b] font-bold">
                Dispatch Cadence
              </span>
              <select
                value={cadence}
                onChange={(e) => {
                  setCadence(e.target.value as any);
                  showToast(`Dispatch cadence updated to ${e.target.value.toLowerCase()}.`);
                }}
                className="mt-1 block font-extrabold text-xs text-[#0f172a] bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#4338ca] cursor-pointer"
              >
                <option value="IMMEDIATE">Immediate (Real-time trigger)</option>
                <option value="DAILY">Daily Digest at 6:00 PM IST</option>
                <option value="WEEKLY">Weekly Digest (Monday 9:00 AM)</option>
              </select>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#faf5ff] flex items-center justify-center text-[#9333ea]">
              <span className="material-symbols-outlined text-[20px]">schedule</span>
            </div>
          </div>
        </div>

        {/* Active Alert Criteria Card */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 sm:p-7 shadow-xs mb-8">
          <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4 mb-6">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[22px] text-[#4338ca]">filter_alt</span>
              <h2 className="text-base font-bold text-[#0f172a]">Your Active Alert Criteria</h2>
            </div>
            <button
              onClick={() => onNavigateTab('NOTIFICATION_PREFERENCES')}
              className="text-xs font-bold text-[#4338ca] hover:text-[#3730a3] flex items-center gap-1 cursor-pointer"
            >
              <span>Refine criteria</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Rule 1 */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">terminal</span>
                Target Domain &amp; Roles
              </span>
              <span className="font-bold text-sm text-[#0f172a]">Software Engineer / Backend</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {['Java 21', 'Spring Boot', 'Python', 'Go'].map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#f1f5f9] text-[#475569]">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Rule 2 */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">school</span>
                Experience &amp; Batch
              </span>
              <span className="font-bold text-sm text-[#0f172a]">Strictly Fresher Scope</span>
              <span className="text-xs text-[#059669] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
                2026 Graduating Cohort Verified
              </span>
            </div>

            {/* Rule 3 */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">location_on</span>
                Locations &amp; Modality
              </span>
              <span className="font-bold text-sm text-[#0f172a]">Bengaluru, Hyderabad, Pune</span>
              <span className="text-xs text-[#64748b]">Hybrid or In-Office Verified</span>
            </div>

            {/* Rule 4 */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">payments</span>
                Compensation Floor
              </span>
              <span className="font-bold text-sm text-[#0f172a]">Full-Time ≥ ₹2.4 LPA</span>
              <span className="text-xs text-[#059669] font-medium">Target range: ₹8.5L – ₹28.0L LPA</span>
            </div>
          </div>

          {/* Strict Guardrails Banner */}
          <div className="mt-6 pt-5 border-t border-[#f1f5f9] bg-[#f8fafc] rounded-xl p-4 flex items-start gap-3 border border-[#e2e8f0]">
            <span className="material-symbols-outlined text-[22px] text-[#059669] shrink-0 mt-0.5">verified_user</span>
            <div>
              <h4 className="text-xs font-bold text-[#0f172a]">Guaranteed Zero Spam Verification Protocol</h4>
              <p className="text-xs text-[#475569] mt-0.5 leading-relaxed">
                Openings below ₹2.4 LPA baseline, roles with unconfirmed/undisclosed compensation, mandatory training fees, unpaid trial assessments, or commercial consultancy proxies are automatically quarantined before notifications reach your terminal.
              </p>
            </div>
          </div>
        </div>

        {/* Recently Dispatched Alerts Feed */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0f172a] flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#4338ca]">mark_email_read</span>
              <span>Recently Dispatched Alerts</span>
            </h2>
            <span className="text-xs text-[#64748b] font-mono">3 Dispatched This Week</span>
          </div>

          {/* Alert Card 1 */}
          <div className="bg-white rounded-xl p-5 border border-[#e2e8f0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#eef2ff] text-[#4338ca] flex items-center justify-center font-extrabold text-base shrink-0 border border-[#c7d2fe]">
                TW
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-[#0f172a]">Thoughtworks</span>
                  <span className="text-xs text-[#64748b]">• 18 mins ago</span>
                  <span className="px-2 py-0.2 rounded-full font-mono text-[10px] font-bold bg-[#ecfdf5] text-[#059669]">
                    94% Fit
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[#0f172a]">Graduate Software Engineer (Java / Backend)</h3>
                <p className="text-xs text-[#475569] mt-0.5">₹11.5 - ₹13.5 LPA • Bengaluru / Pune • 2026 Batch Verified</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onSelectJob && onSelectJob('job_tw_01')}
                className="px-4 py-2 rounded-lg bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>View Job Details</span>
                <span className="material-symbols-outlined text-[15px]">north_east</span>
              </button>
            </div>
          </div>

          {/* Alert Card 2 */}
          <div className="bg-white rounded-xl p-5 border border-[#e2e8f0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#ecfdf5] text-[#059669] flex items-center justify-center font-extrabold text-base shrink-0 border border-[#a7f3d0]">
                RZP
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-[#0f172a]">Razorpay</span>
                  <span className="text-xs text-[#64748b]">• 3 days ago</span>
                  <span className="px-2 py-0.2 rounded-full font-mono text-[10px] font-bold bg-[#ecfdf5] text-[#059669]">
                    91% Fit
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[#0f172a]">Software Engineer 1 - Payments Core</h3>
                <p className="text-xs text-[#475569] mt-0.5">₹16.0 - ₹20.0 LPA • Bengaluru • Zero Bond Guarantee</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onSelectJob && onSelectJob('job_rzp_02')}
                className="px-4 py-2 rounded-lg bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>View Job Details</span>
                <span className="material-symbols-outlined text-[15px]">north_east</span>
              </button>
            </div>
          </div>

          {/* Alert Card 3 */}
          <div className="bg-white rounded-xl p-5 border border-[#e2e8f0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#faf5ff] text-[#9333ea] flex items-center justify-center font-extrabold text-base shrink-0 border border-[#e9d5ff]">
                PS
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-[#0f172a]">Persistent Systems</span>
                  <span className="text-xs text-[#64748b]">• Yesterday</span>
                  <span className="px-2 py-0.2 rounded-full font-mono text-[10px] font-bold bg-[#faf5ff] text-[#9333ea]">
                    Walk-in Drive
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[#0f172a]">Systems Engineer Trainee (Walk-in Campus Drive)</h3>
                <p className="text-xs text-[#475569] mt-0.5">₹7.0 - ₹9.0 LPA • Pune Campus (Hall B) • Bring Updated Resume Pack</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => showToast('Walk-in venue details & document checklist copied.')}
                className="px-4 py-2 rounded-lg bg-white border border-[#cbd5e1] hover:bg-[#f8fafc] text-[#0f172a] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[15px]">badge</span>
                <span>View Venue &amp; Docs</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
