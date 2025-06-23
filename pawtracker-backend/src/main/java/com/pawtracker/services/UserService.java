package com.pawtracker.services;


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

    public User updateUser(User user) {
        Optional<User> existingUser = userRepository.findByUid(user.getUid());
        if (existingUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User u = existingUser.get();
        u.setName(user.getName());
        u.setEmail(user.getEmail());
        u.setUsername(user.getUsername());
        u.setPhoneNumber(user.getPhoneNumber());

        return userRepository.save(u);
    }
}