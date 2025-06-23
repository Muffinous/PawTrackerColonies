package com.pawtracker.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {

    @Id
    private UUID uid;

    @Column(nullable = false)
    private String username;

    private String name;

    private String lastname;

    private String email;

    private String profilePicture;

    private String phoneNumber;

    private String password;

    @ManyToMany
    @JoinTable(
            name = "user_colonies",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "colony_id")
    )
    private List<Colony> colonies;

    @OneToMany(mappedBy = "user")
    private List<ColonyReport> reports;
}
