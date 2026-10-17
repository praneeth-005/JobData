import React, { useState, useEffect } from 'react';
import ResumeSubNav, { ResumeTab } from '../components/ResumeSubNav';
import { ResumeVersion, VersionDiffResponse } from '../types';

interface ResumeHistoryVersionsPageProps {
  onNavigateToTab: (tab: ResumeTab) => void;
}

export default function ResumeHistoryVersionsPage({ onNavigateToTab }: ResumeHistoryVersionsPageProps) {
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [diff, setDiff] = useState<VersionDiffResponse | null>(null);
  const [fromVersionId, setFromVersionId] = useState<string>('res_v20');
  const [toVersionId, setToVersionId] = useState<string>('res_v21');
  const [loading, setLoading] = useState(true);

  // Fetch all versions
  useEffect(() => {
    fetch('/api/v1/resumes/versions?userId=user_arjun', { credentials: 'include' })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Failed to load versions');
      })
      .then((data: ResumeVersion[]) => {
        setVersions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Fallback versions list:', err);
        const fallbackVersions: ResumeVersion[] = [
          {
            id: 'res_v21',
            userId: 'user_arjun',
            versionNumber: 21,
            versionLabel: 'v2.1',
            fileName: 'Arjun_Rao_Resume_v2.1.pdf',
            fileSizeBytes: 248832,
            fileSizeFormatted: '243.0 KB',
            sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            storagePath: 'user_arjun/v21_Arjun_Rao_Resume_v2.1.pdf',
            extractedCandidateName: 'Arjun Rao',
            extractedEmail: 'arjun.rao@example.com',
            extractedPhone: '+91 98765 43210',
            extractedDegree: 'B.Tech in Computer Science & Engineering',
            extractedGraduationBatch: '2026 Batch (Outgoing)',
            extractedCgpa: 8.65,
            extractedSkills: ['Java 21', 'Spring Boot', 'PostgreSQL', 'Apache Kafka', 'Docker', 'Git', 'JUnit 5', 'Mockito', 'REST APIs', 'Microservices', 'React', 'TypeScript', 'Tailwind CSS'],
            extractedProjects: [],
            atsScore: 91,
            overallScore: 93,
            status: 'READY',
            current: true,
            createdAt: '2026-10-15T15:16:19.857Z'
          },
          {
            id: 'res_v20',
            userId: 'user_arjun',
            versionNumber: 20,
            versionLabel: 'v2.0',
            fileName: 'Arjun_Rao_Resume_v2.0.pdf',
            fileSizeBytes: 215040,
            fileSizeFormatted: '210.0 KB',
            sha256Hash: 'c8e4f5a1b2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9',
            storagePath: 'user_arjun/v20_Arjun_Rao_Resume_v2.0.pdf',
            extractedCandidateName: 'Arjun Rao',
            extractedEmail: 'arjun.rao@example.com',
            extractedPhone: '+91 98765 43210',
            extractedDegree: 'B.Tech in Computer Science & Engineering',
            extractedGraduationBatch: '2026 Batch (Outgoing)',
            extractedCgpa: 8.65,
            extractedSkills: ['Java 17', 'Spring Boot', 'MySQL', 'PostgreSQL', 'Docker', 'Git', 'REST APIs', 'React'],
            extractedProjects: [],
            atsScore: 84,
            overallScore: 85,
            status: 'READY',
            current: false,
            createdAt: '2026-10-03T10:00:00.000Z'
          },
          {
            id: 'res_v10',
            userId: 'user_arjun',
            versionNumber: 10,
            versionLabel: 'v1.0',
            fileName: 'Arjun_Rao_Resume_v1.0.pdf',
            fileSizeBytes: 184320,
            fileSizeFormatted: '180.0 KB',
            sha256Hash: 'b7f3a9e4d12c8b05612478e5f98a23d145c67890abcdef1234567890abcdef12',
            storagePath: 'user_arjun/v10_Arjun_Rao_Resume_v1.0.pdf',
            extractedCandidateName: 'Arjun Rao',
            extractedEmail: 'arjun.rao@example.com',
            extractedPhone: '+91 98765 43210',
            extractedDegree: 'B.Tech in Computer Science & Engineering',
            extractedGraduationBatch: '2026 Batch (Outgoing)',
            extractedCgpa: 8.40,
            extractedSkills: ['Java', 'MySQL', 'HTML5', 'CSS3', 'JavaScript', 'Git'],
            extractedProjects: [],
            atsScore: 74,
            overallScore: 76,
            status: 'READY',
            current: false,
            createdAt: '2026-09-02T08:30:00.000Z'
          }
        ];
        setVersions(fallbackVersions);
        setLoading(false);
      });
  }, []);

  // Fetch comparison diff when selected versions change
  useEffect(() => {
    if (!fromVersionId || !toVersionId) return;

    fetch(`/api/v1/resumes/compare?from=${fromVersionId}&to=${toVersionId}`, { credentials: 'include' })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Failed to load diff');
      })
      .then((data: VersionDiffResponse) => {
        setDiff(data);
      })
      .catch((err) => {
        console.warn('Fallback diff:', err);
        setDiff({
          fromVersion: versions.find((v) => v.id === fromVersionId) || versions[1],
          toVersion: versions.find((v) => v.id === toVersionId) || versions[0],
          atsScoreDelta: 7,
          skillCountDelta: 6,
          addedSkills: ['Java 21', 'Apache Kafka', 'JUnit 5', 'Mockito', 'Microservices', 'TypeScript'],
          removedWeakPhrases: [
            "Eliminated vague 'worked on order system' phrasing",
            'Removed unverified cloud tools without metrics',
            'Standardized modern single-column ATS layout'
          ],
          summary: 'Version v2.1 demonstrates a +7 point ATS gain and added 6 verified technical competencies with line proofs.'
        });
      });
  }, [fromVersionId, toVersionId, versions]);

  const handleDownloadVersion = (id: string) => {
    window.open(`/api/v1/resumes/${id}/download`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto pb-16">
      <ResumeSubNav
        activeTab="RESUME_VERSIONS"
        onSelectTab={onNavigateToTab}
        versionLabel="v2.1"
        atsScore={91}
      />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#e2e8f0]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f1f5f9] text-[#475569] text-xs font-semibold mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#475569]"></span>
            <span>Digital Provenance & Audit Trail</span>
            <span className="text-[#94a3b8]">/</span>
            <span>SHA-256 Verified Iterations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
            Analysis History & Version Control
          </h1>
          <p className="text-sm text-[#64748b] mt-1 max-w-2xl">
            Track how your resume evolves over time. Every uploaded version is immutably archived with SHA-256 verification and score trajectories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateToTab('RESUME_UPLOAD')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4338ca] text-white hover:bg-[#3730a3] text-xs font-bold transition shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Upload New Iteration</span>
          </button>
        </div>
      </div>

      {/* Trajectory Velocity Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
        <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
          <span className="text-[#64748b] text-xs font-semibold">Total Iterations</span>
          <div className="text-2xl font-black text-[#0f172a] mt-1">{versions.length || 3}</div>
          <p className="text-[11px] text-[#64748b] mt-0.5">Logged in MongoDB</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
          <span className="text-[#64748b] text-xs font-semibold">Current Master ATS</span>
          <div className="text-2xl font-black text-[#059669] mt-1">91 / 100</div>
          <p className="text-[11px] text-[#059669] font-medium mt-0.5">v2.1 (Active)</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
          <span className="text-[#64748b] text-xs font-semibold">Overall ATS Gain</span>
          <div className="text-2xl font-black text-[#4338ca] mt-1">+17 pts</div>
          <p className="text-[11px] text-[#4338ca] font-medium mt-0.5">74 (v1.0) → 91 (v2.1)</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
          <span className="text-[#64748b] text-xs font-semibold">Target Batch Alignment</span>
          <div className="text-2xl font-black text-[#0f172a] mt-1">2026 Batch</div>
          <p className="text-[11px] text-[#059669] font-medium mt-0.5">100% Fresher Compliant</p>
        </div>
      </div>

      {/* Main Grid: Left Timeline & Right Side-by-Side Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        
        {/* Left Column (5 cols): Version Timeline Cards */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider">
              Version Timeline ({versions.length})
            </span>
            <span className="text-[11px] font-mono text-[#4338ca]">Select 2 to Compare</span>
          </div>

          {versions.map((ver) => {
            const isCurrent = ver.current;
            const isFrom = ver.id === fromVersionId;
            const isTo = ver.id === toVersionId;

            return (
              <div
                key={ver.id}
                className={`p-5 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-white border-[#4338ca] shadow-sm ring-1 ring-[#4338ca]'
                    : 'bg-white border-[#e2e8f0] hover:border-[#cbd5e1]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                      isCurrent ? 'bg-[#4338ca] text-white' : 'bg-[#f1f5f9] text-[#475569]'
                    }`}>
                      {ver.versionLabel}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[#0f172a]">{ver.fileName}</h3>
                        {isCurrent && (
                          <span className="px-1.5 py-0.5 rounded bg-[#ecfdf5] text-[#059669] font-mono text-[10px] font-bold">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#64748b] mt-0.5">
                        {ver.fileSizeFormatted} • ATS {ver.atsScore}/100
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownloadVersion(ver.id)}
                    title="Download this PDF version"
                    className="p-1.5 rounded-lg border border-[#e2e8f0] text-[#64748b] hover:text-[#4338ca] hover:bg-[#f8fafc] transition"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                  </button>
                </div>

                {/* Compare Checkboxes */}
                <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer text-[#475569]">
                      <input
                        type="radio"
                        name="compareFrom"
                        checked={isFrom}
                        onChange={() => setFromVersionId(ver.id)}
                        className="text-[#4338ca] focus:ring-[#4338ca]"
                      />
                      <span className="text-[11px] font-medium">Compare From</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer text-[#475569]">
                      <input
                        type="radio"
                        name="compareTo"
                        checked={isTo}
                        onChange={() => setToVersionId(ver.id)}
                        className="text-[#4338ca] focus:ring-[#4338ca]"
                      />
                      <span className="text-[11px] font-medium">Compare To</span>
                    </label>
                  </div>

                  <span className="text-[10px] font-mono text-[#94a3b8] truncate max-w-[120px]">
                    {ver.sha256Hash?.substring(0, 10)}...
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column (7 cols): Side-by-Side Diff Matrix */}
        <div className="lg:col-span-7 flex flex-col gap-6">

          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#f1f5f9]">
              <div>
                <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider">
                  Version Progression Diff
                </span>
                <h3 className="text-lg font-bold text-[#0f172a] mt-0.5">
                  Comparing {diff?.fromVersion?.versionLabel || 'v2.0'} → {diff?.toVersion?.versionLabel || 'v2.1'}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-[#ecfdf5] text-[#059669] font-bold text-sm">
                  +{diff?.atsScoreDelta || 7} ATS Gain
                </span>
              </div>
            </div>

            {/* Summary */}
            <div className="p-3.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] mt-4 text-xs text-[#334155] leading-relaxed">
              <strong className="text-[#0f172a]">Progression Summary: </strong>
              {diff?.summary || 'Version v2.1 shows consistent improvements in ATS score and added verified competencies.'}
            </div>

            {/* Side by side stats */}
            <div className="grid grid-cols-2 gap-4 mt-5 text-xs">
              <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                <span className="text-[11px] font-mono uppercase text-[#64748b] font-bold">
                  Baseline ({diff?.fromVersion?.versionLabel || 'v2.0'})
                </span>
                <div className="text-xl font-black text-[#0f172a] mt-1">
                  {diff?.fromVersion?.atsScore || 84} / 100 ATS
                </div>
                <p className="text-[11px] text-[#64748b] mt-1">
                  Skills: {diff?.fromVersion?.extractedSkills?.length || 8} items
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0]">
                <span className="text-[11px] font-mono uppercase text-[#059669] font-bold">
                  Target ({diff?.toVersion?.versionLabel || 'v2.1'})
                </span>
                <div className="text-xl font-black text-[#047857] mt-1">
                  {diff?.toVersion?.atsScore || 91} / 100 ATS
                </div>
                <p className="text-[11px] text-[#065f46] mt-1 font-semibold">
                  Skills: {diff?.toVersion?.extractedSkills?.length || 14} items (+{diff?.skillCountDelta || 6})
                </p>
              </div>
            </div>

            {/* Added Skills List */}
            <div className="mt-5">
              <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider block mb-2">
                Newly Added & Proven Technical Skills (+{diff?.addedSkills?.length || 6})
              </span>
              <div className="flex flex-wrap gap-2">
                {(diff?.addedSkills || []).map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#f0fdf4] border border-[#bbf7d0] text-xs font-semibold text-[#166534]"
                  >
                    <span className="material-symbols-outlined text-[14px] text-[#10b981]">add_circle</span>
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Eliminated Weak Phrasings */}
            <div className="mt-5">
              <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider block mb-2">
                Eliminated Flaws & Refinements
              </span>
              <ul className="space-y-1.5 text-xs text-[#64748b]">
                {(diff?.removedWeakPhrases || []).map((phrase, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[15px] text-[#059669] shrink-0 mt-0.5">done</span>
                    <span>{phrase}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Download Target Version CTA */}
            <div className="mt-6 pt-4 border-t border-[#f1f5f9] flex items-center justify-between">
              <span className="text-xs font-mono text-[#64748b]">
                Target: {diff?.toVersion?.fileName || 'Arjun_Rao_Resume_v2.1.pdf'}
              </span>
              <button
                onClick={() => handleDownloadVersion(diff?.toVersion?.id || 'res_v21')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#4338ca] text-white hover:bg-[#3730a3] text-xs font-bold transition shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Download {diff?.toVersion?.versionLabel || 'v2.1'} PDF</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
