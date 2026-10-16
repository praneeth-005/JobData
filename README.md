# IT Career Partner (JobMate India)

AI-Powered Job Discovery & Career Assistant engineered specifically for Indian IT Freshers (0 Years of Experience).

---

## Project Overview

- **Problem:** Existing job boards in India are flooded with expired listings, hidden compensation ("Best in industry"), disguised customer support/telecalling jobs, and predatory placement scams.
- **Solution:** A transparent, truth-first career engine that enforces strict 0-YOE fresher filters, a minimum ₹2.4 LPA salary floor, paid internship rules, walk-in drive detection, and unhurried, explainable AI resume optimization.

---

## Architecture & Technology Stack

```
it-career-partner/
├── backend/                  # Spring Boot 3.3.4 (Java 21) Modular Monolith
│   ├── src/main/java/com/itcareerpartner/
│   │   ├── auth/            # Spring Security & Session Management
│   │   ├── company/         # Company Directory & Verification
│   │   ├── job/             # Job Search & Filtering
│   │   ├── verification/    # Deterministic Gatekeeper (BR-01 to BR-07)
│   │   ├── resume/          # Apache Tika & Private Storage Manager
│   │   ├── ai/              # Provider-Independent AiProviderClient
│   │   ├── matching/        # Dual-Scoring Engine (Job Fit % vs Resume Fit %)
│   │   ├── tracker/         # Application Lifecycle Manager
│   │   └── notification/    # Event Dispatcher & Polling Registry
│   └── src/main/resources/
│       └── application.properties
├── frontend/                 # React 18 + Vite + TypeScript
│   ├── src/
│   │   ├── components/      # UI components adhering to Sovereign Engineering design
│   │   ├── pages/           # The 3 finalized Google Stitch screens:
│   │   │   ├── DashboardPage.tsx    # Executive Dashboard (Screen 1)
│   │   │   ├── FindJobsPage.tsx     # Find Verified Jobs (Screen 2)
│   │   │   └── JobDetailsPage.tsx   # Job Details & AI Match Breakdown (Screen 3)
│   │   └── types/           # TypeScript Domain Models
│   ├── tailwind.config.js   # Stitch Design Tokens (Geist, JetBrains Mono, #4338ca)
│   └── vite.config.ts       # Proxy configured for /api/v1 -> localhost:8080
└── database/                 # MongoDB Schema & Seed Scripts
    ├── init_mongodb_schema.py   # 17 Collections & Compound Indexes
    └── seed_initial_data.py     # Verified Seed Data matching Stitch Mockups
```

---

## Quickstart

### 1. Database Setup
```bash
# Initialize MongoDB collections and compound indexes:
python database/init_mongodb_schema.py "mongodb://localhost:27017"

# Seed initial companies and verified fresher IT jobs:
python database/seed_initial_data.py "mongodb://localhost:27017"
```

### 2. Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
# Server starts at http://localhost:8080/api/v1
```

### 3. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
# Web app runs at http://localhost:5173
```
