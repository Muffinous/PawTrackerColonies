package com.pawtracker.entities.DTO;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class UpdateUserColoniesRequest {
    private UUID userId;
    private List<UUID> selectedColonyIds;
}
