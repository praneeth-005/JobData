# Phase 1: Feature & Ideation Documentation
## Project: IT Career Partner (Personal Career Discovery & Application Companion)

---

### Executive Summary

**IT Career Partner** is an intelligent, high-precision personal career assistant designed to solve the chronic inefficiency, noise, and deception found across modern Indian job portals. Developed specifically for an Indian Information Technology (IT) fresher (0 years of experience), the platform automates job discovery, strictly enforces non-negotiable compensation and eligibility thresholds, verifies genuine openings, highlights walk-in drives, provides explainable resume matching, and delivers immediate notifications.

This document serves as the **foundational ideation and feature specification** resulting from Phase 1 of the Software Development Life Cycle (SDLC), capturing all problems, philosophies, functional concepts, rule definitions, and future roadmaps.

---

## 1. Problem Statement & Motivation

### 1.1 The Market Reality for IT Freshers
Finding an entry-level IT job in India has become an exhausting, high-friction endeavor:
1. **Platform Fragmentation:** Job seekers must navigate dozens of disparate platforms (LinkedIn, Naukri, Foundit, Indeed, Unstop, Wellfound, company career portals, Telegram/WhatsApp groups).
2. **Information Asymmetry & Scattered Data:** Critical parameters—such as exact CTC breakdown, work mode (Remote/Hybrid/Onsite), working days, and interview modality (online vs. physical walk-in)—are obscured, inconsistent, or omitted.
3. **Ghost Jobs & Expired Listings:** A large fraction of listed openings are either stale, already filled, expired, or reposted automatically by aggregators without an active hiring requirement.
4. **Predatory Compensation & Unpaid Exploitation:** Many listings offer sub-market wages (below survival levels for Tier-1/Tier-2 Indian cities), disguise unpaid internships as "training opportunities," or demand upfront fees/training charges.
5. **Irrelevant Role Baiting:** Job titles frequently mislead applicants; "Technical Support," "Process Associate," "BPO Call Center," or "Lead Generation Executive" roles are routinely mislabeled as Software/IT positions.
6. **Resume Black Hole:** Applicants submit generic resumes to hundreds of companies with zero visibility into ATS compatibility, missing skill requirements, or why their profiles are filtered out.

### 1.2 The Core Motivation
The motivation behind developing **IT Career Partner** is to create a trusted personal ally—a *"helpful friend or dedicated partner"*—that removes the cognitive overload of job hunting, filters out junk with mathematical strictness, and guarantees that every displayed opportunity is genuine, active, adequately compensated, and aligned with the candidate's skills.

---

## 2. Core Product Philosophy & Guiding Principles

The application is governed by eight immutable rules:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CORE PRODUCT PRINCIPLE                          │
│                                                                        │
│   "Find fewer but better opportunities, verify them before showing    │
│    them, and help the user apply with a resume that genuinely matches  │
│    the job."                                                           │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Rule 1 — Absolute Information Integrity ("Never Invent Job Information"):**
   The application must never fabricate, extrapolate, or guess job details. If an attribute cannot be confirmed, it must explicitly state `"Not specified"`.
2. **Rule 2 — Strict Separation of Facts from Estimates:**
   Official data points must never be conflated with algorithmic estimations. A clear distinction between **Known**, **Estimated**, and **Unknown** must be maintained across all UI components.
3. **Rule 3 — Provenance & Source Attribution:**
   Every job listing must retain its full discovery pedigree: original application URL, source portal, discovery timestamp, and last verification timestamp.
4. **Rule 4 — Ethical AI Boundary ("Never Invent Experience"):**
   The AI resume engine must **never** hallucinate skills, falsify projects, invent past roles, or fabricate certifications to inflate ATS match scores. Suggestions are limited strictly to restructuring, clarifying, and highlighting genuine competencies.
5. **Rule 5 — Explainability Over Arbitrary Scores:**
   A numerical match score (e.g., `82%`) is meaningless in isolation. The system must explain *why* a score was given, itemizing exact matched competencies, missing prerequisites, and weak project evidence.
6. **Rule 6 — Quality Over Quantity:**
   The application will never inflate search results by relaxing quality checks. If only three jobs satisfy the criteria on a given day, only three jobs will be displayed.
7. **Rule 7 — India-First Geographic Focus:**
   The initial phase targets opportunities geographically based in India or remote roles legally and operationally accessible to Indian residents.
8. **Rule 8 — Candidate Empowerment & Final Agency:**
   The platform acts as an advisor, not an autonomous agent that submits applications blindly. The user retains complete control over which roles to pursue and what resume adjustments to make.

