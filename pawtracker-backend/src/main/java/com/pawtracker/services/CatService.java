package com.pawtracker.services;

import com.pawtracker.entities.Cat;
import com.pawtracker.entities.CatColony;
import com.pawtracker.entities.Colony;
import com.pawtracker.entities.DTO.CatDto;
import com.pawtracker.entities.DTO.ColonyDto;
import com.pawtracker.repository.CatRepository;
import com.pawtracker.repository.ColonyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CatService {
    @Autowired
    private CatRepository catRepository;

    @Autowired
    private ColonyRepository colonyRepository;

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

    // Java
    public List<Cat> saveAll(List<CatDto> cats) {
        System.out.println("Saving cats: " + cats);
        List<Cat> catsToSave = new ArrayList<>();

        for (CatDto catDto : cats) {
            Cat cat = new Cat();
            cat.setName(catDto.getName());
            cat.setImg(catDto.getImg());
            cat.setFurColor(catDto.getFurColor());
            cat.setSpayedNeutered(catDto.getSpayedNeutered());
            cat.setApproximateAge(catDto.getApproximateAge());
            cat.setGender(catDto.getGender());
            cat.setObservations(catDto.getObservations());

            Set<Colony> colonies = new HashSet<>();
            if (catDto.getColonies() != null) {
                for (ColonyDto colonyDto : catDto.getColonies()) {
                    Colony managedColony = colonyRepository.findById(colonyDto.getId())
                            .orElseThrow(() -> new RuntimeException("Colony not found: " + colonyDto.getId()));
                    colonies.add(managedColony);
                }
            }
            cat.setColonies(colonies);
            Cat savedCat = catRepository.save(cat); // Save Cat first

            // Now update colonies with the saved Cat
            for (Colony colony : colonies) {
                if (colony.getCats() == null) {
                    colony.setCats(new HashSet<>());
                }
                colony.getCats().add(savedCat);
                colonyRepository.save(colony);
            }
            catsToSave.add(savedCat);
        }
        return catsToSave;
    }
}
