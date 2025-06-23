package com.pawtracker.repository;

import com.pawtracker.entities.Colony;
import com.pawtracker.entities.DTO.ColonyDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ColonyRepository extends JpaRepository<Colony, UUID> {

    List<Colony> findByUsersUid(UUID userId);

    Optional<Colony> findById(UUID id);

}