import React from 'react';

export type TrackerTab = 'APPLIED_KANBAN' | 'SAVED_JOBS' | 'SCHEDULE_HUB';

interface TrackerSubNavProps {
  activeTab: TrackerTab;
  onSelectTab: (tab: TrackerTab) => void;
  onOpenAddDrawer: () => void;
  trackedCount?: number;
  savedCount?: number;
  upcomingCount?: number;
}

export default function TrackerSubNav({
  activeTab,
  onSelectTab,
  onOpenAddDrawer,
  trackedCount = 5,
  savedCount = 5,
  upcomingCount = 5,
}: TrackerSubNavProps) {
  const tabs = [
    {
      id: 'APPLIED_KANBAN' as TrackerTab,
      label: 'Kanban Board',
      icon: 'view_kanban',
      badge: `${trackedCount} Active`,
      badgeColor: 'bg-[#ffdbce] text-[#7e2c00]',
    },
    {
      id: 'SAVED_JOBS' as TrackerTab,
      label: 'Saved Jobs',
      icon: 'bookmark',
      badge: `${savedCount} Saved`,
      badgeColor: 'bg-[#eef2ff] text-[#4338ca]',
    },
    {
      id: 'SCHEDULE_HUB' as TrackerTab,
      label: 'Schedule Hub',
      icon: 'calendar_month',
      badge: `${upcomingCount} Upcoming`,
      badgeColor: 'bg-[#ecfdf5] text-[#059669]',
    },
  ];

  return (
    <div className="bg-white border-b border-[#e2e8f0] px-4 sm:px-8 py-3 mb-6 -mx-4 sm:-mx-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 overflow-x-auto pb-1 no-scrollbar">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 shrink-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#9c3d0c] text-white shadow-xs'
                    : 'text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a]'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">{tab.icon}</span>
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    isActive ? 'bg-white/20 text-white' : tab.badgeColor
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden xl:flex items-center gap-1.5 text-xs font-mono text-[#64748b]">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
            <span>2026 BATCH PURSUIT SYNC ACTIVE</span>
          </div>

          <button
            onClick={onOpenAddDrawer}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#bc5424] hover:bg-[#9c3d0c] text-white text-xs font-semibold shadow-xs transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Add Application</span>
          </button>
        </div>
      </div>
    </div>
  );
}
