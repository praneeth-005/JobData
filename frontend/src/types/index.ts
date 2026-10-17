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
