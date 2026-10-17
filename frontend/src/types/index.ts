export type WorkMode = 'REMOTE' | 'HYBRID' | 'ONSITE';
export type InterviewMode = 'VIRTUAL' | 'DIRECT_WALKIN' | 'CAMPUS_POOL';

export interface EpistemicData {
  field: string;
  value: string;
  reliability: 'KNOWN' | 'ESTIMATED' | 'UNKNOWN';
  sourceNote: string;
}

export interface MatchFactor {
  title: string;
  description: string;
  type: 'POSITIVE' | 'GAP' | 'RISK_FREE';
  scoreImpact?: string;
  recommendation?: string;
}

export interface Job {
  id: string;
  jobCode: string;
  title: string;
  companyName: string;
  companyLogoUrl?: string;
  location: string;
  workMode: WorkMode;
  workingDays: string;
  shiftTiming: string;
  salaryText: string;
  salaryMinLpa: number;
  salaryBreakdown?: string;
  batchAllowed: string;
  roleCategory: string;
  experienceRequired: string;
  jobType: 'FULL_TIME' | 'INTERNSHIP' | 'CONTRACT';
  interviewMode: InterviewMode;
  tags: string[];
  isWalkin: boolean;
  walkinDetails?: {
    venue: string;
    date: string;
    time: string;
    reportingWindow: string;
  };
  jobMatchScore: number;
  resumeMatchScore: number;
  verificationBadge: string;
  sourcePortal: string;
  sourceUrl: string;
  lastIngestedAgo: string;
  bondStatus: string;
  aboutRole: string;
  responsibilities: string[];
  requirements: string[];
  preferredQualifications: string[];
  strengths: MatchFactor[];
  gaps: MatchFactor[];
  riskChecks: MatchFactor[];
  epistemicMatrix: EpistemicData[];
}

export interface RadarCompany {
  id: string;
  name: string;
  logo: string;
  status: 'HIRING_ACTIVE' | 'HIGH_VOLUME' | 'POOL_EXPECTED';
  badgeText: string;
  fresherRolesCount: number;
  lastDriveDate: string;
  portalUrl: string;
}

export interface PipelineItem {
  id: string;
  company: string;
  role: string;
  salary: string;
  stage: string;
  stageDate: string;
  roundDetails: string;
  statusType: 'INTERVIEW' | 'ASSESSMENT' | 'UNDER_REVIEW';
}

export interface EducationEntry {
  id: string;
  category?: 'higher_ed' | 'school' | 'diploma';
  title: string;
  badge?: string;
  isPrimary: boolean;
  qualification: string;
  gradYear: string;
  specialization: string;
  institution: string;
  scoreType: 'cgpa' | 'pct';
  scoreValue: string;
}

export interface UserProfile {
  id?: string;
  fullName: string;
  email: string;
  emailVerified?: boolean;
  graduationYear?: string;
  degree?: string;
  targetTrack?: string;
  phone?: string;
  collegeName?: string;
  specialization?: string;
  cgpa?: string;
  educationList?: EducationEntry[];
  skills: string[];
  targetRoles: string[];
  preferredLocations: string[];
  workModes: string[];
  employmentTypes: string[];
  interviewPreference?: string;
  workingDaysPreference?: string;
  salaryFloorLpa?: number;
}

// Stitch Interface 1: Job Sources Types
export interface JobSource {
  id: string;
  companyName: string;
  portalName: string;
  portalUrl: string;
  sourceType: 'PORTAL' | 'CAMPUS' | 'API';
  status: 'ACTIVE' | 'SLOWDOWN' | 'PAUSED';
  statusDescription?: string;
  fresherJobsCount: number;
  lastCheckedText?: string;
  lastCheckedAt?: string;
  logoText: string;
}

export interface JobSourceSummary {
  totalPortals: number;
  openOpportunities: number;
  systemHealthText: string;
  sources: JobSource[];
}

// Stitch Interface 2: Check for Jobs / Discovery Scan Types
export interface DiscoveryScan {
  id: string;
  userId?: string;
  scope: 'ALL' | 'SINGLE';
  targetCompanyName?: string;
  targetSourceId?: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'STOPPED';
  progressPercent: number;
  currentStepIndex: number;
  currentCheckDescription: string;
  postingsScanned: number;
  fresherJobsFound: number;
  filteredOut: number;
  duplicatesIgnored: number;
  startedAt?: string;
  completedAt?: string;
}

