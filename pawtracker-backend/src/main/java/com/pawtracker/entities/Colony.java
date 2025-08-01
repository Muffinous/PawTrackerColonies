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

    private Integer totalCats;

    // In Colony.java
    @ManyToMany
    @JoinTable(
            name = "colony_cats",
            joinColumns = @JoinColumn(name = "colony_id"),
            inverseJoinColumns = @JoinColumn(name = "cat_id")
    )
    private Set<Cat> cats = new HashSet<>();

    // In Colony.java
    @ManyToMany(mappedBy = "colonies")
    @JsonIgnore
    private Set<User> users = new HashSet<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Colony colony = (Colony) o;
        return id != null && id.equals(colony.id);
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }


    @Override
    public String toString() {
        return "Colony{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", location='" + location + '\'' +
                ", totalCats=" + totalCats +
                ", cats=" + cats.stream().map(Cat::getId).toList() +
                '}';
    }
}
