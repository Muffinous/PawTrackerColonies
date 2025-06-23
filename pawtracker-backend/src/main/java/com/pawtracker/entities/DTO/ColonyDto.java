package com.pawtracker.entities.DTO;

import com.pawtracker.entities.Colony;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ColonyDto {
    private UUID id;
    private String name;
    private int numberOfCats;
    private String location;
    private List<UserDto> users;
    private List<CatDto> cats;

    // otros campos que quieras exponer

    public ColonyDto(Colony colony) {
        this.id = colony.getId();
        this.name = colony.getName();
        this.location = colony.getLocation();
        this.numberOfCats = colony.getCats().size();
    }

}
