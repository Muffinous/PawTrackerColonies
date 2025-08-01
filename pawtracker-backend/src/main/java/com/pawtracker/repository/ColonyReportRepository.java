package com.pawtracker.repository;

import com.pawtracker.entities.ColonyReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ColonyReportRepository extends JpaRepository<ColonyReport, UUID> {
    List<ColonyReport> findAll();
    List<ColonyReport> findReportsByUser_Uid(UUID userId);

}