package com.pawtracker.entities.Requests;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
public class ColonyReportRequest {
    private UUID colonyId;
    private String title;
    private List<CatReportEntryRequest> catsFed;
    private List<CatReportEntryRequest> catsMissing;
    private UUID userId;
    private LocalDateTime datetime;
}
