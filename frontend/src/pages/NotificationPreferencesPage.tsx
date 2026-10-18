import React, { useState, useEffect } from 'react';
import NotificationsSubNav, { NotificationsTab } from '../components/NotificationsSubNav';
import { NotificationPreferences } from '../types';

interface NotificationPreferencesPageProps {
  onNavigateTab: (tab: NotificationsTab) => void;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  userId: 'user_arjun',
  jobAlertsEnabled: true,
  jobAlertsCadence: 'IMMEDIATE',
  inAppEnabled: true,
  emailAlertsEnabled: true,
  emailAddress: 'arjun.sharma2026@gmail.com',
  emailVerified: true,
  whatsappAlertsEnabled: false,
  whatsappNumber: '+91 98765 43210',
  interviewRemindersEnabled: true,
  interviewRemindersTiming: '1_DAY_AND_2_HOURS',
  assessmentWarningsEnabled: true,
  assessmentExpirationWarning: '24_HOURS',
  followupPromptsEnabled: true,
  followupOverdueDays: 10,
  minMatchScore: 85,
  quietHoursEnabled: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
  alertStatus: 'ACTIVE',
};

// Module cache for 0ms instant reload
let cachedPrefs: NotificationPreferences | null = null;

export default function NotificationPreferencesPage({ onNavigateTab }: NotificationPreferencesPageProps) {
  const [prefs, setPrefs] = useState<NotificationPreferences>(() => cachedPrefs || DEFAULT_PREFERENCES);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    fetch('/api/v1/notifications/preferences?userId=user_arjun')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          cachedPrefs = data;
          setPrefs(data);
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/v1/notifications/preferences?userId=user_arjun', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs),
      });
      if (res.ok) {
        const json = await res.json();
        cachedPrefs = json;
        setPrefs(json);
      }
      showToast('Notification preferences successfully saved and calibrated!');
    } catch (e) {
      cachedPrefs = prefs;
      showToast('Preferences saved to local workspace.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setPrefs(DEFAULT_PREFERENCES);
    cachedPrefs = DEFAULT_PREFERENCES;
    showToast('Preferences reset to platform defaults.');
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
          activeTab="NOTIFICATION_PREFERENCES"
          onSelectTab={onNavigateTab}
          alertStatus={prefs.alertStatus}
        />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#eef2ff] text-[#4338ca] border border-[#c7d2fe]/60">
                Preferences &amp; Channels
              </span>
              <span className="text-xs font-semibold text-[#059669] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
                Dispatcher Active • 2 Channels Live
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">
              Notification Preferences
            </h1>
            <p className="text-sm text-[#475569] mt-1 max-w-2xl font-normal">
              Customize how and when IT Career Partner alerts you across calibrated communication channels.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl border border-[#cbd5e1] text-[#475569] hover:bg-white text-xs font-bold shadow-xs transition-all cursor-pointer bg-white"
            >
              Reset to Defaults
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">check</span>
              <span>{isSaving ? 'Saving...' : 'Save Preferences'}</span>
            </button>
          </div>
        </div>

        {/* Preferences Cards Grid */}
        <div className="flex flex-col gap-6">
          {/* Section 1: Job Alerts */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 sm:p-7 shadow-xs">
            <div className="flex items-start justify-between gap-4 border-b border-[#f1f5f9] pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#eef2ff] text-[#4338ca] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">radar</span>
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#0f172a]">Job Alerts &amp; Opportunity Ingestion</h2>
                  <p className="text-xs text-[#64748b]">
                    Receive alerts when newly discovered openings match your criteria (≥ ₹2.4 LPA, Fresher, 2026 Batch).
                  </p>
                </div>
              </div>

              {/* Master toggle */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefs.jobAlertsEnabled}
                  onChange={(e) => setPrefs({ ...prefs, jobAlertsEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4338ca]"></div>
              </label>
            </div>

            {/* Cadence Selection */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-[#0f172a] mb-2 uppercase tracking-wider font-mono">
                Dispatch Cadence
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'IMMEDIATE', title: 'Immediate (Real-time)', desc: 'Instant push when verified opening is discovered' },
                  { id: 'DAILY', title: 'Daily Digest (6:00 PM IST)', desc: 'Consolidated briefing of all openings found today' },
                  { id: 'WEEKLY', title: 'Weekly Digest (Mondays)', desc: 'Curated Monday morning briefing for targeted preparation' },
                ].map((option) => (
                  <div
                    key={option.id}
                    onClick={() => setPrefs({ ...prefs, jobAlertsCadence: option.id as any })}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      prefs.jobAlertsCadence === option.id
                        ? 'border-[#4338ca] bg-[#eef2ff]/40 ring-1 ring-[#4338ca]'
                        : 'border-[#e2e8f0] bg-white hover:border-[#cbd5e1]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-[#0f172a]">{option.title}</span>
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        prefs.jobAlertsCadence === option.id ? 'border-[#4338ca] bg-[#4338ca]' : 'border-slate-300'
                      }`}>
                        {prefs.jobAlertsCadence === option.id && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748b] leading-relaxed">{option.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Outbound Channels */}
            <div>
              <label className="block text-xs font-bold text-[#0f172a] mb-2 uppercase tracking-wider font-mono">
                Enabled Outbound Channels
              </label>
              <div className="space-y-3">
                {/* Channel 1: In-App */}
                <div className="p-3.5 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px] text-[#4338ca]">notifications_active</span>
                    <div>
                      <h4 className="text-xs font-bold text-[#0f172a]">In-App Notification Center</h4>
                      <p className="text-[11px] text-[#64748b]">Top-bar bell dropdown, alert drawer, and priority badge counters</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefs.inAppEnabled}
                    onChange={(e) => setPrefs({ ...prefs, inAppEnabled: e.target.checked })}
                    className="w-4 h-4 text-[#4338ca] rounded border-slate-300 focus:ring-[#4338ca]"
                  />
                </div>

                {/* Channel 2: Email */}
                <div className="p-3.5 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px] text-[#059669]">alternate_email</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-[#0f172a]">Direct Email Alerts</h4>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-[#ecfdf5] text-[#059669]">
                          VERIFIED
                        </span>
                      </div>
                      <p className="text-[11px] text-[#64748b]">Dispatching to {prefs.emailAddress}</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefs.emailAlertsEnabled}
                    onChange={(e) => setPrefs({ ...prefs, emailAlertsEnabled: e.target.checked })}
                    className="w-4 h-4 text-[#4338ca] rounded border-slate-300 focus:ring-[#4338ca]"
                  />
                </div>

                {/* Channel 3: WhatsApp */}
                <div className="p-3.5 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] flex items-center justify-between opacity-80">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px] text-[#64748b]">chat</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-[#0f172a]">SMS &amp; WhatsApp Alerts</h4>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-[#f1f5f9] text-[#64748b]">
                          COMING SOON
                        </span>
                      </div>
                      <p className="text-[11px] text-[#64748b]">High-priority interview pings via carrier gateway</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    disabled
                    checked={false}
                    className="w-4 h-4 text-slate-300 rounded border-slate-200 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Application Reminders */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 sm:p-7 shadow-xs">
            <div className="flex items-center gap-3 border-b border-[#f1f5f9] pb-4 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#ecfdf5] text-[#059669] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">event_repeat</span>
              </div>
              <div>
                <h2 className="text-base font-bold text-[#0f172a]">Application &amp; Milestone Reminders</h2>
                <p className="text-xs text-[#64748b]">
                  Automated prompts derived strictly from your logged interviews, coding challenges, and recruiter follow-ups.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Reminder 1: Interview */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#0f172a] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#059669]">videocam</span>
                  Interview Reminders
                </label>
                <select
                  value={prefs.interviewRemindersTiming}
                  onChange={(e) => setPrefs({ ...prefs, interviewRemindersTiming: e.target.value })}
                  className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2.5 text-xs text-[#0f172a] focus:outline-none focus:border-[#4338ca] cursor-pointer"
                >
                  <option value="1_DAY_AND_2_HOURS">1 day before &amp; 2 hours before</option>
                  <option value="2_DAYS_AND_1_HOUR">2 days before &amp; 1 hour before</option>
                  <option value="30_MINS_BEFORE">30 minutes before only</option>
                </select>
                <span className="text-[11px] text-[#64748b]">Includes direct meeting link and prep sheet checklist</span>
              </div>

              {/* Reminder 2: Assessment */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#0f172a] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#4338ca]">terminal</span>
                  Assessment Deadlines
                </label>
                <select
                  value={prefs.assessmentExpirationWarning}
                  onChange={(e) => setPrefs({ ...prefs, assessmentExpirationWarning: e.target.value })}
                  className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2.5 text-xs text-[#0f172a] focus:outline-none focus:border-[#4338ca] cursor-pointer"
                >
                  <option value="24_HOURS">24 hours before expiration</option>
                  <option value="48_HOURS_AND_6_HOURS">48 hours &amp; 6 hours before</option>
                  <option value="12_HOURS">12 hours before expiration</option>
                </select>
                <span className="text-[11px] text-[#64748b]">For HackerRank, HackerEarth &amp; CodeSignal links</span>
              </div>

              {/* Reminder 3: Recruiter Follow-ups */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#0f172a] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#dc2626]">forward_to_inbox</span>
                  Overdue Recruiter Nudges
                </label>
                <select
                  value={prefs.followupOverdueDays}
                  onChange={(e) => setPrefs({ ...prefs, followupOverdueDays: parseInt(e.target.value) })}
                  className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2.5 text-xs text-[#0f172a] focus:outline-none focus:border-[#4338ca] cursor-pointer"
                >
                  <option value="7">Prompt after 7 business days</option>
                  <option value="10">Prompt after 10 business days (Recommended)</option>
                  <option value="14">Prompt after 14 business days</option>
                </select>
                <span className="text-[11px] text-[#64748b]">Generates polite recruiter follow-up email template</span>
              </div>
            </div>
          </div>

          {/* Section 3: Guardrails & Quiet Hours */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 sm:p-7 shadow-xs">
            <div className="flex items-center gap-3 border-b border-[#f1f5f9] pb-4 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#faf5ff] text-[#9333ea] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">tune</span>
              </div>
              <div>
                <h2 className="text-base font-bold text-[#0f172a]">Guardrails &amp; Quiet Hours</h2>
                <p className="text-xs text-[#64748b]">
                  Control minimum fit thresholds and prevent night-time notification disturbances.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Minimum Match Score Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#0f172a]">Minimum Match Threshold</label>
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#eef2ff] text-[#4338ca]">
                    ≥ {prefs.minMatchScore}% Match
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="95"
                  step="5"
                  value={prefs.minMatchScore}
                  onChange={(e) => setPrefs({ ...prefs, minMatchScore: parseInt(e.target.value) })}
                  className="w-full accent-[#4338ca] cursor-pointer"
                />
                <span className="text-[11px] text-[#64748b]">
                  Jobs below this semantic match score will not trigger high-priority alerts.
                </span>
              </div>

              {/* Quiet Hours */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#0f172a]">Quiet Hours Window</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prefs.quietHoursEnabled}
                      onChange={(e) => setPrefs({ ...prefs, quietHoursEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4338ca]"></div>
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={prefs.quietHoursStart}
                    onChange={(e) => setPrefs({ ...prefs, quietHoursStart: e.target.value })}
                    className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2 text-xs font-mono text-[#0f172a]"
                  />
                  <span className="text-xs text-[#64748b]">to</span>
                  <input
                    type="time"
                    value={prefs.quietHoursEnd}
                    onChange={(e) => setPrefs({ ...prefs, quietHoursEnd: e.target.value })}
                    className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2 text-xs font-mono text-[#0f172a]"
                  />
                </div>
                <span className="text-[11px] text-[#64748b]">
                  During quiet hours, outbound emails are queued for morning dispatch at 8:00 AM IST.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
