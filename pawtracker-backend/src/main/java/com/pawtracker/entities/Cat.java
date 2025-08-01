package com.pawtracker.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;
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

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private String observations;

    @ManyToMany(mappedBy = "cats")
    @JsonIgnore // Prevent recursion when serializing Cat
    private Set<Colony> colonies = new HashSet<>();

}
