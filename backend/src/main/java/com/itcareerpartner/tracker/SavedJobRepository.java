package com.itcareerpartner.tracker;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedJobRepository extends MongoRepository<SavedJobItem, String> {
    List<SavedJobItem> findByUserIdOrderBySavedAtDesc(String userId);
    Optional<SavedJobItem> findByUserIdAndJobId(String userId, String jobId);
    void deleteByUserIdAndJobId(String userId, String jobId);
}
