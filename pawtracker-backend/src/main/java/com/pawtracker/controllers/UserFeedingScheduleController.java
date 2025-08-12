package com.pawtracker.controllers;

import com.pawtracker.entities.DTO.UserFeedingDto;
import com.pawtracker.entities.DTO.UserFeedingSummaryDto;
import com.pawtracker.entities.UserFeedingSchedule;
import com.pawtracker.mappers.UserFeedingScheduleMapper;
import com.pawtracker.services.UserFeedingScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/feeding-schedule")
public class UserFeedingScheduleController {

    @Autowired
    private UserFeedingScheduleService userFeedingScheduleService;

    @Autowired
    private UserFeedingScheduleMapper userFeedingScheduleMapper;

    @PostMapping
    public UserFeedingSchedule create(@RequestBody UserFeedingSchedule schedule) {
        return userFeedingScheduleService.save(schedule);
    }

    @GetMapping
    public List<UserFeedingSchedule> getAll() {
        return userFeedingScheduleService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserFeedingSchedule> getById(@PathVariable UUID uid) {
        return userFeedingScheduleService.findById(uid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // UserFeedingScheduleService.java
    @GetMapping("/user/{userId}")
    public UserFeedingSummaryDto getAllUserFeedingSchedules(@PathVariable UUID userId) {
        System.out.println("Fetching feeding schedules for user ID: " + userId);
        return userFeedingScheduleService.findUserFeedingSummary(userId);
    }

    @GetMapping("/colony/{colonyId}/feeders")
    public ResponseEntity<List<UserFeedingDto>> getAllFeedersByColonyId(@PathVariable UUID colonyId) {
        List<UserFeedingDto> feeders = userFeedingScheduleService.getAllFeedersByColonyId(colonyId);
        return ResponseEntity.ok(feeders);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserFeedingDto> update(@PathVariable UUID id, @RequestBody UserFeedingSchedule schedule) {
        schedule.setId(id);
        UserFeedingDto userFeedingSchedule = userFeedingScheduleService.updateUserSchedule(schedule);
        return ResponseEntity.ok(userFeedingSchedule);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        userFeedingScheduleService.deleteById(id);
    }
}