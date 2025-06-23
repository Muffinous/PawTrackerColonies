package com.pawtracker.repository;

import com.pawtracker.entities.UserColony;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserColonyRepository extends JpaRepository<UserColony, UUID> {
    List<UserColony> findByUser_uidAndActiveFeedingTrue(UUID userId);

    List<UserColony> findByUser_uid(UUID userId);

}
