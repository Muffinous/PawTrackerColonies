package com.pawtracker.entities.DTO;

public class ColonyDayDto {
    private ColonyDto colony;
    private String dayOfWeek;

    public ColonyDto getColony() { return colony; }
    public void setColony(ColonyDto colony) { this.colony = colony; }
    public String getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(String dayOfWeek) { this.dayOfWeek = dayOfWeek; }
}
