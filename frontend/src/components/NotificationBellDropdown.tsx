import React, { useState } from 'react';
import { NotificationItem } from '../types';

interface NotificationBellDropdownProps {
  notifications: NotificationItem[];
  unreadCount: number;
  isOpen: boolean;
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
  onNavigateToCenter: () => void;
  onNavigateToPreferences: () => void;
  onSelectJob?: (jobId: string) => void;
  onNavigateToSchedule?: () => void;
  onCopyEmailTemplate?: () => void;
}

export default function NotificationBellDropdown({
  notifications,
  unreadCount,
  isOpen,
  onClose,
  onMarkAllAsRead,
  onMarkAsRead,
  onNavigateToCenter,
  onNavigateToPreferences,
  onSelectJob,
  onNavigateToSchedule,
  onCopyEmailTemplate,
}: NotificationBellDropdownProps) {
  const [activeTab, setActiveTab] = useState<'ALL' | 'ALERTS' | 'REMINDERS'>('ALL');

  if (!isOpen) return null;

  const filtered = notifications.filter((item) => {
    if (activeTab === 'ALERTS') return item.type === 'JOB_ALERT' || item.type === 'WALK_IN_DRIVE';
    if (activeTab === 'REMINDERS') return item.type === 'INTERVIEW_REMINDER' || item.type === 'FOLLOW_UP_OVERDUE';
    return true;
  });

  return (
    <>
      {/* Backdrop overlay */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Dropdown Container */}
      <div className="absolute right-0 top-full mt-2 w-80 sm:w-[420px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-xl border border-[#e2e8f0] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-[#f1f5f9] flex items-center justify-between bg-[#faf8ff]/80 backdrop-blur-xs">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-[#0f172a]">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-[#eef2ff] text-[#4338ca] border border-[#c7d2fe]/60">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="px-2 py-1 text-[11px] font-semibold text-[#4338ca] hover:bg-[#eef2ff] rounded-md transition-all flex items-center gap-1 cursor-pointer"
                title="Mark all as read"
              >
                <span className="material-symbols-outlined text-[14px]">done_all</span>
                <span>Mark all read</span>
              </button>
            )}
            <button
              onClick={() => {
                onNavigateToPreferences();
                onClose();
              }}
              className="p-1 text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9] rounded-md transition-all cursor-pointer"
              title="Notification Preferences"
            >
              <span className="material-symbols-outlined text-[17px]">tune</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 bg-white border-b border-[#f1f5f9] flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
              activeTab === 'ALL'
                ? 'bg-[#4338ca] text-white'
                : 'text-[#64748b] hover:bg-[#f1f5f9]'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('ALERTS')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
              activeTab === 'ALERTS'
                ? 'bg-[#4338ca] text-white'
                : 'text-[#64748b] hover:bg-[#f1f5f9]'
            }`}
          >
            Job Alerts ({notifications.filter(n => n.type === 'JOB_ALERT' || n.type === 'WALK_IN_DRIVE').length})
          </button>
          <button
            onClick={() => setActiveTab('REMINDERS')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
              activeTab === 'REMINDERS'
                ? 'bg-[#4338ca] text-white'
                : 'text-[#64748b] hover:bg-[#f1f5f9]'
            }`}
          >
            Reminders ({notifications.filter(n => n.type === 'INTERVIEW_REMINDER' || n.type === 'FOLLOW_UP_OVERDUE').length})
          </button>
        </div>

        {/* Notifications List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-[#f1f5f9]">
          {filtered.length === 0 ? (
            <div className="py-12 px-6 text-center">
              <span className="material-symbols-outlined text-[32px] text-[#94a3b8]">notifications_none</span>
              <p className="text-xs font-bold text-[#0f172a] mt-2">No notifications found</p>
              <p className="text-[11px] text-[#64748b] mt-0.5">You're caught up with all alert triggers.</p>
            </div>
          ) : (
            filtered.map((item) => {
              const isJob = item.type === 'JOB_ALERT' || item.type === 'WALK_IN_DRIVE';
              const isInterview = item.type === 'INTERVIEW_REMINDER';
              const isOverdue = item.type === 'FOLLOW_UP_OVERDUE';

              return (
                <div
                  key={item.id}
                  onClick={() => onMarkAsRead(item.id)}
                  className={`p-3.5 hover:bg-[#faf8ff] transition-all flex items-start gap-3 cursor-pointer ${
                    !item.read ? 'bg-[#fcfaff]' : 'bg-white'
                  }`}
                >
                  {/* Icon / Logo Badge */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isInterview
                        ? 'bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]/60'
                        : isOverdue
                        ? 'bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]/60'
                        : 'bg-[#eef2ff] text-[#4338ca] border border-[#c7d2fe]/60'
                    }`}
                  >
                    {item.logoText ? (
                      item.logoText
                    ) : (
                      <span className="material-symbols-outlined text-[18px]">
                        {isInterview ? 'videocam' : isOverdue ? 'schedule' : 'work'}
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-bold text-xs text-[#0f172a] truncate">
                        {item.company ? `${item.company} — ${item.ctcText || 'Verified'}` : item.title}
                      </span>
                      <span className="text-[10px] text-[#64748b] shrink-0 font-medium">
                        {item.timeAgoFormatted}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#475569] line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>

                    {/* Metadata strip & Action pill */}
                    <div className="flex items-center justify-between mt-2 pt-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.matchScore ? (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-[#ecfdf5] text-[#059669]">
                            {item.matchScore}% Match
                          </span>
                        ) : null}
                        {item.tags?.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-[#f1f5f9] text-[#475569]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Contextual Action Button */}
                      {isJob && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onSelectJob) onSelectJob('job_tw_01');
                            onClose();
                          }}
                          className="text-[11px] font-bold text-[#4338ca] hover:text-[#3730a3] flex items-center gap-0.5"
                        >
                          <span>View Job</span>
                          <span className="material-symbols-outlined text-[13px]">north_east</span>
                        </button>
                      )}
                      {isInterview && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onNavigateToSchedule) onNavigateToSchedule();
                            onClose();
                          }}
                          className="text-[11px] font-bold text-[#059669] hover:text-[#047857] flex items-center gap-0.5"
                        >
                          <span>Prep Notes</span>
                          <span className="material-symbols-outlined text-[13px]">description</span>
                        </button>
                      )}
                      {isOverdue && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onCopyEmailTemplate) onCopyEmailTemplate();
                          }}
                          className="text-[11px] font-bold text-[#dc2626] hover:text-[#b91c1c] flex items-center gap-0.5"
                        >
                          <span>Copy Email</span>
                          <span className="material-symbols-outlined text-[13px]">content_copy</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-[#4338ca] shrink-0 mt-1" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#faf8ff] border-t border-[#f1f5f9] flex items-center justify-between">
          <span className="text-[11px] text-[#059669] font-medium flex items-center gap-1 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
            In-App &amp; Email alerts active
          </span>
          <button
            onClick={() => {
              onNavigateToCenter();
              onClose();
            }}
            className="text-xs font-bold text-[#4338ca] hover:text-[#3730a3] flex items-center gap-1 cursor-pointer"
          >
            <span>View all in Center</span>
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </>
  );
}
