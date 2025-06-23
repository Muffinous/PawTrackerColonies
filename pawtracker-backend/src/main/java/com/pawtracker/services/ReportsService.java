package com.pawtracker.services;

import com.pawtracker.entities.ColonyReport;
import com.pawtracker.entities.DTO.ColonyReportDto;
import com.pawtracker.entities.DTO.ReportDto;
import com.pawtracker.mappers.ColonyReportMapper;
import com.pawtracker.repository.ReportsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ReportsService {

    @Autowired
    private ReportsRepository reportsRepository;

    @Autowired
    private ColonyReportMapper colonyReportMapper;

    public List<ColonyReportDto> getAllReports() {
        return reportsRepository.findAll()
                .stream()
                .map(colonyReportMapper::toDto)
                .toList();
    }

    public List<ColonyReportDto> getReportsByUserId(UUID userId) {
        return reportsRepository.findReportsByUser_Uid(userId)
                .stream()
                .map(colonyReportMapper::toDto)
                .toList();
    }
/*
    public List<ReportDTO> getReportsByUserAndColony(UUID userId, UUID colonyId) {
        return reportsRepository.findReportsByUserIdAndColonyId(userId, colonyId);
    }

    public List<ReportDTO> getReportsByColonyId(UUID colonyId) {
        return reportsRepository.findReportsByColonyId(colonyId);
    }*/


}
