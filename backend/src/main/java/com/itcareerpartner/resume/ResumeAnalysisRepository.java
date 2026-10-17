package com.itcareerpartner.resume;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeAnalysisRepository extends MongoRepository<ResumeAnalysis, String> {
    List<ResumeAnalysis> findByResumeVersionIdOrderByCreatedAtDesc(String resumeVersionId);
    Optional<ResumeAnalysis> findByResumeVersionIdAndTargetJobId(String resumeVersionId, String targetJobId);
    List<ResumeAnalysis> findByUserIdOrderByCreatedAtDesc(String userId);
}
