package com.pawtracker.entities.Responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
public class CreateColonyResponse {
    private String name;

    private UUID colonyId;

    private Boolean success;


}
