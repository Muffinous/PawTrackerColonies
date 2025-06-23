package com.pawtracker.repository;

import com.pawtracker.entities.ColonyReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ColonyReportRepository extends JpaRepository<ColonyReport, UUID> {
    // Consultas personalizadas si es necesario
}