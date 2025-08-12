package com.pawtracker.repository;

import com.pawtracker.entities.UserFeedingSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UserFeedingScheduleRepository extends JpaRepository<UserFeedingSchedule, UUID> {
    List<UserFeedingSchedule> findByColonyId(UUID colonyId);

    List<UserFeedingSchedule> findAllByColonyId(UUID colonyId);
    List<UserFeedingSchedule> findAllByUserUid(UUID userId);
}
