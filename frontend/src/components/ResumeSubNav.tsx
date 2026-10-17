import React from 'react';

export type ResumeTab = 
  | 'RESUME_HUB' 
  | 'RESUME_UPLOAD' 
  | 'RESUME_ANALYSIS' 
  | 'RESUME_MATCHING' 
  | 'RESUME_IMPROVEMENTS' 
  | 'RESUME_VERSIONS';

interface ResumeSubNavProps {
  activeTab: ResumeTab;
  onSelectTab: (tab: ResumeTab) => void;
  versionLabel?: string;
  atsScore?: number;
}

export default function ResumeSubNav({ activeTab, onSelectTab, versionLabel = 'v2.1', atsScore = 91 }: ResumeSubNavProps) {
  const tabs = [
    { id: 'RESUME_HUB' as ResumeTab, label: 'My Resume', icon: 'description', badge: versionLabel },
    { id: 'RESUME_UPLOAD' as ResumeTab, label: 'Upload Center', icon: 'file_upload', badge: 'PDF < 5MB' },
    { id: 'RESUME_ANALYSIS' as ResumeTab, label: 'Analysis Overview', icon: 'analytics', badge: `ATS ${atsScore}` },
    { id: 'RESUME_MATCHING' as ResumeTab, label: 'Job Matching', icon: 'join_inner', badge: '94% Peak' },
    { id: 'RESUME_IMPROVEMENTS' as ResumeTab, label: 'Improvements', icon: 'auto_fix_high', badge: '5 Ready' },
    { id: 'RESUME_VERSIONS' as ResumeTab, label: 'Version History', icon: 'history', badge: '3 Saved' },
  ];

  return (
    <div className="bg-white border-b border-[#e2e8f0] px-4 sm:px-8 py-3 mb-6 -mx-4 sm:-mx-8">
      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-1 no-scrollbar">
        <div className="flex items-center gap-1.5 shrink-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#4338ca] text-white shadow-xs'
                    : 'text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a]'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#e2e8f0] text-[#475569]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="hidden xl:flex items-center gap-2 shrink-0 text-xs font-mono text-[#64748b]">
          <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
          <span>Private Local Enclave (Encrypted Storage)</span>
        </div>
      </div>
    </div>
  );
}
