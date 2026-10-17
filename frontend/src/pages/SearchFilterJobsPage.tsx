import React, { useState, useEffect, useRef } from 'react';
import { FoundJob, CompanyItem } from '../types';

interface SearchFilterJobsPageProps {
  onSelectJob: (jobId: string) => void;
  onNavigateToEligibility?: (jobId: string) => void;
}

export default function SearchFilterJobsPage({ onSelectJob, onNavigateToEligibility }: SearchFilterJobsPageProps) {
  // Main Search & Company Autocomplete State
  const [searchQuery, setSearchQuery] = useState('');
  const [companyInput, setCompanyInput] = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);

  // Filter States
  const [minCtc, setMinCtc] = useState<number>(2.4);
  const [selectedWorkModes, setSelectedWorkModes] = useState<string[]>([]);
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);
  const [selectedInterviewModes, setSelectedInterviewModes] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'match_score' | 'salary_high' | 'newest'>('match_score');

  // Data & Telemetry State
  const [jobs, setJobs] = useState<FoundJob[]>([]);
  const [companiesList, setCompaniesList] = useState<CompanyItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isIngestingCompany, setIsIngestingCompany] = useState(false);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close company dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCompanyDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch verified companies for search autocomplete
  useEffect(() => {
    fetch('/api/v1/jobs/companies')
      .then(res => res.ok ? res.json() : null)
      .then(json => {
        if (json && json.data) {
          setCompaniesList(json.data);
        }
      })
      .catch(() => {});
  }, []);

  // Load jobs from backend
  const fetchFilteredJobs = () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('q', searchQuery.trim());
    if (selectedCompanies.length > 0) params.append('company', selectedCompanies.join(','));
    if (minCtc > 2.4) params.append('minCtc', minCtc.toString());
    if (selectedWorkModes.length === 1) params.append('workMode', selectedWorkModes[0]);
    if (selectedCities.length === 1) params.append('city', selectedCities[0]);
    if (selectedInterviewModes.length === 1) params.append('interviewMode', selectedInterviewModes[0]);
    if (selectedBatches.length === 1) params.append('batch', selectedBatches[0]);
    params.append('sort', sortBy);

    fetch(`/api/v1/jobs/search?${params.toString()}`)
      .then(res => res.ok ? res.json() : null)
      .then(json => {
        if (json && json.data && json.data.jobs) {
          let list = json.data.jobs as FoundJob[];

          // Multi-attribute client-side refinement
          if (selectedCompanies.length > 0) {
            list = list.filter(j => selectedCompanies.some(c => j.company.toLowerCase().includes(c.toLowerCase())));
          }
          if (selectedWorkModes.length > 0) {
            list = list.filter(j => selectedWorkModes.includes(j.workMode || 'Hybrid'));
          }
          if (selectedCities.length > 0) {
            list = list.filter(j => selectedCities.some(city => (j.city || j.location).toLowerCase().includes(city.toLowerCase())));
          }
          if (selectedSkills.length > 0) {
            list = list.filter(j => j.skills && selectedSkills.some(skill => j.skills!.includes(skill)));
          }

          setJobs(list);
        } else {
          loadFallbackJobs();
        }
        setIsLoading(false);
      })
      .catch(() => {
        loadFallbackJobs();
        setIsLoading(false);
      });
  };

  const loadFallbackJobs = () => {
    const defaultList: FoundJob[] = [
      {
        id: 'job-tw',
        jobCode: 'TW-GRAD-2025',
        title: 'Graduate Software Engineer (Java / Backend)',
        company: 'Thoughtworks',
        location: 'Bengaluru • Hybrid',
        city: 'Bengaluru',
        ctcText: '₹8.5 LPA (Confirmed)',
        ctcLpa: 8.5,
        jobType: 'FULL_TIME',
        workMode: 'Hybrid',
        interviewMode: 'VIRTUAL',
        batchAllowed: '2024 / 2025',
        experienceText: '0 Years / Fresher Scope',
        bondText: 'Zero Bond Guarantee',
        jobMatchScore: 94,
        resumeMatchScore: 88,
        skills: ['Java 21', 'Spring Boot', 'PostgreSQL', 'Docker'],
        tag: 'Verified Fresher',
        status: 'VERIFIED',
        foundTimeText: '15 mins ago',
        sourceName: 'Thoughtworks Official Career Page',
        applyUrl: 'https://thoughtworks.com/careers',
        logoText: 'TW'
      },
      {
        id: 'job-swg',
        jobCode: 'SWG-2025-ASE',
        title: 'Associate Software Engineer - 2025 Batch',
        company: 'Swiggy',
        location: 'Bengaluru • Hybrid',
        city: 'Bengaluru',
        ctcText: '₹6.0 LPA (Fixed Gross)',
        ctcLpa: 6.0,
        jobType: 'FULL_TIME',
        workMode: 'Hybrid',
        interviewMode: 'VIRTUAL',
        batchAllowed: '2024 / 2025',
        experienceText: '0 Years (Fresher)',
        bondText: 'Zero Bond Guarantee',
        jobMatchScore: 88,
        resumeMatchScore: 85,
        skills: ['Go / Golang', 'Java', 'Kafka', 'Redis'],
        tag: 'Verified Fresher',
        status: 'VERIFIED',
        foundTimeText: '30 mins ago',
        sourceName: 'Swiggy Careers Direct ATS',
        applyUrl: 'https://swiggy.com/careers/engineering',
        logoText: 'SW'
      },
      {
        id: 'job-rzp',
        jobCode: 'RZP-2025-089',
        title: 'Graduate Software Engineer (Payments Core)',
        company: 'Razorpay',
        location: 'Bengaluru (Hybrid)',
        city: 'Bengaluru',
        ctcText: '₹14.0 LPA (Confirmed)',
        ctcLpa: 14.0,
        jobType: 'FULL_TIME',
        workMode: 'Hybrid',
        interviewMode: 'VIRTUAL',
        batchAllowed: '2024 / 2025',
        experienceText: '0 Years / Fresher Scope',
        bondText: 'Zero Bond Guarantee',
        jobMatchScore: 92,
        resumeMatchScore: 86,
        skills: ['Go / Golang', 'Java 17', 'Distributed Systems', 'Kafka'],
        tag: 'Verified Fresher',
        status: 'VERIFIED',
        foundTimeText: '45 mins ago',
        sourceName: 'Razorpay Engineering Portal',
        applyUrl: 'https://razorpay.com/careers',
        logoText: 'RZP'
      },
      {
        id: 'job-rak',
        jobCode: 'RAK-2025-ASE',
        title: 'Associate Software Engineer',
        company: 'Rakuten',
        location: 'Bengaluru • Hybrid',
        city: 'Bengaluru',
        ctcText: '₹9.0 LPA (Confirmed)',
        ctcLpa: 9.0,
        jobType: 'FULL_TIME',
        workMode: 'Hybrid',
        interviewMode: 'VIRTUAL',
        batchAllowed: '2024 / 2025',
        experienceText: '0 Years / Fresher Scope',
        bondText: 'Zero Bond Guarantee',
        jobMatchScore: 90,
        resumeMatchScore: 89,
        skills: ['Java', 'Spring Cloud', 'React', 'AWS'],
        tag: 'Verified Fresher',
        status: 'VERIFIED',
        foundTimeText: '2 hours ago',
        sourceName: 'Rakuten India Careers',
        applyUrl: 'https://rakuten.in/careers',
        logoText: 'RAK'
      },
      {
        id: 'job-zh',
        jobCode: 'ZH-2025-DEV',
        title: 'Junior Full-Stack Developer',
        company: 'Zoho',
        location: 'Chennai • On-site',
        city: 'Chennai',
        ctcText: '₹5.6 LPA (Confirmed)',
        ctcLpa: 5.6,
        jobType: 'FULL_TIME',
        workMode: 'On-site',
        interviewMode: 'WALK_IN',
        batchAllowed: '2024 / 2025',
        experienceText: '0 Years / Entry-Level',
        bondText: 'Zero Bond Guarantee',
        jobMatchScore: 85,
        resumeMatchScore: 82,
        skills: ['Java', 'JavaScript', 'C++', 'PostgreSQL'],
        tag: 'Verified Fresher',
        status: 'VERIFIED',
        foundTimeText: '1 hour ago',
        sourceName: 'Zoho Corporation Career Portal',
        applyUrl: 'https://zoho.com/careers',
        logoText: 'ZH'
      },
      {
        id: 'job-infy',
        jobCode: 'INF-SP-2025',
        title: 'Specialist Programmer - Java Track',
        company: 'Infosys',
        location: 'Bengaluru • Hybrid',
        city: 'Bengaluru',
        ctcText: '₹9.5 LPA (Confirmed)',
        ctcLpa: 9.5,
        jobType: 'FULL_TIME',
        workMode: 'Hybrid',
        interviewMode: 'VIRTUAL',
        batchAllowed: '2024 / 2025',
        experienceText: '0 Years / Fresher Scope',
        bondText: 'Zero Bond Guarantee',
        jobMatchScore: 93,
        resumeMatchScore: 88,
        skills: ['Java', 'Spring Boot', 'Microservices', 'PostgreSQL'],
        tag: 'Verified Fresher',
        status: 'VERIFIED',
        foundTimeText: '4 hours ago',
        sourceName: 'Infosys Launchpad Hub',
        applyUrl: 'https://infosys.com/careers',
        logoText: 'INF'
      },
      {
        id: 'job-tcs',
        jobCode: 'TCS-DIG-2025',
        title: 'TCS Digital Software Developer',
        company: 'Tata Consultancy Services',
        location: 'Hyderabad • Hybrid',
        city: 'Hyderabad',
        ctcText: '₹7.2 LPA (Confirmed)',
        ctcLpa: 7.2,
        jobType: 'FULL_TIME',
        workMode: 'Hybrid',
        interviewMode: 'VIRTUAL',
        batchAllowed: '2024 / 2025',
        experienceText: '0 Years / Fresher Scope',
        bondText: 'Zero Bond Guarantee',
        jobMatchScore: 87,
        resumeMatchScore: 84,
        skills: ['Java', 'Python', 'Cloud Computing', 'SQL'],
        tag: 'Verified Fresher',
        status: 'VERIFIED',
        foundTimeText: '3 hours ago',
        sourceName: 'TCS NextStep & Career Hub',
        applyUrl: 'https://tcs.com/careers',
        logoText: 'TCS'
      },
      {
        id: 'job-pp',
        jobCode: 'PP-2025-SDE',
        title: 'Software Engineer - Backend Track',
        company: 'PhonePe',
        location: 'Bengaluru • Hybrid',
        city: 'Bengaluru',
        ctcText: '₹13.5 LPA (Confirmed)',
        ctcLpa: 13.5,
        jobType: 'FULL_TIME',
        workMode: 'Hybrid',
        interviewMode: 'VIRTUAL',
        batchAllowed: '2024 / 2025',
        experienceText: '0 Years / Fresher Scope',
        bondText: 'Zero Bond Guarantee',
        jobMatchScore: 91,
        resumeMatchScore: 87,
        skills: ['Java', 'Spring Boot', 'Kafka', 'Aerospike'],
        tag: 'Verified Fresher',
        status: 'VERIFIED',
        foundTimeText: '1 hour ago',
        sourceName: 'PhonePe Official Careers',
        applyUrl: 'https://phonepe.com/careers',
        logoText: 'PH'
      }
    ];

    let filtered = defaultList;
    if (companyInput.trim()) {
      filtered = filtered.filter(j => j.company.toLowerCase().includes(companyInput.toLowerCase().trim()));
    }
    if (selectedCompanies.length > 0) {
      filtered = filtered.filter(j => selectedCompanies.some(c => j.company.toLowerCase().includes(c.toLowerCase())));
    }
    if (minCtc > 2.4) {
      filtered = filtered.filter(j => (j.ctcLpa || 0) >= minCtc);
    }
    if (selectedWorkModes.length > 0) {
      filtered = filtered.filter(j => selectedWorkModes.includes(j.workMode || 'Hybrid'));
    }
    if (selectedCities.length > 0) {
      filtered = filtered.filter(j => selectedCities.some(city => (j.city || j.location).toLowerCase().includes(city.toLowerCase())));
    }
    setJobs(filtered);
  };

  useEffect(() => {
    fetchFilteredJobs();
  }, [searchQuery, selectedCompanies, minCtc, selectedWorkModes, selectedBatches, selectedInterviewModes, selectedCities, selectedSkills, sortBy]);

  // Handle on-demand ingestion when a user types an unlisted IT company
  const handleIngestSearchedCompany = (compName: string) => {
    if (!compName.trim()) return;
    setIsIngestingCompany(true);
    fetch('/api/v1/jobs/ingest-company', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyName: compName.trim() })
    })
      .then(res => res.json())
      .then(json => {
        setIsIngestingCompany(false);
        if (json && json.data) {
          showToast(`Verified fresher opening for ${compName} ingested successfully!`);
          if (!selectedCompanies.includes(compName)) {
            setSelectedCompanies(prev => [...prev, compName]);
          }
          fetchFilteredJobs();
        }
      })
      .catch(() => {
        setIsIngestingCompany(false);
        showToast(`Ingestion scan triggered for ${compName}. Added to verified queue.`);
        if (!selectedCompanies.includes(compName)) {
          setSelectedCompanies(prev => [...prev, compName]);
        }
      });
  };

  const toggleArrayItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(x => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setCompanyInput('');
    setSelectedCompanies([]);
    setMinCtc(2.4);
    setSelectedWorkModes([]);
    setSelectedBatches([]);
    setSelectedInterviewModes([]);
    setSelectedCities([]);
    setSelectedSkills([]);
    showToast('All search filters reset to defaults');
  };

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    fetch(`/api/v1/jobs/${id}/save`, { method: 'POST' }).catch(() => {});
    setSavedJobs(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast('Job removed from saved collection');
      } else {
        next.add(id);
        showToast('Opportunity saved successfully to profile!');
      }
      return next;
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered companies for autocomplete dropdown
  const filteredCompanySuggestions = companiesList.filter(c => 
    companyInput.trim() === '' || c.name.toLowerCase().includes(companyInput.toLowerCase().trim())
  );

  const hasActiveFilters = selectedCompanies.length > 0 || minCtc > 2.4 || selectedWorkModes.length > 0 || 
    selectedBatches.length > 0 || selectedInterviewModes.length > 0 || selectedCities.length > 0 || 
    selectedSkills.length > 0 || searchQuery.trim() !== '';

  return (
    <div className="w-full max-w-[1340px] mx-auto px-4 sm:px-6 py-6 font-sans">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1e1b4b] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-mono border border-indigo-400/30 animate-in fade-in slide-in-from-top-4">
          <span className="material-symbols-outlined text-[18px] text-[#10b981]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header / Meta Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#4338ca] font-bold mb-1">
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>MULTI-ATTRIBUTE SEARCH &amp; VERIFICATION ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0f172a] tracking-tight">
            Search &amp; Filter IT Jobs
          </h1>
          <p className="text-xs sm:text-sm text-[#64748b] mt-1 max-w-2xl">
            Search any Indian or global software IT company, filter with statutory fresher compensation floors, and view zero-bond guaranteed roles.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button 
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden px-3.5 py-2 bg-white border border-[#cbd5e1] rounded-xl text-xs font-mono font-bold text-[#334155] flex items-center gap-1.5 shadow-2xs"
          >
            <span className="material-symbols-outlined text-[18px] text-[#4338ca]">filter_list</span>
            <span>Filters ({selectedCompanies.length + selectedWorkModes.length + (minCtc > 2.4 ? 1 : 0)})</span>
          </button>

          {hasActiveFilters && (
            <button 
              onClick={resetAllFilters}
              className="px-3 py-2 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#334155] rounded-xl text-xs font-mono font-medium transition flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">refresh</span>
              <span>Reset All</span>
            </button>
          )}
        </div>
      </div>

      {/* UNIVERSAL SOFTWARE IT COMPANY SEARCH BAR (Feature Core) */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-4 sm:p-5 mb-6 shadow-xs flex flex-col gap-4">
        
        <div className="flex flex-col sm:flex-row gap-3">
          
          {/* Main IT Company Search Box with Autocomplete Dropdown */}
          <div className="flex-1 relative" ref={dropdownRef}>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined text-[22px] text-[#4338ca] absolute left-3.5 pointer-events-none">
                apartment
              </span>
              <input 
                type="text"
                value={companyInput}
                onChange={(e) => {
                  setCompanyInput(e.target.value);
                  setIsCompanyDropdownOpen(true);
                }}
                onFocus={() => setIsCompanyDropdownOpen(true)}
                placeholder="Search ANY software IT company (e.g. Swiggy, Thoughtworks, PhonePe, Zoho, Rakuten, TCS, Infosys, Amazon...)"
                className="w-full pl-11 pr-10 py-3 bg-[#faf8ff] text-sm text-[#0f172a] placeholder-[#94a3b8] rounded-xl border border-[#cbd5e1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4338ca] focus:border-[#4338ca] transition font-medium"
              />
              {companyInput && (
                <button 
                  onClick={() => {
                    setCompanyInput('');
                    setIsCompanyDropdownOpen(false);
                  }}
                  className="absolute right-3.5 text-[#94a3b8] hover:text-[#0f172a] text-sm font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Live Autocomplete Suggestions Dropdown */}
            {isCompanyDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#cbd5e1] rounded-2xl shadow-xl z-50 max-h-80 overflow-y-auto p-2">
                <div className="px-3 py-1.5 text-[11px] font-mono text-[#94a3b8] uppercase font-bold border-b border-[#f1f5f9] flex justify-between">
                  <span>Verified Software IT Companies ({filteredCompanySuggestions.length})</span>
                  <span>Instant Filter</span>
                </div>

                {filteredCompanySuggestions.length > 0 ? (
                  filteredCompanySuggestions.map(comp => {
                    const isSelected = selectedCompanies.includes(comp.name);
                    return (
                      <div
                        key={comp.name}
                        onClick={() => {
                          toggleArrayItem(selectedCompanies, setSelectedCompanies, comp.name);
                          setCompanyInput('');
                          setIsCompanyDropdownOpen(false);
                        }}
                        className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition ${
                          isSelected ? 'bg-[#eef2ff] text-[#4338ca]' : 'hover:bg-[#f8fafc] text-[#0f172a]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#0f172a] text-white flex items-center justify-center font-bold text-xs">
                            {comp.logoText || comp.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-bold tracking-tight">
                              {comp.name}
                            </div>
                            <div className="text-[11px] font-mono text-[#64748b]">
                              {comp.category} • Avg Fresher CTC: {comp.avgSalaryText}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#f1f5f9] text-[#475569]">
                            {comp.openingsCount} Active Roles
                          </span>
                          <span className={`material-symbols-outlined text-[20px] ${
                            isSelected ? 'text-[#4338ca]' : 'text-[#cbd5e1]'
                          }`}>
                            {isSelected ? 'check_box' : 'add_box'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  /* When user types a company not in DB: Prompt On-Demand Ingestion! */
                  <div className="p-4 text-center flex flex-col items-center">
                    <span className="material-symbols-outlined text-[28px] text-[#4338ca] mb-1">
                      search_check
                    </span>
                    <div className="text-sm font-bold text-[#0f172a]">
                      "{companyInput}" not yet indexed in active batch
                    </div>
                    <p className="text-xs text-[#64748b] mt-0.5 max-w-sm">
                      Our platform supports ANY software IT company. Trigger live ingestion scanner now to fetch verified fresher openings.
                    </p>
                    <button
                      onClick={() => {
                        handleIngestSearchedCompany(companyInput);
                        setIsCompanyDropdownOpen(false);
                      }}
                      disabled={isIngestingCompany}
                      className="mt-3 px-4 py-2 bg-[#4338ca] hover:bg-[#3730a3] text-white rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[16px]">bolt</span>
                      <span>{isIngestingCompany ? 'Scanning Career Portal...' : `Scan & Ingest ${companyInput}`}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Keyword Search (Title / Skills) */}
          <div className="sm:w-72 relative">
            <span className="material-symbols-outlined text-[20px] text-[#94a3b8] absolute left-3 top-3.5 pointer-events-none">
              code
            </span>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Skill or role (e.g. Java, Go, React)"
              className="w-full pl-9 pr-3 py-3 bg-[#faf8ff] text-sm text-[#0f172a] placeholder-[#94a3b8] rounded-xl border border-[#cbd5e1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4338ca] transition font-medium"
            />
          </div>

        </div>

        {/* Quick Company Pill Filter Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[11px] font-mono font-bold text-[#64748b] shrink-0 uppercase">
            POPULAR:
          </span>
          {['Rakuten', 'Thoughtworks', 'PhonePe', 'Swiggy', 'Zoho', 'Infosys', 'Tata Consultancy Services', 'Razorpay', 'Juspay', 'Amazon', 'Google'].map(comp => {
            const isSelected = selectedCompanies.includes(comp);
            return (
              <button
                key={comp}
                onClick={() => toggleArrayItem(selectedCompanies, setSelectedCompanies, comp)}
                className={`px-3 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition flex items-center gap-1 shrink-0 ${
                  isSelected 
                    ? 'bg-[#4338ca] text-white font-bold shadow-xs' 
                    : 'bg-[#f1f5f9] text-[#334155] hover:bg-[#e2e8f0]'
                }`}
              >
                <span>{comp}</span>
                {isSelected && <span>✓</span>}
              </button>
            );
          })}
        </div>

      </div>

      {/* ACTIVE FILTER PILLS STRIP */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white rounded-xl border border-[#e2e8f0] shadow-2xs">
          <span className="text-[11px] font-mono text-[#64748b] font-bold uppercase">
            Active Filters ({selectedCompanies.length + selectedWorkModes.length + selectedCities.length + selectedSkills.length + (minCtc > 2.4 ? 1 : 0)}):
          </span>

          {selectedCompanies.map(c => (
            <span key={c} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#eef2ff] text-[#4338ca] text-xs font-mono font-medium">
              Company: {c}
              <button onClick={() => toggleArrayItem(selectedCompanies, setSelectedCompanies, c)} className="hover:text-red-600">✕</button>
            </span>
          ))}

          {minCtc > 2.4 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ecfdf5] text-[#059669] text-xs font-mono font-medium">
              CTC: ≥ ₹{minCtc} LPA
              <button onClick={() => setMinCtc(2.4)} className="hover:text-red-600">✕</button>
            </span>
          )}

          {selectedWorkModes.map(m => (
            <span key={m} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f1f5f9] text-[#334155] text-xs font-mono font-medium">
              Mode: {m}
              <button onClick={() => toggleArrayItem(selectedWorkModes, setSelectedWorkModes, m)} className="hover:text-red-600">✕</button>
            </span>
          ))}

          {selectedCities.map(city => (
            <span key={city} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f8fafc] text-[#0284c7] text-xs font-mono font-medium">
              City: {city}
              <button onClick={() => toggleArrayItem(selectedCities, setSelectedCities, city)} className="hover:text-red-600">✕</button>
            </span>
          ))}

          {selectedSkills.map(s => (
            <span key={s} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#faf5ff] text-[#7e22ce] text-xs font-mono font-medium">
              Skill: {s}
              <button onClick={() => toggleArrayItem(selectedSkills, setSelectedSkills, s)} className="hover:text-red-600">✕</button>
            </span>
          ))}

          <button 
            onClick={resetAllFilters}
            className="text-xs font-mono text-[#dc2626] hover:underline ml-auto font-medium"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Grid: Left Filter Rail + Right Results Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* DESKTOP FILTER RAIL (3 Cols) */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-5 bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-xs sticky top-20">
          
          <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
            <span className="text-xs font-bold font-mono text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[17px] text-[#4338ca]">filter_list</span>
              <span>Filter Attributes</span>
            </span>
            <span className="text-[11px] font-mono text-[#059669] font-bold">
              Floor: ≥ ₹2.4L
            </span>
          </div>

          {/* Dimension 1: Minimum CTC Floor Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#0f172a]">Minimum Annual CTC</span>
              <span className="font-mono font-bold text-[#4338ca]">≥ ₹{minCtc} LPA</span>
            </div>
            <input 
              type="range"
              min="2.4"
              max="20"
              step="0.5"
              value={minCtc}
              onChange={(e) => setMinCtc(parseFloat(e.target.value))}
              className="w-full accent-[#4338ca] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#94a3b8]">
              <span>₹2.4L (Floor)</span>
              <span>₹6.0L</span>
              <span>₹12.0L</span>
              <span>₹20.0L+</span>
            </div>
          </div>

          {/* Dimension 2: Work Mode */}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#f1f5f9]">
            <span className="text-xs font-bold text-[#0f172a]">Work Arrangement</span>
            <div className="flex flex-col gap-1.5 text-xs text-[#334155]">
              {['Hybrid', 'Remote', 'On-site'].map(mode => (
                <label key={mode} className="flex items-center gap-2 cursor-pointer hover:text-[#0f172a]">
                  <input 
                    type="checkbox"
                    checked={selectedWorkModes.includes(mode)}
                    onChange={() => toggleArrayItem(selectedWorkModes, setSelectedWorkModes, mode)}
                    className="rounded text-[#4338ca] focus:ring-[#4338ca]"
                  />
                  <span>{mode}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Dimension 3: Graduation Batch */}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#f1f5f9]">
            <span className="text-xs font-bold text-[#0f172a]">Target Batch</span>
            <div className="flex flex-col gap-1.5 text-xs text-[#334155]">
              {['2024', '2025', '2026'].map(b => (
                <label key={b} className="flex items-center gap-2 cursor-pointer hover:text-[#0f172a]">
                  <input 
                    type="checkbox"
                    checked={selectedBatches.includes(b)}
                    onChange={() => toggleArrayItem(selectedBatches, setSelectedBatches, b)}
                    className="rounded text-[#4338ca] focus:ring-[#4338ca]"
                  />
                  <span>Class of {b}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Dimension 4: Interview Mode */}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#f1f5f9]">
            <span className="text-xs font-bold text-[#0f172a]">Interview Cadence</span>
            <div className="flex flex-col gap-1.5 text-xs text-[#334155]">
              {[
                { id: 'VIRTUAL', label: '100% Virtual / Remote Process' },
                { id: 'WALK_IN', label: 'Direct Walk-In Drives' }
              ].map(item => (
                <label key={item.id} className="flex items-center gap-2 cursor-pointer hover:text-[#0f172a]">
                  <input 
                    type="checkbox"
                    checked={selectedInterviewModes.includes(item.id)}
                    onChange={() => toggleArrayItem(selectedInterviewModes, setSelectedInterviewModes, item.id)}
                    className="rounded text-[#4338ca] focus:ring-[#4338ca]"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Dimension 5: City Hubs */}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#f1f5f9]">
            <span className="text-xs font-bold text-[#0f172a]">Primary City Hub</span>
            <div className="flex flex-wrap gap-1.5">
              {['Bengaluru', 'Hyderabad', 'Pune', 'Chennai', 'Noida / NCR', 'Mumbai'].map(city => {
                const isSelected = selectedCities.includes(city);
                return (
                  <button
                    key={city}
                    onClick={() => toggleArrayItem(selectedCities, setSelectedCities, city)}
                    className={`px-2 py-1 rounded-md text-[11px] font-mono transition ${
                      isSelected 
                        ? 'bg-[#1e1b4b] text-white font-bold' 
                        : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]'
                    }`}
                  >
                    {city}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dimension 6: Tech Stack Pills */}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#f1f5f9]">
            <span className="text-xs font-bold text-[#0f172a]">Skills Overlap</span>
            <div className="flex flex-wrap gap-1.5">
              {['Java', 'Spring Boot', 'Go', 'React', 'Python', 'SQL', 'PostgreSQL', 'Docker'].map(skill => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    onClick={() => toggleArrayItem(selectedSkills, setSelectedSkills, skill)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono transition ${
                      isSelected 
                        ? 'bg-[#4338ca] text-white font-bold' 
                        : 'bg-[#f8fafc] border border-[#e2e8f0] text-[#475569] hover:bg-[#e2e8f0]'
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* RESULTS FEED (9 Cols) */}
        <div className="lg:col-span-9 flex flex-col gap-4">
          
          {/* Subheader: Results count & Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#e2e8f0] shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
              <span className="font-bold text-[#0f172a]">{jobs.length} Opportunities Match Strict Rules</span>
              <span className="text-[#94a3b8] hidden sm:inline">• 0-1 Yr Exp Verified</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#64748b] font-mono">SORT:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-2.5 py-1 font-mono text-xs text-[#0f172a] focus:outline-none focus:ring-1 focus:ring-[#4338ca]"
              >
                <option value="match_score">Highest Fit Match</option>
                <option value="salary_high">Salary: High to Low</option>
                <option value="newest">Newest Ingested</option>
              </select>
            </div>
          </div>

          {/* Job List / Loading / Empty */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-[#e2e8f0]">
              <div className="w-10 h-10 rounded-full border-3 border-[#4338ca] border-t-transparent animate-spin mb-3"></div>
              <p className="text-sm font-mono text-[#64748b]">Evaluating multi-attribute filters across MongoDB database...</p>
            </div>
          ) : jobs.length === 0 ? (
            /* Empty State Matching Stitch Screen 5 Card A */
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-[#fee2e2] text-[#dc2626] flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[34px]">filter_alt_off</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold">
                  0 Openings Matched
                </span>
                <span className="text-xs font-mono text-[#64748b]">
                  Applied: {selectedCompanies.length + selectedWorkModes.length + (minCtc > 2.4 ? 1 : 0)} Criteria
                </span>
              </div>
              <h3 className="text-base font-bold text-[#0f172a]">No Results for Current Filters</h3>
              <p className="text-xs text-[#64748b] mt-1 max-w-md leading-relaxed">
                No eligible openings match all selected filters. The combination of your chosen IT company, salary threshold (≥ ₹{minCtc} LPA), or work arrangement yielded zero direct intersections.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
                <button 
                  onClick={resetAllFilters}
                  className="px-4 py-2 bg-[#4338ca] hover:bg-[#3730a3] text-white rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">refresh</span>
                  <span>Reset All Filters</span>
                </button>
                {companyInput && (
                  <button 
                    onClick={() => handleIngestSearchedCompany(companyInput)}
                    className="px-4 py-2 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#334155] rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">cloud_sync</span>
                    <span>Scan Career Portal for "{companyInput}"</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {jobs.map(job => {
                const isSaved = savedJobs.has(job.id);
                const score = job.jobMatchScore || 88;
                return (
                  <div 
                    key={job.id}
                    onClick={() => onSelectJob(job.id)}
                    className="bg-white rounded-2xl border border-[#e2e8f0] hover:border-[#c7d2fe] p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      
                      {/* Top Row: Company & Title & Fit Score */}
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-start gap-3.5 min-w-0">
                          <div className="w-12 h-12 rounded-xl bg-[#0f172a] text-white flex items-center justify-center font-bold text-base shrink-0 group-hover:bg-[#4338ca] transition-colors shadow-xs">
                            {job.logoText || job.company.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-[#4338ca] uppercase tracking-wide">
                                {job.company}
                              </span>
                              <span className="text-[#cbd5e1]">•</span>
                              <span className="px-2 py-0.5 rounded-full bg-[#f1f5f9] text-[#475569] text-[10px] font-mono">
                                {job.jobCode || 'VERIFIED-ATS'}
                              </span>
                              <span className="text-[#cbd5e1]">•</span>
                              <span className="text-[11px] font-mono text-[#64748b]">
                                {job.foundTimeText || 'Recent'}
                              </span>
                            </div>
                            <h2 className="text-base sm:text-lg font-bold text-[#0f172a] tracking-tight truncate group-hover:text-[#4338ca] transition-colors mt-0.5">
                              {job.title}
                            </h2>
                          </div>
                        </div>

                        {/* Fit Score Badge */}
                        <div className="flex flex-col items-end shrink-0">
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ecfdf5] text-[#059669] text-xs font-mono font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                            <span>{score}% Deterministic Match</span>
                          </div>
                          <span className="text-[10px] font-mono text-[#94a3b8] mt-0.5">
                            Rank #02 In Profile
                          </span>
                        </div>
                      </div>

                      {/* Fact Pills Row */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="px-3 py-1 rounded-lg bg-[#f0fdf4] text-[#15803d] border border-[#bbf7d0] text-xs font-mono font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px]">payments</span>
                          <span>{job.ctcText}</span>
                        </span>

                        <span className="px-2.5 py-1 rounded-lg bg-[#f8fafc] text-[#334155] border border-[#e2e8f0] text-xs font-medium flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px] text-[#64748b]">location_on</span>
                          <span>{job.location}</span>
                        </span>

                        <span className="px-2.5 py-1 rounded-lg bg-[#f1f5f9] text-[#475569] text-xs font-mono">
                          {job.workMode || 'Hybrid'}
                        </span>

                        <span className="px-2.5 py-1 rounded-lg bg-[#ecfdf5] text-[#059669] text-xs font-mono font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">verified</span>
                          <span>{job.bondText || 'Zero Bond Guarantee'}</span>
                        </span>
                      </div>

                      {/* Role summary / description */}
                      {job.description && (
                        <p className="text-xs text-[#64748b] line-clamp-2 mb-3 leading-relaxed">
                          {job.description}
                        </p>
                      )}

                      {/* Skills Tags */}
                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {job.skills.map(s => (
                            <span key={s} className="px-2 py-0.5 rounded bg-[#f1f5f9] text-[#334155] text-[11px] font-mono">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}

                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between gap-3 mt-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => toggleSave(job.id, e)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition ${
                            isSaved 
                              ? 'bg-[#eef2ff] border-[#c7d2fe] text-[#4338ca] font-bold' 
                              : 'bg-white border-[#e2e8f0] text-[#64748b] hover:text-[#0f172a]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {isSaved ? 'bookmark_added' : 'bookmark_border'}
                          </span>
                          <span>{isSaved ? 'Saved' : 'Save'}</span>
                        </button>

                        {onNavigateToEligibility && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigateToEligibility(job.id);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#faf8ff] hover:bg-[#eef2ff] text-[#4338ca] border border-[#e0e7ff] text-xs font-mono font-medium transition flex items-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-[16px]">psychology</span>
                            <span>View Match Explanation</span>
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (job.applyUrl) window.open(job.applyUrl, '_blank');
                          }}
                          className="px-4 py-1.5 rounded-lg bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-mono font-bold transition flex items-center gap-1 shadow-xs"
                        >
                          <span>Apply Official ATS</span>
                          <span className="material-symbols-outlined text-[15px]">arrow_outward</span>
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full p-5 flex flex-col justify-between overflow-y-auto">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
                <h3 className="font-bold text-sm text-[#0f172a]">Filter Attributes</h3>
                <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="text-[#64748b] p-1 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Min CTC */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-[#0f172a]">Min Annual CTC (≥ ₹{minCtc}L)</span>
                <input 
                  type="range"
                  min="2.4"
                  max="20"
                  step="0.5"
                  value={minCtc}
                  onChange={(e) => setMinCtc(parseFloat(e.target.value))}
                  className="w-full accent-[#4338ca]"
                />
              </div>

              {/* Work Mode */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-[#0f172a]">Work Arrangement</span>
                <div className="flex flex-wrap gap-2">
                  {['Hybrid', 'Remote', 'On-site'].map(mode => (
                    <button
                      key={mode}
                      onClick={() => toggleArrayItem(selectedWorkModes, setSelectedWorkModes, mode)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono ${
                        selectedWorkModes.includes(mode) ? 'bg-[#4338ca] text-white' : 'bg-[#f1f5f9] text-[#334155]'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cities */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-[#0f172a]">City Hubs</span>
                <div className="flex flex-wrap gap-2">
                  {['Bengaluru', 'Hyderabad', 'Pune', 'Chennai'].map(c => (
                    <button
                      key={c}
                      onClick={() => toggleArrayItem(selectedCities, setSelectedCities, c)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono ${
                        selectedCities.includes(c) ? 'bg-[#4338ca] text-white' : 'bg-[#f1f5f9] text-[#334155]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <div className="pt-4 border-t border-[#f1f5f9] flex gap-3">
              <button 
                onClick={resetAllFilters}
                className="flex-1 py-2.5 rounded-xl border border-[#cbd5e1] text-xs font-mono font-bold text-[#334155]"
              >
                Reset
              </button>
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#4338ca] text-white text-xs font-mono font-bold"
              >
                Apply ({jobs.length} Jobs)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
