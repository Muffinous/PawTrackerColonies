package com.pawtracker.mappers;

import com.pawtracker.entities.DTO.UserColonyDto;
import com.pawtracker.entities.UserColony;

import java.util.stream.Collectors;

public class UserColonyMapper {
    public static UserColonyDto toDto(UserColony userColony) {
        UserColonyDto dto = new UserColonyDto();
        dto.setId(userColony.getId());
        dto.setUserId(userColony.getUser().getUid());
        dto.setColonyId(userColony.getColony().getId());
        dto.setName(userColony.getColony().getName());
        dto.setLocation(userColony.getColony().getLocation());
        dto.setCats(userColony.getColony().getCats().stream()
                .map(ColonyMapper::toCatDto)
                .collect(Collectors.toList()));
        dto.setActiveFeeding(userColony.isActiveFeeding());
        return dto;
    }
}