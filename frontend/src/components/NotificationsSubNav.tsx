import React from 'react';

export type NotificationsTab =
  | 'NOTIFICATION_CENTER'
  | 'JOB_ALERTS'
  | 'APPLICATION_REMINDERS'
  | 'NOTIFICATION_PREFERENCES'
  | 'NOTIFICATION_STATES';

interface NotificationsSubNavProps {
  activeTab: NotificationsTab;
  onSelectTab: (tab: NotificationsTab) => void;
  unreadCount?: number;
  remindersCount?: number;
  alertStatus?: 'ACTIVE' | 'PAUSED';
}

export default function NotificationsSubNav({
  activeTab,
  onSelectTab,
  unreadCount = 3,
  remindersCount = 1,
  alertStatus = 'ACTIVE',
}: NotificationsSubNavProps) {
  const tabs = [
    {
      id: 'NOTIFICATION_CENTER' as NotificationsTab,
      label: 'Notification Center',
      icon: 'notifications',
      badge: unreadCount > 0 ? `${unreadCount} New` : undefined,
      badgeColor: 'bg-[#4338ca] text-white',
    },
    {
      id: 'JOB_ALERTS' as NotificationsTab,
      label: 'Job Alerts',
      icon: 'radar',
      badge: alertStatus === 'ACTIVE' ? 'Active' : 'Paused',
      badgeColor: alertStatus === 'ACTIVE' ? 'bg-[#ecfdf5] text-[#059669]' : 'bg-[#fffbeb] text-[#d97706]',
    },
    {
      id: 'APPLICATION_REMINDERS' as NotificationsTab,
      label: 'Application Reminders',
      icon: 'event_repeat',
      badge: remindersCount > 0 ? `${remindersCount} Due` : undefined,
      badgeColor: 'bg-[#fef2f2] text-[#dc2626]',
    },
    {
      id: 'NOTIFICATION_PREFERENCES' as NotificationsTab,
      label: 'Preferences Hub',
      icon: 'tune',
    },
    {
      id: 'NOTIFICATION_STATES' as NotificationsTab,
      label: 'Delivery & System States',
      icon: 'feedback',
    },
  ];

  return (
    <div className="bg-white border-b border-[#e2e8f0] px-4 sm:px-6 lg:px-8 -mx-4 sm:-mx-6 lg:-mx-8 mb-6 shadow-xs sticky top-0 z-20">
      <div className="flex items-center justify-between gap-4 overflow-x-auto scrollbar-none py-2.5">
        <div className="flex items-center gap-1.5 shrink-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#eef2ff] text-[#4338ca] shadow-xs'
                    : 'text-[#475569] hover:bg-[#f8fafc] hover:text-[#0f172a]'
                }`}
              >
                <span className={`material-symbols-outlined text-[17px] ${isActive ? 'text-[#4338ca]' : 'text-[#64748b]'}`}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.2 rounded-full font-mono text-[10px] font-bold ${tab.badgeColor}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1 text-[11px] font-mono text-[#059669] font-bold bg-[#ecfdf5] px-2.5 py-1 rounded-md border border-[#a7f3d0]/60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse"></span>
            2026 Alert Stream Online
          </span>
        </div>
      </div>
    </div>
  );
}
