package com.pawtracker.entities.DTO;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Data
public class ColonyReportDto {
    private UUID id;
    private ColonyDto colony;
    private String title;
    private List<CatReportDto> catsMissing;
    private List<CatReportDto> catsFed;
    private Map<UUID, String> catDescriptions;
    private UserDto user;
    private LocalDateTime datetime;
}
