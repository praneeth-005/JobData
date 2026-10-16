"""
IT Career Partner — MongoDB Initialization & Indexing Script
Based on: IT_Career_Partner_Database_API_Design.md (v1.0 Baseline)
Supports: MongoDB Atlas URI or Localhost
"""

import sys
import os
from datetime import datetime, timezone
import pymongo
from pymongo import MongoClient, ASCENDING, DESCENDING, IndexModel

DEFAULT_DB_NAME = "it_career_partner"

COLLECTIONS_METADATA = [
    "users",
    "email_tokens",
    "user_preferences",
    "companies",
    "jobs",
    "job_sources",
    "job_source_records",
    "resumes",
    "resume_analyses",
    "job_analyses",
    "job_matches",
    "resume_match_results",
    "applications",
    "monitoring_tasks",
    "background_tasks",
    "notifications",
    "notification_outbox"
]

def initialize_database(uri, db_name=DEFAULT_DB_NAME):
    print(f"[*] Connecting to MongoDB at: {uri.split('@')[-1] if '@' in uri else uri}...")
    client = MongoClient(uri, serverSelectionTimeoutMS=5000)
    
    # Test connection
    try:
        client.admin.command('ping')
        print("[+] Successfully connected to MongoDB!")
    except Exception as e:
        print(f"[-] Connection failed: {e}")
        return False

    db = client[db_name]
    print(f"[+] Initializing database: '{db_name}'...")

    # Ensure all collections exist
    existing_cols = db.list_collection_names()
    for col_name in COLLECTIONS_METADATA:
        if col_name not in existing_cols:
            db.create_collection(col_name)
            print(f"  [+] Created collection: {col_name}")
        else:
            print(f"  [*] Collection already exists: {col_name}")

    print("\n[*] Applying indexes as per Section 6 specification...")

    # 1. users
    db.users.create_indexes([
        IndexModel([("normalizedEmail", ASCENDING)], unique=True, name="idx_users_normalized_email")
    ])
    print("  [+] users: unique index on normalizedEmail")

    # 2. email_tokens
    db.email_tokens.create_indexes([
        IndexModel([("tokenHash", ASCENDING)], unique=True, name="idx_tokens_hash"),
        IndexModel([("userId", ASCENDING), ("purpose", ASCENDING)], name="idx_tokens_user_purpose"),
        IndexModel([("expiresAt", ASCENDING)], expireAfterSeconds=0, name="idx_tokens_ttl")
    ])
    print("  [+] email_tokens: unique tokenHash, (userId, purpose), TTL expiresAt")

    # 3. user_preferences
    db.user_preferences.create_indexes([
        IndexModel([("userId", ASCENDING)], unique=True, name="idx_prefs_user_id")
    ])
    print("  [+] user_preferences: unique userId")

    # 4. companies
    db.companies.create_indexes([
        IndexModel([("normalizedName", ASCENDING)], name="idx_companies_normalized_name"),
        IndexModel([("aliases", ASCENDING)], name="idx_companies_aliases")
    ])
    print("  [+] companies: normalizedName, aliases")

    # 5. jobs
    db.jobs.create_indexes([
        IndexModel([("verification.status", ASCENDING), ("jobType", ASCENDING), ("discoveredAt", DESCENDING)], name="idx_jobs_verification_type_discovered"),
        IndexModel([("companyId", ASCENDING), ("lifecycleStatus", ASCENDING)], name="idx_jobs_company_lifecycle"),
        IndexModel([("requiredSkills", ASCENDING)], name="idx_jobs_skills"),
        IndexModel([("interview.isWalkin", ASCENDING), ("discoveredAt", DESCENDING)], name="idx_jobs_walkin_freshness")
    ])
    print("  [+] jobs: compound verification/type, company/lifecycle, skills, walk-in")

    # 6. job_sources
    db.job_sources.create_indexes([
        IndexModel([("sourceKey", ASCENDING)], unique=True, name="idx_sources_key")
    ])
    print("  [+] job_sources: unique sourceKey")

    # 7. job_source_records
    db.job_source_records.create_indexes([
        IndexModel([("sourceId", ASCENDING), ("externalJobId", ASCENDING)], unique=True, partialFilterExpression={"externalJobId": {"$type": "string"}}, name="idx_records_source_external_id"),
        IndexModel([("jobId", ASCENDING), ("lastSeenAt", DESCENDING)], name="idx_records_job_last_seen")
    ])
    print("  [+] job_source_records: partial unique (sourceId, externalJobId), (jobId, lastSeenAt)")

    # 8. resumes
    db.resumes.create_indexes([
        IndexModel([("userId", ASCENDING)], unique=True, name="idx_resumes_user_id")
    ])
    print("  [+] resumes: unique userId")

    # 9. resume_analyses
    db.resume_analyses.create_indexes([
        IndexModel([("userId", ASCENDING), ("resumeVersion", ASCENDING), ("createdAt", DESCENDING)], name="idx_resume_analyses_user_version_created")
    ])
    print("  [+] resume_analyses: (userId, resumeVersion, createdAt desc)")

    # 10. job_analyses
    db.job_analyses.create_indexes([
        IndexModel([("jobId", ASCENDING), ("jobVersion", ASCENDING)], name="idx_job_analyses_job_version")
    ])
    print("  [+] job_analyses: (jobId, jobVersion)")

    # 11. job_matches
    db.job_matches.create_indexes([
        IndexModel([("userId", ASCENDING), ("jobId", ASCENDING), ("jobVersion", ASCENDING), ("scoreVersion", ASCENDING)], unique=True, name="idx_job_matches_unique")
    ])
    print("  [+] job_matches: unique (userId, jobId, jobVersion, scoreVersion)")

    # 12. resume_match_results
    db.resume_match_results.create_indexes([
        IndexModel([("userId", ASCENDING), ("jobId", ASCENDING), ("computedAt", DESCENDING)], name="idx_resume_matches_user_job_computed")
    ])
    print("  [+] resume_match_results: (userId, jobId, computedAt desc)")

    # 13. applications
    db.applications.create_indexes([
        IndexModel([("userId", ASCENDING), ("jobId", ASCENDING)], unique=True, name="idx_applications_user_job_unique"),
        IndexModel([("userId", ASCENDING), ("status", ASCENDING), ("updatedAt", DESCENDING)], name="idx_applications_user_status_updated")
    ])
    print("  [+] applications: unique (userId, jobId), (userId, status, updatedAt desc)")

    # 14. monitoring_tasks
    db.monitoring_tasks.create_indexes([
        IndexModel([("userId", ASCENDING), ("status", ASCENDING), ("createdAt", DESCENDING)], name="idx_monitoring_user_status_created")
    ])
    print("  [+] monitoring_tasks: (userId, status, createdAt desc)")

    # 15. background_tasks
    db.background_tasks.create_indexes([
        IndexModel([("idempotencyKey", ASCENDING)], unique=True, sparse=True, name="idx_tasks_idempotency_key"),
        IndexModel([("status", ASCENDING), ("nextAttemptAt", ASCENDING)], name="idx_tasks_status_next_attempt"),
        IndexModel([("status", ASCENDING), ("leaseExpiresAt", ASCENDING)], name="idx_tasks_status_lease_expires")
    ])
    print("  [+] background_tasks: unique idempotencyKey, (status, nextAttemptAt), (status, leaseExpiresAt)")

    # 16. notifications
    db.notifications.create_indexes([
        IndexModel([("userId", ASCENDING), ("dedupeKey", ASCENDING)], unique=True, name="idx_notifs_user_dedupe"),
        IndexModel([("userId", ASCENDING), ("createdAt", DESCENDING)], name="idx_notifs_user_created")
    ])
    print("  [+] notifications: unique (userId, dedupeKey), (userId, createdAt desc)")

    # 17. notification_outbox
    db.notification_outbox.create_indexes([
        IndexModel([("status", ASCENDING), ("nextAttemptAt", ASCENDING)], name="idx_outbox_status_next_attempt")
    ])
    print("  [+] notification_outbox: (status, nextAttemptAt)")

    print("\n[✔] Database initialization and indexing completed successfully!")
    return True

if __name__ == "__main__":
    uri = sys.argv[1] if len(sys.argv) > 1 else os.environ.get("MONGODB_URI", "mongodb://localhost:27017")
    initialize_database(uri)
