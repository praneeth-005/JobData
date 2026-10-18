package com.itcareerpartner.tracker;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository extends MongoRepository<ActivityItem, String> {
    List<ActivityItem> findByUserIdOrderByScheduledDateTimeAsc(String userId);
    List<ActivityItem> findByUserIdAndApplicationId(String userId, String applicationId);
}
