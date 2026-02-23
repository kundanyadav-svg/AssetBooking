package com.example.asset_seat_booking.ExcepionHnadle;

public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String message) {
        super(message);
    }
}

