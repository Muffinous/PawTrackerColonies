package com.pawtracker.services;

import com.pawtracker.entities.Cat;
import com.pawtracker.repository.CatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CatService {
    @Autowired
    private CatRepository catRepository;

    public List<Cat> findAll() {
        return catRepository.findAll();
    }

    public Optional<Cat> findById(UUID id) {
        return catRepository.findById(id);
    }

    public Cat save(Cat cat) {
        return catRepository.save(cat);
    }

    public void deleteById(UUID id) {
        catRepository.deleteById(id);
    }
}
