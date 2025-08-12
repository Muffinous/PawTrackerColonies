package com.pawtracker.mappers;

import com.pawtracker.entities.DTO.ColonyDto;
import com.pawtracker.entities.DTO.UserDto;
import com.pawtracker.entities.DTO.UserFeedingDto;
import com.pawtracker.entities.UserFeedingSchedule;
import org.springframework.stereotype.Component;

@Component
public class UserFeedingScheduleMapper {

    public UserFeedingDto toDto(UserFeedingSchedule schedule) {
        UserFeedingDto dto = new UserFeedingDto();
        dto.setId(schedule.getId());

        if (schedule.getUser() != null) {
            UserDto userDto = new UserDto();
            userDto.setUid(schedule.getUser().getUid());
            userDto.setName(schedule.getUser().getName());
            userDto.setUsername(schedule.getUser().getUsername());
            userDto.setEmail(schedule.getUser().getEmail());
            userDto.setProfilePicture(schedule.getUser().getProfilePicture());
            userDto.setPhoneNumber(schedule.getUser().getPhoneNumber());
            dto.setUser(userDto);
        } else {
            dto.setUser(null);
        }

        // Map Colony
        if (schedule.getColony() != null) {
            ColonyDto colonyDto = new ColonyDto();
            colonyDto.setId(schedule.getColony().getId());
            colonyDto.setName(schedule.getColony().getName());
            colonyDto.setLocation(schedule.getColony().getLocation());
            // Add other fields as needed
            dto.setColony(colonyDto);
        } else {
            dto.setColony(null);
        }

        dto.setDayOfWeek(schedule.getDayOfWeek());
        return dto;
    }
}