---

## 3. Target User & Persona

### 3.1 Primary Persona: The Entry-Level IT Aspirant
* **Experience Level:** Strictly fresher (0 years of formal full-time experience).
* **Educational Background:** Engineering, Computer Applications, or Technology degree (B.Tech / B.E. / BCA / MCA / B.Sc CS / IT).
* **Current Objective:** Secure either a high-value entry-level full-time software engineering role or a well-compensated technical internship.
* **Geographic Focus:** Major Indian IT clusters—Hyderabad and Bengaluru as top preferences, alongside Pune, Chennai, Mumbai, Delhi-NCR, Visakhapatnam, and nationwide remote.
* **Work Preference:** Strongly favors online/virtual interview processes to reduce travel expenditure and logistical friction.

### 3.2 Product Lifecycle Context
* **Phase A (Initial Deployment):** Single-user personal career command center tailored directly to the creator's individual parameters and career search.
* **Phase B (Future Evolution):** Multi-user public career platform architecture preserving strict privacy isolation and scalable multi-tenant infrastructure.

---

## 4. Mandatory Eligibility & Boundary Conditions

To eliminate noise, the application enforces non-negotiable hard eligibility filters before any listing can enter the recommendation pipeline:

```
                                  Incoming Job Lead
                                          │
                                          ▼
                            ┌───────────────────────────┐
                            │ Is Role Strictly IT Tech? │─── NO ──► [ REJECT ]
                            └───────────────────────────┘
                                          │ YES
                                          ▼
                            ┌───────────────────────────┐
                            │  Explicitly for Fresher?  │─── NO ──► [ REJECT ]
                            │   (0 yrs / 0-1 / 0-2 yrs) │
                            └───────────────────────────┘
                                          │ YES
                                          ▼
                            ┌───────────────────────────┐
                            │    Employment Category    │
                            └───────────────────────────┘
                                    │           │
                    Full-Time Role  │           │  Internship
                                    ▼           ▼
                      ┌──────────────────┐ ┌──────────────────────────┐
                      │ CTC > ₹2.4 LPA?  │ │ Paid? Undisclosed = NO?  │
                      └──────────────────┘ └──────────────────────────┘
                        │ YES      │ NO      │ YES              │ NO
                        ▼          ▼         ▼                  ▼
                    [ PASS ]   [ REJECT ]  Duration Check   [ REJECT ]
                                             │
                        ┌────────────────────┴────────────────────┐
                        ▼                                         ▼
                 ≤ 2 Months Duration                       > 2 Months Duration
                        │                                         │
             ┌─────────────────────┐                   ┌─────────────────────┐
             │ WFH: ≥ ₹5k/month    │                   │ Minimum: ≥ ₹8k/mo   │
             │ Office: ≥ ₹10k/month│                   │ No artificial cap   │
             │ Hybrid: ≥ ₹10k/month│                   │ (8k, 15k, 25k, 50k+)│
             └─────────────────────┘                   └─────────────────────┘
```

