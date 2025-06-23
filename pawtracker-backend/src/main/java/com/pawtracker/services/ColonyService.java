package com.pawtracker.services;

import com.pawtracker.entities.Colony;
import com.pawtracker.entities.DTO.ColonyDto;
import com.pawtracker.entities.DTO.CreateColonyResponse;
import com.pawtracker.entities.DTO.UserColonyDto;
import com.pawtracker.entities.User;
import com.pawtracker.entities.UserColony;
import com.pawtracker.mappers.ColonyMapper;
import com.pawtracker.mappers.UserColonyMapper;
import com.pawtracker.repository.ColonyRepository;
import com.pawtracker.repository.UserColonyRepository;
import com.pawtracker.repository.UserRepository;
import io.micrometer.observation.ObservationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public List<ColonyDto> getAllColonies() {
        List<Colony> colonies = colonyRepository.findAll();

        List<ColonyDto> dtos = colonies.stream()
                .map(ColonyMapper::toDto)
                .collect(Collectors.toList());
        return dtos;
    }


    public List<UserColonyDto> findAllColoniesByUserId(UUID userId) {
        List<UserColony> colonies = userColonyRepository.findByUser_uidAndActiveFeedingTrue(userId);
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

    public CreateColonyResponse createNewColony(Colony colony) {

        return CreateColonyResponse.builder()
                .success(true)
                .build();
    }
}
