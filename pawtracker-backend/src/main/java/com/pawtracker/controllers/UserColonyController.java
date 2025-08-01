package com.pawtracker.controllers;

import com.pawtracker.entities.Requests.UpdateUserColoniesRequest;
import com.pawtracker.services.UserColonyService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user-colonies")
@RequiredArgsConstructor
public class UserColonyController {

    @Autowired
    private UserColonyService userColonyService;

    @PostMapping("/update")
    public ResponseEntity<Void> updateUserColonies(@RequestBody UpdateUserColoniesRequest request) {
        userColonyService.updateUserColonies(request.getUserId(), request.getSelectedColonyIds());
        return ResponseEntity.ok().build();
    }
}
