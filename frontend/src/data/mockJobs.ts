export interface Job {
  id: string;
  jobCode: string;
  title: string;
  companyName: string;
  location: string;
  workMode: string;
  workingDays: string;
  salaryText: string;
  salaryMinLpa: number;
  fixedBase?: string;
  batchAllowed: string;
  roleCategory: string;
  experienceRequired: string;
  jobType: 'FULL_TIME' | 'INTERNSHIP';
  interviewMode: 'VIRTUAL' | 'WALK_IN' | 'HYBRID';
  tags: string[];
  isWalkin: boolean;
  walkinDetails?: {
    venue: string;
    date: string;
    time: string;
    instructions: string;
  };
  jobMatchScore: number;
  resumeMatchScore: number;
  matchBadgeText: string;
  sourceBadge: string;
  sourceUrl: string;
  ingestedAgo: string;
  ppoDetails?: string;
}

export const EXACT_JOBS: Job[] = [
  {
    id: 'job-rzp',
    jobCode: 'RZP-2025-089',
    title: 'Graduate Software Engineer (Backend)',
    companyName: 'Razorpay',
    location: 'Bengaluru (Hybrid)',
    workMode: 'Hybrid: 3 Days Office',
    workingDays: '5 Days / Week (General Day Shift)',
    salaryText: '₹14.0 LPA',
    salaryMinLpa: 14.0,
    fixedBase: 'Fixed Base: ₹12.50 LPA',
    batchAllowed: '2024 / 2025 B.Tech / M.Tech',
    roleCategory: 'Core Payments Transaction Processing Engine',
    experienceRequired: '0 Yrs (2024 / 2025)',
    jobType: 'FULL_TIME',
    interviewMode: 'VIRTUAL',
    tags: ['Go / Golang', 'Java 17', 'Distributed Systems', 'Kafka', 'MySQL'],
    isWalkin: false,
    jobMatchScore: 92,
    resumeMatchScore: 85,
    matchBadgeText: '94% Match',
    sourceBadge: '• Zero-Fee Verified • Direct Portal',
    sourceUrl: 'https://razorpay.com/careers',
    ingestedAgo: '18 mins ago'
  },
  {
    id: 'job-tw',
    jobCode: 'TW-GRAD-2025',
    title: 'Junior Software Engineer (Graduate Track)',
    companyName: 'ThoughtWorks Technologies',
    location: 'Hyderabad (Hitec City Campus)',
    workMode: 'On-site',
    workingDays: '5 Days / Week',
    salaryText: '₹8.5 LPA',
    salaryMinLpa: 8.5,
    batchAllowed: 'B.Tech/MCA 2024',
    roleCategory: 'Graduate Engineering Track',
    experienceRequired: '0 Yrs Exp',
    jobType: 'FULL_TIME',
    interviewMode: 'WALK_IN',
    tags: ['Java', 'Data Structures', 'Clean Code', 'OOP'],
    isWalkin: true,
    walkinDetails: {
      venue: 'Ascendas IT Park, 4th Flr. Hitec City, Hyderabad',
      date: 'March 15',
      time: '09:00 AM',
      instructions: 'Carry 2 hardcopy resumes & Gov ID. Ascendas IT Park, 4th Flr. Hitec City'
    },
    jobMatchScore: 92,
    resumeMatchScore: 89,
    matchBadgeText: '92% Match',
    sourceBadge: 'Verified via Thoughtworks Portal',
    sourceUrl: 'https://thoughtworks.com/careers',
    ingestedAgo: '42 mins ago'
  },
  {
    id: 'job-postman',
    jobCode: 'PM-FE-2025',
    title: 'Associate Frontend Developer',
    companyName: 'Postman',
    location: 'Bengaluru (Hybrid: Indiranagar)',
    workMode: 'Hybrid',
    workingDays: '5 Days / Week',
    salaryText: '₹7.2 LPA',
    salaryMinLpa: 7.2,
    batchAllowed: '2024 & 2025 Grads',
    roleCategory: 'Frontend Developer Platform',
    experienceRequired: '0 Yrs Exp',
    jobType: 'FULL_TIME',
    interviewMode: 'VIRTUAL',
    tags: ['React 18', 'TypeScript', 'Tailwind', 'Web Performance'],
    isWalkin: false,
    jobMatchScore: 86,
    resumeMatchScore: 84,
    matchBadgeText: '86% Match',
    sourceBadge: 'DIRECT ATS OPENING • Greenhouse • 1h ago',
    sourceUrl: 'https://postman.com/careers',
    ingestedAgo: '1 hour ago'
  },
  {
    id: 'job-lti',
    jobCode: 'LTI-QA-2025',
    title: 'Associate QA Automation Engineer',
    companyName: 'LTIMindtree',
    location: 'Hyderabad',
    workMode: 'On-site',
    workingDays: '5 Days / Week',
    salaryText: '₹4.5 LPA',
    salaryMinLpa: 4.5,
    batchAllowed: '2024 Batch Only',
    roleCategory: 'QA & Test Automation',
    experienceRequired: '0 Yrs Exp',
    jobType: 'FULL_TIME',
    interviewMode: 'WALK_IN',
    tags: ['Selenium', 'Java & OOP', 'TestNG', 'Postman', 'SQL'],
    isWalkin: true,
    walkinDetails: {
      venue: 'Mindspace SEZ, Madhapur, Hyderabad',
      date: 'Mar 18',
      time: '10:00 AM IST',
      instructions: 'Direct Entry • Hall Pass Not Required'
    },
    jobMatchScore: 88,
    resumeMatchScore: 88,
    matchBadgeText: '88% Resume Match',
    sourceBadge: '• WALK-IN DRIVE • Physical Drive: Mar 18',
    sourceUrl: 'https://ltimindtree.com/careers',
    ingestedAgo: '2 hours ago'
  },
  {
    id: 'job-swiggy',
    jobCode: 'SWIGGY-INT-2025',
    title: 'Frontend Engineering Intern',
    companyName: 'Swiggy',
    location: 'Remote (India)',
    workMode: 'Remote (India)',
    workingDays: '6 Months Full-Time',
    salaryText: '₹35,000 /mo',
    salaryMinLpa: 4.2,
    ppoDetails: '₹11.0L PPO CTC',
    batchAllowed: '2024 / 2025 Grads',
    roleCategory: 'Frontend Consumer Platform',
    experienceRequired: '0 Yrs (Intern)',
    jobType: 'INTERNSHIP',
    interviewMode: 'VIRTUAL',
    tags: ['React 18', 'Next.js', 'Tailwind CSS', 'Redux Toolkit'],
    isWalkin: false,
    jobMatchScore: 82,
    resumeMatchScore: 82,
    matchBadgeText: '82% Match',
    sourceBadge: '• Greenhouse Direct • Closes in 4 days',
    sourceUrl: 'https://swiggy.com/careers',
    ingestedAgo: '3 hours ago'
  },
  {
    id: 'job-persistent',
    jobCode: 'PS-CLOUD-2025',
    title: 'Junior Cloud & DevOps Trainee',
    companyName: 'Persistent Systems',
    location: 'Pune / Remote Initial',
    workMode: 'Remote Initial',
    workingDays: '5 Days / Week',
    salaryText: '₹4.8 LPA',
    salaryMinLpa: 4.8,
    batchAllowed: '2024 Batch',
    roleCategory: 'Cloud & Infrastructure Services',
    experienceRequired: '0 Yrs Exp',
    jobType: 'FULL_TIME',
    interviewMode: 'VIRTUAL',
    tags: ['Linux', 'AWS Fundamentals', 'Bash', 'Git CI'],
    isWalkin: false,
    jobMatchScore: 78,
    resumeMatchScore: 78,
    matchBadgeText: '78% Match',
    sourceBadge: 'VERIFIED CAMPUS CADRE • Closes March 20, 2025',
    sourceUrl: 'https://persistent.com/careers',
    ingestedAgo: '4 hours ago'
  },
  {
    id: 'job-indirech',
    jobCode: 'IND-PY-2025',
    title: 'Junior Python / Django Developer',
    companyName: 'IndirechLabs',
    location: 'Pune (Viman Nagar)',
    workMode: 'On-site',
    workingDays: '5 Days / Week',
    salaryText: '₹3.6 - 4.2 LPA',
    salaryMinLpa: 3.6,
    batchAllowed: '2024 Grads',
    roleCategory: 'Python Backend Platform',
    experienceRequired: '0 Yrs Exp',
    jobType: 'FULL_TIME',
    interviewMode: 'HYBRID',
    tags: ['Python 3.11', 'Django REST', 'PostgreSQL', 'Git'],
    isWalkin: false,
    jobMatchScore: 76,
    resumeMatchScore: 76,
    matchBadgeText: '76% Match',
    sourceBadge: 'Aggregator Listing • Free Application',
    sourceUrl: '#',
    ingestedAgo: '5 hours ago'
  }
];
