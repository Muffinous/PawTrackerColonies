package com.pawtracker.entities.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
public class CreateColonyResponse {
    private String name;

    private UUID colonyId;

    private Boolean success;

}