### 4.1 Strict IT Role Inclusions vs. Exclusions
* **In-Scope Technical Roles:**
  * Software Engineering & Programming (Java, Python, C++, C#, Golang, .NET, etc.)
  * Web & Mobile Development (Frontend, Backend, Full Stack, React, Angular, Node.js, Android, iOS, React Native, Flutter)
  * Quality Assurance & Software Testing (Manual QA, Automation Testing, SDET, Selenium, Cypress)
  * Cloud & DevOps Engineering (AWS, Azure, GCP, CI/CD, Docker, Kubernetes)
  * Data Engineering & Analytics (Data Analyst, Business Intelligence, Data Science, Python, SQL)
  * Artificial Intelligence & Machine Learning (AI Engineer, ML Practitioner, NLP, LLM prompt engineering)
  * Cybersecurity & Network Infrastructure (Security Analyst, Network Engineer, SOC Analyst)
  * Database Administration & Development (SQL Developer, DBA, PostgreSQL, MongoDB)
* **Explicitly Excluded Non-Technical Roles (Auto-Reject):**
  * Customer Support / Helpdesk / Client Care
  * Business Process Outsourcing (BPO) / Knowledge Process Outsourcing (KPO)
  * Call Center / Inbound & Outbound Telecalling
  * Inside Sales / Business Development (BDE/BDA)
  * Field Marketing / Non-technical operations
  * *Note:* Even if the hiring entity is an elite IT multinational corporation (e.g., Infosys, TCS, Wipro, Accenture), non-technical support or call center postings are categorically disqualified.

### 4.2 Experience Thresholds
* **Eligible Listings:** Postings that explicitly state `0 Years`, `Freshers Welcome`, `2024 / 2025 / 2026 Batch Graduates`, `0–1 Years`, or `0–2 Years` where 0 years is explicitly accepted.
* **Disqualified Listings:** Postings stating `1+ Years Required`, `2+ Years Required`, `Mid-Senior Level`, or any listing indicating prior full-time industrial tenure as a mandatory barrier.

### 4.3 Full-Time Compensation Barrier
* **Rule:** Annual Cost to Company (CTC) must be **strictly greater than ₹2.4 LPA** (i.e., `CTC > ₹240,000` per annum or `> ₹20,000/month`).
* **Evaluation Matrix:**
  * `₹2.00 LPA` ➔ ❌ Reject
  * `₹2.39 LPA` ➔ ❌ Reject
  * `₹2.40 LPA` ➔ ❌ Reject (Must be *strictly greater than*)
  * `₹2.41 LPA` ➔ ✅ Eligible
  * `₹3.50 LPA` ➔ ✅ Eligible
  * `₹6.00 LPA+` ➔ ✅ Eligible
* **Undisclosed Full-Time Salaries:** Postings that hide compensation or mark it as "Best in Industry" cannot satisfy the strict verification threshold. They are either tagged with a prominent verification warning or routed away from primary recommendations until salary details are verified.

### 4.4 Paid Internship Stipend Matrix
Unpaid internships are treated as predatory and automatically rejected. Paid internships are evaluated according to duration and work mode:

| Internship Duration | Work Mode | Minimum Stipend Required | Decision Rule |
|:---|:---|:---:|:---|
| **≤ 2 Months (Short-term)** | Work From Home (WFH) | **₹5,000 / month** | If `< ₹5k` ➔ Reject; If `≥ ₹5k` ➔ Eligible |
| **≤ 2 Months (Short-term)** | Work From Office (WFO) | **₹10,000 / month** | If `< ₹10k` ➔ Reject; If `≥ ₹10k` ➔ Eligible |
| **≤ 2 Months (Short-term)** | Hybrid | **₹10,000 / month** | If `< ₹10k` ➔ Reject; If `≥ ₹10k` ➔ Eligible |
| **> 2 Months (Long-term)** | Any Work Mode | **₹8,000 / month** | Baseline threshold. **No artificial upper ceiling**. |

#### Stipend Quality Tiers for Long-Term Internships (> 2 Months)
* **₹8,000 / month:** Meets minimum acceptable baseline.
* **₹15,000 / month:** Good compensation.
* **₹25,000 / month:** Very good compensation.
* **₹40,000+ / month:** Premium / Excellent opportunity.

---

## 5. Information Transparency: The "No Guessing" Rule

To establish trust, the platform categorizes every data point into one of three distinct epistemic tiers:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        EPISTEMIC TIERS OF DATA                         │
├───────────────────┬────────────────────────────────────────────────────┤
│ 1. KNOWN          │ Confirmed fact explicitly stated by source.       │
│                   │ Example: "Salary: ₹4.5 LPA"                        │
├───────────────────┼────────────────────────────────────────────────────┤
│ 2. ESTIMATED      │ Derived via statistical analysis; labelled clearly.│
│                   │ Example: "[ESTIMATED] ₹3.5 - ₹5.0 LPA"             │
├───────────────────┼────────────────────────────────────────────────────┤
│ 3. UNKNOWN        │ Unstated or unverified; never guessed or assumed.  │
│                   │ Example: "Interview Mode: Not Specified"           │
└───────────────────┴────────────────────────────────────────────────────┘
```

* Under no circumstances will the system convert an assumption into a confirmed attribute.
* If working days (e.g., 5-day week vs. 6-day week) are omitted from a job posting, it will display as `"Working Days: Not specified"`.

---

## 6. Functional Features Specification

### 6.1 Intelligent Job Discovery & Source Verification Engine
* **Source Stratification:**
  * *Level 1 (Highest Trust):* Direct career pages and Applicant Tracking Systems (Workday, Greenhouse, Lever, BambooHR, Darwinbox).
  * *Level 2:* Authorized APIs, official RSS/XML job feeds, and verified aggregator syndications.
  * *Level 3:* Major job networks (LinkedIn, Naukri, Foundit, Indeed) scraped or ingested via compliant interfaces.
* **Verification Pipeline:**
  1. *Source Legitimacy:* Validates domain reputation, SSL, and official origin.
  2. *Active Status Check:* Probes original URL for HTTP 404, 301/302 redirects to homepage, or "Job No Longer Available" page markers.
  3. *Scam & Safety Filter:* Scans for fraudulent markers (requests for money, training fees, deposit demands, unsecured free email addresses like `hr@gmail.com`).
  4. *De-duplication System:* Normalizes job titles, company names, and locations using canonical hashes to collapse identical multi-board postings into a single unified opportunity card.
* **Low-Confidence Handling:**
  If an opening passes all hard eligibility rules (IT role, fresher, > ₹2.4 LPA) but automated scripts cannot definitively verify active status or company legitimacy, the system **will not delete it**. Instead, it renders the card with a high-visibility warning:
  > `⚠️ Needs Manual Verification: Automated verification confidence is low. Please inspect the original source before applying.`

### 6.2 Walk-in Drive Radar
* Detects physical walk-in interview notices across India.
* Visually distinguishes walk-in events using a distinct **`🔴 WALK-IN DRIVE`** badge.
* Extracts critical logistical metadata:
  * Specific Drive Date(s) and Reporting Time Windows
  * Physical Venue Address & Landmark
  * Mandatory Physical Documentation Required (e.g., Gov ID, Academic Transcripts, Physical Resume Copies, Passport Photos)
  * Walk-in Eligibility & Batch Cutoffs (e.g., "2024/2025 graduates with min 60% aggregate")

### 6.3 Company Explorer & Goal-Based Company Monitoring
* **Company Profiles:** Search any company (from early-stage Indian startups to tier-1 MNCs like TCS, Infosys, Google, Microsoft, Accenture). Displays active fresher opportunities, typical package ranges, workplace policies, and interview procedures.
* **Targeted Company Monitoring:**
  * The user can submit a monitoring request: e.g., *"Monitor Zoho for Fresher QA Roles."*
  * The application schedules persistent background polling targeting that specific employer.
  * **Automatic Completion Criteria:** The monitoring engine actively tracks the employer until the requested data or job opening is discovered, delivers the alert to the user, and **automatically halts polling** to conserve compute and avoid redundant requests.

### 6.4 Single-Resume Storage & Asynchronous AI Deep Analysis
* **Single Master Document Model:** The user maintains a single, active, master PDF resume.
* **Deep Background Processing:** To ensure a responsive user experience, AI parsing and deep NLP semantic analysis run asynchronously in the background. The user is never blocked by a slow spinner.
* **Automatic Re-Analysis on Update:** Uploading a revised PDF resume immediately invalidates stale match vectors and launches fresh background evaluations across all indexed jobs.
* **Data Extraction Scope:** Deconstructs the PDF into structured JSON (Contact details, Degree/College, Technical Skill taxonomies, Programming Languages, Frameworks, Personal/Academic Projects, Internships, Certifications, and Verifiable Accomplishments).

### 6.5 Dual-Scoring Paradigm: Job Match vs. Resume Match
The platform strictly dissociates two distinct evaluation concepts:

```
┌────────────────────────────────────────────────────────────────────────┐
│                      TWO DISTINCT EVALUATION SCORES                    │
├───────────────────────────────────┬────────────────────────────────────┤
│ 1. JOB MATCH SCORE                │ 2. RESUME MATCH SCORE              │
│ "Is this job suitable for you?"   │ "Does your resume prove it?"       │
├───────────────────────────────────┼────────────────────────────────────┤
│ Evaluates holistic fit:           │ Evaluates document alignment:      │
│ • Technical domain & skills       │ • Keyword presence in text         │
│ • Preferred locations (HYD/BLR)   │ • Project evidence & demonstrations│
│ • Salary satisfaction (> ₹2.4LPA) │ • ATS formatting & parser score    │
│ • Preferred interview mode        │ • Missing qualifications in CV     │
│ • Work mode preference            │ • Action-verb impact & clarity     │
└───────────────────────────────────┴────────────────────────────────────┘
```

### 6.6 Dedicated Resume-Matched Jobs Interface
* Provides a dedicated, distraction-free view that sorts opportunities strictly by semantic alignment with the candidate's uploaded resume.
* Each card includes an **Explainable Match Breakdown**:
  * **Strong Matches:** Green tags displaying confirmed skill overlaps (e.g., `Java`, `Spring Boot`, `PostgreSQL`).
  * **Missing Prerequisites:** Red tags showing mandatory job requirements absent from the resume (e.g., `Docker`, `Kafka`).
  * **Weak Evidence:** Amber warnings indicating skills declared in the resume's skills list but completely absent from project bullet points.
  * **Actionable Recommendations:** Ethical suggestions on how to demonstrate existing competencies without fabricating experience.

### 6.7 Ethical Job-Specific Resume Tailoring (No Hallucinations)
* For any target job posting, the user can request optimization advice.
* The AI compares the specific Job Description (JD) with the candidate's master resume and suggests:
  * Re-ordering technical skills to mirror JD priority.
  * Rephrasing existing project descriptions using industry-standard action verbs.
  * Highlighting course modules or academic projects that satisfy JD prerequisites.
  * *Strict Prohibition:* The AI will never generate fake past companies, counterfeit GitHub projects, or false skill declarations.

### 6.8 Application Lifecycle Tracking & Redirection
* **Official Apply Redirection:** The application acts as a discovery and preparation engine, not an intermediary applicant tracking proxy. Clicking **`APPLY`** redirects the candidate directly to the official company careers page or primary job board.
* **"Already Applied" State Tracking:**
  * When an application link is visited, the user can toggle an `"Applied"` state (or the system marks it as initiated).
  * The job card permanently displays an **`[ALREADY APPLIED]`** tag.
  * Applied jobs are archived in the user's history and excluded from fresh alert feeds to prevent duplicate submissions.

### 6.9 Multi-Channel Real-Time Alerting System
* Configurable alert triggers:
  * Newly discovered fresher IT job meeting all salary/location rules.
  * Newly announced physical walk-in drive in preferred cities.
  * High-priority company monitoring target found.
  * Job with a Resume Match Score `≥ 85%` identified.
* **Dispatch Channels:** Instant In-App Notifications, Web Push Alerts, Email Dispatches, and SMS Notifications.
* **De-duplication Protection:** Strict rate-limiting and notification deduplication hashes ensure the candidate is never pinged twice for the same opening.

---

## 7. Phased Product Roadmap

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SDLC PHASED DELIVERABLES                        │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 1: Feature & Ideation (Completed & Documented)                   │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 2: Product Requirements Document (PRD) (Finalized)               │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 3: System Design & Architecture (Monolith, Queue, Data Schemas)  │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 4: Database Design & Indexing (MongoDB Schemas, Text Indexes)   │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 5: Implementation (MVP: Web-first, Single Resume, Alerts)        │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 6: Testing, Quality Assurance, & Verification Hardening          │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 7: Deployment & Private Local Operation                          │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 8: V2 & V3 Expansions (Mobile App, Resume Builder, Multi-User)   │
└────────────────────────────────────────────────────────────────────────┘
```

### 7.1 MVP (Minimum Viable Product — Phase 1 Target)
* Responsive Web Application interface.
* Single-user authentication and personalized preference profiles.
* Automated ingestion from Level 1 and Level 2 IT job sources in India.
* Hard rule validation: Freshers only, IT category only, full-time CTC `> ₹2.4 LPA`, paid internships (≤2mo: ₹5k WFH / ₹10k WFO; >2mo: min ₹8k).
* Search and filtering by Role, Company, Location, Work Mode, Interview Mode.
* Walk-in Drive detection with highlighted logistical badges.
* Single PDF resume upload with asynchronous background parsing.
* Dual Match scoring with explainable breakdown.
* Application state tracking ("Applied" state).
* Instant In-App, Email, and Push alerts.

### 7.2 Version 2 (V2 Enhancements)
* Native Mobile Application (Android / iOS) utilizing shared backend REST APIs.
* Interactive in-app Resume Builder with ATS-compliant downloadable PDF templates.
* Deep interview preparation question generator based on analyzed JDs.
* Enhanced multi-channel alerting (WhatsApp / SMS integrations).

### 7.3 Version 3 (V3 Enterprise / Public Release)
* Multi-tenant user registration, authentication, and secure profile isolation.
* Full Administrative Dashboard for reviewing job source health and reporting dead links.
* Geographic expansion beyond India (Remote Worldwide, APAC, EMEA).

---

## 8. Ideation Phase Sign-Off & Status

* [x] Core problem validated and refined.
* [x] Target user defined (Indian IT Fresher, 0 Years Experience).
* [x] Hard eligibility rules codified (IT Only, CTC > ₹2.4 LPA, Paid Internship Thresholds).
* [x] Single-resume background processing model approved.
* [x] Walk-in detection and company monitoring defined.
* [x] Epistemic rules established (Known vs. Estimated vs. Unknown).
* [x] Phased roadmap and MVP boundaries approved.

**Status:** Phase 1 (Feature & Ideation) is formally complete. Proceed to Phase 2 (Product Requirements Document - PRD).
