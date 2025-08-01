package com.pawtracker.controllers;

import com.pawtracker.entities.Cat;
import com.pawtracker.entities.DTO.CatDto;
import com.pawtracker.services.CatService;
import com.pawtracker.services.ColonyCatService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/cats")
@RequiredArgsConstructor
public class CatController {

    Path basePath = Paths.get("D:/PAWTRACKER/pawtracker-backend/uploads/cats");

    @Autowired
    private CatService catService;

    @Autowired
    private ColonyCatService colonyCatService;

    @GetMapping("/{id}")
    public ResponseEntity<Cat> getCatById(@PathVariable String id) {
        UUID uuid = UUID.fromString(id);
        return catService.findById(uuid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    public ResponseEntity<List<Cat>> saveCats(@RequestBody List<CatDto> cats) {
        if (cats == null || cats.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        List<Cat> savedCats = catService.saveAll(cats);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCats);
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

    @GetMapping("/colony/{colonyId}")
    public ResponseEntity<List<CatDto>> getCatsByColonyId(@PathVariable String colonyId) {
        UUID uuid = UUID.fromString(colonyId);
        List<CatDto> cats = colonyCatService.findCatsByColonyId(uuid);
        return ResponseEntity.ok(cats);
    }

    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<Resource> getCatImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get("D:/PAWTRACKER/uploads/cats")
                    .resolve(filename)
                    .normalize();

            System.out.println("Loading image from path: " + filePath);  // <-- Esto es clave

            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                throw new RuntimeException("Could not read file: " + filename);
            }

            String contentType = Files.probeContentType(filePath);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType != null ? contentType : "application/octet-stream"))
                    .body(resource);

        } catch (IOException e) {
            throw new RuntimeException("Error loading file: " + filename, e);
        }
    }


}

