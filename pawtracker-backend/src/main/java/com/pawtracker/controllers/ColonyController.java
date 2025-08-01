package com.pawtracker.controllers;

import com.pawtracker.entities.Colony;
import com.pawtracker.entities.DTO.ColonyDto;
import com.pawtracker.entities.Responses.CreateColonyResponse;
import com.pawtracker.entities.DTO.UserColonyDto;
import com.pawtracker.services.ColonyService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/colonies")
@RequiredArgsConstructor
public class ColonyController {

    @Autowired
    private ColonyService colonyService;

    @GetMapping
    public ResponseEntity<List<ColonyDto>> getAllColonies() {
        return ResponseEntity.ok(colonyService.getAllColonies());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Colony> getColonyById(@PathVariable("id") String id) {
        UUID uuid = UUID.fromString(id);
        return colonyService.findById(uuid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CreateColonyResponse> createColony(@RequestBody Colony colony) {
        System.out.println("Creating colony: " + colony);
       System.out.println("cats" + colony.getCats());

        return new ResponseEntity<>(colonyService.createNewColony(colony), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteColony(@PathVariable String id) {
        UUID uuid = UUID.fromString(id);
        colonyService.deleteById(uuid);
        return ResponseEntity.noContent().build();
    }

/*    @GetMapping("/colony-by-username/{id}")
    public ResponseEntity<List<Colony>> getAllColoniesByUsername(@PathVariable String username) {
        colonyService.findByUsername(username);

        return ResponseEntity.ok(colonyService.findAll());
    }
*/
    @GetMapping("/by-userId/{uuid}")
    public ResponseEntity<List<UserColonyDto>> getAllColoniesByUserId(@PathVariable("uuid") String uuid) {
        return ResponseEntity.ok(colonyService.findAllColoniesByUserId(UUID.fromString(uuid)));
    }
}
