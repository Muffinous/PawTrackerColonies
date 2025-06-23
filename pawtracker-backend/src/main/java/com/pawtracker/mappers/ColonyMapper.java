package com.pawtracker.mappers;

import com.pawtracker.entities.Cat;
import com.pawtracker.entities.Colony;
import com.pawtracker.entities.DTO.CatDto;
import com.pawtracker.entities.DTO.ColonyDto;
import com.pawtracker.entities.DTO.UserDto;
import com.pawtracker.entities.User;

import java.util.stream.Collectors;

public class ColonyMapper {
    public static ColonyDto toDto(Colony colony) {
        ColonyDto dto = new ColonyDto();
        dto.setId(colony.getId());
        dto.setName(colony.getName());
        dto.setLocation(colony.getLocation());
        dto.setLocation(colony.getLocation());

        dto.setUsers(colony.getUsers().stream()
                .map(ColonyMapper::toUserBasicDto)
                .collect(Collectors.toList()));

        dto.setCats(colony.getCats().stream()
                .map(ColonyMapper::toCatDto)
                .collect(Collectors.toList()));

        return dto;
    }

    private static UserDto toUserBasicDto(User user) {
        UserDto dto = new UserDto();
        dto.setUid(user.getUid());
        dto.setUsername(user.getUsername());
        dto.setName(user.getName());
        dto.setLastname(user.getLastname());
        dto.setEmail(user.getEmail());
        dto.setProfilePicture(user.getProfilePicture());
        return dto;
    }

    static CatDto toCatDto(Cat cat) {
        CatDto dto = new CatDto();
        dto.setId(cat.getId());
        dto.setName(cat.getName());
        // mapear más campos si es necesario
        return dto;
    }
}
