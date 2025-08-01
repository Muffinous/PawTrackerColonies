package com.pawtracker.controllers;

import com.pawtracker.entities.ColonyReport;
import com.pawtracker.entities.DTO.ColonyReportDto;
import com.pawtracker.entities.Requests.ColonyReportRequest;
import com.pawtracker.services.ColonyReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/colonyReports")
@RequiredArgsConstructor
public class ColonyReportController {

    @Autowired
    private ColonyReportService colonyReportService;

    @GetMapping("/{id}")
    public ResponseEntity<ColonyReportDto> getReportById(@PathVariable String id) {
        UUID uuid = UUID.fromString(id);
        return colonyReportService.findById(uuid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

   /*@PutMapping("/{id}")
    public ResponseEntity<ColonyReport> updateReport(@PathVariable String id, @RequestBody ColonyReport report) {
        UUID uuid = UUID.fromString(id);
        report.setId(uuid);
        ColonyReport updatedReport = colonyReportService.update(report);
        return ResponseEntity.ok(updatedReport);
    } */

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable String id) {
        colonyReportService.deleteById(UUID.fromString(id));
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<ColonyReportDto>> getAllReports() {
        return ResponseEntity.ok(colonyReportService.getAllReports());
    }

    // 2. Reports por user
    @GetMapping("/by-userId/{uuid}")
    public ResponseEntity<List<ColonyReportDto>> getReportsByUserId(@PathVariable("uuid") String uuid) {
        return ResponseEntity.ok(colonyReportService.getReportsByUserId(UUID.fromString(uuid)));
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

    @PostMapping
    public ResponseEntity<?> saveReport(@RequestBody ColonyReportRequest reportRequest) {
        try {
            ColonyReport savedReport = colonyReportService.saveReport(reportRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedReport);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving report: " + e.getMessage());
        }
    }
}
