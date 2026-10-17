package com.itcareerpartner.auth;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmailTokenRepository extends MongoRepository<EmailToken, String> {
    Optional<EmailToken> findByTokenHashAndPurposeAndUsedFalse(String tokenHash, String purpose);
    List<EmailToken> findByUserIdAndPurpose(String userId, String purpose);
    List<EmailToken> findTop20ByOrderByCreatedAtDesc();
}
