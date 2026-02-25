package com.example.asset_seat_booking.services;

import com.example.asset_seat_booking.entity.SeatCapacity;
import com.example.asset_seat_booking.repositry.SeatCapacityRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class SeatCapacityServiceImpl implements SeatCapacityService {

    private final SeatCapacityRepository repo;

    public SeatCapacityServiceImpl(SeatCapacityRepository repo) {
        this.repo = repo;
    }




    @Override
    public SeatCapacity setSeats(LocalDate date, int totalSeats) {

        SeatCapacity capacity = repo.findByDate(date)
                .orElse(new SeatCapacity(date, totalSeats));

        capacity.setTotalSeats(totalSeats);
        return repo.save(capacity);
    }

}
