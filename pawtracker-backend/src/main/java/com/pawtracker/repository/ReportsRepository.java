package com.pawtracker.repository;

import com.pawtracker.entities.Colony;
import com.pawtracker.entities.ColonyReport;
import com.pawtracker.entities.DTO.ColonyReportDto;
import com.pawtracker.entities.DTO.ReportDto;
import com.pawtracker.entities.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReportsRepository extends JpaRepository<ColonyReport, UUID> {

    List<ColonyReport> findAll();
    List<ColonyReport> findReportsByUser_Uid(UUID userId);
   /* List<ReportDTO> findReportsByUserIdAndColonyId(UUID userId, UUID colonyId);
    List<ReportDTO> findReportsByColonyId(UUID colonyId);*/
}
