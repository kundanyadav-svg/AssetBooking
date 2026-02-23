package com.example.asset_seat_booking.controller;

import com.example.asset_seat_booking.Dtos.BookSeatRequest;
import com.example.asset_seat_booking.Dtos.SeatStatusDto;
import com.example.asset_seat_booking.entity.Booking;
import com.example.asset_seat_booking.entity.User;
import com.example.asset_seat_booking.services.BookingServices;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;




@CrossOrigin(origins = "http://localhost:5173" ,allowCredentials = "true") // Allow React app to access
@RestController
@RequestMapping("/api/bookings")
public class BookingController {


    private final BookingServices bookingService;

    public BookingController(BookingServices bookingService) {
        this.bookingService = bookingService;
    }




    // ✅ Book seat
    @PostMapping("/book")
    public ResponseEntity<Booking> bookSeat(
            @RequestBody BookSeatRequest request,
            @AuthenticationPrincipal User user) {


        return ResponseEntity.ok(
                bookingService.bookSeat(request.getSeatNo(), request.getDate(), user)
        );
    }




       // fetch all seats and their status for a given date
    @GetMapping("/status")
    public ResponseEntity<List<SeatStatusDto>> getSeatStatus(@RequestParam LocalDate date) {
        return ResponseEntity.ok(bookingService.getSeatStatus(date));
    }




     //fetching all booking requests (for admin)
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<Booking>> getAll(
            @RequestParam int page,
            @RequestParam int size
    ) {

        Page<Booking> result = bookingService.getAllRequestsPaginated(page, size);
        return ResponseEntity.ok(result);
    }



    //fetching my booking for a specific date
    @GetMapping("/my-seat")
    public ResponseEntity<Booking> getMySeatForDate(
            @RequestParam LocalDate date,
            @AuthenticationPrincipal User user) {

        Booking booking = bookingService.getUserBookingForDate(user, date);
        return ResponseEntity.ok(booking);
    }




}
