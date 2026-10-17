package com.itcareerpartner.resume;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeVersionRepository extends MongoRepository<ResumeVersion, String> {
    List<ResumeVersion> findByUserIdOrderByVersionNumberDesc(String userId);
    Optional<ResumeVersion> findByUserIdAndIsCurrentTrue(String userId);
    Optional<ResumeVersion> findByUserIdAndVersionNumber(String userId, int versionNumber);
}
