package com.pawtracker.entities.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserColonyDto {
    private UUID id;
    private UUID userId;
    private UUID colonyId;
    private String name;
    private String location;
    private List<CatDto> cats;
    private boolean activeFeeding;
}
