package com.pawtracker.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "colonies")
public class Colony {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    private String location;

    @ManyToMany
    @JoinTable(
            name = "colony_cats",
            joinColumns = @JoinColumn(name = "colony_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "cat_id", referencedColumnName = "id")
    )
    private List<Cat> cats;

    @ManyToMany(mappedBy = "colonies")
    private Set<User> users = new HashSet<>();
}
