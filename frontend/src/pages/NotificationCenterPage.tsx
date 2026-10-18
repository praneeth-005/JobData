import React, { useState, useEffect, useRef } from 'react';
import { NotificationItem, NotificationSummaryResponse } from '../types';
import NotificationsSubNav, { NotificationsTab } from '../components/NotificationsSubNav';

interface NotificationCenterPageProps {
  onNavigateTab: (tab: NotificationsTab) => void;
  onSelectJob?: (jobId: string) => void;
  onNavigateToSchedule?: () => void;
  onNavigateToApplications?: () => void;
  onNavigateToResumeAnalysis?: () => void;
  onNavigateToPreferences?: () => void;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    userId: 'user_arjun',
    type: 'JOB_ALERT',
    title: 'New matching job found: Thoughtworks • Graduate Software Engineer',
    message: 'Graduate Software Engineer (Java / Spring Boot). Direct Greenhouse ATS verified. 2026 Batch Verified.',
    company: 'Thoughtworks',
    logoText: 'TW',
    ctcText: '₹11.5 - ₹13.5 LPA',
    location: 'Bengaluru / Pune (Hybrid)',
    batchAllowed: '2026 Batch',
    matchScore: 94,
    linkUrl: '/jobs/job_tw_01',
    actionLabel: 'View Details & Apply',
    timeAgoFormatted: '18 minutes ago',
    read: false,
    tags: ['Tier 1', 'Spring Boot', 'Clean Code', '2026 Batch Verified'],
  },
  {
    id: 'notif_2',
    userId: 'user_arjun',
    type: 'INTERVIEW_REMINDER',
    title: 'Upcoming Interview Tomorrow: Round 2 Technical (Thoughtworks)',
    message: 'Thoughtworks Round 2 Technical Discussion with Siddharth Sen (Lead Technologist). Google Meet link verified.',
    company: 'Thoughtworks',
    logoText: 'TW',
    ctcText: '₹11.5 - ₹13.5 LPA',
    location: 'Google Meet (Online)',
    batchAllowed: '2026 Batch',
    matchScore: 94,
    linkUrl: '/tracker/schedule',
    actionLabel: 'View Prep Notes & Meeting Link',
    timeAgoFormatted: '1 hour ago',
    read: false,
    tags: ['Urgent', 'Interview', '45 Mins Duration'],
    metadata: {
      scheduledTime: 'Tomorrow, 2:30 PM IST',
      meetingLink: 'https://meet.google.com/zkw-xsqe-rba',
      interviewer: 'Siddharth Sen (Lead Technologist)',
    },
  },
  {
    id: 'notif_3',
    userId: 'user_arjun',
    type: 'FOLLOW_UP_OVERDUE',
    title: 'Follow-up Overdue: Juspay (Junior Java Backend Developer)',
    message: 'Assessment submitted 5 business days ago without recruiter update. Recommended polite follow-up inquiry.',
    company: 'Juspay',
    logoText: 'JP',
    ctcText: '₹12.0 - ₹15.0 LPA',
    location: 'Bengaluru (Hybrid)',
    batchAllowed: '2026 Batch',
    matchScore: 91,
    linkUrl: '/tracker/applications',
    actionLabel: 'Copy Polite Follow-up Email',
    timeAgoFormatted: '2 hours ago',
    read: false,
    tags: ['Action Required', '2 Days Overdue'],
    metadata: {
      overdueDays: '2',
      emailSubject: 'Inquiry Regarding Junior Java Backend Developer Application - Arjun Rao',
    },
  },
  {
    id: 'notif_4',
    userId: 'user_arjun',
    type: 'WALK_IN_DRIVE',
    title: 'Walk-in Drive Detected: Persistent Systems • Systems Engineer Trainee',
    message: 'Exclusive 2026 Graduating Cohort walk-in drive verified for Pune / Hyderabad campus intake.',
    company: 'Persistent Systems',
    logoText: 'PS',
    ctcText: '₹7.0 - ₹9.0 LPA',
    location: 'Pune Campus (Hall B)',
    batchAllowed: '2026 Batch',
    matchScore: 85,
    linkUrl: '/jobs/persist_01',
    actionLabel: 'View Venue & Registration Checklist',
    timeAgoFormatted: 'Yesterday',
    read: true,
    tags: ['Campus Drive', '2026 Batch Verified'],
  },
  {
    id: 'notif_5',
    userId: 'user_arjun',
    type: 'JOB_ALERT',
    title: 'New matching job found: Razorpay • Software Engineer 1 - Payments Core',
    message: 'High-throughput distributed payments engineering opening. Zero bond, 2026 eligible.',
    company: 'Razorpay',
    logoText: 'RZP',
    ctcText: '₹16.0 - ₹20.0 LPA',
    location: 'Bengaluru (On-Site)',
    batchAllowed: '2026 Batch',
    matchScore: 91,
    linkUrl: '/jobs/job_rzp_02',
    actionLabel: 'Track & Apply',
    timeAgoFormatted: '3 days ago',
    read: true,
    tags: ['Fintech Core', 'Go', 'PostgreSQL', '2026 Batch Verified'],
  },
  {
    id: 'notif_6',
    userId: 'user_arjun',
    type: 'SYSTEM_UPDATE',
    title: 'Resume Re-analysis Completed (Resume v2.1)',
    message: 'Overall readiness score increased to 88/100 (+6 pts). 3 action items resolved for 2026 product benchmarks.',
    company: 'IT Career Partner AI',
    logoText: 'AI',
    ctcText: 'Platform Intelligence',
    location: 'Cloud Analysis',
    batchAllowed: '2026 Batch',
    matchScore: 88,
    linkUrl: '/resume/analysis',
    actionLabel: 'View Analysis Breakdown',
    timeAgoFormatted: '4 days ago',
    read: true,
    tags: ['System Update', 'Score 88/100'],
  },
];

