package com.itcareerpartner.tracker;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends MongoRepository<JobApplication, String> {
    List<JobApplication> findByUserIdOrderByCreatedAtDesc(String userId);
    List<JobApplication> findByUserIdAndStage(String userId, ApplicationStage stage);
    Optional<JobApplication> findByUserIdAndJobId(String userId, String jobId);
}
