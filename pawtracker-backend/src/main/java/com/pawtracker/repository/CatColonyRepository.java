package com.pawtracker.repository;

import com.pawtracker.entities.CatColony;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CatColonyRepository extends JpaRepository<CatColony, CatColony.CatColonyId> {
    // Custom query to find cats by colony ID
    List<CatColony> findByCat_Id(UUID catId);
    List<CatColony> findByColony_Id(UUID colonyId);}
