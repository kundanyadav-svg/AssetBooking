package com.example.asset_seat_booking.services;

import com.example.asset_seat_booking.Dtos.SeatStatusDto;
import com.example.asset_seat_booking.entity.Booking;
import com.example.asset_seat_booking.entity.User;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.util.List;

public interface BookingServices {

    Booking bookSeat(Integer seatNo, LocalDate date, User user);

    // Fetch all seats and their status for a given date
    List<SeatStatusDto> getSeatStatus(LocalDate date);

    Page<Booking> getAllRequestsPaginated(int page, int size);

    Booking getUserBookingForDate(User user, LocalDate date);


}
