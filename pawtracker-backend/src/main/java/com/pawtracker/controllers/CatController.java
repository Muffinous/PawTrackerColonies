package com.pawtracker.controllers;

import com.pawtracker.entities.Cat;
import com.pawtracker.services.CatService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/cats")
@RequiredArgsConstructor
public class CatController {

    @Autowired
    private CatService catService;

    @GetMapping("/{id}")
    public ResponseEntity<Cat> getCatById(@PathVariable String id) {
        UUID uuid = UUID.fromString(id);
        return catService.findById(uuid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Cat> createCat(@RequestBody Cat cat) {
        Cat savedCat = catService.save(cat);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCat);
    }

    /*@PutMapping("/{id}")
    public ResponseEntity<Cat> updateCat(@PathVariable String id, @RequestBody Cat cat) {
        UUID uuid = UUID.fromString(id);
        cat.setId(uuid);
        Cat updatedCat = catService.update(cat);
        return ResponseEntity.ok(updatedCat);
    }*/

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCat(@PathVariable String id) {
        UUID uuid = UUID.fromString(id);
        catService.deleteById(uuid);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Cat>> getAllCats() {
        return ResponseEntity.ok(catService.findAll());
    }
}