// Persistent module cache for zero-delay instant tab revisit
let cachedSummary: NotificationSummaryResponse | null = null;
let hasLoadedOnce = false;

export default function NotificationCenterPage({
  onNavigateTab,
  onSelectJob,
  onNavigateToSchedule,
  onNavigateToApplications,
  onNavigateToResumeAnalysis,
  onNavigateToPreferences,
}: NotificationCenterPageProps) {
  const [data, setData] = useState<NotificationSummaryResponse>(() => {
    if (cachedSummary) return cachedSummary;
    return {
      totalCount: DEFAULT_NOTIFICATIONS.length,
      unreadCount: DEFAULT_NOTIFICATIONS.filter(n => !n.read).length,
      jobAlertsCount: 3,
      remindersCount: 2,
      systemUpdatesCount: 1,
      alertStatus: 'ACTIVE',
      notifications: DEFAULT_NOTIFICATIONS,
    };
  });

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'UNREAD' | 'ALERTS' | 'REMINDERS' | 'SYSTEM'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'match'>('newest');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isInitialMount = useRef(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchNotifications = async (silent = false) => {
    try {
      const res = await fetch('/api/v1/notifications?userId=user_arjun');
      if (res.ok) {
        const json = await res.json();
        if (json && json.notifications) {
          cachedSummary = json;
          hasLoadedOnce = true;
          setData(json);
        }
      }
    } catch (err) {
      console.warn('Using resilient notifications cache', err);
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (hasLoadedOnce && cachedSummary) {
        fetchNotifications(true);
        return;
      }
    }
    fetchNotifications(false);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch(`/api/v1/notifications/${id}/read`, { method: 'POST' });
    } catch (e) {
      // offline fallback
    }
    setData((prev) => {
      const nextNotifs = prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
      const nextUnread = nextNotifs.filter((n) => !n.read).length;
      const nextSummary = {
        ...prev,
        unreadCount: nextUnread,
        notifications: nextNotifs,
      };
      cachedSummary = nextSummary;
      return nextSummary;
    });
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch('/api/v1/notifications/mark-all-read?userId=user_arjun', { method: 'POST' });
    } catch (e) {
      // offline fallback
    }
    setData((prev) => {
      const nextNotifs = prev.notifications.map((n) => ({ ...n, read: true }));
      const nextSummary = {
        ...prev,
        unreadCount: 0,
        notifications: nextNotifs,
      };
      cachedSummary = nextSummary;
      return nextSummary;
    });
    showToast('All notifications marked as read.');
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/v1/notifications/${id}`, { method: 'DELETE' });
    } catch (e) {
      // offline fallback
    }
    setData((prev) => {
      const nextNotifs = prev.notifications.filter((n) => n.id !== id);
      const nextSummary = {
        ...prev,
        totalCount: nextNotifs.length,
        unreadCount: nextNotifs.filter((n) => !n.read).length,
        notifications: nextNotifs,
      };
      cachedSummary = nextSummary;
      return nextSummary;
    });
    showToast('Notification dismissed.');
  };

  const handleCopyTemplate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const template = `Subject: Inquiry Regarding Junior Java Backend Developer Application - Arjun Rao\n\nDear Recruiting Team,\n\nI hope this email finds you well. I am following up on my application for the Junior Java Backend Developer role (2026 Batch) submitted recently. I completed the technical assessment and wanted to reaffirm my strong enthusiasm for joining the team. Please let me know if any further information is needed from my end.\n\nWarm regards,\nArjun Rao\narjun.sharma2026@gmail.com`;
    navigator.clipboard.writeText(template);
    showToast('Polite follow-up email template copied to clipboard!');
  };

  // Filter & Sort
  const filtered = data.notifications
    .filter((n) => {
      const matchSearch =
        searchQuery === '' ||
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.company && n.company.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchTab = true;
      if (activeFilter === 'UNREAD') matchTab = !n.read;
      if (activeFilter === 'ALERTS') matchTab = n.type === 'JOB_ALERT' || n.type === 'WALK_IN_DRIVE';
      if (activeFilter === 'REMINDERS') matchTab = n.type === 'INTERVIEW_REMINDER' || n.type === 'FOLLOW_UP_OVERDUE';
      if (activeFilter === 'SYSTEM') matchTab = n.type === 'SYSTEM_UPDATE';

      return matchSearch && matchTab;
    })
    .sort((a, b) => {
      if (sortBy === 'match') return (b.matchScore || 0) - (a.matchScore || 0);
      return 0; // default order
    });

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
          activeTab="NOTIFICATION_CENTER"
          onSelectTab={onNavigateTab}
          unreadCount={data.unreadCount}
          remindersCount={data.remindersCount}
          alertStatus={data.alertStatus}
        />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#eef2ff] text-[#4338ca] border border-[#c7d2fe]/60">
                Priority Feed
              </span>
              {data.unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]/60">
                  {data.unreadCount} Unread
                </span>
              )}
            </div>
            <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">
              Notifications
            </h1>
            <p className="text-sm text-[#475569] mt-1 max-w-2xl font-normal">
              Stay updated on verified job opportunities, interview milestones, and targeted career progression alerts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {data.unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2.5 rounded-xl border border-[#cbd5e1] text-[#0f172a] hover:bg-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer bg-white"
              >
                <span className="material-symbols-outlined text-[18px] text-[#4338ca]">done_all</span>
                <span>Mark all as read</span>
              </button>
            )}
            <button
              onClick={() => onNavigateTab('NOTIFICATION_PREFERENCES')}
              className="px-5 py-2.5 rounded-xl bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              <span>Notification Settings</span>
            </button>
          </div>
        </div>

        {/* Action & Filter Toolbar */}
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-[#e2e8f0] shadow-xs mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeFilter === 'ALL'
                  ? 'bg-[#eef2ff] text-[#4338ca]'
                  : 'text-[#475569] hover:bg-[#f8fafc]'
              }`}
            >
              <span>All</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                activeFilter === 'ALL' ? 'bg-[#4338ca] text-white' : 'bg-[#e2e8f0] text-[#475569]'
              }`}>
                {data.totalCount}
              </span>
            </button>

            <button
              onClick={() => setActiveFilter('UNREAD')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeFilter === 'UNREAD'
                  ? 'bg-[#eef2ff] text-[#4338ca]'
                  : 'text-[#475569] hover:bg-[#f8fafc]'
              }`}
            >
              <span>Unread</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                activeFilter === 'UNREAD' ? 'bg-[#4338ca] text-white' : 'bg-[#e2e8f0] text-[#475569]'
              }`}>
                {data.unreadCount}
              </span>
            </button>

            <button
              onClick={() => setActiveFilter('ALERTS')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeFilter === 'ALERTS'
                  ? 'bg-[#eef2ff] text-[#4338ca]'
                  : 'text-[#475569] hover:bg-[#f8fafc]'
              }`}
            >
              <span>Job Alerts</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                activeFilter === 'ALERTS' ? 'bg-[#4338ca] text-white' : 'bg-[#e2e8f0] text-[#475569]'
              }`}>
                {data.notifications.filter(n => n.type === 'JOB_ALERT' || n.type === 'WALK_IN_DRIVE').length}
              </span>
            </button>

            <button
              onClick={() => setActiveFilter('REMINDERS')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeFilter === 'REMINDERS'
                  ? 'bg-[#eef2ff] text-[#4338ca]'
                  : 'text-[#475569] hover:bg-[#f8fafc]'
              }`}
            >
              <span>Application Reminders</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                activeFilter === 'REMINDERS' ? 'bg-[#4338ca] text-white' : 'bg-[#e2e8f0] text-[#475569]'
              }`}>
                {data.notifications.filter(n => n.type === 'INTERVIEW_REMINDER' || n.type === 'FOLLOW_UP_OVERDUE').length}
              </span>
            </button>

            <button
              onClick={() => setActiveFilter('SYSTEM')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeFilter === 'SYSTEM'
                  ? 'bg-[#eef2ff] text-[#4338ca]'
                  : 'text-[#475569] hover:bg-[#f8fafc]'
              }`}
            >
              <span>System Updates</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                activeFilter === 'SYSTEM' ? 'bg-[#4338ca] text-white' : 'bg-[#e2e8f0] text-[#475569]'
              }`}>
                {data.notifications.filter(n => n.type === 'SYSTEM_UPDATE').length}
              </span>
            </button>
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <span className="material-symbols-outlined text-[18px] text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notifications..."
                className="w-full pl-9 pr-3 py-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-xs font-medium text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#4338ca] focus:bg-white"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-2 px-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-xs font-semibold text-[#0f172a] focus:outline-none focus:border-[#4338ca] cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="match">Highest Match %</option>
            </select>
          </div>
        </div>

        {/* Notifications Feed */}
        <div className="flex flex-col gap-3.5">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-[#e2e8f0]">
              <span className="material-symbols-outlined text-[38px] text-[#64748b]">notifications_paused</span>
              <h3 className="text-sm font-bold text-[#0f172a] mt-2">No Notifications Match Filter</h3>
              <p className="text-xs text-[#64748b] mt-1 max-w-sm mx-auto">
                All alerts and reminders have been reviewed for this category.
              </p>
            </div>
          ) : (
            filtered.map((item) => {
              const isJob = item.type === 'JOB_ALERT' || item.type === 'WALK_IN_DRIVE';
              const isInterview = item.type === 'INTERVIEW_REMINDER';
              const isOverdue = item.type === 'FOLLOW_UP_OVERDUE';
              const isSystem = item.type === 'SYSTEM_UPDATE';

              return (
                <article
                  key={item.id}
                  onClick={() => handleMarkAsRead(item.id)}
                  className={`group relative rounded-xl p-5 sm:p-6 border transition-all flex flex-col gap-3 cursor-pointer ${
                    !item.read
                      ? 'bg-white border-[#4338ca]/30 shadow-xs ring-1 ring-[#4338ca]/10'
                      : 'bg-white/80 border-[#e2e8f0] hover:border-[#cbd5e1]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* Logo / Type Indicator */}
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-base shrink-0 shadow-xs ${
                          isInterview
                            ? 'bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]'
                            : isOverdue
                            ? 'bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]'
                            : isSystem
                            ? 'bg-[#f8fafc] text-[#475569] border border-[#e2e8f0]'
                            : 'bg-[#eef2ff] text-[#4338ca] border border-[#c7d2fe]'
                        }`}
                      >
                        {item.logoText ? (
                          item.logoText
                        ) : (
                          <span className="material-symbols-outlined text-[22px]">
                            {isInterview ? 'videocam' : isOverdue ? 'schedule' : isSystem ? 'settings' : 'work'}
                          </span>
                        )}
                      </div>

                      {/* Content Column */}
                      <div>
                        <div className="flex items-center flex-wrap gap-2 mb-1">
                          {/* Type Pill */}
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              isInterview
                                ? 'bg-[#ecfdf5] text-[#059669]'
                                : isOverdue
                                ? 'bg-[#fef2f2] text-[#dc2626]'
                                : isJob
                                ? 'bg-[#eef2ff] text-[#4338ca]'
                                : 'bg-[#f1f5f9] text-[#475569]'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[13px]">
                              {isInterview ? 'event' : isOverdue ? 'warning' : isJob ? 'bolt' : 'info'}
                            </span>
                            <span>
                              {isInterview
                                ? 'Interview Milestone'
                                : isOverdue
                                ? 'Action Required'
                                : isJob
                                ? 'Job Match'
                                : 'System Intelligence'}
                            </span>
                          </span>

                          {item.matchScore && (
                            <span className="px-2 py-0.5 rounded-full bg-[#f1f5f9] text-[#0f172a] font-mono text-[11px] font-bold">
                              {item.matchScore}% Semantic Fit
                            </span>
                          )}

                          <span className="text-xs text-[#64748b]">
                            • {item.timeAgoFormatted}
                          </span>

                          {!item.read && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#4338ca] text-white">
                              NEW
                            </span>
                          )}
                        </div>

                        <h2 className="text-base font-bold text-[#0f172a] tracking-tight">
                          {item.title}
                        </h2>

                        <p className="text-xs text-[#475569] mt-1 leading-relaxed max-w-3xl">
                          {item.message}
                        </p>

                        {/* Attribute Badges */}
                        <div className="flex items-center flex-wrap gap-2 mt-2.5">
                          {item.ctcText && (
                            <span className="px-2.5 py-1 rounded-md bg-[#f8fafc] border border-[#e2e8f0] text-xs font-bold text-[#0f172a]">
                              {item.ctcText}
                            </span>
                          )}
                          {item.location && (
                            <span className="px-2.5 py-1 rounded-md bg-[#f8fafc] border border-[#e2e8f0] text-xs text-[#475569]">
                              {item.location}
                            </span>
                          )}
                          {item.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#f1f5f9] text-[#475569]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="flex sm:flex-col items-end justify-between gap-3 shrink-0 self-end sm:self-start">
                      <button
                        onClick={(e) => handleDelete(item.id, e)}
                        title="Dismiss notification"
                        className="text-[#94a3b8] hover:text-[#dc2626] p-1 rounded-lg hover:bg-[#fef2f2] transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>

                      {/* Primary CTA */}
                      {isJob && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onSelectJob) onSelectJob('job_tw_01');
                          }}
                          className="px-3.5 py-2 rounded-lg bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{item.actionLabel || 'View Details'}</span>
                          <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                        </button>
                      )}

                      {isInterview && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onNavigateToSchedule) onNavigateToSchedule();
                          }}
                          className="px-3.5 py-2 rounded-lg bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[15px]">videocam</span>
                          <span>Join Meeting &amp; Prep</span>
                        </button>
                      )}

                      {isOverdue && (
                        <button
                          onClick={handleCopyTemplate}
                          className="px-3.5 py-2 rounded-lg bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[15px]">content_copy</span>
                          <span>Copy Polite Email</span>
                        </button>
                      )}

                      {isSystem && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onNavigateToResumeAnalysis) onNavigateToResumeAnalysis();
                          }}
                          className="px-3.5 py-2 rounded-lg bg-white border border-[#cbd5e1] hover:bg-[#f8fafc] text-[#0f172a] text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>View Analysis</span>
                          <span className="material-symbols-outlined text-[15px]">north_east</span>
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
