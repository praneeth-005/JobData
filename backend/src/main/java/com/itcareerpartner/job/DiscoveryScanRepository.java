package com.itcareerpartner.job;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DiscoveryScanRepository extends MongoRepository<DiscoveryScan, String> {

    Optional<DiscoveryScan> findTopByUserIdOrderByStartedAtDesc(String userId);

    Optional<DiscoveryScan> findTopByOrderByStartedAtDesc();
}
