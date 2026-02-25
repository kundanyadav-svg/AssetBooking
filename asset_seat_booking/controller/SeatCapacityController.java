package com.example.asset_seat_booking.controller;

import com.example.asset_seat_booking.entity.SeatCapacity;
import com.example.asset_seat_booking.repositry.SeatCapacityRepository;
import com.example.asset_seat_booking.services.SeatCapacityService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;


@CrossOrigin(origins = "http://localhost:5173" ,allowCredentials = "true") // Allow React app to access
@RestController
@RequestMapping("/api/seats")
public class SeatCapacityController {

    private final SeatCapacityService service;
    private final SeatCapacityRepository capacityRepo;

    public SeatCapacityController(SeatCapacityService service, SeatCapacityRepository capacityRepo) {
        this.service = service;
        this.capacityRepo = capacityRepo;
    }




    // ADMIN sets seats for a date
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping
    public SeatCapacity updateSeats(
            @RequestParam LocalDate date,
            @RequestParam int totalSeats) {

        SeatCapacity capacity = capacityRepo.findByDate(date)
                .orElseGet(() -> {
                    SeatCapacity sc = new SeatCapacity();
                    sc.setDate(date);
                    return sc;
                });

        capacity.setTotalSeats(totalSeats);
        return capacityRepo.save(capacity);
    }






}
