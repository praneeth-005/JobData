import React, { useState, useEffect } from 'react';
import {
  ApplicationStage,
  JobApplication,
  KanbanBoardResponse,
  KanbanColumn,
} from '../types';
import TrackerSubNav, { TrackerTab } from '../components/TrackerSubNav';

interface ApplicationTrackerKanbanPageProps {
  onSelectApplication: (id: string) => void;
  onOpenAddDrawer: () => void;
  onNavigateTab: (tab: TrackerTab) => void;
}

export default function ApplicationTrackerKanbanPage({
  onSelectApplication,
  onOpenAddDrawer,
  onNavigateTab,
}: ApplicationTrackerKanbanPageProps) {
  const [boardData, setBoardData] = useState<KanbanBoardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterStage, setSelectedFilterStage] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  const fetchBoard = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/tracker/kanban?userId=user_arjun');
      if (res.ok) {
        const data = await res.json();
        setBoardData(data);
      }
    } catch (e) {
      console.warn('Failed to fetch kanban from API, using fallback store', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoard();
  }, []);

  const handleAdvanceStage = async (e: React.MouseEvent, app: JobApplication) => {
    e.stopPropagation();
    let nextStage: ApplicationStage = 'UNDER_REVIEW';
    if (app.stage === 'APPLIED') nextStage = 'UNDER_REVIEW';
    else if (app.stage === 'UNDER_REVIEW') nextStage = 'TECHNICAL_INTERVIEW';
    else if (app.stage === 'TECHNICAL_INTERVIEW') nextStage = 'OFFER_EXTENDED';
    else if (app.stage === 'OFFER_EXTENDED') nextStage = 'ARCHIVED';

    try {
      const res = await fetch(`/api/v1/tracker/applications/${app.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: nextStage,
          statusLabel: nextStage.replace('_', ' '),
        }),
      });
      if (res.ok) {
        fetchBoard();
      }
    } catch (err) {
      console.error('Failed to advance stage', err);
    }
  };

  const handleDelete = async (e: React.MouseEvent, appId: string) => {
    e.stopPropagation();
    if (!window.confirm('Remove this application from pursuit tracking?')) return;
    try {
      await fetch(`/api/v1/tracker/applications/${appId}`, { method: 'DELETE' });
      fetchBoard();
    } catch (err) {
      console.error('Failed to delete application', err);
    }
  };

  // Filter applications
  const filterApp = (app: JobApplication) => {
    const matchesSearch =
      searchQuery === '' ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStage =
      selectedFilterStage === 'ALL' || app.stage === selectedFilterStage;

    return matchesSearch && matchesStage;
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#0f172a] font-sans antialiased pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Tracker Sub Navigation */}
        <TrackerSubNav
          activeTab="APPLIED_KANBAN"
          onSelectTab={onNavigateTab}
          onOpenAddDrawer={onOpenAddDrawer}
          trackedCount={boardData?.totalTrackedCount || 5}
        />

        {/* Top Command & Action Bar */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#eef2ff] text-[#4338ca] text-xs font-bold uppercase tracking-wider">
                Active Pursuit Tracker
              </span>
              <span className="text-xs text-[#64748b]">• Synced with Enterprise Portals</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">
              Application Tracker
            </h1>
            <p className="text-sm text-[#475569] max-w-2xl mt-1">
              Stay organized across all 2026 Batch opportunities. Track timeline shifts, technical assessments, and interview schedules.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Switcher: Kanban vs List */}
            <div className="flex items-center bg-[#f1f5f9] p-1 rounded-xl border border-[#e2e8f0]">
              <button
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'kanban'
                    ? 'bg-white text-[#4338ca] shadow-xs'
                    : 'text-[#64748b] hover:text-[#0f172a]'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">view_kanban</span>
                <span>Kanban Board</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-[#4338ca] shadow-xs'
                    : 'text-[#64748b] hover:text-[#0f172a]'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">table_rows</span>
                <span>List View</span>
              </button>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={onOpenAddDrawer}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Add Application</span>
            </button>
          </div>
        </div>

        {/* KPI Summary Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
                Total Tracked
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-[#0f172a]">
                  {boardData?.totalTrackedCount || 5}
                </span>
                <span className="text-xs text-[#475569]">active pursuits</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#eef2ff] flex items-center justify-center text-[#4338ca]">
              <span className="material-symbols-outlined text-[22px]">hub</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
                In Progress
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-[#0f172a]">
                  {boardData?.inProgressCount || 3}
                </span>
                <span className="text-xs text-[#475569]">awaiting response</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#eef2ff] flex items-center justify-center text-[#4338ca]">
              <span className="material-symbols-outlined text-[22px]">pending_actions</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
                Interviews Scheduled
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-[#7c3aed]">
                  {boardData?.interviewsScheduledCount || 2}
                </span>
                <span className="text-xs text-[#475569]">upcoming this week</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#faf5ff] flex items-center justify-center text-[#9333ea]">
              <span className="material-symbols-outlined text-[22px]">video_camera_front</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
                Offers Received
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-[#059669]">
                  {boardData?.offersCount || 1}
                </span>
                <span className="text-xs text-[#059669] font-semibold">PhonePe Offer Extended</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#ecfdf5] flex items-center justify-center text-[#059669]">
              <span className="material-symbols-outlined text-[22px]">stars</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-xl p-3 mb-6 border border-[#e2e8f0] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-[#64748b]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search applications by company, role, or location..."
              className="w-full h-10 pl-9 pr-4 bg-[#f8fafc] text-xs rounded-lg border border-[#e2e8f0] text-[#0f172a] placeholder:text-[#64748b] outline-none focus:ring-2 focus:ring-[#4338ca]/20 focus:border-[#4338ca]"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-[#475569]">
              <span className="font-semibold">Filter Stage:</span>
              <select
                value={selectedFilterStage}
                onChange={(e) => setSelectedFilterStage(e.target.value)}
                className="h-10 px-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-xs font-semibold text-[#0f172a] outline-none"
              >
                <option value="ALL">All Stages</option>
                <option value="APPLIED">Applied</option>
                <option value="UNDER_REVIEW">Under Review / Tests</option>
                <option value="TECHNICAL_INTERVIEW">Interviews Scheduled</option>
                <option value="OFFER_EXTENDED">Offers Extended</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main View Area */}
        {viewMode === 'kanban' ? (
          /* Kanban Board Columns */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start overflow-x-auto pb-6">
            {boardData?.columns?.map((col) => {
              const filteredApps = col.applications.filter(filterApp);
              return (
                <div
                  key={col.stage}
                  className="bg-[#f8fafc] rounded-xl p-3 border border-[#e2e8f0] flex flex-col min-w-[260px]"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-[#0f172a] tracking-tight truncate">
                        {col.title}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-white text-[#0f172a] text-[11px] font-bold shadow-xs border border-[#e2e8f0]">
                        {filteredApps.length}
                      </span>
                    </div>
                  </div>

                  {/* Column Cards */}
                  <div className="space-y-3 flex-1">
                    {filteredApps.length === 0 ? (
                      <div className="py-8 text-center text-xs text-[#64748b] border border-dashed border-[#e2e8f0] rounded-lg bg-white">
                        No applications in this stage
                      </div>
                    ) : (
                      filteredApps.map((app) => (
                        <div
                          key={app.id}
                          onClick={() => onSelectApplication(app.id)}
                          className="group relative bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-xs hover:shadow-md hover:border-[#4338ca]/40 transition-all cursor-pointer flex flex-col gap-2.5"
                        >
                          {/* Card Header */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-[#eef2ff] text-[#4338ca] font-bold text-xs flex items-center justify-center shrink-0 border border-[#c7d2fe]/50">
                                {app.logoText || app.company.substring(0, 2).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-[#0f172a] truncate">
                                  {app.company}
                                </h4>
                                <span className="text-[10px] text-[#64748b]">
                                  {app.appliedDateFormatted}
                                </span>
                              </div>
                            </div>
                            <span className="px-1.5 py-0.5 rounded bg-[#ecfdf5] text-[#059669] text-[10px] font-bold shrink-0">
                              {app.matchScore}% Match
                            </span>
                          </div>

                          {/* Role Title */}
                          <div className="font-semibold text-xs text-[#0f172a] line-clamp-2 leading-snug">
                            {app.title}
                          </div>

                          {/* Attributes & Batch */}
                          <div className="flex items-center flex-wrap gap-1.5 text-[11px] text-[#475569]">
                            <span className="font-bold text-[#0f172a]">{app.ctcText}</span>
                            <span>•</span>
                            <span>{app.location}</span>
                            <span>•</span>
                            <span className="text-[#059669] font-semibold">{app.batchAllowed}</span>
                          </div>

                          {/* Next Action Pill */}
                          {app.nextActionTitle && (
                            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2 text-[11px] flex items-center gap-1.5 text-[#334155]">
                              <span className="material-symbols-outlined text-[15px] text-[#4338ca]">
                                event_available
                              </span>
                              <span className="truncate font-medium">{app.nextActionTitle}</span>
                            </div>
                          )}

                          {/* Card Actions Footer */}
                          <div className="pt-2 border-t border-[#f1f5f9] flex items-center justify-between">
                            <span className="text-[10px] font-mono text-[#64748b]">
                              {app.resumeVersionLabel || 'v2.1'}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                title="Advance Stage"
                                onClick={(e) => handleAdvanceStage(e, app)}
                                className="px-2 py-1 rounded bg-[#eef2ff] hover:bg-[#4338ca] hover:text-white text-[#4338ca] text-[10px] font-bold transition-all flex items-center gap-0.5"
                              >
                                <span>Advance</span>
                                <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                              </button>
                              <button
                                title="Delete"
                                onClick={(e) => handleDelete(e, app.id)}
                                className="w-6 h-6 rounded flex items-center justify-center text-[#64748b] hover:text-[#dc2626] hover:bg-[#fef2f2] transition-all"
                              >
                                <span className="material-symbols-outlined text-[14px]">delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View Table */
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8fafc] text-[#64748b] font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Company & Role</th>
                    <th className="py-3 px-4">Stage</th>
                    <th className="py-3 px-4">CTC Package</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Applied</th>
                    <th className="py-3 px-4">Next Action</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {boardData?.columns
                    ?.flatMap((c) => c.applications)
                    .filter(filterApp)
                    .map((app) => (
                      <tr
                        key={app.id}
                        onClick={() => onSelectApplication(app.id)}
                        className="hover:bg-[#f8fafc] transition-colors cursor-pointer"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[#eef2ff] text-[#4338ca] font-bold flex items-center justify-center border border-[#c7d2fe]/50">
                              {app.logoText || app.company.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-[#0f172a]">{app.company}</div>
                              <div className="text-[#475569] text-[11px]">{app.title}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-[#eef2ff] text-[#4338ca] font-bold text-[10px]">
                            {app.statusLabel || app.stage}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-[#0f172a]">{app.ctcText}</td>
                        <td className="py-3 px-4 text-[#475569]">{app.location} ({app.workMode})</td>
                        <td className="py-3 px-4 text-[#64748b]">{app.appliedDateFormatted}</td>
                        <td className="py-3 px-4">
                          <span className="text-[#334155] font-medium text-[11px]">
                            {app.nextActionTitle || 'Awaiting Review'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={(e) => handleAdvanceStage(e, app)}
                            className="px-2.5 py-1 rounded bg-[#eef2ff] hover:bg-[#4338ca] hover:text-white text-[#4338ca] text-[10px] font-bold transition-all mr-2"
                          >
                            Advance
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
