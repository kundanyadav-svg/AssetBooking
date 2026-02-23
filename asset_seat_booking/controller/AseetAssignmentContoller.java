package com.example.asset_seat_booking.controller;


import com.example.asset_seat_booking.entity.AssetAssignment;
import com.example.asset_seat_booking.services.AssetAssignmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@CrossOrigin(origins = "http://localhost:5173" ,allowCredentials = "true")
@RestController
@RequestMapping("/api")
public class AseetAssignmentContoller {


    private final AssetAssignmentService assetAssignmentService;

    public AseetAssignmentContoller(AssetAssignmentService assetAssignmentService) {
        this.assetAssignmentService = assetAssignmentService;
    }


    @GetMapping("/my-assignments")
    public ResponseEntity<List<AssetAssignment>> getMyAssignments(Authentication authentication) {

        String email = authentication.getName();
        List<AssetAssignment> assignments = assetAssignmentService.getAssignmentsForUser(email);

        return ResponseEntity.ok(assignments);
    }

}
