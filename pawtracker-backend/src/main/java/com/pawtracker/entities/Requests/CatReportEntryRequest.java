package com.pawtracker.entities.Requests;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class CatReportEntryRequest {
    private UUID catId;
    private String description;
}
