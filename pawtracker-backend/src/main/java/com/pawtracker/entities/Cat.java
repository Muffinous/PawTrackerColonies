package com.pawtracker.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "cats")
public class Cat {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String img;

    @Column(nullable = false)
    private String name;

    private String furColor;

    private Boolean spayedNeutered;

    private Integer approximateAge;

    private Gender gender; // "M" o "F"

    private String observations;

    @ManyToMany(mappedBy = "cats")
    private List<Colony> colonies;

    public enum Gender {
        M, F
    }
}
