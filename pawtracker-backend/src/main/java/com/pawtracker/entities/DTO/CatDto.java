package com.pawtracker.entities.DTO;

import com.pawtracker.entities.Cat;
import com.pawtracker.entities.Gender;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CatDto {
    private UUID id;
    private String name;
    private String img;
    private String furColor;
    private Boolean spayedNeutered;
    private Integer approximateAge;
    private String observations;
    private Gender gender;
    private List<ColonyDto> colonies;
}

