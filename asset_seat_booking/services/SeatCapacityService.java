package com.example.asset_seat_booking.services;

import com.example.asset_seat_booking.entity.SeatCapacity;

import java.time.LocalDate;

public interface SeatCapacityService {
    SeatCapacity setSeats(LocalDate date, int totalSeats);
}
