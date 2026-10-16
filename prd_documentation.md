# Phase 2: Product Requirements Document (PRD)
## Project: IT Career Partner

---

### Document Control & Metadata
* **Document Title:** Product Requirements Document (PRD) — IT Career Partner
* **Project Codename:** IT Career Partner (Personal Career Discovery & Application Companion)
* **Version:** 1.0.0 (Finalized Phase 2 Baseline)
* **Target Audience:** Product Management, System Architects, Backend Engineers, Frontend Engineers, QA Engineers
* **Status:** Approved / Ready for Architecture & System Design (Phase 3)

---

## 1. Product Overview & Strategic Vision

### 1.1 Product Vision
**IT Career Partner** is a high-precision, AI-powered personal career intelligence engine. Unlike indiscriminate public job search engines that aggregate millions of unverified, obsolete, or predatory listings, IT Career Partner operates with an uncompromising mandate: **Quality Over Quantity**.

The application serves as a candidate's personal hiring partner by:
1. Actively discovering entry-level Information Technology (IT) opportunities across India in real time.
2. Enforcing non-negotiable compensation baselines (CTC `> ₹2.4 LPA` for full-time jobs, duration/mode-based stipends for internships).
3. Verifying the legitimacy and active status of listings, flagging dead or fraudulent leads.
4. Distinguishing physical walk-in drives from standard online applications.
5. Performing deep asynchronous AI resume evaluations without fabricating candidate history.
6. Delivering immediate, multi-channel notifications the moment a qualifying role is verified.

---

## 2. Target User Persona & User Stories

### 2.1 Primary Persona
* **Name:** The Entry-Level IT Engineer
* **Experience:** 0 Years (Fresher / Recent Graduate / Batch of 2024–2026).
* **Location:** Residing in India; prioritizing major technology corridors (Hyderabad, Bengaluru, Pune, Chennai, Mumbai, NCR) alongside remote opportunities.
* **Core Pain Points:** Scams demanding training fees, ghost jobs that expired weeks ago, undisclosed salaries, call-center roles mislabeled as IT, and submitting resumes into ATS systems without feedback.
* **Primary Need:** High signal-to-noise ratio, verified direct application links, transparent compensation, and guidance on aligning their real skills with job descriptions.

### 2.2 Epic & Core User Stories

| ID | User Story | Priority |
|:---|:---|:---:|
| **US-01** | *As an IT fresher*, I want the system to filter out any non-IT or customer-support roles automatically, so that I never waste time reviewing irrelevant positions. | **P0 (Must Have)** |
| **US-02** | *As an IT fresher*, I want the platform to reject any full-time job offering ₹2.4 LPA or less, so that I only apply to roles meeting my baseline standard of living. | **P0 (Must Have)** |
| **US-03** | *As an applicant*, I want unpaid internships or undisclosed stipends rejected immediately, and paid internships filtered by duration and work mode, so that I am never financially exploited. | **P0 (Must Have)** |
| **US-04** | *As a job seeker*, I want clear alerts for physical walk-in drives with exact venue and document requirements, so that I can prepare for in-person recruitment events. | **P0 (Must Have)** |
| **US-05** | *As a candidate*, I want to upload a single master PDF resume and have it analyzed asynchronously in the background, so that I can see explainable match scores without UI lag. | **P0 (Must Have)** |
| **US-06** | *As a candidate*, I want AI suggestions to optimize my resume for a specific job without the AI ever fabricating skills or experience I don't possess. | **P0 (Must Have)** |
| **US-07** | *As a user*, I want to monitor a specific target company until required opening details are gathered, with monitoring automatically halting once completed. | **P1 (High)** |
| **US-08** | *As a user*, I want immediate notifications (in-app, push, email, SMS) when a high-match verified opportunity appears. | **P0 (Must Have)** |
| **US-09** | *As a user*, I want to track jobs I have applied for with an "Already Applied" tag and direct links to the official application portal. | **P0 (Must Have)** |

---

## 3. Scope & Boundary Conditions