// Stitch Interface 3: Recently Found Jobs Types
export interface FoundJob {
  id: string;
  jobCode?: string;
  title: string;
  company: string;
  location: string;
  city?: string;
  ctcText: string;
  ctcLpa?: number;
  fixedBase?: string;
  jobType: 'FULL_TIME' | 'INTERNSHIP' | 'TRAINEE';
  workMode?: string;
  interviewMode?: string;
  batchAllowed?: string;
  experienceText?: string;
  roleCategory?: string;
  bondText?: string;
  jobMatchScore?: number;
  resumeMatchScore?: number;
  skills?: string[];
  tag: string;
  status: 'VERIFIED' | 'REVIEW' | 'FILTERED';
  foundTimeText: string;
  sourceName: string;
  applyUrl: string;
  logoText: string;
  cautionNotice?: string;
  filterReason?: string;
  description?: string;
  aboutCompany?: string;
  isSaved?: boolean;
}

export interface FoundJobSummary {
  allCount: number;
  verifiedCount: number;
  reviewCount: number;
  filteredCount: number;
  jobs: FoundJob[];
}

// Stitch 5 Interfaces New Types
export interface CompanyItem {
  name: string;
  logoText: string;
  openingsCount: number;
  avgSalaryText: string;
  category: string;
  isVerified: boolean;
  website: string;
}

export interface RuleEvaluation {
  ruleNumber: number;
  ruleName: string;
  status: 'Pass' | 'N/A' | 'Fail';
  detail: string;
}

export interface FactorBreakdown {
  factorName: string;
  weightPercent: number;
  matchPercent: number;
  description: string;
  icon: string;
}

export interface JobEligibility {
  jobId: string;
  company: string;
  title: string;
  ctcText: string;
  ctcLpa: number;
  overallFitScore: number;
  fitRank: string;
  isEligible: boolean;
  auditHash: string;
  negativeContrastAlert: string;
  hardRules: RuleEvaluation[];
  candidateBreakdown: FactorBreakdown[];
}

// ==========================================
// Stitch 6 Interfaces: Resume Intelligence Types
// ==========================================

export interface ResumeProjectItem {
  title: string;
  role: string;
  techStack: string;
  bulletPoints: string[];
  projectUrl?: string;
  evidenceStrength?: string;
}

export interface EvidenceItem {
  skillOrKeyword: string;
  category: string;
  lineProof: string;
  confidencePercent: number;
  status: 'CONFIRMED' | 'GAP' | 'WEAK';
}

export interface MatchFactorItem {
  factorName: string;
  weightPercent: number;
  matchPercent: number;
  detail: string;
  icon: string;
}

export interface BulletImprovementItem {
  id: string;
  category: string;
  originalText: string;
  recommendedText: string;
  rationale: string;
  impactLevel: 'High' | 'Medium' | 'Format' | 'Low';
  context: string;
}

export interface ResumeVersion {
  id: string;
  userId: string;
  versionNumber: number;
  versionLabel: string;
  fileName: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  sha256Hash: string;
  storagePath: string;
  parsedText?: string;
  extractedCandidateName: string;
  extractedEmail: string;
  extractedPhone: string;
  extractedDegree: string;
  extractedGraduationBatch: string;
  extractedCgpa?: number;
  extractedSkills: string[];
  extractedProjects: ResumeProjectItem[];
  atsScore: number;
  overallScore: number;
  status: 'READY' | 'PROCESSING' | 'FAILED';
  errorMessage?: string;
  current: boolean;
  createdAt: string;
}

export interface ResumeOverview {
  resume: ResumeVersion;
  totalSkillsCount: number;
  totalProjectsCount: number;
  matchingJobsCount: number;
  peakMatchPercent: number;
  topMatchingCompany: string;
  topSkills: string[];
  projects: ResumeProjectItem[];
  atsScore: number;
  overallQualityScore: number;
}

export interface JobMatchItem {
  jobId: string;
  company: string;
  title: string;
  logoText: string;
  ctcText: string;
  workMode: string;
  matchScore: number;
  resumeScore: number;
  tag: string;
  confirmedEvidence: EvidenceItem[];
  missingPrerequisites: string[];
  weakEvidence: string[];
  matchFactors: MatchFactorItem[];
}

export interface MultiJobMatchResponse {
  resumeVersionId: string;
  resumeLabel: string;
  totalOpportunitiesEvaluated: number;
  activeTargetJobId: string;
  evaluatedJobs: JobMatchItem[];
}

export interface ImprovementsResponse {
  resumeVersionId: string;
  resumeLabel: string;
  totalSuggestions: number;
  highPriorityCount: number;
  mediumPriorityCount: number;
  formatStyleCount: number;
  suggestions: BulletImprovementItem[];
}

export interface VersionDiffResponse {
  fromVersion: ResumeVersion;
  toVersion: ResumeVersion;
  atsScoreDelta: number;
  skillCountDelta: number;
  addedSkills: string[];
  removedWeakPhrases: string[];
  summary: string;
}

export interface ResumeUploadResponse {
  id: string;
  versionLabel: string;
  fileName: string;
  fileSizeBytes: number;
  sha256Hash: string;
  atsScore: number;
  overallScore: number;
  status: string;
  extractedSkills: string[];
  message: string;
}
