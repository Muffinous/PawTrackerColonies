package com.pawtracker.services;

import com.pawtracker.entities.Colony;
import com.pawtracker.entities.DTO.*;
import com.pawtracker.entities.User;
import com.pawtracker.entities.UserFeedingSchedule;
import com.pawtracker.mappers.UserFeedingScheduleMapper;
import com.pawtracker.repository.UserFeedingScheduleRepository;
import com.pawtracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserFeedingScheduleService {

    @Autowired
    private UserFeedingScheduleRepository userFeedingScheduleRepository;

    @Autowired
    private UserFeedingScheduleMapper userFeedingScheduleMapper;

    public List<UserFeedingSchedule> findAll() {
        return userFeedingScheduleRepository.findAll();
    }

    public Optional<UserFeedingSchedule> findById(UUID uid) {
        return userFeedingScheduleRepository.findById(uid);
    }

    public List<UserFeedingDto> findByUserId(UUID userId) {
        List<UserFeedingSchedule> schedules = userFeedingScheduleRepository.findAllByUserUid(userId);

        return schedules.stream()
                .sorted(Comparator.comparing(UserFeedingSchedule::getDayOfWeek))
                .map(schedule -> {

                    UserFeedingDto feedingDto = getUserFeedingDto(schedule);
                    System.out.println("Feeding DTO created for user: " + feedingDto.toString());
                    return feedingDto;

                })
                .toList();
    }

    private static UserFeedingDto getUserFeedingDto(UserFeedingSchedule schedule) {
        Colony colony = schedule.getColony();
        ColonyDto colonyDto = new ColonyDto();
        colonyDto.setId(colony.getId());
        colonyDto.setName(colony.getName());
        colonyDto.setLocation(colony.getLocation());
        colonyDto.setNumberOfCats(colony.getCats().size());

        UserFeedingDto feedingDto = new UserFeedingDto();
        feedingDto.setColony(colonyDto);
        feedingDto.setDayOfWeek(schedule.getDayOfWeek());
        return feedingDto;
    }

    public UserFeedingSchedule save(UserFeedingSchedule schedule) {
        return userFeedingScheduleRepository.save(schedule);
    }

    public void deleteById(UUID uid) {
        userFeedingScheduleRepository.deleteById(uid);
    }

    public List<UserFeedingDto> getAllFeedersByColonyId(UUID colonyId) {
        List<UserFeedingSchedule> schedules = userFeedingScheduleRepository.findAllByColonyId(colonyId);
        return schedules.stream()
                .map(schedule -> {
                    User user = schedule.getUser();
                    System.out.println("Processing user: " + user != null + user.getUsername());
                    UserDto userDto = new UserDto();
                    userDto.setUid(user.getUid());
                    userDto.setName(user.getName());
                    userDto.setLastname(user.getLastname());
                    userDto.setEmail(user.getEmail());
                    userDto.setUsername(user.getUsername());
                    userDto.setPhoneNumber(user.getPhoneNumber());
                    userDto.setProfilePicture(user.getProfilePicture());

                    UserFeedingDto feedingDto = getUserFeedingDto(schedule);
                    feedingDto.setUser(userDto);
                    System.out.println("Feeding DTO created for user: " + feedingDto.toString());
                    return feedingDto;

                })
                .toList();
    }

    public UserFeedingDto updateUserSchedule(UserFeedingSchedule userFeedingSchedule) {
        Optional<UserFeedingSchedule> existingFeedingSchedule = userFeedingScheduleRepository.findById(userFeedingSchedule.getId());
        if (existingFeedingSchedule.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        UserFeedingSchedule us = existingFeedingSchedule.get();

        if (userFeedingSchedule.getUser() != null) us.setUser(userFeedingSchedule.getUser());
        if (userFeedingSchedule.getColony() != null) us.setColony(userFeedingSchedule.getColony());
        if (userFeedingSchedule.getDayOfWeek() != null) us.setDayOfWeek(userFeedingSchedule.getDayOfWeek());

        UserFeedingSchedule updated = userFeedingScheduleRepository.save(us);

        UserFeedingDto dto = new UserFeedingDto();
        dto.setId(updated.getId());
        if (updated.getUser() != null) {
            UserDto userDto = new UserDto();
            userDto.setUid(updated.getUser().getUid());
            userDto.setName(updated.getUser().getName());
            userDto.setUsername(updated.getUser().getUsername());
            userDto.setEmail(updated.getUser().getEmail());
            userDto.setProfilePicture(updated.getUser().getProfilePicture());
            userDto.setPhoneNumber(updated.getUser().getPhoneNumber());
            dto.setUser(userDto);
        } else {
            dto.setUser(null);
        }

        if (updated.getColony() != null) {
            ColonyDto colonyDto = new ColonyDto();
            colonyDto.setId(updated.getColony().getId());
            colonyDto.setName(updated.getColony().getName());
            colonyDto.setLocation(updated.getColony().getLocation());
            colonyDto.setNumberOfCats(updated.getColony().getCats().size());
            dto.setColony(colonyDto);
        } else {
            dto.setColony(null);
        }

        dto.setDayOfWeek(updated.getDayOfWeek());
        return dto;
    }

    public UserFeedingSummaryDto findUserFeedingSummary(UUID userId) {
        List<UserFeedingSchedule> schedules = userFeedingScheduleRepository.findAllByUserUid(userId);

        UserDto userDto = new UserDto();
        List<ColonyDayDto> colonyDays = schedules.stream()
                .sorted(Comparator.comparing(UserFeedingSchedule::getDayOfWeek))
                .map(schedule -> {
                    if (schedule.getUser() != null) {
                        User user = schedule.getUser();
                        userDto.setUid(user.getUid());
                        userDto.setName(user.getName());
                        userDto.setLastname(user.getLastname());
                        userDto.setEmail(user.getEmail());
                        userDto.setUsername(user.getUsername());
                        userDto.setPhoneNumber(user.getPhoneNumber());
                        userDto.setProfilePicture(user.getProfilePicture());
                    }
                    ColonyDto colonyDto = new ColonyDto();
                    Colony colony = schedule.getColony();
                    colonyDto.setId(colony.getId());
                    colonyDto.setName(colony.getName());
                    colonyDto.setLocation(colony.getLocation());
                    colonyDto.setNumberOfCats(colony.getCats().size());

                    ColonyDayDto colonyDayDto = new ColonyDayDto();
                    colonyDayDto.setColony(colonyDto);
                    colonyDayDto.setDayOfWeek(schedule.getDayOfWeek().name());
                    return colonyDayDto;
                })
                .collect(Collectors.toList());

        UserFeedingSummaryDto summaryDto = new UserFeedingSummaryDto();
        summaryDto.setUser(userDto);
        summaryDto.setColonies(colonyDays);
        return summaryDto;
    }
}
