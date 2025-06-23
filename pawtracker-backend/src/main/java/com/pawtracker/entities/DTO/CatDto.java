package com.pawtracker.entities.DTO;

import com.pawtracker.entities.Cat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private Cat.Gender gender; // "M" o "F"
}
