package com.pawtracker.services;

import com.pawtracker.entities.UserColony;
import com.pawtracker.repository.UserColonyRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UserColonyService {

    @Autowired
    private UserColonyRepository userColonyRepository;

    @Transactional
    public void updateUserColonies(UUID userId, List<UUID> selectedColonyIds) {
        List<UserColony> allUserColonies = userColonyRepository.findByUser_uid(userId);

        for (UserColony uc : allUserColonies) {
            boolean shouldBeActive = selectedColonyIds.contains(uc.getColony().getId());
            if (uc.isActiveFeeding() != shouldBeActive) {
                uc.setActiveFeeding(shouldBeActive);
            }
        }

        userColonyRepository.saveAll(allUserColonies);
    }
}

