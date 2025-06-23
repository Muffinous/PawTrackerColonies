package com.pawtracker.mappers;

import com.pawtracker.entities.Cat;
import com.pawtracker.entities.Colony;
import com.pawtracker.entities.ColonyReport;
import com.pawtracker.entities.DTO.*;
import com.pawtracker.entities.User;
import com.pawtracker.repository.CatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ColonyReportMapper {

    @Autowired
    private final CatRepository catRepository;

    public ColonyReportDto toDto(ColonyReport report) {
        ColonyReportDto dto = new ColonyReportDto();
        dto.setId(report.getId());
        dto.setTitle(report.getTitle());
        dto.setColony(toColonyBasicDto(report.getColony()));
        dto.setCatsMissing(toCatReportDtoList(report.getCatsMissing()));
        dto.setCatsFed(toCatReportDtoList(report.getCatsFed()));
        dto.setUser(toUserBasicDto(report.getUser()));
        dto.setDatetime(report.getDatetime());
        return dto;
    }

    private UserDto toUserBasicDto(User user) {
        UserDto dto = new UserDto();
        dto.setUid(user.getUid());
        dto.setUsername(user.getUsername());
        dto.setName(user.getName());
        dto.setLastname(user.getLastname());
        dto.setEmail(user.getEmail());
        dto.setProfilePicture(user.getProfilePicture());
        dto.setPhoneNumber(user.getPhoneNumber());
        return dto;
    }


    private ColonyDto toColonyBasicDto(Colony colony) {
        ColonyDto dto = new ColonyDto();
        dto.setId(colony.getId());
        dto.setName(colony.getName());
        dto.setLocation(colony.getLocation());
        dto.setNumberOfCats(colony.getCats().size());
        dto.setCats(colony.getCats()
                .stream()
                .map(this::toCatDto)
                .collect(Collectors.toList()));
        return dto;
    }

    private CatDto toCatDto(Cat cat) {
        CatDto dto = new CatDto();
        dto.setId(cat.getId());
        dto.setName(cat.getName());
        dto.setImg(cat.getImg());
        dto.setFurColor(cat.getFurColor());
        dto.setSpayedNeutered(cat.getSpayedNeutered());
        dto.setApproximateAge(cat.getApproximateAge());
        dto.setObservations(cat.getObservations());
        dto.setGender(cat.getGender());
        return dto;
    }

    private List<CatReportDto> toCatReportDtoList(List<CatReportEntry> entries) {
        return entries.stream()
                .map(e -> {
                    CatReportDto dto = new CatReportDto();
                    dto.setCatId(e.getCatId());
                    dto.setDescription(e.getDescription());
                    catRepository.findById(e.getCatId()).ifPresent(cat -> {
                        dto.setCat(toCatDto(cat));
                    });
                    return dto;
                })
                .collect(Collectors.toList());
    }
}