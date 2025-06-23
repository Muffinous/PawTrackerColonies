package com.pawtracker.entities.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private UUID uid;
    private String username;
    private String name;
    private String lastname;
    private String email;
    private String profilePicture;
    private String phoneNumber;
}
