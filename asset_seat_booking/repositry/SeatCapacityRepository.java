package com.example.asset_seat_booking.repositry;

import com.example.asset_seat_booking.entity.SeatCapacity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface SeatCapacityRepository extends JpaRepository<SeatCapacity, Long> {

    Optional<SeatCapacity> findByDate(LocalDate date);

}
