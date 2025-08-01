package com.pawtracker.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.*;

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
    @JsonIgnore
    private Set<Colony> colonies = new HashSet<>();

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<ColonyReport> reports;

    @Override
    public String toString() {
        return "User{id=" + uid + ", username=" + username + "}";
    }
}
