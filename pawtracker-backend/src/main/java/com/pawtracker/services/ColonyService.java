package com.pawtracker.services;

import com.pawtracker.entities.Cat;
import com.pawtracker.entities.Colony;
import com.pawtracker.entities.DTO.ColonyDto;
import com.pawtracker.entities.Responses.CreateColonyResponse;
import com.pawtracker.entities.DTO.UserColonyDto;
import com.pawtracker.entities.UserColony;
import com.pawtracker.mappers.ColonyMapper;
import com.pawtracker.mappers.UserColonyMapper;
import com.pawtracker.repository.CatRepository;
import com.pawtracker.repository.ColonyRepository;
import com.pawtracker.repository.UserColonyRepository;
import com.pawtracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ColonyService {
    @Autowired
    private ColonyRepository colonyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserColonyRepository userColonyRepository;

    @Autowired
    private CatRepository catRepository;

    public List<ColonyDto> getAllColonies() {
        List<Colony> colonies = colonyRepository.findAll();

        List<ColonyDto> dtos = colonies.stream()
                .map(ColonyMapper::toDto)
                .collect(Collectors.toList());
        return dtos;
    }


    public List<UserColonyDto> findAllColoniesByUserId(UUID userId) {
        List<UserColony> colonies = userColonyRepository.findByUser_uidAndActiveFeedingTrue(userId);
        System.out.print("COLONIES " + colonies);
        return colonies.stream()
                .map(UserColonyMapper::toDto)
                .collect(Collectors.toList());
    }

    public Optional<Colony> findById(UUID uuid) {
        return colonyRepository.findById(uuid);
    }

    public void deleteById(UUID uuid) {
        colonyRepository.deleteById(uuid);
    }

    @Transactional
    public CreateColonyResponse createNewColony(Colony colony) {
        // Save the colony first
        if (colony.getCats() != null) {
            for (Cat cat : colony.getCats()) {
                if (cat.getColonies() == null) {
                    cat.setColonies(new HashSet<>());
                }
                cat.getColonies().add(colony);
            }
        }
        Colony savedColony = colonyRepository.save(colony); // Save only once
        System.out.println("Colony saved with ID: " + savedColony.getId() + " Cats " + savedColony.getCats());
        return new CreateColonyResponse(savedColony.getName(), savedColony.getId(), true);
    }
}
