package com.pawtracker.services;


import com.pawtracker.entities.DTO.UserDto;
import com.pawtracker.entities.User;
import com.pawtracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findById(String uid) {
        return userRepository.findById(UUID.fromString(uid));
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public void deleteById(String uid) {
        userRepository.deleteById(UUID.fromString(uid));
    }

    public UserDto updateUser(User user) {
        Optional<User> existingUser = userRepository.findByUid(user.getUid());
        if (existingUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User u = existingUser.get();

        if (user.getName() != null) u.setName(user.getName());
        if (user.getEmail() != null) u.setEmail(user.getEmail());
        if (user.getUsername() != null) u.setUsername(user.getUsername());
        if (user.getPhoneNumber() != null) u.setPhoneNumber(user.getPhoneNumber());
        if (user.getProfilePicture() != null) u.setProfilePicture(user.getProfilePicture());


        User updated = userRepository.save(u);

        UserDto dto = new UserDto();
        dto.setUid(updated.getUid());
        dto.setName(updated.getName());
        dto.setEmail(updated.getEmail());
        dto.setUsername(updated.getUsername());
        dto.setPhoneNumber(updated.getPhoneNumber());
        dto.setProfilePicture(updated.getProfilePicture());

        return dto;
    }
}