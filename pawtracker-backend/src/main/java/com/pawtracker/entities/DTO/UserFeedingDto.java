package com.pawtracker.entities.DTO;

import lombok.*;

import java.time.DayOfWeek;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserFeedingDto {
    private UUID id;
    private UserDto user;
    private ColonyDto colony;
    private DayOfWeek dayOfWeek;

}
