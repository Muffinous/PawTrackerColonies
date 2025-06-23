package com.pawtracker.entities.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportDto {

    private Integer id;

    private UUID userId;
    private String userName;
    private String userLastName;

    private Integer colonyId;
    private String colonyName;

    private LocalDateTime datetime;

    private List<Integer> catsFedIds;
    private List<Integer> catsMissingIds;

    private List<CatDescriptionDTO> catDescriptions;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CatDescriptionDTO {
        private Integer catId;
        private String description;
    }
}
