export type WorkMode = 'REMOTE' | 'HYBRID' | 'ONSITE';
export type InterviewMode = 'VIRTUAL' | 'IN_PERSON' | 'MIXED';

export interface Job {
  id: string;
  title: string;
  companyName: string;
  companyId: string;
  location: string;
  workMode: WorkMode;
  workingDays: string;
  salaryText: string;
  salaryMinLpa: number;
  roleCategory: string;
  experienceRequired: string;
  tags: string[];
  isWalkin: boolean;
  walkinDetails?: {
    venue: string;
    date: string;
    time: string;
  };
  jobMatchScore: number;
  resumeMatchScore: number;
  verificationBadge: string;
  sourceUrl: string;
}

export interface MetricSummary {
  qualifiedRoles: number;
  highMatchCount: number;
  walkinDrivesCount: number;
  pipelineCount: number;
}
