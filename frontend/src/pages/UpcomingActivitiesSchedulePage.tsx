import React, { useState, useEffect } from 'react';
import { ActivityItem, ScheduleHubResponse } from '../types';
import TrackerSubNav, { TrackerTab } from '../components/TrackerSubNav';

interface UpcomingActivitiesSchedulePageProps {
  onOpenAddDrawer: () => void;
  onNavigateTab: (tab: TrackerTab) => void;
}

export default function UpcomingActivitiesSchedulePage({
  onOpenAddDrawer,
  onNavigateTab,
}: UpcomingActivitiesSchedulePageProps) {
  const [hubData, setHubData] = useState<ScheduleHubResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // New Activity Form State
  const [newCompany, setNewCompany] = useState('Google India');
  const [newTitle, setNewTitle] = useState('Round 1 Data Structures & Algorithms');
  const [newType, setNewType] = useState<'INTERVIEW' | 'ASSESSMENT' | 'FOLLOW_UP'>('INTERVIEW');
  const [newRound, setNewRound] = useState('Round 1 Technical Screening');
  const [newMeetingLink, setNewMeetingLink] = useState('https://meet.google.com/abc-defg-hij');

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/tracker/schedule?userId=user_arjun');
      if (res.ok) {
        const data = await res.json();
        setHubData(data);
      }
    } catch (err) {
      console.warn('Failed to fetch schedule hub', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const handleUpdateStatus = async (activityId: string, newStatus: string) => {
    try {
      await fetch(`/api/v1/tracker/activities/${activityId}/status?status=${newStatus}`, {
        method: 'PUT',
      });
      fetchSchedule();
    } catch (err) {
      console.error('Failed to update activity status', err);
    }
  };

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        company: newCompany,
        title: newTitle,
        activityType: newType,
        roundName: newRound,
        scheduledFormatted: 'Oct 30, 2024',
        timeFormatted: '4:00 PM IST',
        status: 'UPCOMING',
        meetingLink: newMeetingLink,
        checklist: [
          { id: '1', label: 'Review technical prerequisites', completed: false },
          { id: '2', label: 'Check audio & camera setup', completed: true },
        ],
      };

      const res = await fetch('/api/v1/tracker/activities?userId=user_arjun', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsLogModalOpen(false);
        fetchSchedule();
      }
    } catch (err) {
      console.error('Failed to log activity', err);
    }
  };

  // Filter activities
  const activities = (hubData?.activities || []).filter((a) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'INTERVIEW') return a.activityType === 'INTERVIEW';
    if (filterType === 'ASSESSMENT') return a.activityType === 'ASSESSMENT';
    if (filterType === 'FOLLOW_UP') return a.activityType === 'FOLLOW_UP';
    if (filterType === 'OVERDUE') return a.status === 'OVERDUE';
    return true;
  });

  const interviews = activities.filter((a) => a.activityType === 'INTERVIEW');
  const assessments = activities.filter((a) => a.activityType === 'ASSESSMENT');
  const followups = activities.filter((a) => a.activityType === 'FOLLOW_UP');

  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#1f1b17] font-sans antialiased pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Navigation SubBar */}
        <TrackerSubNav
          activeTab="SCHEDULE_HUB"
          onSelectTab={onNavigateTab}
          onOpenAddDrawer={onOpenAddDrawer}
          upcomingCount={hubData?.totalUpcomingCount || 5}
        />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#ffdbce] text-[#7e2c00] text-xs font-bold uppercase tracking-wider">
                Interview & Activity Hub
              </span>
              <span className="text-xs text-[#8a7269]">• Calendar Sync & Reminders</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#1f1b17] tracking-tight">
              Upcoming Activities & Schedule Hub
            </h1>
            <p className="text-sm text-[#625d5b] max-w-2xl mt-1">
              Consolidated timeline of confirmed technical interviews, online assessment windows, and recruiter follow-ups for the 2026 Batch.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLogModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-[#ddc0b6] text-xs font-bold text-[#1f1b17] hover:bg-[#f6ece6] transition-all"
            >
              <span className="material-symbols-outlined text-[17px]">event</span>
              <span>Log Activity</span>
            </button>
            <button
              onClick={onOpenAddDrawer}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#bc5424] hover:bg-[#9c3d0c] text-white text-xs font-bold shadow-md transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Add Application</span>
            </button>
          </div>
        </div>

        {/* Filter Chips Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
          {[
            { id: 'ALL', label: 'All Activities', count: hubData?.totalUpcomingCount || 5, icon: 'calendar_month' },
            { id: 'INTERVIEW', label: 'Interviews Scheduled', count: hubData?.interviewsCount || 2, icon: 'video_camera_front', color: 'text-[#bc5424]' },
            { id: 'ASSESSMENT', label: 'Online Assessments', count: hubData?.assessmentsCount || 1, icon: 'terminal', color: 'text-[#4338ca]' },
            { id: 'FOLLOW_UP', label: 'Follow-ups Due', count: hubData?.followupsDueCount || 1, icon: 'outgoing_mail', color: 'text-[#00692e]' },
            { id: 'OVERDUE', label: 'Overdue Attention', count: hubData?.overdueCount || 1, icon: 'priority_high', color: 'text-[#ba1a1a]' },
          ].map((chip) => {
            const isActive = filterType === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setFilterType(chip.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#bc5424] text-white shadow-xs'
                    : 'bg-white border border-[#ddc0b6]/60 text-[#625d5b] hover:bg-[#f6ece6]'
                }`}
              >
                <span className={`material-symbols-outlined text-[15px] ${isActive ? 'text-white' : chip.color}`}>
                  {chip.icon}
                </span>
                <span>{chip.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#f6ece6] text-[#1f1b17]'
                  }`}
                >
                  {chip.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Top Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white p-6 rounded-xl border border-[#f0e6e0] shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8a7269]">
                  Confirmed Pipeline
                </span>
                <div className="text-2xl font-extrabold text-[#1f1b17] mt-1">
                  2 Scheduled
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#f6ece6] flex items-center justify-center text-[#bc5424]">
                <span className="material-symbols-outlined text-[22px]">event_upcoming</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#f0e6e0] flex items-center gap-2 text-xs text-[#625d5b]">
              <span className="material-symbols-outlined text-[#bc5424] text-[16px]">play_circle</span>
              <span>Next: <strong className="text-[#1f1b17]">Thoughtworks</strong> on Oct 28 • 2:30 PM</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#f0e6e0] shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8a7269]">
                  Assessment Windows
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-extrabold text-[#1f1b17]">1 Expiring</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ffdad6] text-[#93000a]">
                    Urgent
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#f6ece6] flex items-center justify-center text-[#4338ca]">
                <span className="material-symbols-outlined text-[22px]">timer</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#f0e6e0] flex items-center gap-2 text-xs text-[#625d5b]">
              <span className="material-symbols-outlined text-[#ba1a1a] text-[16px]">alarm</span>
              <span>Swiggy HackerEarth • <strong className="text-[#ba1a1a]">48 hrs remaining</strong></span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#f0e6e0] shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8a7269]">
                  Follow-up Attention
                </span>
                <div className="text-2xl font-extrabold text-[#1f1b17] mt-1">
                  1 Due • 1 Overdue
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#ffdad6]/40 flex items-center justify-center text-[#ba1a1a]">
                <span className="material-symbols-outlined text-[22px]">notification_important</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#f0e6e0] flex items-center gap-2 text-xs text-[#625d5b]">
              <span className="material-symbols-outlined text-[#ba1a1a] text-[16px]">priority_high</span>
              <span>Action recommended: <strong className="text-[#1f1b17]">Juspay application</strong></span>
            </div>
          </div>
        </div>

        {/* Section 1: Upcoming Interviews */}
        {(filterType === 'ALL' || filterType === 'INTERVIEW') && interviews.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-[#bc5424]"></div>
              <h2 className="text-lg font-bold text-[#1f1b17]">Upcoming Interviews</h2>
              <span className="px-2 py-0.5 rounded-full bg-[#f6ece6] text-xs font-bold text-[#8a7269]">
                {interviews.length} Scheduled
              </span>
            </div>

            <div className="space-y-4">
              {interviews.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-6 rounded-xl border border-[#f0e6e0] shadow-xs hover:shadow-md transition-all flex flex-col gap-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#f6ece6] flex items-center justify-center font-bold text-base text-[#9c3d0c] shrink-0">
                        {item.company.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-bold text-base text-[#1f1b17]">{item.company}</h3>
                          <span className="px-2.5 py-0.5 rounded-full bg-[#ecfdf5] text-[#00692e] text-[11px] font-bold">
                            {item.roundName}
                          </span>
                        </div>
                        <div className="text-xs text-[#625d5b]">{item.title}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start">
                      <span className="font-mono text-xs font-bold bg-[#f6ece6] px-3 py-1 rounded-md text-[#1f1b17]">
                        {item.scheduledFormatted} • {item.timeFormatted}
                      </span>
                    </div>
                  </div>

                  {item.notes && (
                    <p className="text-xs text-[#625d5b] bg-[#fff8f5] p-3 rounded-lg border border-[#ddc0b6]/40">
                      {item.notes}
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#f0e6e0]">
                    <div className="flex items-center gap-3">
                      {item.interviewer && (
                        <span className="text-xs text-[#8a7269] flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px]">person</span>
                          <span>{item.interviewer}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {item.meetingLink && (
                        <a
                          href={item.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-lg bg-[#bc5424] hover:bg-[#9c3d0c] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                        >
                          <span className="material-symbols-outlined text-[16px]">videocam</span>
                          <span>Join Meeting</span>
                        </a>
                      )}
                      <button
                        onClick={() => handleUpdateStatus(item.id, 'COMPLETED')}
                        className="px-3 py-2 rounded-lg bg-[#f6ece6] hover:bg-[#eae1da] text-[#1f1b17] text-xs font-semibold transition-all"
                      >
                        Mark Completed
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 2: Online Assessments */}
        {(filterType === 'ALL' || filterType === 'ASSESSMENT') && assessments.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-[#4338ca]"></div>
              <h2 className="text-lg font-bold text-[#1f1b17]">Online Assessments & Tests</h2>
              <span className="px-2 py-0.5 rounded-full bg-[#f6ece6] text-xs font-bold text-[#8a7269]">
                {assessments.length} Active
              </span>
            </div>

            <div className="space-y-4">
              {assessments.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-6 rounded-xl border border-[#f0e6e0] shadow-xs hover:shadow-md transition-all flex flex-col gap-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#eef2ff] flex items-center justify-center font-bold text-base text-[#4338ca] shrink-0">
                        {item.company.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-bold text-base text-[#1f1b17]">{item.company}</h3>
                          <span className="px-2.5 py-0.5 rounded-full bg-[#eef2ff] text-[#4338ca] text-[11px] font-bold">
                            {item.roundName}
                          </span>
                        </div>
                        <div className="text-xs text-[#625d5b]">{item.title}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start">
                      <span className="font-mono text-xs font-bold bg-[#ffdad6] text-[#93000a] px-3 py-1 rounded-md">
                        Due {item.scheduledFormatted} • 48 hrs left
                      </span>
                    </div>
                  </div>

                  {item.notes && (
                    <p className="text-xs text-[#625d5b] bg-[#fff8f5] p-3 rounded-lg border border-[#ddc0b6]/40">
                      {item.notes}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-[#f0e6e0]">
                    <span className="text-xs text-[#8a7269]">
                      Topics: Data Structures, Concurrency & SQL Optimization
                    </span>
                    <a
                      href="https://www.hackerearth.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px]">terminal</span>
                      <span>Open Assessment Portal</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 3: Recruiter Follow-ups */}
        {(filterType === 'ALL' || filterType === 'FOLLOW_UP') && followups.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-[#00692e]"></div>
              <h2 className="text-lg font-bold text-[#1f1b17]">Recruiter Follow-ups & Reminders</h2>
              <span className="px-2 py-0.5 rounded-full bg-[#f6ece6] text-xs font-bold text-[#8a7269]">
                {followups.length} Tasks
              </span>
            </div>

            <div className="space-y-4">
              {followups.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-6 rounded-xl border border-[#f0e6e0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#f6ece6] flex items-center justify-center font-bold text-sm text-[#9c3d0c]">
                      {item.company.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#1f1b17]">{item.company}</span>
                        {item.status === 'OVERDUE' && (
                          <span className="px-2 py-0.2 rounded bg-[#ffdad6] text-[#93000a] text-[10px] font-bold">
                            Overdue
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#625d5b] mt-0.5">{item.title}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <a
                      href="mailto:careers@juspay.in?subject=Application Follow-up: 2026 Batch Backend Role"
                      className="px-3.5 py-1.5 rounded-lg border border-[#ddc0b6] text-xs font-semibold text-[#1f1b17] hover:bg-[#fff8f5] transition-all flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[15px]">send</span>
                      <span>Send Follow-up</span>
                    </a>
                    <button
                      onClick={() => handleUpdateStatus(item.id, 'COMPLETED')}
                      className="px-3.5 py-1.5 rounded-lg bg-[#00692e] text-white text-xs font-bold hover:bg-[#005323] transition-all"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Log Activity Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#1f1b17]/50 backdrop-blur-xs"
            onClick={() => setIsLogModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-6 z-10 border border-[#f0e6e0]">
            <div className="flex items-center justify-between pb-4 border-b border-[#f0e6e0] mb-4">
              <h3 className="text-base font-bold text-[#1f1b17]">Log Upcoming Activity</h3>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#8a7269] hover:bg-[#f6ece6]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#1f1b17] block mb-1">Company</label>
                <input
                  type="text"
                  required
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full h-10 px-3 bg-[#fff8f5] border border-[#ddc0b6] rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#1f1b17] block mb-1">Activity Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full h-10 px-3 bg-[#fff8f5] border border-[#ddc0b6] rounded-lg outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1f1b17] block mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full h-10 px-3 bg-[#fff8f5] border border-[#ddc0b6] rounded-lg outline-none"
                  >
                    <option value="INTERVIEW">Interview</option>
                    <option value="ASSESSMENT">Assessment</option>
                    <option value="FOLLOW_UP">Follow-up</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#1f1b17] block mb-1">Round Name</label>
                  <input
                    type="text"
                    value={newRound}
                    onChange={(e) => setNewRound(e.target.value)}
                    className="w-full h-10 px-3 bg-[#fff8f5] border border-[#ddc0b6] rounded-lg outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1f1b17] block mb-1">Meeting Link (optional)</label>
                <input
                  type="url"
                  value={newMeetingLink}
                  onChange={(e) => setNewMeetingLink(e.target.value)}
                  className="w-full h-10 px-3 bg-[#fff8f5] border border-[#ddc0b6] rounded-lg outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#f0e6e0]">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-[#625d5b] hover:bg-[#f6ece6] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#bc5424] hover:bg-[#9c3d0c] text-white font-bold"
                >
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