### 3.1 In-Scope Job Categories (Strictly Technical IT)
The system strictly accepts roles under the following domains:
* Software Engineering & Application Development (Java, Python, C++, C#, .NET, Go, Rust)
* Web Development (Frontend, Backend, Full Stack: React, Angular, Vue, Node.js, Django, Spring Boot)
* Mobile Application Development (Android Kotlin/Java, iOS Swift, Flutter, React Native)
* Software Quality Assurance & SDET (Manual Testing, Automation: Selenium, Cypress, Playwright)
* Cloud & DevOps Engineering (AWS, Azure, GCP, Docker, Kubernetes, CI/CD)
* Data Science, Analytics & Database Engineering (Data Analyst, SQL Developer, Python, BI)
* Artificial Intelligence & Machine Learning (AI Engineer, ML Practitioner, NLP, LLM Engineering)
* Cybersecurity & Technical Systems Administration (SOC Analyst, Network Security, IT Infrastructure)

### 3.2 Out-of-Scope Roles (Automated Rejection)
Even if posted by major IT multinationals (e.g., TCS, Infosys, Wipro, Cognizant, Accenture), the following roles are strictly rejected:
* Customer Support / Helpdesk / Technical Support Voice Process
* Business Process Outsourcing (BPO) / Knowledge Process Outsourcing (KPO)
* Call Center / Inbound & Outbound Telecalling / Tele-sales
* Business Development Executive (BDE) / Inside Sales / Field Marketing
* Non-technical operations, administrative data entry, and clerical support

### 3.3 Geographic Boundaries
* Primary Focus: **India Only**.
* Locations: Tier-1 hubs (Bengaluru, Hyderabad, Pune, Chennai, Mumbai, Delhi-NCR) and emerging centers (Visakhapatnam, Kochi, Coimbatore, Ahmedabad, Kolkata).
* Remote: Accepted if legal and operational employment is based within India.

---

## 4. Hard Business Rules & Eligibility Gates

The application enforces a sequence of **Non-Negotiable Eligibility Gates**. Any listing failing a hard rule is instantly disqualified.

```
                      ┌─────────────────────────────────────────┐
                      │          INCOMING JOB CANDIDATE         │
                      └─────────────────────────────────────────┘
                                           │
                                           ▼
                      ┌─────────────────────────────────────────┐
                      │ GATE 1: Technical IT Domain Check       │
                      │ Is it engineering/tech, not BPO/Sales?  │
                      └─────────────────────────────────────────┘
                                  │ YES            │ NO ──► [ REJECT ]
                                  ▼
                      ┌─────────────────────────────────────────┐
                      │ GATE 2: Fresher Experience Check        │
                      │ Is 0 yrs / 0-1 / 0-2 yrs accepted?      │
                      └─────────────────────────────────────────┘
                                  │ YES            │ NO ──► [ REJECT ]
                                  ▼
                      ┌─────────────────────────────────────────┐
                      │ GATE 3: Compensation Rule Check         │
                      │ Full-Time: CTC > ₹2.4 LPA (strictly)    │
                      │ Internship: Paid; passes duration matrix│
                      └─────────────────────────────────────────┘
                                  │ YES            │ NO ──► [ REJECT ]
                                  ▼
                      ┌─────────────────────────────────────────┐
                      │ GATE 4: Scam & Active Verification      │
                      │ Genuine domain? No fee? Active URL?     │
                      └─────────────────────────────────────────┘
                                  │ PASS
                                  ▼
                      ┌─────────────────────────────────────────┐
                      │ APPROVED: Ingest, Score & Notify        │
                      └─────────────────────────────────────────┘
```

### 4.1 Gate 1: Experience Rule
* Postings must explicitly accommodate candidates with **0 years of experience**.
* Qualified: Stated as `0 Years`, `Freshers Eligible`, `2024/2025/2026 Batch`, `0–1 Years`, or `0–2 Years` where freshers are not disqualified.
* Disqualified: Postings requiring minimum 1+ or 2+ years of prior full-time industrial experience.

### 4.2 Gate 2: Full-Time Salary CTC Rule
* Non-negotiable formula: **`Annual CTC > ₹2,40,000 INR`** (Strictly greater than ₹2.4 LPA).
* A salary of exactly ₹2.40 LPA is **rejected**.
* Postings with undisclosed salary ("Best in Industry", "Competitive") fail automated verification and cannot be recommended as verified full-time listings without manual validation.

### 4.3 Gate 3: Paid Internship Stipend Matrix
* Unpaid internships are categorically **rejected**.
* Undisclosed internship stipends are **rejected**.
* Duration-based eligibility rules:

| Internship Duration | Work Mode | Minimum Permissible Stipend | Action if Below Minimum |
|:---|:---|:---:|:---|
| **≤ 2 Months** | Work from Home (WFH) | **₹5,000 / month** | Instant Auto-Reject |
| **≤ 2 Months** | Work from Office (WFO) | **₹10,000 / month** | Instant Auto-Reject |
| **≤ 2 Months** | Hybrid | **₹10,000 / month** | Instant Auto-Reject |
| **> 2 Months** | Any Mode (WFH/WFO/Hybrid) | **₹8,000 / month** | Instant Auto-Reject |

* *Rule for Long-Term Internships (> 2 Months):* Baseline starts at ₹8,000/month. There is **no artificial upper ceiling**. Higher stipends (₹15k, ₹25k, ₹50k+) are welcomed and categorized into quality tiers:
  * `₹8k – ₹14.9k`: Meets Minimum
  * `₹15k – ₹24.9k`: Good
  * `₹25k – ₹39.9k`: Very Good
  * `₹40k+`: Excellent / Premium

---

## 5. Epistemic Transparency: The "No Guessing" Rule

The platform mandates strict epistemic labeling across all presentation and storage layers:
1. **KNOWN:** Data explicitly provided by the authoritative source (e.g., `Salary: ₹4.8 LPA`, `Working Days: 5 Days (Mon-Fri)`).
2. **ESTIMATED:** Data calculated via algorithmic or market estimation; must be explicitly badged with an `[ESTIMATED]` tag (e.g., `Estimated CTC: ₹3.5 - ₹5.0 LPA`).
3. **UNKNOWN:** Missing, unstated, or unconfirmed attributes. Under no circumstance may the system fill gaps with assumptions. Must render explicitly as `"Not specified"`.

---

## 6. Detailed Functional Requirements (FR)

### FR-01: User Profile & Preference Engine
* **FR-01.1:** System shall store candidate target domains, preferred cities (primary: Hyderabad, Bengaluru), remote preference, target minimum salary, and preferred interview modes.
* **FR-01.2:** System shall allow users to toggle preferred interview modes (Online Virtual vs. Physical Walk-in).

### FR-02: Permitted Job Source Ingestion Pipeline
* **FR-02.1:** System shall ingest job postings from Level 1 (official company ATS pages: Workday, Greenhouse, Lever, etc.), Level 2 (authorized job feeds and APIs), and Level 3 (compliant aggregator ingestion).
* **FR-02.2:** System shall capture raw discovery metadata: `source_url`, `source_type`, `discovered_at`, and raw job payload.

### FR-03: Multi-Stage Job Verification & Active Status Sentinel
* **FR-03.1:** System shall verify the active status of every ingested job URL before presenting it to the user.
* **FR-03.2:** System shall detect expired listings by checking HTTP response codes (404, 410) and scanning page content for closure phrases (e.g., "This job is no longer accepting applications").
* **FR-03.3:** System shall log `last_verified_at` timestamps for every job record.

### FR-04: Safety, Anti-Scam & Fraud Elimination Engine
* **FR-04.1:** System shall parse job descriptions for fraud keywords: "registration fee", "security deposit", "laptop charges", "training fee required for offer letter".
* **FR-04.2:** Postings with confirmed scam markers shall be immediately blacklisted and assigned status `FRAUD_REJECTED`.

### FR-05: Canonical De-duplication Engine
* **FR-05.1:** System shall compute canonical entity hashes combining `normalized_company_name`, `normalized_job_title`, and `job_location`.
* **FR-05.2:** Duplicate listings found across multiple boards shall be collapsed into a single canonical job profile, preserving all verified source links.

### FR-06: Walk-in Drive Radar
* **FR-06.1:** System shall automatically detect physical walk-in interview notices.
* **FR-06.2:** Walk-in records must extract and prominently display:
  * Drive Date(s) and Reporting Time Windows
  * Physical Venue Address & Landmark
  * Mandatory Documents Required (Government Photo ID, Marksheets, Physical CV Copies)
  * Walk-in Batch Cutoffs & Eligibility
* **FR-06.3:** Walk-in listings shall render with a distinctive `🔴 WALK-IN DRIVE` badge.

### FR-07: Search, Multimodal Filtering & Ranking Engine
* **FR-07.1:** Full-text search across job titles, company names, skills, and locations.
* **FR-07.2:** Granular filtering across Experience (0 yrs, 0–1 yr), Salary Range, Work Mode (Remote, Hybrid, Onsite), Interview Mode (Online, Offline, Walk-in), and Tech Category.
* **FR-07.3:** Ranking Algorithm shall weigh:
  * Confirmed Online/Virtual Interview Mode (higher priority per user preference).
  * Compensation quality relative to the ₹2.4 LPA baseline.
  * Direct location match with user preferences (Hyderabad / Bengaluru).
  * Resume semantic match score.

### FR-08: Company Explorer & Goal-Based Target Monitoring
* **FR-08.1:** Searchable directory of companies (startups through tier-1 MNCs) showing active fresher openings, typical package ranges, and office locations.
* **FR-08.2:** Goal-Based Company Monitoring: The user can trigger a monitoring goal (e.g., *"Monitor Zoho for Fresher QA roles"*).
* **FR-08.3:** Persistent background tasks shall monitor the company until the requested information is captured and delivered, at which point the task **automatically terminates**.

### FR-09: Single Master Resume Storage & Asynchronous Deep Parsing
* **FR-09.1:** System shall support uploading a single master PDF resume (`max_file_size: 10MB`).
* **FR-09.2:** Uploading a new PDF replaces the previous master resume and immediately triggers an asynchronous re-parsing task.
* **FR-09.3:** Parser deconstructs resume into a structured JSON schema: contact info, education, technical skills, programming languages, frameworks, databases, projects, internships, certifications, and verifiable achievements.

### FR-10: Dual-Scoring Match Engine
* **FR-10.1: Job Match Score (0–100%):** Evaluates whether the job opportunity suits the candidate's declared profile, salary criteria, location, and preferred work/interview modes.
* **FR-10.2: Resume Match Score (0–100%):** Evaluates how thoroughly the candidate's current master resume proves their qualification for the job description.

### FR-11: Explainable Match Breakdown & Skill Gap Analysis
* **FR-11.1:** System shall not display a match percentage without an explainable breakdown.
* **FR-11.2:** Breakdown must itemize:
  * **Strong Matches:** Green tags showing verified skill overlaps.
  * **Missing Prerequisites:** Red tags showing mandatory job requirements absent from the resume.
  * **Weak Evidence:** Amber warnings indicating skills listed in the resume skills header but never referenced in projects or experience.
  * **Actionable Advice:** Concrete, ethical tips to demonstrate existing knowledge.

### FR-12: Dedicated Resume-Matched Jobs Dashboard
* **FR-12.1:** A dedicated interface displaying jobs sorted strictly by semantic alignment with the uploaded resume.
* **FR-12.2:** Includes quick-filter toggles: `High Match (> 80%)`, `Missing < 2 Skills`, `Direct Keyword Match`.

### FR-13: Ethical Job-Specific Resume Tailoring (Zero-Hallucination Policy)
* **FR-13.1:** When requested for a specific job, the AI provides recommendations to restructure, rephrase, and highlight genuine competencies.
* **FR-13.2 (Hard Constraint):** The AI engine is strictly prohibited from fabricating skills, inventing past employers, generating fake GitHub projects, or creating unverified certifications.

### FR-14: Application Lifecycle Tracking & Official Redirection
* **FR-14.1:** Clicking **`APPLY`** redirects the user directly to the original verified source URL.
* **FR-14.2:** System tracks the application status: `Not Applied`, `Applied`, `Interviewing`, `Archived`.
* **FR-14.3:** Applied jobs display an **`[ALREADY APPLIED]`** badge to prevent duplicate submissions.

### FR-15: Real-Time Multi-Channel Notification Dispatcher
* **FR-15.1:** Dispatches immediate alerts upon discovery and verification of:
  * Any new IT fresher job matching the candidate's profile.
  * Any new walk-in drive announced in preferred locations.
  * Goal-based company monitoring targets found.
* **FR-15.2:** Supported channels: In-App Toast/Notification Feed, Web Push Notifications, Email Alerts, and SMS alerts.
* **FR-15.3:** Notification deduplication ensures no user receives duplicate alerts for the same canonical job ID.

### FR-16: Low-Confidence Manual Verification Warning Pipeline
* **FR-16.1:** If an opening satisfies all hard rules (IT role, fresher, CTC `> ₹2.4 LPA`) but automated verification has low confidence, the job is displayed with a high-visibility badge:
  `⚠️ Needs Manual Verification: Automated verification confidence is low. Please inspect original source.`
* **FR-16.2:** The badge must list the specific unverified attributes (e.g., "Active status could not be verified via HTTP probe").

---

## 7. Non-Functional Requirements (NFR)

### NFR-01: Performance & Latency
* **NFR-01.1:** Web application page initial load time under 1.5 seconds on standard broadband.
* **NFR-01.2:** Search and filter execution latency `< 200ms` for indexed job datasets.
* **NFR-01.3:** Resume upload UI response immediate; deep AI analysis offloaded to asynchronous background workers with real-time status updates via WebSockets or polling.

### NFR-02: Security, Privacy & Resume Protection
* **NFR-02.1:** Resumes stored securely with encrypted storage at rest (AES-256) and HTTPS (TLS 1.3) in transit.
* **NFR-02.2:** Resumes remain private by default; resume data is never exposed publicly or shared with third parties without explicit user action.

### NFR-03: System Reliability & Task Queue Resiliency
* **NFR-03.1:** Background discovery and verification jobs managed via an idempotent task queue. Failed tasks retry with exponential backoff.
* **NFR-03.2:** System uptime target: 99.5% for core web services.

### NFR-04: Source Compliance & Ethical Rate Limiting
* **NFR-04.1:** Discovery crawlers and HTTP probes must respect source `robots.txt`, implement polite request delays, and never disrupt target servers.

### NFR-05: Maintainability & Architectural Modularity
* **NFR-05.1:** Engineered as a **Modular Monolith** for Phase 1/MVP, ensuring rapid local development while maintaining clean module boundaries (Auth, Ingestion, Verification, Matching, Notifications).

---

## 8. Data Architecture & Entity Schemas

```
┌─────────────────┐       1:N       ┌────────────────────────┐
│   User Profile  │────────────────►│   Application Record   │
└─────────────────┘                 └────────────────────────┘
         │                                       │
         │ 1:1                                   │ N:1
         ▼                                       ▼
┌─────────────────┐                 ┌────────────────────────┐
│  Resume Profile │                 │       Job Posting      │
└─────────────────┘                 └────────────────────────┘
                                                 │
                                                 │ N:1
                                                 ▼
                                    ┌────────────────────────┐
                                    │     Company Profile    │
                                    └────────────────────────┘
```

### 8.1 Key Entity Definitions
* **`User`:** `user_id`, `email`, `phone`, `password_hash`, `preferences` (locations, target_roles, min_salary, interview_mode_pref), `created_at`.
* **`JobPosting`:** `job_id`, `canonical_hash`, `title`, `company_name`, `company_id`, `category` (IT_DEV, IT_QA, IT_DEVOPS, etc.), `employment_type` (FULL_TIME, INTERNSHIP), `experience_min` (0), `experience_max`, `salary_type` (KNOWN, ESTIMATED, UNKNOWN), `ctc_annual_inr`, `internship_duration_months`, `internship_stipend_monthly`, `work_mode` (WFH, WFO, HYBRID), `interview_mode` (ONLINE, OFFLINE, WALKIN, UNKNOWN), `is_walkin` (boolean), `walkin_details` (date, time, venue, documents), `source_url`, `source_type`, `verification_status` (VERIFIED, LOW_CONFIDENCE, EXPIRED, FRAUD_REJECTED), `discovered_at`, `last_verified_at`.
* **`ResumeProfile`:** `resume_id`, `user_id`, `file_path`, `raw_text`, `parsed_data` (skills[], programming_languages[], frameworks[], databases[], projects[], education[], certifications[]), `embedding_vector`, `uploaded_at`.
* **`JobApplication`:** `application_id`, `user_id`, `job_id`, `status` (NOT_APPLIED, APPLIED, INTERVIEWING, REJECTED, ARCHIVED), `applied_at`, `notes`.
* **`NotificationRecord`:** `notification_id`, `user_id`, `job_id`, `channel` (IN_APP, EMAIL, SMS, PUSH), `message`, `is_read`, `dispatched_at`.

---

## 9. End-to-End User & System Workflows

### 9.1 End-to-End User Experience Flow
```
User registers & sets preferences (IT, Fresher, Hyderabad/Bengaluru, Online Interview)
                                  │
                                  ▼
                     Uploads Master PDF Resume
                                  │
                                  ▼
      [System processes resume in background via AI parser]
                                  │
                                  ▼
       System discovers and verifies real-time IT job openings
                                  │
                                  ▼
    Filters: CTC > ₹2.4 LPA | Paid Internship Rules | Scam Detection
                                  │
                                  ▼
    User receives immediate alert on matching verified opening
                                  │
                                  ▼
    User opens Job Card ➔ Inspects KNOWN details & Walk-in badge
                                  │
                                  ▼
    User reviews Dual Match Scores & Explainable Breakdown
                                  │
                                  ▼
    User reads AI Resume Tailoring advice (ethical alignment)
                                  │
                                  ▼
    Clicks "APPLY" ➔ Redirects to Official Career Page
                                  │
                                  ▼
    Card toggles to [ALREADY APPLIED] ➔ Stored in user history
```

---

## 10. MVP Scope Matrix vs. Future Roadmap

| Feature Component | MVP (Phase 1/2 Scope) | V2 Scope | V3 Scope |
|:---|:---:|:---:|:---:|
| **Client Platform** | Responsive Web Application | Native Mobile Apps (iOS/Android) | Mobile & Desktop Apps |
| **User Tenancy** | Single User / Private Mode | Multi-User Authentication | Public SaaS Multi-Tenancy |
| **Job Filtering** | Hard Rules: IT only, Fresher, > ₹2.4 LPA, Paid Internship | Enhanced Machine Learning Filters | Global Remote Filters |
| **Walk-in Radar** | Dedicated Badge & Logistical Detail View | GPS/Map Directions to Venue | Walk-in Community Check-in |
| **Resume Handling** | 1 Active PDF, Background AI Parsing | Multiple Version Resumes | Integrated Interactive Resume Builder |
| **Match Engine** | Dual Score (Job Match vs Resume Match) + Gap Breakdown | Automated Cover Letter Generator | Mock Interview Simulator |
| **Company Monitoring** | Goal-based targeted monitoring with auto-stop | Multi-company persistent tracking | Real-time Employee Referral Finder |
| **Alerting** | In-App, Web Push, Email, SMS | WhatsApp Integration | Telegram & Slack Integrations |
| **Admin Dashboard** | Basic health logs & DB queries | Basic Source Admin | Full Enterprise Admin Portal |

---

## 11. Acceptance Criteria & Test Scenarios

### AC-01: Full-Time Salary Validation
* **Given** a full-time job posting with an annual CTC of ₹2,40,000 (₹2.40 LPA),
* **When** evaluated by the eligibility engine,
* **Then** the job must be **REJECTED** because CTC must be *strictly greater than* ₹2.4 LPA.
* **Given** a full-time job with CTC ₹2,41,000,
* **Then** the job must **PASS** Gate 2.

### AC-02: Paid Internship Validation
* **Given** an internship with duration = 1.5 months (≤ 2 months) and work mode = "Work from Home",
* **When** stipend is ₹5,000/month,
* **Then** it must **PASS**.
* **When** stipend is ₹4,500/month,
* **Then** it must be **REJECTED**.
* **Given** an internship with duration = 3 months (> 2 months),
* **When** stipend is ₹7,500/month,
* **Then** it must be **REJECTED** (minimum baseline is ₹8,000/month).
* **When** stipend is ₹30,000/month,
* **Then** it must **PASS** and receive the *"Very Good"* stipend quality badge.

### AC-03: Zero-Hallucination AI Integrity
* **Given** a candidate resume lacking "Docker" and "Kubernetes",
* **When** the AI generates resume improvement suggestions for a DevOps job,
* **Then** the AI must highlight "Docker" as a missing prerequisite and explain how to highlight existing relevant coursework, and must **never** output: *"Add 1 year of Docker experience to your resume."*

### AC-04: Epistemic Data Tagging
* **Given** a job posting where working days are omitted from the source description,
* **When** rendered in the UI,
* **Then** the working days field must display: `"Working Days: Not specified"`.

---

## 12. PRD Sign-Off & Next Steps

* **Product Requirements Document Status:** Complete, verified, and locked.
* **Next SDLC Phase:** **Phase 3 — System Design & Architecture Documentation** (Modular Monolith architecture, ingestion pipeline queues, database schema definitions, and AI processing pipelines).
