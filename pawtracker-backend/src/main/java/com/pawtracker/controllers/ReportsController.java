package com.pawtracker.controllers;

import com.pawtracker.entities.ColonyReport;
import com.pawtracker.entities.DTO.ColonyReportDto;
import com.pawtracker.entities.DTO.ReportDto;
import com.pawtracker.services.ReportsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportsController {

    @Autowired
    private ReportsService reportsService;

    // 1. Todos los reports
    @GetMapping
    public ResponseEntity<List<ColonyReportDto>> getAllReports() {
        return ResponseEntity.ok(reportsService.getAllReports());
    }

    // 2. Reports por user
    @GetMapping("/by-userId/{uuid}")
    public ResponseEntity<List<ColonyReportDto>> getReportsByUserId(@PathVariable("uuid") String uuid) {
        return ResponseEntity.ok(reportsService.getReportsByUserId(UUID.fromString(uuid)));
    }
/*
    // 3. Reports por colonia
    @GetMapping("/colony/{colonyId}")
    public ResponseEntity<List<ReportDTO>> getReportsByColonyId(@PathVariable UUID colonyId) {
        return ResponseEntity.ok(reportsService.getReportsByColonyId(colonyId));
    }

    // 4. Reports por user en colonia
    @GetMapping("/user/{userId}/colony/{colonyId}")
    public ResponseEntity<List<ReportDTO>> getReportsByUserAndColony(
            @PathVariable UUID userId,
            @PathVariable UUID colonyId
    ) {
        return ResponseEntity.ok(reportsService.getReportsByUserAndColony(userId, colonyId));
    }*/
}
