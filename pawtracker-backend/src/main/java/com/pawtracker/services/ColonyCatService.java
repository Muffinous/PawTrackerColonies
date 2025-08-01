package com.pawtracker.services;


import com.pawtracker.entities.CatColony;
import com.pawtracker.entities.DTO.CatDto;
import com.pawtracker.mappers.ColonyCatMapper;
import com.pawtracker.repository.CatColonyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ColonyCatService {

    @Autowired
    private CatColonyRepository catColonyRepository;

    @Autowired
    private ColonyCatMapper colonyCatMapper;

    public List<CatDto> findCatsByColonyId(UUID colonyId) {
        List<CatColony> catColonies = catColonyRepository.findByColony_Id(colonyId);
        System.out.println("Found " + catColonies.size() + " cats in colony with ID: " + colonyId);
        return catColonies.stream()
                .map(colonyCatMapper::toCatDto)
                .toList();
    }
}
