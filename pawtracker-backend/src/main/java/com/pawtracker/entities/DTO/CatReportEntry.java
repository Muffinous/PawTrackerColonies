package com.pawtracker.entities.DTO;

import com.pawtracker.entities.Cat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CatReportEntry {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cat_id")
    private Cat cat;

    @Column(columnDefinition = "TEXT")
    private String description;
}

