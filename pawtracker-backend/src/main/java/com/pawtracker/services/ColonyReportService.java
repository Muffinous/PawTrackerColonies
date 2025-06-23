package com.pawtracker.services;

import com.pawtracker.entities.ColonyReport;
import com.pawtracker.entities.DTO.ColonyReportDto;
import com.pawtracker.entities.UserColony;
import com.pawtracker.mappers.ColonyReportMapper;
import com.pawtracker.mappers.UserColonyMapper;
import com.pawtracker.repository.ColonyReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ColonyReportService {
    @Autowired
    private ColonyReportRepository colonyReportRepository;

    @Autowired
    private ColonyReportMapper colonyReportMapper;

    public List<ColonyReport> findAll() {
        return colonyReportRepository.findAll();
    }

    public Optional<ColonyReportDto> findById(UUID id) {
        return colonyReportRepository.findById(id)
                // usa el mapper de instancia, no el método estático
                .map(colonyReportMapper::toDto);
    }

    public ColonyReport save(ColonyReport report) {
        return colonyReportRepository.save(report);
    }

    public void deleteById(UUID id) {
        colonyReportRepository.deleteById(id);
    }
}
