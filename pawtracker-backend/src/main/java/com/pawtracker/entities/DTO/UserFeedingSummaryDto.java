package com.pawtracker.entities.DTO;

import java.util.List;

public class UserFeedingSummaryDto {
    private UserDto user;
    private List<ColonyDayDto> colonies;

    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }
    public List<ColonyDayDto> getColonies() { return colonies; }
    public void setColonies(List<ColonyDayDto> colonies) { this.colonies = colonies; }
}

