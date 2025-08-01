package com.pawtracker.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Entity
@Table(name = "colony_cats")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CatColony {

    @EmbeddedId
    private CatColonyId id;

    @MapsId("colonyId") // <- conecta con el campo dentro de CatColonyId
    @ManyToOne
    @JoinColumn(name = "colony_id")
    private Colony colony;

    @MapsId("catId") // <- conecta con el campo dentro de CatColonyId
    @ManyToOne
    @JoinColumn(name = "cat_id")
    private Cat cat;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Embeddable
    public static class CatColonyId implements Serializable {
        private UUID colonyId;
        private UUID catId;
    }
}
