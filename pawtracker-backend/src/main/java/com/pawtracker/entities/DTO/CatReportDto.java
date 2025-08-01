package com.pawtracker.entities.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CatReportDto {
    private UUID catId;
    private String description;
    private CatDto cat;
    private String imageUrl;
}
