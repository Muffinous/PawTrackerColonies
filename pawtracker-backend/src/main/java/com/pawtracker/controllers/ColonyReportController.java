package com.pawtracker.controllers;

import com.pawtracker.entities.ColonyReport;
import com.pawtracker.entities.DTO.ColonyReportDto;
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

    @PostMapping
    public ResponseEntity<ColonyReport> createReport(@RequestBody ColonyReport report) {
        ColonyReport savedReport = colonyReportService.save(report);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedReport);
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
    public ResponseEntity<List<ColonyReport>> getAllReports() {
        return ResponseEntity.ok(colonyReportService.findAll());
    }
}
