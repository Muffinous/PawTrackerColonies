package com.pawtracker.services;

import com.pawtracker.entities.*;
import com.pawtracker.entities.DTO.CatReportEntry;
import com.pawtracker.entities.DTO.ColonyReportDto;
import com.pawtracker.entities.Requests.ColonyReportRequest;
import com.pawtracker.mappers.ColonyReportMapper;
import com.pawtracker.repository.CatRepository;
import com.pawtracker.repository.ColonyReportRepository;
import com.pawtracker.repository.ColonyRepository;
import com.pawtracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
    private ColonyRepository colonyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CatRepository catRepository;

    @Autowired
    private ColonyReportMapper colonyReportMapper;

    public List<ColonyReport> findAll() {
        return colonyReportRepository.findAll();
    }

    public Optional<ColonyReportDto> findById(UUID id) {
        return colonyReportRepository.findById(id)
                .map(colonyReportMapper::toDto);
    }

    public ColonyReport save(ColonyReport report) {
        return colonyReportRepository.save(report);
    }

    public void deleteById(UUID id) {
        colonyReportRepository.deleteById(id);
    }

    public List<ColonyReportDto> getAllReports() {
        return colonyReportRepository.findAll()
                .stream()
                .map(colonyReportMapper::toDto)
                .toList();
    }

    public List<ColonyReportDto> getReportsByUserId(UUID userId) {
        return colonyReportRepository.findReportsByUser_Uid(userId)
                .stream()
                .map(colonyReportMapper::toDto)
                .toList();
    }


    public ColonyReport saveReport(ColonyReportRequest request) {
        ColonyReport report = new ColonyReport();

        // Set colony
        Optional<Colony> colonyOpt = colonyRepository.findById(request.getColonyId());
        if (colonyOpt.isEmpty()) {
            throw new RuntimeException("Colony not found with id " + request.getColonyId());
        }
        report.setColony(colonyOpt.get());

        // Set user
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        report.setUser(user);

        report.setTitle(request.getTitle());
        report.setDatetime(request.getDatetime() != null ? request.getDatetime() : LocalDateTime.now());

        // Map catsFed entries
        List<CatReportEntry> fedEntries = request.getCatsFed().stream().map(entryReq -> {
            CatReportEntry entry = new CatReportEntry();
            Cat cat = catRepository.findById(entryReq.getCatId())
                    .orElseThrow(() -> new RuntimeException("Cat not found with id " + entryReq.getCatId()));
            entry.setCat(cat);
            entry.setDescription(entryReq.getDescription());
            return entry;
        }).collect(Collectors.toList());

        report.setCatsFed(fedEntries);

        // Map catsMissing entries
        List<CatReportEntry> missingEntries = request.getCatsMissing().stream().map(entryReq -> {
            CatReportEntry entry = new CatReportEntry();
            Cat cat = catRepository.findById(entryReq.getCatId())
                    .orElseThrow(() -> new RuntimeException("Cat not found with id " + entryReq.getCatId()));
            entry.setCat(cat);
            entry.setDescription(entryReq.getDescription());
            return entry;
        }).collect(Collectors.toList());

        report.setCatsMissing(missingEntries);

        return colonyReportRepository.save(report);
    }
}
