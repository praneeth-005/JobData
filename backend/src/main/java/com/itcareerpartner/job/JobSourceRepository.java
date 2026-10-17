package com.itcareerpartner.job;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobSourceRepository extends MongoRepository<JobSource, String> {

    List<JobSource> findAllByOrderByCreatedAtDesc();

    List<JobSource> findByStatus(String status);

    Optional<JobSource> findByCompanyNameIgnoreCase(String companyName);

    boolean existsByCompanyNameIgnoreCase(String companyName);
}
