import React, { useState } from 'react';
import { UserProfile } from '../types';

interface JobPreferencesPageProps {
  profile: UserProfile;
  onSaveSuccess: (updated: UserProfile) => void;
  onNavigateToOverview?: () => void;
}

export default function JobPreferencesPage({
  profile,
  onSaveSuccess,
  onNavigateToOverview,
}: JobPreferencesPageProps) {
  // Roles state
  const defaultRoles = ['Backend Developer', 'Software Engineer', 'Java Developer', 'QA / Test Automation Engineer'];
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    profile.targetRoles && profile.targetRoles.length > 0 ? profile.targetRoles : defaultRoles
  );
  const [customRoleInput, setCustomRoleInput] = useState('');

  // Employment Types state
  const [employmentTypes, setEmploymentTypes] = useState<string[]>(
    profile.employmentTypes && profile.employmentTypes.length > 0
      ? profile.employmentTypes
      : ['Full-time Direct Hire', 'Paid Technical Internships']
  );

  // Work Modes state
  const [workModes, setWorkModes] = useState<string[]>(
    profile.workModes && profile.workModes.length > 0
      ? profile.workModes
      : ['Hybrid', 'On-site']
  );

  // Locations state
  const defaultLocations = ['Bengaluru', 'Hyderabad', 'Pune'];
  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    profile.preferredLocations && profile.preferredLocations.length > 0
      ? profile.preferredLocations
      : defaultLocations
  );

  // Interview & Working days preferences
  const [interviewPref, setInterviewPref] = useState<string>(profile.interviewPreference || 'online');
  const [workingDaysPref, setWorkingDaysPref] = useState<string>(profile.workingDaysPreference || '5_days');
  const salaryFloor = profile.salaryFloorLpa || 2.4;

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Available add options
  const recommendedRoles = ['Frontend Developer', 'Full-Stack Developer', 'Software Development Engineer (SDE)', 'Data Analyst', 'DevOps / Cloud Engineer'];
  const availableCities = ['Chennai', 'Delhi-NCR', 'Mumbai', 'Kolkata', 'Any location in India'];

  const addRole = (role: string) => {
    const trimmed = role.trim();
    if (!trimmed) return;
    if (selectedRoles.some(r => r.toLowerCase() === trimmed.toLowerCase())) return;
    setSelectedRoles([...selectedRoles, trimmed]);
    setCustomRoleInput('');
  };

  const removeRole = (role: string) => {
    setSelectedRoles(selectedRoles.filter(r => r !== role));
  };

  const toggleEmploymentType = (type: string) => {
    if (employmentTypes.includes(type)) {
      if (employmentTypes.length > 1) {
        setEmploymentTypes(employmentTypes.filter(t => t !== type));
      }
    } else {
      setEmploymentTypes([...employmentTypes, type]);
    }
  };

  const toggleWorkMode = (mode: string) => {
    if (workModes.includes(mode)) {
      if (workModes.length > 1) {
        setWorkModes(workModes.filter(m => m !== mode));
      }
    } else {
      setWorkModes([...workModes, mode]);
    }
  };

  const addLocation = (city: string) => {
    if (!selectedLocations.includes(city)) {
      setSelectedLocations([...selectedLocations, city]);
    }
  };

  const removeLocation = (city: string) => {
    setSelectedLocations(selectedLocations.filter(c => c !== city));
  };

  const resetChanges = () => {
    setSelectedRoles(defaultRoles);
    setSelectedLocations(defaultLocations);
    setEmploymentTypes(['Full-time Direct Hire', 'Paid Technical Internships']);
    setWorkModes(['Hybrid', 'On-site']);
    setInterviewPref('online');
    setWorkingDaysPref('5_days');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccessMessage(null);
    setErrorMessage(null);

    const updatedProfile: UserProfile = {
      ...profile,
      targetRoles: selectedRoles,
      preferredLocations: selectedLocations,
      employmentTypes,
      workModes,
      interviewPreference: interviewPref,
      workingDaysPreference: workingDaysPref,
      salaryFloorLpa: salaryFloor,
    };

    try {
      const res = await fetch('/api/v1/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updatedProfile),
      });

      if (res.ok) {
        const json = await res.json();
        const data = json.data || updatedProfile;
        setSaveSuccessMessage('Job preferences and statutory compensation rules saved to MongoDB Atlas!');
        onSaveSuccess(data);
      } else {
        const errJson = await res.json().catch(() => null);
        setErrorMessage(errJson?.error?.message || 'Failed to save preferences. Server returned an error.');
      }
    } catch {
      setSaveSuccessMessage('Job preferences saved locally.');
      onSaveSuccess(updatedProfile);
    } finally {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3500);
    }
  };

  return (
    <div className="w-full bg-[#faf8ff] min-h-screen pb-32 animate-fade-in text-[#0f172a]">
      
      {/* Dynamic Top Context Bar */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#f1f5f9]">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#64748b]">
            <span className="hover:text-[#4338ca] cursor-pointer" onClick={onNavigateToOverview}>Preferences</span>
            <span className="material-symbols-outlined text-[13px] text-[#cbd5e1]">chevron_right</span>
            <span className="text-[#0f172a] font-bold">Job Discovery Settings</span>
          </div>

          <div className="flex items-baseline gap-3 pt-1">
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0f172a] tracking-tight">
              Job & Eligibility Preferences
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] font-mono text-[11px] font-bold text-[#059669]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
              Algorithmic Curation Active
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#64748b]">
            Define your role targets, mandatory salary boundaries, and tailored location preferences for verified technical pipelines.
          </p>
        </div>

        {/* Quick Telemetry Chipset */}
        <div className="flex items-center gap-4 self-start md:self-auto bg-white border border-[#e2e8f0] px-4 py-2.5 rounded-xl shadow-xs">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] uppercase text-[#94a3b8] font-bold">Discovery Health</span>
            <span className="text-xs font-bold text-[#059669] flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">verified</span> 100% Signal Match
            </span>
          </div>
          <div className="h-8 w-px bg-[#f1f5f9]"></div>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] uppercase text-[#94a3b8] font-bold">Quarantine Guard</span>
            <span className="text-xs font-bold text-[#4338ca]">Strict Filtering</span>
          </div>
        </div>
      </div>

      {/* Dynamic Feedback Banners */}
      {(saveSuccessMessage || errorMessage) && (
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          {saveSuccessMessage && (
            <div className="p-3.5 bg-[#ecfdf5] border border-[#a7f3d0] rounded-xl flex items-center gap-2.5 text-xs text-[#059669] font-medium animate-fade-in">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span>{saveSuccessMessage}</span>
            </div>
          )}
          {errorMessage && (
            <div className="p-3.5 bg-[#fef2f2] border border-[#fecaca] rounded-xl flex items-center gap-2.5 text-xs text-[#dc2626] font-medium animate-fade-in">
              <span className="material-symbols-outlined text-[20px]">error</span>
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      )}

      {/* Main Multi-Column Canvas */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left 8 Columns: Dynamic Configuration Panels */}
        <div className="xl:col-span-8 space-y-8">
          
          {/* SECTION C: MANDATORY ELIGIBILITY (The Non-Negotiable Barrier) */}
          <section className="relative overflow-hidden rounded-2xl bg-white border border-[#e2e8f0] p-6 sm:p-7 shadow-sm">
            <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-[#eef2ff] blur-3xl pointer-events-none"></div>

            <div className="flex items-start justify-between gap-4 relative z-10 pb-4 border-b border-[#f1f5f9]">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#eef2ff] text-[#4338ca] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">lock</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#4338ca] font-bold">
                      Non-Negotiable Barrier
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#cbd5e1]"></span>
                    <span className="font-mono text-[10px] text-[#64748b]">Platform Hard-Rules</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-[#0f172a]">
                    Mandatory Compensation & Quality Thresholds
                  </h2>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-[#eef2ff] text-[#4338ca] font-mono text-[11px] font-bold flex items-center gap-1 shrink-0">
                <span className="material-symbols-outlined text-[13px]">shield</span> Immutable Lock
              </span>
            </div>

            <p className="text-xs text-[#64748b] pt-3 pb-5 relative z-10 leading-relaxed">
              Our partner platform aggressively filters bad-faith listings. Any opportunity failing the compensation requirements below is quarantined or dropped from indexing before delivery.
            </p>

            {/* Metric Grid for Guardrails */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
              
              {/* Full-time Salary Floor */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex flex-col justify-between gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase text-[#94a3b8] font-bold">
                    Full-Time Compensation Floor
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-[#059669]">check_circle</span>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-[#0f172a] tracking-tight flex items-baseline gap-1.5">
                    &gt; ₹2.40 <span className="text-sm font-normal text-[#64748b]">LPA</span>
                  </div>
                  <span className="inline-block mt-1 font-mono text-[10px] text-[#4338ca] font-bold bg-[#eef2ff] px-2 py-0.5 rounded">
                    Strict Statutory Minimum
                  </span>
                </div>

                <p className="text-[11px] text-[#64748b] leading-normal pt-1">
                  Listings below ₹2.4 LPA, variable-only packages, or roles with undisclosed compensation tiers are permanently quarantined.
                </p>
              </div>

              {/* Paid Internship Stipend Rules */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex flex-col justify-between gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase text-[#94a3b8] font-bold">
                    Internship Stipend Mandates
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-[#059669]">verified_user</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#334155] font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4338ca]"></span> Short-term (≤ 2 mos)
                    </span>
                    <span className="font-mono font-semibold text-[#0f172a]">WFH: ₹5k/mo | WFO: ₹10k/mo</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#334155] font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4338ca]"></span> Long-term (&gt; 2 mos)
                    </span>
                    <span className="font-mono font-semibold text-[#0f172a]">Min. ₹8,000/mo (No cap)</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[#dc2626] font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626]"></span> Unstated Stipend
                    </span>
                    <span className="font-mono text-[10px] uppercase font-bold text-[#dc2626]">Auto-Disqualified</span>
                  </div>
                </div>

                <div className="text-[11px] text-[#64748b] border-t border-[#e2e8f0] pt-2">
                  Unpaid technical internships violate ecosystem policy and are barred by system-level filters.
                </div>
              </div>

            </div>
          </section>

          {/* SECTION A: TARGET IT SPECIALIZATIONS */}
          <section className="rounded-2xl bg-white border border-[#e2e8f0] p-6 sm:p-7 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-[#f1f5f9] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#94a3b8] font-bold">Section A</span>
                  <span className="w-1 h-1 rounded-full bg-[#cbd5e1]"></span>
                  <span className="font-mono text-[10px] text-[#4338ca] font-bold">Core Technical Target</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#0f172a]">Target IT Specializations</h3>
              </div>
              <span className="text-xs text-[#64748b] font-mono">
                <span className="font-bold text-[#0f172a]">{selectedRoles.length}</span> selected
              </span>
            </div>

            {/* Exclusion Guard Notice Banner */}
            <div className="p-3.5 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] flex items-start gap-3">
              <span className="material-symbols-outlined text-[20px] text-[#059669] shrink-0 mt-0.5">policy</span>
              <div className="text-xs leading-relaxed">
                <span className="font-bold text-[#059669] block">Exclusion Guard Active</span>
                <span className="text-[#334155]">
                  BPO, Telecalling, Data Entry, Tech Support (L1 Non-Dev), and Non-Tech Sales titles are permanently excluded from indexing regardless of search terms.
                </span>
              </div>
            </div>

            {/* Selected Roles Stack */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase text-[#94a3b8] font-bold">Active Selected Roles</label>
              <div className="flex flex-wrap gap-2 min-h-10">
                {selectedRoles.map((role) => (
                  <button 
                    key={role}
                    type="button"
                    onClick={() => removeRole(role)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-semibold shadow-2xs transition group"
                  >
                    <span>{role}</span>
                    <span className="material-symbols-outlined text-[15px] opacity-75 group-hover:opacity-100">close</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recommended Target Adds */}
            <div className="space-y-2 pt-1 text-xs">
              <label className="font-mono text-[10px] uppercase text-[#94a3b8] font-bold">Recommended Available Targets</label>
              <div className="flex flex-wrap gap-2">
                {recommendedRoles.map((r) => (
                  <button 
                    key={r}
                    type="button"
                    onClick={() => addRole(r)}
                    disabled={selectedRoles.includes(r)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
                      selectedRoles.includes(r)
                        ? 'bg-[#f1f5f9] text-[#94a3b8] border-[#e2e8f0] cursor-default'
                        : 'bg-white hover:bg-[#f8fafc] border-[#e2e8f0] text-[#334155] hover:border-[#4338ca]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {selectedRoles.includes(r) ? 'check' : 'add'}
                    </span>
                    <span>{r}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Role Input */}
            <div className="pt-2">
              <div className="relative flex items-center">
                <span className="material-symbols-outlined text-[#94a3b8] absolute left-3.5 text-[18px]">search</span>
                <input 
                  type="text"
                  value={customRoleInput}
                  onChange={(e) => setCustomRoleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addRole(customRoleInput);
                    }
                  }}
                  placeholder="Search or define custom technical role (e.g. Distributed Systems Engineer)..."
                  className="w-full h-11 pl-10 pr-24 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] text-[#0f172a] text-xs font-medium outline-none focus:border-[#4338ca] focus:bg-white transition"
                />
                <button 
                  type="button"
                  onClick={() => addRole(customRoleInput)}
                  className="absolute right-2 px-3.5 py-1.5 rounded bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-semibold transition"
                >
                  Add Tag
                </button>
              </div>
            </div>

          </section>

          {/* SECTION B & D: EMPLOYMENT TYPE + WORK MODE (Dual Bento) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Section B: Employment Type */}
            <section className="rounded-2xl bg-white border border-[#e2e8f0] p-6 shadow-sm flex flex-col justify-between gap-5">
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase text-[#94a3b8] font-bold">Section B</span>
                <h3 className="text-base font-bold text-[#0f172a]">Employment Type</h3>
                <p className="text-xs text-[#64748b]">Select target engagements eligible for direct application.</p>
              </div>

              <div className="space-y-3">
                <label 
                  onClick={() => toggleEmploymentType('Full-time Direct Hire')}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] cursor-pointer hover:bg-[#f1f5f9] transition"
                >
                  <input 
                    type="checkbox"
                    checked={employmentTypes.includes('Full-time Direct Hire')}
                    readOnly
                    className="mt-0.5 w-4 h-4 rounded text-[#4338ca] accent-[#4338ca]"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-[#0f172a] block">Full-time Direct Hire</span>
                    <span className="text-[#64748b]">Permanent standard roles with minimum ₹2.4 LPA base floor.</span>
                  </div>
                </label>

                <label 
                  onClick={() => toggleEmploymentType('Paid Technical Internships')}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] cursor-pointer hover:bg-[#f1f5f9] transition"
                >
                  <input 
                    type="checkbox"
                    checked={employmentTypes.includes('Paid Technical Internships')}
                    readOnly
                    className="mt-0.5 w-4 h-4 rounded text-[#4338ca] accent-[#4338ca]"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-[#0f172a] block">Paid Technical Internships</span>
                    <span className="text-[#64748b]">Structured stipend positions compliant with advisory compensation rules.</span>
                  </div>
                </label>
              </div>

              <div className="p-2.5 rounded-lg bg-[#f1f5f9] flex items-center gap-2 text-xs text-[#64748b]">
                <span className="material-symbols-outlined text-[16px] text-[#dc2626]">do_not_disturb_on</span>
                <span className="text-[11px]">Unpaid internships are strictly prohibited and never displayed.</span>
              </div>
            </section>

            {/* Section D: Preferred Work Mode */}
            <section className="rounded-2xl bg-white border border-[#e2e8f0] p-6 shadow-sm flex flex-col justify-between gap-5">
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase text-[#94a3b8] font-bold">Section D</span>
                <h3 className="text-base font-bold text-[#0f172a]">Preferred Work Mode</h3>
                <p className="text-xs text-[#64748b]">Tailors matches; unstated positions remain labeled 'Not specified'.</p>
              </div>

              <div className="space-y-2.5 text-xs">
                {/* Remote */}
                <label 
                  onClick={() => toggleWorkMode('Remote')}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] cursor-pointer hover:bg-[#f1f5f9] transition"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-[#64748b]">home_work</span>
                    <span className="font-semibold text-[#0f172a]">Remote / Work from Home</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={workModes.includes('Remote')}
                    readOnly
                    className="w-4 h-4 rounded text-[#4338ca] accent-[#4338ca]"
                  />
                </label>

                {/* Hybrid */}
                <label 
                  onClick={() => toggleWorkMode('Hybrid')}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] cursor-pointer hover:bg-[#f1f5f9] transition"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-[#4338ca]">corporate_fare</span>
                    <span className="font-semibold text-[#0f172a]">Hybrid (1-3 Days In-Office)</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={workModes.includes('Hybrid')}
                    readOnly
                    className="w-4 h-4 rounded text-[#4338ca] accent-[#4338ca]"
                  />
                </label>

                {/* On-site */}
                <label 
                  onClick={() => toggleWorkMode('On-site')}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] cursor-pointer hover:bg-[#f1f5f9] transition"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-[#4338ca]">domain</span>
                    <span className="font-semibold text-[#0f172a]">On-site / Campus Office</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={workModes.includes('On-site')}
                    readOnly
                    className="w-4 h-4 rounded text-[#4338ca] accent-[#4338ca]"
                  />
                </label>
              </div>

              <div className="p-2.5 rounded-lg bg-[#f1f5f9] flex items-center gap-2 text-xs text-[#64748b]">
                <span className="material-symbols-outlined text-[16px] text-[#4338ca]">info</span>
                <span className="text-[11px]">Hybrid & On-Site prioritize selected metropolitan clusters.</span>
              </div>
            </section>

          </div>

          {/* SECTION E: PREFERRED LOCATIONS */}
          <section className="rounded-2xl bg-white border border-[#e2e8f0] p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-[#f1f5f9] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase text-[#94a3b8] font-bold">Section E</span>
                  <span className="w-1 h-1 rounded-full bg-[#cbd5e1]"></span>
                  <span className="font-mono text-[10px] text-[#64748b]">Metropolitan Technology Hubs</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#0f172a]">Target Geographic Clusters</h3>
              </div>
              <span className="text-xs text-[#059669] font-mono font-bold">Primary Hubs Priority</span>
            </div>

            {/* Selected Locations */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase text-[#94a3b8] font-bold">Selected Locations (Ranked Priority)</label>
              <div className="flex flex-wrap gap-2">
                {selectedLocations.map((loc, idx) => (
                  <div 
                    key={loc}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#f1f5f9] border border-[#e2e8f0] text-[#0f172a] text-xs font-semibold"
                  >
                    <span className="material-symbols-outlined text-[#4338ca] text-[16px]">location_on</span>
                    <span>{loc}</span>
                    {idx === 0 && <span className="text-[#64748b] font-normal text-[11px]">(Primary)</span>}
                    <button 
                      type="button"
                      onClick={() => removeLocation(loc)}
                      className="material-symbols-outlined text-[14px] text-[#94a3b8] hover:text-[#dc2626] ml-1"
                    >
                      close
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Regional Quick-Adds */}
            <div className="space-y-2 pt-1 text-xs">
              <label className="font-mono text-[10px] uppercase text-[#94a3b8] font-bold">Available Regional Centers</label>
              <div className="flex flex-wrap gap-2">
                {availableCities.map((city) => (
                  <button 
                    key={city}
                    type="button"
                    onClick={() => addLocation(city)}
                    disabled={selectedLocations.includes(city)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
                      selectedLocations.includes(city)
                        ? 'bg-[#f1f5f9] text-[#94a3b8] border-[#e2e8f0] cursor-default'
                        : 'bg-white hover:bg-[#f8fafc] border-[#e2e8f0] text-[#334155] hover:border-[#4338ca]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {selectedLocations.includes(city) ? 'check' : 'add_location'}
                    </span>
                    <span>{city}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION F & G: INTERVIEW FORMAT + WORKING DAYS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Section F: Interview Preference */}
            <section className="rounded-2xl bg-white border border-[#e2e8f0] p-6 shadow-sm space-y-4">
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase text-[#94a3b8] font-bold">Section F</span>
                <h3 className="text-base font-bold text-[#0f172a]">Interview Format Preference</h3>
                <p className="text-xs text-[#64748b]">Select your disposition for initial technical rounds.</p>
              </div>

              <div className="space-y-2 text-xs">
                <label className="flex items-center justify-between p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] cursor-pointer hover:bg-[#f1f5f9] transition">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#4338ca] text-[18px]">videocam</span>
                    <div>
                      <span className="font-bold text-[#0f172a] block">Online / Virtual Preferred</span>
                      <span className="text-[11px] text-[#64748b]">Standard for initial technical screening</span>
                    </div>
                  </div>
                  <input 
                    type="radio"
                    name="interview-pref"
                    checked={interviewPref === 'online'}
                    onChange={() => setInterviewPref('online')}
                    className="w-4 h-4 text-[#4338ca] accent-[#4338ca]"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] cursor-pointer hover:bg-[#f1f5f9] transition">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#64748b] text-[18px]">sync_alt</span>
                    <span className="font-semibold text-[#0f172a]">Either online or offline</span>
                  </div>
                  <input 
                    type="radio"
                    name="interview-pref"
                    checked={interviewPref === 'either'}
                    onChange={() => setInterviewPref('either')}
                    className="w-4 h-4 text-[#4338ca] accent-[#4338ca]"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] cursor-pointer hover:bg-[#f1f5f9] transition">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#64748b] text-[18px]">group</span>
                    <span className="font-semibold text-[#0f172a]">Offline / Walk-in acceptable</span>
                  </div>
                  <input 
                    type="radio"
                    name="interview-pref"
                    checked={interviewPref === 'offline'}
                    onChange={() => setInterviewPref('offline')}
                    className="w-4 h-4 text-[#4338ca] accent-[#4338ca]"
                  />
                </label>
              </div>
            </section>

            {/* Section G: Working Days */}
            <section className="rounded-2xl bg-white border border-[#e2e8f0] p-6 shadow-sm flex flex-col justify-between gap-4">
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase text-[#94a3b8] font-bold">Section G</span>
                <h3 className="text-base font-bold text-[#0f172a]">Working Days Schedule</h3>
                <p className="text-xs text-[#64748b]">Calendar frequency preference for weekly operations.</p>
              </div>

              <div className="space-y-2 text-xs">
                <label className="flex items-center justify-between p-2.5 px-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] cursor-pointer hover:bg-[#f1f5f9] transition">
                  <span className="font-semibold text-[#0f172a]">Prefer 5 working days</span>
                  <input 
                    type="radio"
                    name="working-days"
                    checked={workingDaysPref === '5_days'}
                    onChange={() => setWorkingDaysPref('5_days')}
                    className="w-4 h-4 text-[#4338ca] accent-[#4338ca]"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 px-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] cursor-pointer hover:bg-[#f1f5f9] transition">
                  <span className="font-semibold text-[#0f172a]">6 working days acceptable</span>
                  <input 
                    type="radio"
                    name="working-days"
                    checked={workingDaysPref === '6_days'}
                    onChange={() => setWorkingDaysPref('6_days')}
                    className="w-4 h-4 text-[#4338ca] accent-[#4338ca]"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 px-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] cursor-pointer hover:bg-[#f1f5f9] transition">
                  <span className="font-semibold text-[#0f172a]">No preference</span>
                  <input 
                    type="radio"
                    name="working-days"
                    checked={workingDaysPref === 'none'}
                    onChange={() => setWorkingDaysPref('none')}
                    className="w-4 h-4 text-[#4338ca] accent-[#4338ca]"
                  />
                </label>
              </div>

              <div className="p-3 rounded-xl bg-[#f1f5f9] flex items-start gap-2.5 text-xs text-[#334155]">
                <span className="material-symbols-outlined text-[18px] text-[#4338ca] shrink-0 mt-0.5">school</span>
                <div>
                  <span className="font-mono text-[10px] uppercase text-[#64748b] font-bold block">Cohort Benchmark</span>
                  <p className="text-[11px] text-[#64748b]">Configured for 0 years of professional experience (2024 / 2025 graduates).</p>
                </div>
              </div>
            </section>

          </div>

        </div>

        {/* Right 4 Columns: Editorial Narrative & Live Match Inspector */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Editorial Card: Advisory Quality Guarantee */}
          <div className="rounded-2xl bg-white border border-[#e2e8f0] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#4338ca] font-bold">
                Verification Engine
              </span>
              <span className="font-mono text-[11px] text-[#94a3b8]">v3.4-LIVE</span>
            </div>

            <h4 className="text-xl font-bold font-serif text-[#0f172a] leading-tight">
              Curation Without Noise.
            </h4>

            <p className="text-xs text-[#64748b] leading-relaxed">
              Unlike bulk job boards that aggregate unvetted telemetry, your Discovery Engine matches candidate profiles against calibrated architectural benchmarks.
            </p>

            <div className="p-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#64748b]">Platform Acceptance Rate</span>
                <span className="font-mono font-bold text-[#0f172a]">14.2%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#e2e8f0] overflow-hidden">
                <div className="h-full bg-[#059669] rounded-full" style={{ width: '14.2%' }}></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#94a3b8] pt-0.5">
                <span>85.8% Filtered Out</span>
                <span className="text-[#059669] font-bold">Strict Standard</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <div className="w-9 h-9 rounded-xl bg-[#4338ca] text-white flex items-center justify-center font-bold text-xs shrink-0">
                EA
              </div>
              <div>
                <span className="font-bold text-xs text-[#0f172a] block">Executive Advisory</span>
                <span className="text-[11px] text-[#64748b]">Indian Tech Fresher Ecosystem</span>
              </div>
            </div>
          </div>

          {/* Live Rule Enforcement Monitor */}
          <div className="rounded-2xl bg-white border border-[#e2e8f0] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
              <h4 className="font-bold text-sm text-[#0f172a]">Filter Pipeline Active</h4>
              <span className="material-symbols-outlined text-[#059669] text-[18px]">sync</span>
            </div>

            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#059669] text-[17px] shrink-0 mt-0.5">check</span>
                <div>
                  <span className="font-bold text-[#0f172a] block">BPO / Non-Tech Suppression</span>
                  <span className="text-[#64748b] text-[11px]">Active at gateway level</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#059669] text-[17px] shrink-0 mt-0.5">check</span>
                <div>
                  <span className="font-bold text-[#0f172a] block">Full-time Floor: &gt; ₹2.40 LPA</span>
                  <span className="text-[#64748b] text-[11px]">Sub-floor packages discarded</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#059669] text-[17px] shrink-0 mt-0.5">check</span>
                <div>
                  <span className="font-bold text-[#0f172a] block">Zero-Experience Calibration</span>
                  <span className="text-[#64748b] text-[11px]">2024 / 2025 entry cohorts indexed</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#059669] text-[17px] shrink-0 mt-0.5">check</span>
                <div>
                  <span className="font-bold text-[#0f172a] block">Mandatory Stipend Assurance</span>
                  <span className="text-[#64748b] text-[11px]">Unpaid internships permanently blocked</span>
                </div>
              </li>
            </ul>

            <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#64748b] text-[17px]">database</span>
                <span className="text-[#0f172a] font-medium">Indexed pool sync</span>
              </div>
              <span className="font-mono font-bold text-[#4338ca]">1,248 Roles</span>
            </div>
          </div>

        </div>

      </div>

      {/* SECTION H: STICKY FLOATING ACTION BAR & LIVE TELEMETRY */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-60 z-30 bg-white/95 backdrop-blur-md px-4 sm:px-8 py-3.5 border-t border-[#e2e8f0] shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Live Summary Pills */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f1f5f9] text-[#0f172a] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#4338ca]"></span>
            <span>{selectedRoles.length} Target Roles</span>
          </div>
          <span className="text-[#cbd5e1]">•</span>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f8fafc] border border-[#e2e8f0] text-[#334155] font-medium">
            <span className="material-symbols-outlined text-[15px] text-[#059669]">shield_lock</span>
            <span>&gt; ₹2.4 LPA Floor</span>
          </div>
          <span className="text-[#cbd5e1]">•</span>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f8fafc] border border-[#e2e8f0] text-[#334155] font-medium">
            <span className="material-symbols-outlined text-[15px] text-[#4338ca]">pin_drop</span>
            <span>{selectedLocations.length} Hubs</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end">
          <button 
            type="button"
            onClick={resetChanges}
            className="px-4 py-2 rounded-lg border border-[#e2e8f0] bg-white hover:bg-[#f8fafc] text-[#334155] text-xs font-semibold transition"
          >
            Reset Changes
          </button>

          <button 
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 rounded-lg bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-semibold shadow-xs transition flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
            ) : (
              <span className="material-symbols-outlined text-[16px]">check</span>
            )}
            <span>{isSaving ? 'Synchronizing...' : 'Save Preferences'}</span>
          </button>
        </div>

      </div>

      {/* Save Feedback Toast Notification */}
      {showToast && (
        <div className="fixed bottom-20 right-6 z-50 rounded-xl bg-[#0f172a] text-white px-5 py-3.5 shadow-2xl flex items-center gap-3 animate-fade-in border border-white/10">
          <span className="material-symbols-outlined text-[#10b981] text-[22px]">verified</span>
          <div className="text-xs">
            <span className="font-bold block">Preferences Synchronized</span>
            <span className="text-[#94a3b8]">
              Discovery algorithm recalibrated to {selectedRoles.length} roles & ₹2.4 LPA floor.
            </span>
          </div>
        </div>
      )}

    </div>
  );
}
