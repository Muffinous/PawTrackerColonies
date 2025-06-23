package com.pawtracker.entities;

import com.pawtracker.entities.DTO.CatReportDto;
import com.pawtracker.entities.DTO.CatReportEntry;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "colony_report")
public class ColonyReport {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "colony_id")
    private Colony colony;

    private String title;

    @ElementCollection
    @CollectionTable(name = "colony_report_cats_missing", joinColumns = @JoinColumn(name = "colony_report_id"))
    private List<CatReportEntry> catsMissing;

    @ElementCollection
    @CollectionTable(name = "colony_report_cats_fed", joinColumns = @JoinColumn(name = "colony_report_id"))
    private List<CatReportEntry> catsFed;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime datetime;
}