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
  title: string;
  company: string;
  location: string;
  city?: string;
  ctcText: string;
  ctcLpa?: number;
  jobType: 'FULL_TIME' | 'INTERNSHIP' | 'TRAINEE';
  tag: string;
  status: 'VERIFIED' | 'REVIEW' | 'FILTERED';
  foundTimeText: string;
  sourceName: string;
  applyUrl: string;
  logoText: string;
  cautionNotice?: string;
  filterReason?: string;
  isSaved?: boolean;
}

export interface FoundJobSummary {
  allCount: number;
  verifiedCount: number;
  reviewCount: number;
  filteredCount: number;
  jobs: FoundJob[];
}
