package com.example.asset_seat_booking.services;

import com.example.asset_seat_booking.Dtos.SeatStatusDto;
import com.example.asset_seat_booking.entity.Booking;
import com.example.asset_seat_booking.entity.SeatCapacity;
import com.example.asset_seat_booking.entity.User;
import com.example.asset_seat_booking.repositry.BookingRepository;
import com.example.asset_seat_booking.repositry.SeatCapacityRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookingImpl implements BookingServices {

    private static final int DEFAULT_SEATS = 30;


    private final BookingRepository bookingRepo;
    private final SeatCapacityRepository capacityRepo;

    public BookingImpl(BookingRepository bookingRepo,
                       SeatCapacityRepository capacityRepo) {
        this.bookingRepo = bookingRepo;
        this.capacityRepo = capacityRepo;
    }

    // ================= BOOK SEAT =================
    @Override
    @Transactional
    public Booking bookSeat(Integer seatNo, LocalDate date, User user) {

        SeatCapacity capacity = capacityRepo.findByDate(date)
                .orElseGet(() -> {
                    SeatCapacity sc = new SeatCapacity();
                    sc.setDate(date);
                    sc.setTotalSeats(DEFAULT_SEATS);
                    return capacityRepo.save(sc);
                });


        Optional<Booking> lockedBooking =
                bookingRepo.findBySeatNoAndDateForUpdate(seatNo, date);



        if (lockedBooking.isPresent()) {
            throw new RuntimeException("Seat already booked");
        }


        // validate seat range
        if (seatNo < 1 || seatNo > capacity.getTotalSeats()) {
            throw new RuntimeException("Invalid seat number");
        }

        // one booking per user per day
        if (bookingRepo.existsByUserAndDate(user, date)) {
            throw new RuntimeException("User already booked for this date");
        }

        // prevent double booking
        if (bookingRepo.existsBySeatNoAndDate(seatNo, date)) {
            throw new RuntimeException("Seat already booked");
        }

        Booking booking = new Booking(seatNo, date, user);
        return bookingRepo.save(booking);
    }



    //Get seat status for a date
    @Override
    public List<SeatStatusDto> getSeatStatus(LocalDate date) {

        SeatCapacity capacity = capacityRepo.findByDate(date)
                   .orElseGet(() -> {
                    SeatCapacity sc = new SeatCapacity();
                    sc.setDate(date);
                    sc.setTotalSeats(DEFAULT_SEATS);
                    return capacityRepo.save(sc);
                    });

        int totalSeats = capacity.getTotalSeats();



         // for the given date, find all bookings and collect booked seat numbers
        List<Booking> bookings = bookingRepo.findByDate(date);



        //storing unique booked seat numbers in a set  from the list of bookings
        Set<Integer> bookedSeats = bookings.stream()
                .map(Booking::getSeatNo)
                .collect(Collectors.toSet());



        List<SeatStatusDto> result = new ArrayList<>();



          // iterate through all seat numbers and check if they are booked or not, then create a SeatStatusDto for each seat
        for (int i = 1; i <= totalSeats; i++) {
            result.add(new SeatStatusDto(i, bookedSeats.contains(i)));
        }



        return result;
    }





    //paginatiom
    @Override
    public Page<Booking> getAllRequestsPaginated(int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        return bookingRepo.findAll(pageable);
    }





//fetching user booking for a specific date
    @Override
    public Booking getUserBookingForDate(User user, LocalDate date) {

        return bookingRepo.findByUserAndDate(user, date)
                .orElseThrow(() -> new RuntimeException("No booking found for this user on this date"));
    }



    @Override
    @Transactional
    public void cancelBooking(Long bookingId, User user) {
        // Find the booking or throw an error if it doesn't exist
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Security check: Only the user who made the booking can cancel it
        if (!booking.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: You can only cancel your own bookings");
        }

        bookingRepo.delete(booking);
    }


}
