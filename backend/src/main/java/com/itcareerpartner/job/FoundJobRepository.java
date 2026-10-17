package com.itcareerpartner.job;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoundJobRepository extends MongoRepository<FoundJob, String> {

    List<FoundJob> findAllByOrderByCreatedAtDesc();

    List<FoundJob> findByStatus(String status);

    long countByStatus(String status);

    List<FoundJob> findByIsSavedTrue();
}
