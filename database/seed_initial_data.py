"""
IT Career Partner â€” Initial Data Seeding Script
Populates verified companies and fresher IT jobs matching Google Stitch UI references.
"""

import sys
import os
from datetime import datetime, timezone
from bson import ObjectId
from pymongo import MongoClient

def seed_data(uri, db_name="it_career_partner"):
    client = MongoClient(uri, serverSelectionTimeoutMS=5000)
    db = client[db_name]

    print("[*] Seeding companies and verified fresher IT jobs...")

    # Sample Companies
    companies_data = [
        {
            "_id": ObjectId("670f1a000000000000000001"),
            "canonicalName": "Razorpay Software Pvt. Ltd.",
            "normalizedName": "razorpay software pvt. ltd.",
            "aliases": ["Razorpay"],
            "officialWebsiteUrl": "https://razorpay.com",
            "officialCareersUrl": "https://razorpay.com/jobs",
            "headquartersCountry": "India",
            "industry": "FinTech / Payment Gateway",
            "verificationStatus": "VERIFIED",
            "createdAt": datetime.now(timezone.utc),
            "updatedAt": datetime.now(timezone.utc),
            "schemaVersion": 1
        },
        {
            "_id": ObjectId("670f1a000000000000000002"),
            "canonicalName": "LTIMindtree",
            "normalizedName": "ltimindtree",
            "aliases": ["LTI", "Mindtree", "Larsen & Toubro Infotech"],
            "officialWebsiteUrl": "https://www.ltimindtree.com",
            "officialCareersUrl": "https://www.ltimindtree.com/careers",
            "headquartersCountry": "India",
            "industry": "Information Technology Services",
            "verificationStatus": "VERIFIED",
            "createdAt": datetime.now(timezone.utc),
            "updatedAt": datetime.now(timezone.utc),
            "schemaVersion": 1
        },
        {
            "_id": ObjectId("670f1a000000000000000003"),
            "canonicalName": "Swiggy",
            "normalizedName": "swiggy",
            "aliases": ["Bundl Technologies"],
            "officialWebsiteUrl": "https://www.swiggy.com",
            "officialCareersUrl": "https://careers.swiggy.com",
            "headquartersCountry": "India",
            "industry": "Consumer Tech / Quick Commerce",
            "verificationStatus": "VERIFIED",
            "createdAt": datetime.now(timezone.utc),
            "updatedAt": datetime.now(timezone.utc),
            "schemaVersion": 1
        },
        {
            "_id": ObjectId("670f1a000000000000000004"),
            "canonicalName": "ThoughtWorks Technologies",
            "normalizedName": "thoughtworks technologies",
            "aliases": ["Thoughtworks"],
            "officialWebsiteUrl": "https://www.thoughtworks.com",
            "officialCareersUrl": "https://www.thoughtworks.com/careers/india",
            "headquartersCountry": "India",
            "industry": "Software Engineering Consultancy",
            "verificationStatus": "VERIFIED",
            "createdAt": datetime.now(timezone.utc),
            "updatedAt": datetime.now(timezone.utc),
            "schemaVersion": 1
        }
    ]

    for comp in companies_data:
        db.companies.update_one({"_id": comp["_id"]}, {"$set": comp}, upsert=True)
    print(f"  [+] Seeded {len(companies_data)} companies.")

    # Sample Jobs matching Stitch UI references
    jobs_data = [
        {
            "_id": ObjectId("670f2b000000000000000001"),
            "companyId": ObjectId("670f1a000000000000000001"),
            "title": "Graduate Software Engineer (Backend)",
            "normalizedTitle": "graduate software engineer (backend)",
            "roleCategory": "BACKEND",
            "jobType": "FULL_TIME",
            "experienceMinYears": 0,
            "experienceMaxYears": 0,
            "fresherEligible": True,
            "educationRequirements": ["B.Tech / B.E. (CS, IT, ECE)", "2024 / 2025 Passing Batches"],
            "country": "India",
            "salaryMinLpa": 14.0,
            "salaryMaxLpa": 14.0,
            "salaryPeriod": "ANNUAL",
            "currency": "INR",
            "disclosed": True,
            "location": {
                "country": "India",
                "city": "Bengaluru",
                "region": "Karnataka",
                "rawText": "Bengaluru (Lavelle Road Office)"
            },
            "workMode": "HYBRID",
            "workingDays": "5_DAYS",
            "interviewMode": "VIRTUAL",
            "interviewDetails": "3 Rounds - Online Assessment + 2 Technical Interviews",
            "applicationDeadline": datetime(2026, 11, 30, tzinfo=timezone.utc),
            "applicationUrl": "https://razorpay.com/jobs/grad-swe-backend",
            "walkIn": { "isWalkIn": False },
            "lifecycleStatus": "PUBLISHED",
            "eligibilityStatus": "ELIGIBLE",
            "verificationStatus": "VERIFIED",
            "requiredSkills": ["Java 17", "Go / Golang", "Distributed Systems", "Kafka", "MySQL"],
            "preferredSkills": ["Docker", "Kubernetes", "AWS Basics"],
            "descriptionText": "Join Razorpay's Core Platform Team building ultra-reliable payment switches...",
            "firstDiscoveredAt": datetime.now(timezone.utc),
            "lastVerifiedAt": datetime.now(timezone.utc),
            "lastSeenAt": datetime.now(timezone.utc),
            "schemaVersion": 1
        },
        {
            "_id": ObjectId("670f2b000000000000000002"),
            "companyId": ObjectId("670f1a000000000000000002"),
            "title": "Associate QA Automation Engineer",
            "normalizedTitle": "associate qa automation engineer",
            "roleCategory": "QA",
            "jobType": "FULL_TIME",
            "experienceMinYears": 0,
            "experienceMaxYears": 0,
            "fresherEligible": True,
            "educationRequirements": ["B.Tech / BCA / MCA / B.Sc CS", "2024 / 2025 Batches"],
            "country": "India",
            "salaryMinLpa": 4.5,
            "salaryMaxLpa": 4.5,
            "salaryPeriod": "ANNUAL",
            "currency": "INR",
            "disclosed": True,
            "location": {
                "country": "India",
                "city": "Hyderabad",
                "region": "Telangana",
                "rawText": "Mindspace SEZ, Madhapur, Hyderabad"
            },
            "workMode": "ONSITE",
            "workingDays": "5_DAYS",
            "interviewMode": "IN_PERSON",
            "interviewDetails": "Direct Physical Walk-in Drive",
            "applicationUrl": "https://www.ltimindtree.com/careers/walkin-hyderabad",
            "walkIn": {
                "isWalkIn": True,
                "date": "2026-10-25",
                "venue": "Mindspace SEZ, Building 12, Madhapur, Hyderabad - 10:00 AM IST",
                "details": "Direct entry. Carry 2 hard copies of resume and Govt ID."
            },
            "lifecycleStatus": "PUBLISHED",
            "eligibilityStatus": "ELIGIBLE",
            "verificationStatus": "VERIFIED",
            "requiredSkills": ["Selenium", "Java & OOP", "TestNG", "Postman", "SQL"],
            "preferredSkills": ["CI/CD Pipeline", "Jira"],
            "descriptionText": "Direct Walk-in drive for entry level QA Automation Engineers at LTIMindtree Hyderabad...",
            "firstDiscoveredAt": datetime.now(timezone.utc),
            "lastVerifiedAt": datetime.now(timezone.utc),
            "lastSeenAt": datetime.now(timezone.utc),
            "schemaVersion": 1
        },
        {
            "_id": ObjectId("670f2b000000000000000003"),
            "companyId": ObjectId("670f1a000000000000000003"),
            "title": "Frontend Engineering Intern",
            "normalizedTitle": "frontend engineering intern",
            "roleCategory": "FRONTEND",
            "jobType": "INTERNSHIP",
            "experienceMinYears": 0,
            "experienceMaxYears": 0,
            "fresherEligible": True,
            "educationRequirements": ["Final Year Students / 2025 / 2026 Grads"],
            "country": "India",
            "stipendMinMonthlyInr": 35000,
            "stipendMaxMonthlyInr": 35000,
            "salaryPeriod": "MONTHLY",
            "currency": "INR",
            "disclosed": True,
            "location": {
                "country": "India",
                "city": "Remote - India",
                "region": "All India",
                "rawText": "Remote (India) - 6 Months Full-Time Internship"
            },
            "workMode": "REMOTE",
            "workingDays": "5_DAYS",
            "interviewMode": "VIRTUAL",
            "interviewDetails": "Machine Coding Round + Technical Discussion",
            "applicationUrl": "https://careers.swiggy.com/interns",
            "walkIn": { "isWalkIn": False },
            "lifecycleStatus": "PUBLISHED",
            "eligibilityStatus": "ELIGIBLE",
            "verificationStatus": "VERIFIED",
            "requiredSkills": ["React 18", "Next.js", "Tailwind CSS", "Redux Toolkit", "TypeScript"],
            "preferredSkills": ["Web Performance", "Jest"],
            "descriptionText": "6 months full-time frontend engineering internship with PPO conversion opportunity (â‚¹11.0 LPA CTC)...",
            "firstDiscoveredAt": datetime.now(timezone.utc),
            "lastVerifiedAt": datetime.now(timezone.utc),
            "lastSeenAt": datetime.now(timezone.utc),
            "schemaVersion": 1
        }
    ]

    for job in jobs_data:
        db.jobs.update_one({"_id": job["_id"]}, {"$set": job}, upsert=True)
    print(f"  [+] Seeded {len(jobs_data)} verified fresher jobs.")

    print("\n[âœ”] Initial seed data successfully applied!")

if __name__ == "__main__":
    uri = sys.argv[1] if len(sys.argv) > 1 else os.environ.get("MONGODB_URI", "mongodb://localhost:27017")
    seed_data(uri)

