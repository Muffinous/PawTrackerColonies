package com.pawtracker.mappers;

import com.pawtracker.entities.Cat;
import com.pawtracker.entities.CatColony;
import com.pawtracker.entities.DTO.CatDto;
import com.pawtracker.repository.CatColonyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ColonyCatMapper {

    @Autowired
    private final CatColonyRepository catColonyRepository;

    public Cat toCat(CatColony catColony) {
        return catColony.getCat();
    }

    public CatDto toCatDto(CatColony catColony) {
        CatDto dto = new CatDto();
        dto.setId(catColony.getCat().getId());
        dto.setName(catColony.getCat().getName());
        dto.setImg(catColony.getCat().getImg());
        dto.setFurColor(catColony.getCat().getFurColor());
        dto.setSpayedNeutered(catColony.getCat().getSpayedNeutered());
        dto.setApproximateAge(catColony.getCat().getApproximateAge());
        dto.setObservations(catColony.getCat().getObservations());
        dto.setGender(catColony.getCat().getGender());
        return dto;
    }
}
